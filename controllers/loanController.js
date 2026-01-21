const Loan = require('../models/Loan');
const Employee = require('../models/Employee');

/**
 * @desc    Create a new loan for an employee
 * @route   POST /api/loans
 * @req     { employeeId, loanType, loanAmount, tenureMonths }
 */
exports.createLoan = async (req, res) => {
  try {
    const { employeeId, loanType, loanAmount, tenureMonths } = req.body;

    // Check if employee exists before issuing loan
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Create loan as per Loan & Advances requirements [cite: 136, 157]
    const loan = await Loan.create({
      employee: employeeId,
      loanType,         // e.g., "Finance" or "Travel" 
      loanAmount,       // e.g., ₹50,000 [cite: 178]
      remainingBalance: loanAmount,
      tenureMonths,
      status: 'Active'
    });

    res.status(201).json({ success: true, data: loan });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all loans (for the Employee Loans table)
 * @route   GET /api/loans
 */
exports.getAllLoans = async (req, res) => {
  try {
    // Populate employee details to show names like "John Doe" or "Priya Singh" [cite: 159-161]
    const loans = await Loan.find().populate('employee', 'name employeeID');
    res.status(200).json({ 
      success: true, 
      count: loans.length, 
      data: loans 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

/**
 * @desc    Record an EMI payment (usually called during Payroll Processing)
 * @route   PUT /api/loans/:id/repay
 */
exports.recordRepayment = async (req, res) => {
  try {
    const { emiAmount } = req.body;
    const loan = await Loan.findById(req.params.id);

    if (!loan || loan.status === 'Closed') {
      return res.status(400).json({ success: false, message: 'Loan inactive or not found' });
    }

    // Update balance and paid amount [cite: 137, 179]
    loan.amountPaid += emiAmount;
    loan.remainingBalance -= emiAmount;

    if (loan.remainingBalance <= 0) {
      loan.remainingBalance = 0;
      loan.status = 'Closed';
    }

    await loan.save();
    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};