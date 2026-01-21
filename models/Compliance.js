const mongoose = require('mongoose');

const ComplianceSchema = new mongoose.Schema({
  taskName: { type: String, required: true }, // e.g., "PF Filing Due" [cite: 33, 284]
  dueDate: { type: Date, required: true }, // e.g., 5 Feb 2022 [cite: 34, 285]
  amount: { type: Number, required: true }, // e.g., ₹35,200 [cite: 116]
  status: { type: String, enum: ['Due', 'Paid'], default: 'Due' }, // [cite: 115]
  type: { type: String, enum: ['PF', 'ESI', 'TDS'], required: true } // [cite: 101]
}, { timestamps: true });

module.exports = mongoose.model('Compliance', ComplianceSchema);