/**
 * Format a phone number string into (XXX) XXX-XXXX format
 */
export function formatPhoneNumber(value: string) {
  const numbers = value.replace(/\D/g, '');
  
  // Remove leading 1 if present
  const cleanNumbers = numbers.startsWith('1') ? numbers.slice(1) : numbers;
  
  // Format remaining digits
  if (cleanNumbers.length <= 3) {
    return `(${cleanNumbers}`;
  } else if (cleanNumbers.length <= 6) {
    return `(${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3)}`;
  } else {
    return `(${cleanNumbers.slice(0, 3)}) ${cleanNumbers.slice(3, 6)}-${cleanNumbers.slice(6, 10)}`;
  }
}

/**
 * Check if a phone number string matches (XXX) XXX-XXXX format
 */
export function isValidPhoneNumber(number: string) {
  return /^\(\d{3}\) \d{3}-\d{4}$/.test(number);
}