const express = require('express');
const router = express.Router();
const { addEmployee, getEmployees } = require('../controllers/employeeController');

// Standard routes for Employee Management [cite: 48-50]
router.route('/')
    .get(getEmployees)   // To populate the Employees table [cite: 66]
    .post(addEmployee);  // For onboarding new employees [cite: 295]

module.exports = router;