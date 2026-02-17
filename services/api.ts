import { UserRegistration, TrackKey, User, EnrollmentRecord } from '../types';
import { supabase } from '../lib/supabaseClient';

export const apiService = {
  /**
   * Starts the OTP flow using Supabase Auth SDK.
   * @param email The user's email
   * @param fullName Optional name for new user registration
   * @param isSignup Whether this is a new registration
   */
  async sendOtp(email: string, fullName?: string, isSignup: boolean = true): Promise<{ success: boolean; error?: string }> {
    try {
      let result;
      
      if (isSignup) {
        // For new users, we use signUp to pass the full_name metadata
        result = await supabase.auth.signUp({
          email,
          password: Math.random().toString(36).slice(-12), // Dummy password for OTP flow
          options: {
            emailRedirectTo: "https://www.stjufends.com",
            data: fullName ? { full_name: fullName } : undefined
          }
        });
      } else {
        // For existing users, we use signInWithOtp
        result = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: "https://www.stjufends.com"
          }
        });
      }

      if (result.error) {
        const errMsg = result.error.message.toLowerCase();
        // Handle specific error logic expected by AuthModal
        if (!isSignup && result.error.status === 422) {
          throw new Error("ACCOUNT_NOT_FOUND");
        }
        if (isSignup && (errMsg.includes('already registered') || errMsg.includes('already exists'))) {
          throw new Error("ALREADY_REGISTERED");
        }
        throw result.error;
      }

      // Supabase sometimes returns a user but no session for signup if email confirmation is on
      // or if the user already exists (depending on site settings).
      // We check if it's a silent "user already exists" success
      if (isSignup && result.data?.user && result.data.user.identities?.length === 0) {
        throw new Error("ALREADY_REGISTERED");
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send OTP' };
    }
  },

  /**
   * Verifies the 6-digit code using Supabase Auth SDK.
   */
  async verifyOtp(email: string, token: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
      });

      if (error) throw error;

      if (!data.user || !data.session) {
        throw new Error("Verification failed: session not found");
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`
      };

      return { success: true, user, token: data.session.access_token };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid or expired code.' };
    }
  },

  /**
   * Recovers the user session using the token.
   */
  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return null;
      
      return {
        id: user.id,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
      };
    } catch {
      return null;
    }
  },

  /**
   * Submits an application to the database using Supabase Client.
   */
  async submitApplication(data: any, token?: string): Promise<{ success: boolean; error?: string }> {
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

      const { error } = await supabase
        .from('applications')
        .insert(payload);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Database sync failed" };
    }
  },

  /**
   * Fetches enrollments for a specific user email.
   */
  async fetchUserEnrollments(email: string): Promise<EnrollmentRecord[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('email', email);

      if (error) throw error;
      
      return (data || []).map((item: any) => ({
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






