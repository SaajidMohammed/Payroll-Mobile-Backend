const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  monthYear: { type: String, required: true }, // Must match Image 3 error
  totalGrossPay: { type: Number, required: true }, // Must match Image 3 error
  totalNetPay: { type: Number, required: true }, // Must match Image 3 error
  totalEmployees: { type: Number },
  totalDeductions: { type: Number },
  status: { type: String, default: 'Processed' }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', PayrollSchema);