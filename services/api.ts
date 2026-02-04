
import { UserRegistration, TrackKey, PaymentStatus } from '../types';

/**
 * PRODUCTION API SERVICE for Supabase
 * Handles mapping from the frontend (camelCase) to the Database (snake_case)
 */

const getApiConfig = () => {
  const env = (import.meta as any).env || {};
  const baseUrl = (env.VITE_BACKEND_API_URL || '').trim();
  const key = (env.VITE_BACKEND_API_KEY || '').trim();

  return { 
    url: baseUrl ? (baseUrl.replace(/\/$/, '') + '/rest/v1/applications') : '', 
    key 
  };
};

export const apiService = {
  async submitApplication(data: any): Promise<{ success: boolean; error?: string }> {
    const config = getApiConfig();

    // Bypass in development environments if config is missing
    if (!config.url || !config.key) {
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('stackblitz')) {
        console.warn("Bypassing API submission in Localhost. Check Vercel for live data.");
        return { success: true };
      }
      return { 
        success: false, 
        error: `Configuration Error: Missing VITE_BACKEND_API_URL or VITE_BACKEND_API_KEY in Vercel.` 
      };
    }

    try {
      const payload = {
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        linkedin: data.linkedin || null,
        current_status: data.currentStatus,
        career_goals: data.careerGoals,
        track_key: data.track,
        payment_status: 'completed',
        razorpay_payment_id: data.paymentId || null,
        razorpay_order_id: data.orderId || null,
        razorpay_signature: data.signature || null
      };

      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.key,
          'Authorization': `Bearer ${config.key}`,
          'Prefer': 'return=minimal' 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({ message: 'Unknown database error' }));
        return { 
          success: false, 
          error: `Supabase Error: ${errBody.message || response.statusText}. Ensure table 'applications' exists with correct columns.` 
        };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: "Network connection failed. Data not saved." };
    }
  }
};

