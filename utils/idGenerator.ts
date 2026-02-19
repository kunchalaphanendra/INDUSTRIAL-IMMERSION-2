
/**
 * Generates a unique Application ID: STJ + YY + MM + [2 Letters] + [3 Numbers]
 * Format: STJ2601AB123
 * This avoids any database-side MAX(id) queries which fail on UUID primary keys.
 */
export async function generateApplicationId(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randLetter1 = letters[Math.floor(Math.random() * letters.length)];
  const randLetter2 = letters[Math.floor(Math.random() * letters.length)];
  const randNum = Math.floor(100 + Math.random() * 900); // 3 digits

  return `STJ${year}${month}${randLetter1}${randLetter2}${randNum}`;
}



