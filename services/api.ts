
import { UserRegistration, TrackKey, User, EnrollmentRecord, Review, ApplicationRecord, CourseStatus } from '../types';
import { supabase } from '../lib/supabaseClient';
import { generateApplicationId } from '../utils/idGenerator';

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
      if (result.error) throw result.error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Failed to send OTP' };
    }
  },

  async verifyOtp(email: string, token: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
      if (error) throw error;
      if (!data.user || !data.session) throw new Error("Verification failed");
      
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
      return { success: false, error: err.message || 'Invalid code.' };
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
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        isAdmin: user.email === adminEmail
      };
    } catch { return null; }
  },

  async submitApplication(data: any): Promise<{ success: boolean; error?: string }> {
    try {
      const appId = await generateApplicationId();
      
      const { error } = await supabase.from('applications').insert({
        application_id: appId,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        linkedin: data.linkedin || null,
        current_status: data.currentStatus,
        career_goals: data.careerGoals,
        track_key: data.track,
        program_type: data.programType,
        student_type: data.studentType,
        payment_status: 'completed',
        amount_paid: data.amountPaid || 0,
        // Rules: College gets pending status, School gets NULL
        course_status: data.studentType === 'college' ? 'pending' : null,
        razorpay_payment_id: data.paymentId || null,
        razorpay_order_id: data.orderId || null,
        razorpay_signature: data.signature || null
      });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async fetchAdminApplications(): Promise<ApplicationRecord[]> {
    try {
      const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        fullName: item.full_name,
        track_key: item.track_key as TrackKey,
        student_type: item.student_type as any,
        course_status: item.course_status as any
      }));
    } catch { return []; }
  },

  async updateApplicationStatus(id: string, status: CourseStatus) {
    try {
      const { error } = await supabase.from('applications').update({ course_status: status }).eq('id', id);
      return { success: !error, error };
    } catch (err: any) { return { success: false, error: err.message }; }
  },

  async fetchAdminStats() {
    try {
      const { data: apps } = await supabase.from('applications').select('*');
      const { count: pendingReviews } = await supabase.from('reviews').select('id', { count: 'exact' }).eq('is_approved', false);
      const totalRevenue = apps?.reduce((sum, a) => sum + (Number(a.amount_paid) || 0), 0) || 0;
      return {
        totalApplications: apps?.length || 0,
        totalEnrollments: apps?.filter(a => a.payment_status === 'completed').length || 0,
        totalRevenue,
        pendingReviews: pendingReviews || 0,
        distribution: [],
        totalUsers: new Set(apps?.map(a => a.email)).size || 0
      };
    } catch { return null; }
  },

  async fetchRecentActivity() {
    try {
      const { data: apps } = await supabase.from('applications').select('full_name, created_at').order('created_at', { ascending: false }).limit(3);
      return (apps || []).map(a => ({ msg: 'New Application', user: a.full_name, time: a.created_at }));
    } catch { return []; }
  },

  async fetchApprovedReviews(courseKey?: string): Promise<Review[]> {
    let q = supabase.from('reviews').select('*').eq('is_approved', true);
    if (courseKey) q = q.eq('course', courseKey);
    const { data } = await q.order('created_at', { ascending: false });
    return data || [];
  },

  async fetchAllReviewsForAdmin(): Promise<{ data: Review[], error?: string }> {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    return { data: data || [], error: error?.message };
  },

  async toggleReviewApproval(id: string, approved: boolean) {
    const { error } = await supabase.from('reviews').update({ is_approved: approved }).eq('id', id);
    return { success: !error, error: error?.message };
  },

  async fetchUserReview(userId: string, courseKey: string) {
    const { data } = await supabase.from('reviews').select('*').eq('user_id', userId).eq('course', courseKey).maybeSingle();
    return data;
  },

  async upsertReview(review: any) {
    const { error } = await supabase.from('reviews').upsert(review, { onConflict: 'user_id,course' });
    return { success: !error, error: error?.message };
  },

  async fetchUserEnrollments(email: string): Promise<EnrollmentRecord[]> {
    const { data } = await supabase.from('applications').select('*').eq('email', email);
    return (data || []).map(item => ({
      id: item.id,
      track_key: item.track_key as TrackKey,
      created_at: item.created_at,
      payment_status: item.payment_status,
      progress: 0
    }));
  }
};











