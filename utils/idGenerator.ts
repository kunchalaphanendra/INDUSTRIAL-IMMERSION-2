
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
    
    // Check Supabase for duplicates
    const { data } = await supabase
      .from('applications')
      .select('application_id')
      .eq('application_id', uniqueId)
      .maybeSingle();

    if (!data) {
      isUnique = true;
    }
    attempts++;
  }

  return uniqueId;
}
