const Payroll = require('../models/Payroll'); 
const Employee = require('../models/Employee');
const Loan = require('../models/Loan');
const { calculateNetSalary } = require('../utils/salaryCalculator');

/**
 * @desc    Process monthly payroll with statutory deductions [cite: 88, 90, 101]
 * @route   POST /api/payroll/run
 */
exports.processPayroll = async (req, res) => {
  try {
    const { monthYear } = req.body; // e.g., "Jan 2022" [cite: 225]

    // 1. Fetch all active employees for processing [cite: 7, 28, 275]
    const activeEmployees = await Employee.find({ status: 'Active' });

    if (activeEmployees.length === 0) {
      return res.status(400).json({ success: false, message: "No active employees found" });
    }

    let totalGrossPayout = 0;
    let totalNetPayout = 0;
    let totalDeductions = 0;

    // 2. Iterate through employees to calculate individual components [cite: 91, 297]
    const processedEmployees = await Promise.all(activeEmployees.map(async (emp) => {
      
      // Fetch active loans to apply EMI deductions [cite: 137, 178]
      const activeLoan = await Loan.findOne({ employee: emp._id, status: 'Active' });
      
      // Calculate EMI if tenure exists 
      const emiAmount = (activeLoan && activeLoan.tenureMonths > 0) 
        ? (activeLoan.loanAmount / activeLoan.tenureMonths) 
        : 0;

      // Calculate salary based on structure defined in Employee Management [cite: 49, 101, 104]
      // Uses 'grossSalary' from the Employee model [cite: 70, 76]
      const salaryDetails = calculateNetSalary(emp.salaryStructure.grossSalary, emiAmount);

      totalGrossPayout += salaryDetails.grossSalary;
      totalNetPayout += salaryDetails.netSalary;
      totalDeductions += salaryDetails.totalDeductions;

      return {
        employeeId: emp._id,
        name: emp.name,
        ...salaryDetails
      };
    }));

    // 3. Create the payroll entry for the dashboard summary [cite: 12, 13]
    // FIXED: Using keys that match your updated Payroll Model to avoid validation errors
    const payrollEntry = await Payroll.create({
      monthYear: monthYear, // Fulfills "month" requirement [cite: 24, 268]
      totalEmployees: activeEmployees.length, // [cite: 6, 266]
      totalGrossPay: totalGrossPayout, // Maps to 'Yousi Employes' total [cite: 231]
      totalNetPay: totalNetPayout,     // Maps to 'Veal Emn Doly' (Net Pay) [cite: 237]
      totalDeductions: totalDeductions,
      status: 'Processed' // Requirement: Lock and process payroll [cite: 92, 227, 259]
    });

    res.status(200).json({ 
      success: true, 
      data: payrollEntry,
      employeeBreakdown: processedEmployees 
    });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Get Recent Payroll History for Dashboard overview [cite: 4, 15]
 * @route   GET /api/payroll/recent
 */
exports.getRecentPayroll = async (req, res) => {
  try {
    // Fetches history for "Recent Payroll" summary list [cite: 23-27, 267-271]
    const history = await Payroll.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};