const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  employeeID: { type: String, required: true, unique: true }, 
  department: { type: String, required: true }, // e.g., Engineering, HR [cite: 68, 74, 77]
  designation: { type: String, required: true }, // [cite: 69]
  salaryStructure: {
    grossSalary: { type: Number, required: true }, // [cite: 70, 76]
    statutoryBonus: { type: Number, default: 0 }, // [cite: 65]
  },
  bankDetails: {
    bankName: { type: String, required: true }, // [cite: 164, 180]
    accountNumber: { type: String, required: true }, // [cite: 181, 182]
    ifscCode: { type: String } 
  },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' } 
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);