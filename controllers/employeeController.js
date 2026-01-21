// 1. Path must be exactly '../models/Employee' (Case-Sensitive)
const Employee = require('../models/Employee'); 

/**
 * @desc    Add/Onboard New Employee 
 * @route   POST /api/employees
 */
exports.addEmployee = async (req, res) => {
  try {
    // Expects: name, employeeID, department, designation, salaryStructure, and bankDetails [cite: 52]
    const newEmployee = await Employee.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: "Employee onboarded successfully",
      data: newEmployee 
    });
  } catch (err) {
    // Handles duplicate employeeID or missing required fields
    res.status(400).json({ 
      success: false, 
      error: err.message 
    });
  }
};

/**
 * @desc    Get All Employees for Management List [cite: 54, 70]
 * @route   GET /api/employees
 */
exports.getEmployees = async (req, res) => {
  try {
    // Retrieves profiles including Department, Designation, and Salary [cite: 68-70]
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