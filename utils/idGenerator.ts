
/**
 * Generates a unique Application ID: STJ + YY + MM + [Timestamp-Suffix]
 * Purely client-side to avoid Postgres aggregation (MAX(UUID)) errors.
 */
export async function generateApplicationId(): Promise<string> {
  const date = new Date();
  const YY = date.getFullYear().toString().slice(-2);
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  
  // Generate a random 4-character hex suffix
  const randomSuffix = Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0');
  
  // Use the last 2 digits of the current second/millisecond to ensure high entropy
  const timeSlice = Date.now().toString().slice(-4);
  
  // Example Result: STJ2602-A4F1-9921
  return `STJ${YY}${MM}-${randomSuffix}-${timeSlice}`;
}


