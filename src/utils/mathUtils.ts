export const evaluateExpression = (a: number, b: number, operation: string): number => {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '×':
    case '*':
      return a * b;
    case '÷':
    case '/':
      if (b === 0) throw new Error('Division by zero');
      return a / b;
    case '%':
      return a % b;
    case '^':
    case '**':
      return Math.pow(a, b);
    case 'root':
      return Math.pow(a, 1 / b);
    default:
      return b;
  }
};

export const evaluateScientific = (value: number, operation: string): number => {
  switch (operation) {
    case 'sin':
      return Math.sin(value * Math.PI / 180);
    case 'cos':
      return Math.cos(value * Math.PI / 180);
    case 'tan':
      return Math.tan(value * Math.PI / 180);
    case 'asin':
      return Math.asin(value) * 180 / Math.PI;
    case 'acos':
      return Math.acos(value) * 180 / Math.PI;
    case 'atan':
      return Math.atan(value) * 180 / Math.PI;
    case 'ln':
      return Math.log(value);
    case 'log':
      return Math.log10(value);
    case 'sqrt':
      return Math.sqrt(value);
    case 'square':
      return value * value;
    case 'cube':
      return value * value * value;
    case 'factorial':
      return factorial(value);
    case 'reciprocal':
      if (value === 0) throw new Error('Division by zero');
      return 1 / value;
    case 'abs':
      return Math.abs(value);
    case 'exp':
      return Math.exp(value);
    default:
      return value;
  }
};

export const factorial = (n: number): number => {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Invalid input for factorial');
  if (n <= 1) return 1;
  return n * factorial(n - 1);
};

export const formatNumber = (num: number): string => {
  if (isNaN(num) || !isFinite(num)) return 'Error';
  
  // Handle very large or very small numbers
  if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
    return num.toExponential(10);
  }
  
  // Remove trailing zeros and unnecessary decimal point
  const formatted = parseFloat(num.toPrecision(12)).toString();
  
  // Add commas for thousands separator
  if (Math.abs(num) >= 1000) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
  }
  
  return formatted;
};

export const parseExpression = (expression: string): number => {
  // Remove spaces and replace display operators with JavaScript operators
  const cleaned = expression
    .replace(/\s/g, '')
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/,/g, '');
  
  // Basic validation
  if (!/^[0-9+\-*/().]*$/.test(cleaned)) {
    throw new Error('Invalid expression');
  }
  
  try {
    // Use Function constructor for safe evaluation
    return Function(`"use strict"; return (${cleaned})`)();
  } catch (error) {
    throw new Error('Invalid expression');
  }
};

export const solveLinearEquation = (equation: string, variable: string = 'x'): number => {
  // Simple linear equation solver: ax + b = c
  // This is a basic implementation for demonstration
  const parts = equation.split('=');
  if (parts.length !== 2) throw new Error('Invalid equation format');
  
  const left = parts[0].trim();
  const right = parseFloat(parts[1].trim());
  
  // Extract coefficient and constant
  const regex = new RegExp(`(-?\\d*)${variable}\\s*([+-]\\s*\\d+)?`);
  const match = left.match(regex);
  
  if (!match) throw new Error('Invalid equation format');
  
  const coefficient = match[1] === '' || match[1] === '+' ? 1 : 
                     match[1] === '-' ? -1 : 
                     parseFloat(match[1]);
  
  const constant = match[2] ? parseFloat(match[2].replace(/\s/g, '')) : 0;
  
  if (coefficient === 0) throw new Error('No solution exists');
  
  return (right - constant) / coefficient;
};