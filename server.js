require('dotenv').config(); // Load variables from .env [cite: 173]
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express app
const app = express();

// 1. Connect to MongoDB
connectDB();

// 2. Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing for the React Native frontend
app.use(express.json()); // Body parser for JSON data [cite: 52, 93, 145]

// 3. Define Routes Mapping to Requirements
// Employee Management: Add/Edit and Salary structure [cite: 48, 49]
app.use('/api/employees', require('./routes/employeeRoutes'));

// Payroll Processing: Run, calculate, and lock payroll [cite: 90, 91, 92]
app.use('/api/payroll', require('./routes/payrollRoutes'));

// Compliance: PF, ESI, TDS calculation and reports [cite: 101, 102]
app.use('/api/compliance', require('./routes/complianceRoutes'));

// Loans & Advances: Loan creation and EMI deduction [cite: 136, 137]
app.use('/api/loans', require('./routes/loanRoutes'));

// 4. Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});