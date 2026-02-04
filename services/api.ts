
import { UserRegistration, TrackKey, User, EnrollmentRecord } from '../types';

const getApiConfig = () => {
  const env = (import.meta as any).env || {};
  const baseUrl = (env.VITE_BACKEND_API_URL || '').trim();
  const key = (env.VITE_BACKEND_API_KEY || '').trim();

  return { 
    url: baseUrl ? baseUrl.replace(/\/$/, '') : '', 
    key 
  };
};

export const apiService = {
  async submitApplication(data: any): Promise<{ success: boolean; error?: string }> {
    const config = getApiConfig();
    const endpoint = `${config.url}/rest/v1/applications`;

    if (!config.url || !config.key) {
      if (window.location.hostname === 'localhost' || window.location.hostname.includes('stackblitz')) {
        return { success: true };
      }
      return { success: false, error: "Missing API Config" };
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

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.key,
          'Authorization': `Bearer ${config.key}`,
          'Prefer': 'return=minimal' 
        },
        body: JSON.stringify(payload),
      });

      return { success: response.ok };
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  },

  async fetchUserEnrollments(email: string): Promise<EnrollmentRecord[]> {
    const config = getApiConfig();
    if (!config.url || !config.key) return [];

    try {
      const response = await fetch(`${config.url}/rest/v1/applications?email=eq.${email}&select=*`, {
        headers: {
          'apikey': config.key,
          'Authorization': `Bearer ${config.key}`
        }
      });
      if (!response.ok) return [];
      const data = await response.json();
      return data.map((item: any) => ({
        id: item.id,
        track_key: item.track_key,
        created_at: item.created_at,
        payment_status: item.payment_status,
        progress: Math.floor(Math.random() * 40) // Simulated progress
      }));
    } catch {
      return [];
    }
  }
};



