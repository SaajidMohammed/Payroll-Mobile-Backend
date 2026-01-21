const express = require('express');
const router = express.Router();
const { createLoan, getAllLoans, recordRepayment } = require('../controllers/loanController');

// Manage employee loan accounts [cite: 157]
router.route('/')
    .get(getAllLoans)   // View the Employee Loans report [cite: 148, 157]
    .post(createLoan);  // Create a new loan entry [cite: 136]

router.put('/:id/repay', recordRepayment); // Deduct EMI [cite: 137]

module.exports = router;