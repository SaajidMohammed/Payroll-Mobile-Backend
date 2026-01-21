const express = require('express');
const router = express.Router();
// Added getEmployeeById to the destructured imports
const { addEmployee, getEmployees, getEmployeeById } = require('../controllers/employeeController');

// Standard routes for Employee Management
router.route('/')
    .get(getEmployees)   // To populate the Employees table
    .post(addEmployee);  // For onboarding new employees

// NEW: Route to handle individual employee fetching by ID
// This fixes the 404 error when navigating to the details screen
router.route('/:id')
    .get(getEmployeeById);

module.exports = router;