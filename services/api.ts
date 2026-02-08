
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
  // --- AUTH METHODS ---
  async signUp(email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> {
    const config = getApiConfig();
    try {
      const response = await fetch(`${config.url}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.key
        },
        body: JSON.stringify({
          email,
          password,
          data: { full_name: fullName }
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || data.error_description || 'Signup failed');
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async signIn(email: string, password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    const config = getApiConfig();
    try {
      const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.key
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error_description || data.msg || 'Login failed');
      
      const user: User = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`
      };

      return { success: true, user, token: data.access_token };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getCurrentUser(token: string): Promise<User | null> {
    const config = getApiConfig();
    try {
      const response = await fetch(`${config.url}/auth/v1/user`, {
        headers: {
          'apikey': config.key,
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) return null;
      return {
        id: data.id,
        email: data.email,
        fullName: data.user_metadata?.full_name || data.email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`
      };
    } catch {
      return null;
    }
  },

  // --- APPLICATION METHODS ---
  async submitApplication(data: any, token?: string): Promise<{ success: boolean; error?: string }> {
    const config = getApiConfig();
    const endpoint = `${config.url}/rest/v1/applications`;

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
          'Authorization': token ? `Bearer ${token}` : `Bearer ${config.key}`,
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
        progress: Math.floor(Math.random() * 40)
      }));
    } catch {
      return [];
    }
  }
};
