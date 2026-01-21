const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  employeeID: { type: String, required: true, unique: true }, 
  department: { type: String, required: true }, //
  designation: { type: String, required: true }, //
  
  // UPDATED: Salary structure to include breakdown components
  salaryStructure: {
    grossSalary: { type: Number, required: true }, //
    basic: { type: Number, required: true },       // Required for net pay calculation
    da: { type: Number, default: 0 },              // Dearness Allowance
    hra: { type: Number, default: 0 },             // House Rent Allowance
    pf: { type: Number, default: 0 },              // PF Deduction
    tax: { type: Number, default: 0 },             // Tax Deduction
    statutoryBonus: { type: Number, default: 0 },  //
  },
  
  bankDetails: {
    bankName: { type: String, required: true }, //
    accountNumber: { type: String, required: true }, //
    ifscCode: { type: String } 
  },
  
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' } 
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);