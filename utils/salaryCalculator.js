/**
 * Utility to calculate statutory deductions and net pay
 * Based on Compliance Module requirements
 */
const calculateNetSalary = (grossSalary, loanEMI = 0) => {
  // Statutory Rates (Example Indian Standards)
  const PF_RATE = 0.12;  // 12%
  const ESI_RATE = 0.0075; // 0.75%
  
  // 1. Calculate Deductions
  const pfDeduction = grossSalary * PF_RATE;
  const esiDeduction = grossSalary * ESI_RATE;
  
  // 2. TDS Calculation (Simplified logic for demonstration)
  let tdsDeduction = 0;
  if (grossSalary * 12 > 500000) {
    tdsDeduction = (grossSalary * 0.10); // 10% TDS
  }

  // 3. Total Deductions
  const totalDeductions = pfDeduction + esiDeduction + tdsDeduction + loanEMI;

  // 4. Net Salary
  const netSalary = grossSalary - totalDeductions;

  return {
    grossSalary,
    pfDeduction,
    esiDeduction,
    tdsDeduction,
    loanEMI,
    totalDeductions,
    netSalary
  };
};

module.exports = { calculateNetSalary };