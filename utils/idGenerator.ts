
/**
 * Generates a unique Application ID: STJ + YY + MM + [2 Letters] + [2 Numbers]
 * Format: STJ2601AB12
 * This follows the industrial standard: STJ + Year + Month + Random Alphanumeric.
 */
export async function generateApplicationId(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randLetter1 = letters[Math.floor(Math.random() * letters.length)];
  const randLetter2 = letters[Math.floor(Math.random() * letters.length)];
  const randNum = Math.floor(10 + Math.random() * 90); // 2 digits (10-99)

  return `STJ${year}${month}${randLetter1}${randLetter2}${randNum}`;
}




