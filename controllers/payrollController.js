const Payroll = require("../models/Payroll");
const Employee = require("../models/Employee");
const Loan = require("../models/Loan");

/**
 * @desc    Process monthly payroll with detailed components (Basic, DA, HRA, Tax, PF)
 * @route   POST /api/payroll/run
 */
exports.processPayroll = async (req, res) => {
  try {
    const { monthYear } = req.body; // Expects: "Jan 2026"

    // 1. Fetch all active employees for processing
    const activeEmployees = await Employee.find({ status: "Active" });

    if (activeEmployees.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No active employees found to process payroll.",
      });
    }

    let totalGrossPayout = 0;
    let totalNetPayout = 0;
    let totalDeductions = 0;

    // 2. Iterate through employees to calculate individual components
    const processedEmployees = await Promise.all(
      activeEmployees.map(async (emp) => {
        // Extract the detailed breakdown from the employee record
        const { 
          basic = 0, 
          da = 0, 
          hra = 0, 
          pf = 0, 
          tax = 0, 
          grossSalary = 0 
        } = emp.salaryStructure;

        // Fetch active loans to apply EMI deductions
        const activeLoan = await Loan.findOne({
          employee: emp._id,
          status: "Active",
        });

        // Calculate EMI if loan exists
        const emiAmount =
          activeLoan && activeLoan.tenureMonths > 0
            ? activeLoan.loanAmount / activeLoan.tenureMonths
            : 0;

        // Calculation Logic: Final Net Salary
        // Net = (Basic + DA + HRA) - (PF + Tax + Loan EMI)
        const earnings = basic + da + hra;
        const statutoryDeductions = pf + tax;
        const totalEmpDeductions = statutoryDeductions + emiAmount;
        const netSalary = earnings - totalEmpDeductions;

        // Aggregate totals for the Payroll entry
        totalGrossPayout += earnings;
        totalNetPayout += netSalary;
        totalDeductions += totalEmpDeductions;

        return {
          employeeId: emp._id,
          name: emp.name,
          earnings: { basic, da, hra },
          deductions: { pf, tax, emi: emiAmount },
          netSalary: netSalary,
          grossSalary: earnings
        };
      }),
    );

    // 3. Create the payroll entry for the dashboard summary
    const payrollEntry = await Payroll.create({
      monthYear: monthYear, 
      totalGrossPay: totalGrossPayout, 
      totalNetPay: totalNetPayout, 
      totalEmployees: activeEmployees.length,
      totalDeductions: totalDeductions,
      status: "Processed",
    });

    res.status(200).json({
      success: true,
      data: payrollEntry,
      employeeBreakdown: processedEmployees,
    });
  } catch (err) {
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