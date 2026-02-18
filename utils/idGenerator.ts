
import { supabase } from '../lib/supabaseClient';

/**
 * Generates a unique Application ID: STJ + YY + MM + LLNN
 * Example: STJ2602AB47
 */
export async function generateApplicationId(): Promise<string> {
  const date = new Date();
  const YY = date.getFullYear().toString().slice(-2);
  const MM = (date.getMonth() + 1).toString().padStart(2, '0');
  
  const generatePart = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const LL = letters.charAt(Math.floor(Math.random() * 26)) + 
               letters.charAt(Math.floor(Math.random() * 26));
    const NN = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    return `${LL}${NN}`;
  };

  let uniqueId = '';
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    uniqueId = `STJ${YY}${MM}${generatePart()}`;
    
    // Using select with limit(1) instead of maybeSingle() to prevent
    // internal PostgREST header/aggregation issues like MAX(UUID)
    const { data, error } = await supabase
      .from('applications')
      .select('application_id')
      .eq('application_id', uniqueId)
      .limit(1);

    if (!error && (!data || data.length === 0)) {
      isUnique = true;
    }
    attempts++;
  }

  return uniqueId;
}

