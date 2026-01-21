// 1. Path must be exactly '../models/Employee' (Case-Sensitive)
const Employee = require('../models/Employee'); 

/**
 * @desc    Add/Onboard New Employee 
 * @route   POST /api/employees
 */
exports.addEmployee = async (req, res) => {
  try {
    /** * Expects full payload from frontend including:
     * - salaryStructure: { grossSalary, basic, da, hra, pf, tax }
     * - bankDetails: { bankName, accountNumber, ifscCode }
     */
    const newEmployee = await Employee.create(req.body); // Automatically validates against new Schema
    
    res.status(201).json({ 
      success: true, 
      message: "Employee onboarded successfully",
      data: newEmployee 
    });
  } catch (err) {
    // Handles duplicate employeeID, validation failures, or missing fields
    res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
};

/**
 * @desc    Get All Employees for Management List
 * @route   GET /api/employees
 */
exports.getEmployees = async (req, res) => {
  try {
    // Retrieves profiles including detailed Salary breakdown and Bank details
    const employees = await Employee.find();
    
    res.status(200).json({ 
      success: true, 
      count: employees.length, 
      data: employees 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: 'Server Error: Unable to fetch employee profiles' 
    });
  }
};

/**
 * @desc    Get Single Employee by MongoDB ID
 * @route   GET /api/employees/:id
 */
exports.getEmployeeById = async (req, res) => {
  try {
    // req.params.id is passed from the dynamic route in employeeRoutes.js
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    
    res.status(200).json({ success: true, data: employee });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};