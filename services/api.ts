
import { UserRegistration, TrackKey, User, EnrollmentRecord, Review } from '../types';
import { supabase } from '../lib/supabaseClient';

export const apiService = {
  // ... existing methods (sendOtp, verifyOtp, etc.) ...

  async sendOtp(email: string, fullName?: string, isSignup: boolean = true): Promise<{ success: boolean; error?: string }> {
    try {
      let result;
      if (isSignup) {
        result = await supabase.auth.signUp({
          email,
          password: Math.random().toString(36).slice(-12),
          options: {
            emailRedirectTo: "https://www.stjufends.com",
            data: fullName ? { full_name: fullName } : undefined
          }
        });
      } else {
        result = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: "https://www.stjufends.com" }
        });
      }
      if (result.error) {
        const errMsg = result.error.message.toLowerCase();
        if (!isSignup && result.error.status === 422) throw new Error("ACCOUNT_NOT_FOUND");
        if (isSignup && (errMsg.includes('already registered') || errMsg.includes('already exists'))) throw new Error("ALREADY_REGISTERED");
        throw result.error;
      }
      if (isSignup && result.data?.user && result.data.user.identities?.length === 0) throw new Error("ALREADY_REGISTERED");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send OTP' };
    }
  },

  async verifyOtp(email: string, token: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
      if (error) throw error;
      if (!data.user || !data.session) throw new Error("Verification failed: session not found");
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        isAdmin: data.user.email === 'admin@stjufends.com' // Simple admin check example
      };
      return { success: true, user, token: data.session.access_token };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid or expired code.' };
    }
  },

  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return null;
      return {
        id: user.id,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        isAdmin: user.email === 'admin@stjufends.com'
      };
    } catch { return null; }
  },

  async submitApplication(data: any): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('applications').insert({
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
      });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Database sync failed" };
    }
  },

  async fetchUserEnrollments(email: string): Promise<EnrollmentRecord[]> {
    try {
      const { data, error } = await supabase.from('applications').select('*').eq('email', email);
      if (error) throw error;
      return (data || []).map((item: any) => ({
        id: item.id,
        track_key: item.track_key,
        created_at: item.created_at,
        payment_status: item.payment_status,
        progress: Math.floor(Math.random() * 40)
      }));
    } catch { return []; }
  },

  // --- NEW REVIEW METHODS ---

  async fetchApprovedReviews(courseKey?: string): Promise<Review[]> {
    try {
      let query = supabase.from('reviews').select('*').eq('is_approved', true).order('created_at', { ascending: false });
      if (courseKey) query = query.eq('course', courseKey);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch { return []; }
  },

  async fetchAllReviewsForAdmin(): Promise<Review[]> {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    } catch { return []; }
  },

  async fetchUserReview(userId: string, courseKey: string): Promise<Review | null> {
    try {
      const { data, error } = await supabase.from('reviews').select('*').eq('user_id', userId).eq('course', courseKey).maybeSingle();
      if (error) throw error;
      return data;
    } catch { return null; }
  },

  async upsertReview(reviewData: Partial<Review>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('reviews').upsert({
        ...reviewData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,course' });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async toggleReviewApproval(reviewId: string, isApproved: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.from('reviews').update({ is_approved: isApproved }).eq('id', reviewId);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }
};







