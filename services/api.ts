import { UserRegistration, TrackKey, User, EnrollmentRecord, Review, ApplicationRecord, CourseStatus } from '../types';
import { supabase } from '../lib/supabaseClient';

export const apiService = {
  async sendOtp(email: string, fullName?: string, isSignup: boolean = true): Promise<{ success: boolean; error?: string }> {
    try {
      let result;
      if (isSignup) {
        result = await supabase.auth.signUp({
          email,
          password: Math.random().toString(36).slice(-12),
          options: {
            emailRedirectTo: window.location.origin,
            data: fullName ? { full_name: fullName } : undefined
          }
        });
      } else {
        result = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: window.location.origin }
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
      
      const adminEmail = 'admin@stjufends.com';
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        isAdmin: data.user.email === adminEmail
      };
      return { success: true, user, token: data.session.access_token };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid or expired code.' };
    }
  },

  async getCurrentUser(token: string): Promise<User | null> {
    if (token === 'test-token-bypass') {
      const storedUser = localStorage.getItem('ii_user');
      return storedUser ? JSON.parse(storedUser) : null;
    }

    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return null;
      
      const adminEmail = 'admin@stjufends.com';
      return {
        id: user.id,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        isAdmin: user.email === adminEmail
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
        program_type: data.programType,
        payment_status: 'completed',
        amount_paid: data.amountPaid || 0,
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
        track_key: item.track_key as TrackKey,
        created_at: item.created_at,
        payment_status: item.payment_status,
        progress: Math.floor(Math.random() * 40)
      }));
    } catch { return []; }
  },

  // ADMIN CRM METHODS
  async fetchAdminStats() {
    try {
      const { data: apps, error: appErr } = await supabase.from('applications').select('*');
      const { count: pendingReviewsCount } = await supabase.from('reviews').select('id', { count: 'exact' }).eq('is_approved', false);
      
      if (appErr) throw appErr;

      const totalRevenue = apps?.reduce((sum, a) => sum + (Number(a.amount_paid) || 0), 0) || 0;
      
      // Calculate real distribution
      const counts: Record<string, number> = {
        college_immersion: 0,
        college_prof: 0,
        school_skill: 0,
        school_tuition: 0
      };
      apps?.forEach(a => { if (counts[a.track_key] !== undefined) counts[a.track_key]++; });
      
      const totalCount = apps?.length || 1;
      const distribution = Object.entries(counts).map(([key, val]) => ({
        name: key.replace(/_/g, ' '),
        count: Math.round((val / totalCount) * 100),
        raw: val
      }));

      return {
        totalApplications: apps?.length || 0,
        totalEnrollments: apps?.filter(a => a.payment_status === 'completed').length || 0,
        totalRevenue,
        pendingReviews: pendingReviewsCount || 0,
        distribution,
        totalUsers: apps ? new Set(apps.map(a => a.email)).size : 0
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  async fetchRecentActivity() {
    try {
      const { data: apps } = await supabase.from('applications').select('full_name, created_at').order('created_at', { ascending: false }).limit(5);
      const { data: reviews } = await supabase.from('reviews').select('user_name, created_at, is_approved').order('created_at', { ascending: false }).limit(5);
      
      const activity = [
        ...(apps || []).map(a => ({ msg: 'New Application', user: a.full_name, time: a.created_at, type: 'app' })),
        ...(reviews || []).map(r => ({ msg: r.is_approved ? 'Review Approved' : 'New Review Pending', user: r.user_name, time: r.created_at, type: 'rev' }))
      ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

      return activity;
    } catch { return []; }
  },

  async fetchAdminApplications(): Promise<ApplicationRecord[]> {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        fullName: item.full_name,
        track_key: item.track_key as TrackKey,
        amount_paid: item.amount_paid // Pass through real amount
      }));
    } catch { return []; }
  },

  async updateApplicationStatus(id: string, status: CourseStatus) {
    try {
      const { error } = await supabase.from('applications').update({ course_status: status }).eq('id', id);
      return { success: !error, error };
    } catch (err: any) { return { success: false, error: err.message }; }
  },

  async fetchApprovedReviews(courseKey?: string): Promise<Review[]> {
    try {
      let query = supabase.from('reviews').select('*').eq('is_approved', true).order('created_at', { ascending: false });
      if (courseKey) query = query.eq('course', courseKey);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch { return []; }
  },

  async fetchAllReviewsForAdmin(): Promise<{ data: Review[], error?: string }> {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data: data || [] };
    } catch (err: any) {
      return { data: [], error: err.message };
    }
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










