/**
 * Utility functions for formatting numbers with comma separators
 */

/**
 * Formats a number with comma separators and decimal places
 * @param {number|string} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export const formatNumber = (value, decimals = 2) => {
  const num = parseFloat(value) || 0;
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats a currency amount with RD$ prefix and comma separators
 * @param {number|string} value - The amount to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, decimals = 2) => {
  const formatted = formatNumber(value, decimals);
  return `RD$ ${formatted}`;
};

/**
 * Formats a number for display in tables and forms
 * @param {number|string} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string with $ prefix
 */
export const formatDisplayNumber = (value, decimals = 2) => {
  const formatted = formatNumber(value, decimals);
  return `$${formatted}`;
};

/**
 * Formats a number for PDF generation (without currency symbol)
 * @param {number|string} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted number string
 */
export const formatNumberForPDF = (value, decimals = 2) => {
  return formatNumber(value, decimals);
};
