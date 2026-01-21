const PDFDocument = require('pdfkit');

/**
 * Generates a basic Payslip PDF structure
 * Requirement: Handles salary disbursement and payslip generation [cite: 206, 209]
 */
const generatePayslipPDF = (employeeData, salaryData) => {
  const doc = new PDFDocument();

  // Header: Zoho Payroll Style [cite: 1, 264]
  doc.fontSize(20).text('PAYSLIP - ' + salaryData.month, { align: 'center' });
  doc.moveDown();

  // Employee Details [cite: 66-70]
  doc.fontSize(12).text(`Employee Name: ${employeeData.name}`);
  doc.text(`Designation: ${employeeData.designation}`);
  doc.text(`Department: ${employeeData.department}`);
  doc.moveDown();

  // Salary Table [cite: 242-258]
  doc.text('------------------------------------------');
  doc.text(`Gross Salary: ${salaryData.grossSalary}`);
  doc.text(`PF Deduction: ${salaryData.pfDeduction}`);
  doc.text(`TDS: ${salaryData.tdsDeduction}`);
  doc.text(`Loan EMI: ${salaryData.loanEMI}`);
  doc.text('------------------------------------------');
  doc.fontSize(14).text(`NET PAYABLE: ${salaryData.netSalary}`, { bold: true });

  doc.end();
  return doc;
};

module.exports = { generatePayslipPDF };