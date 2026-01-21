const express = require('express');
const router = express.Router();

// The name inside { } MUST match the 'exports.getTaxTasks' in the controller
const { getTaxTasks } = require('../controllers/complianceController');

// This endpoint provides data for the "Upcoming Tax Tasks" dashboard section 
router.get('/tasks', getTaxTasks);

module.exports = router;