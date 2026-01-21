const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // [cite: 159, 160]
  loanType: { type: String, required: true }, // e.g., Finance [cite: 177]
  loanAmount: { type: Number, required: true }, // [cite: 178]
  amountPaid: { type: Number, default: 0 }, // [cite: 179]
  remainingBalance: { type: Number, required: true }, // 
  status: { type: String, enum: ['Active', 'Closed'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);