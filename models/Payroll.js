const mongoose = require('mongoose');

const PayrollSchema = new mongoose.Schema({
  monthYear: { type: String, required: true }, // e.g., "Jan 2022" [cite: 225]
  totalEmployees: { type: Number, required: true }, // [cite: 6, 21, 228]
  totalGrossPay: { type: Number, required: true }, // Maps to 'Yousi Employes' [cite: 231]
  totalNetPay: { type: Number, required: true }, // Maps to 'Veal Emn Doly' [cite: 237]
  totalDeductions: { type: Number, default: 0 }, // [cite: 101]
  status: { type: String, enum: ['Processed', 'Not Processed'], default: 'Processed' } // [cite: 92, 227]
}, { timestamps: true });

module.exports = mongoose.model('Payroll', PayrollSchema);