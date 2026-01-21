const Payroll = require('../models/Payroll'); 
const Employee = require('../models/Employee');
const Loan = require('../models/Loan');
const { calculateNetSalary } = require('../utils/salaryCalculator');

/**
 * @desc    Process monthly payroll with statutory deductions
 * @route   POST /api/payroll/run
 */
exports.processPayroll = async (req, res) => {
  try {
    const { monthYear } = req.body; // Expects: "Jan 2022"

    // 1. Fetch all active employees for processing
    const activeEmployees = await Employee.find({ status: 'Active' });

    if (activeEmployees.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "No active employees found to process payroll." 
      });
    }

    let totalGrossPayout = 0;
    let totalNetPayout = 0;
    let totalDeductions = 0;

    // 2. Iterate through employees to calculate individual components
    const processedEmployees = await Promise.all(activeEmployees.map(async (emp) => {
      
      // Fetch active loans to apply EMI deductions
      const activeLoan = await Loan.findOne({ employee: emp._id, status: 'Active' });
      
      // Calculate EMI if loan exists and tenure is valid
      const emiAmount = (activeLoan && activeLoan.tenureMonths > 0) 
        ? (activeLoan.loanAmount / activeLoan.tenureMonths) 
        : 0;

      // Calculate salary using statutory logic (PF, ESI, TDS)
      // Uses 'grossSalary' from Employee salary structure
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

    // 3. Create the payroll entry for the dashboard summary
    // UPDATED: Mapping keys to match your specific Schema requirements
    const payrollEntry = await Payroll.create({
      month: monthYear,              // Fixes 'month' validation error
      totalEmployees: activeEmployees.length, //
      totalPayout: totalGrossPayout,  // Fixes 'totalPayout' error
      netPayable: totalNetPayout,     // Fixes 'netPayable' error
      totalDeductions: totalDeductions,
      status: 'Processed'             // Requirement: Lock/Process payroll
    });

    res.status(200).json({ 
      success: true, 
      data: payrollEntry,
      employeeBreakdown: processedEmployees 
    });

  } catch (err) {
    // Catch-all for database or calculation errors
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * @desc    Get Recent Payroll History for Dashboard overview
 * @route   GET /api/payroll/recent
 */
exports.getRecentPayroll = async (req, res) => {
  try {
    // Fetches history for "Recent Payroll" summary list
    const history = await Payroll.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};