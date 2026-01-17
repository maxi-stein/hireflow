import * as crypto from 'crypto';

/**
 * Generates a random secure password
 * @param length - Length of the password (default: 10)
 * @returns Random password string
 */
export function generateRandomPassword(length: number = 10): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*';

  const allChars = lowercase + uppercase + numbers + specialChars;

  // Ensure at least one character from each category
  let password = '';
  password += lowercase[crypto.randomInt(0, lowercase.length)];
  password += uppercase[crypto.randomInt(0, uppercase.length)];
  password += numbers[crypto.randomInt(0, numbers.length)];
  password += specialChars[crypto.randomInt(0, specialChars.length)];

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[crypto.randomInt(0, allChars.length)];
  }

  // Shuffle the password to avoid predictable patterns
  return password
    .split('')
    .sort(() => crypto.randomInt(-1, 2))
    .join('');
}
