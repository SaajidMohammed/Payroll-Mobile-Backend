const express = require('express');
const router = express.Router();
// IMPORTANT: This name MUST match 'exports.processPayroll' in the controller
const { processPayroll, getRecentPayroll } = require('../controllers/payrollController');

// This handles "Run payroll" 
router.post('/run', processPayroll);

// This handles the "Recent Payroll" dashboard section [cite: 23]
router.get('/recent', getRecentPayroll);

module.exports = router;