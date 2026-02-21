
import { UserRegistration, TrackKey, User, EnrollmentRecord, Review, ApplicationRecord, CourseStatus, StudentType, Institution, BlogPost, BlogPostInput } from '../types';
import { supabase } from '../lib/supabaseClient';
import { generateApplicationId } from '../utils/idGenerator';
// Import admin credentials for internal verification
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../lib/adminAuth';

export interface AdminFilterOptions {
  studentType?: string;
  program?: string;
  courseStatus?: string;
  paymentStatus?: string;
  institutionId?: string;
  search?: string;
}

export const apiService = {
  // --- Institution Hybrid Logic ---
  async fetchVerifiedInstitutions(type?: StudentType): Promise<Institution[]> {
    let query = supabase.from('institutions').select('*').eq('is_verified', true);
    if (type) {
      query = query.eq('type', type.toLowerCase());
    }
    const { data, error } = await query.order('name');
    
    if (error) return [];
    return (data || []).map(item => ({
      ...item,
      type: item.type.toUpperCase() as StudentType
    }));
  },

  async fetchAllInstitutionsForAdmin(): Promise<Institution[]> {
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return (data || []).map(item => ({
      ...item,
      type: item.type.toUpperCase() as StudentType
    }));
  },

  async approveInstitution(id: string) {
    const { error } = await supabase
      .from('institutions')
      .update({ is_verified: true })
      .eq('id', id);
    return { success: !error, error: error?.message };
  },

  async createInstitution(name: string, type: StudentType): Promise<{ id: string | null; error?: string }> {
    const { data, error } = await supabase
      .from('institutions')
      .insert({ name, type: type.toLowerCase(), is_verified: false })
      .select('id')
      .single();
    
    if (error) return { id: null, error: error.message };
    return { id: data.id, error: undefined };
  },

  async adminAddInstitution(name: string, type: StudentType): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('institutions')
      .insert({ name, type: type.toLowerCase(), is_verified: true });
    
    return { success: !error, error: error?.message };
  },

  async checkUserExists(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('applications')
      .select('email')
      .eq('email', email)
      .limit(1);
    
    if (error) return false;
    return data && data.length > 0;
  },

  async sendOtp(email: string, fullName?: string, isSignup: boolean = true): Promise<{ success: boolean; error?: string }> {
    try {
      let result;
      if (isSignup) {
        result = await supabase.auth.signUp({
          email,
          password: Math.random().toString(36).slice(-12),
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin
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
      return { success: false, error: err.message || 'Failed to send verification code' };
    }
  },

  async verifyOtp(email: string, token: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      const { data, error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
      if (error) throw error;
      if (!data.user || !data.session) throw new Error("Verification failed");
      
      const user: User = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
        isAdmin: false
      };
      return { success: true, user, token: data.session.access_token };
    } catch (err: any) {
      return { success: false, error: err.message || 'Invalid code.' };
    }
  },

  async adminLogin(password: string): Promise<{ success: boolean; user?: User; token?: string; error?: string }> {
    try {
      if (password === ADMIN_PASSWORD) {
        localStorage.setItem("admin_session", "true");
        const user: User = {
          id: 'admin-id',
          email: ADMIN_EMAIL,
          fullName: 'Administrator',
          avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=admin`,
          isAdmin: true
        };
        return { success: true, user, token: 'admin-token' };
      }
      return { success: false, error: 'Invalid credentials' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Admin authentication failed' };
    }
  },

  async getCurrentUser(token: string): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) return null;
      return {
        id: user.id,
        email: user.email || '',
        fullName: user.user_metadata?.full_name || user.email?.split('@')[0],
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
        isAdmin: false
      };
    } catch { return null; }
  },

  async submitApplication(data: any): Promise<{ success: boolean; error?: string }> {
    try {
      const appId = await generateApplicationId();
      
      const payload = {
        application_id: appId,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        institution_id: data.institution_id,
        linkedin: data.linkedin || null,
        current_status: data.currentStatus,
        career_goals: data.careerGoals,
        track_key: data.track,
        program_type: data.programType,
        student_type: data.studentType?.toLowerCase() || 'college',
        payment_status: 'completed',
        amount_paid: Number(data.amountPaid) || 0,
        course_progress: data.studentType === 'COLLEGE' ? 'PENDING' : 'COMPLETED',
        razorpay_payment_id: data.paymentId || null,
        razorpay_order_id: data.orderId || null,
        razorpay_signature: data.signature || null
      };
      const { error } = await supabase.from('applications').insert(payload);
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async fetchAdminApplications(filters?: AdminFilterOptions): Promise<ApplicationRecord[]> {
    try {
      let query = supabase.from('applications').select(`
        *,
        institutions (
          id,
          name,
          type
        )
      `);
      
      if (filters) {
        if (filters.studentType && filters.studentType !== 'ALL') {
          query = query.eq('student_type', filters.studentType.toLowerCase());
        }
        if (filters.program && filters.program !== 'ALL') {
          query = query.eq('track_key', filters.program);
        }
        if (filters.courseStatus && filters.courseStatus !== 'ALL') {
          query = query.eq('course_progress', filters.courseStatus.toUpperCase());
        }
        if (filters.paymentStatus && filters.paymentStatus !== 'ALL') {
          query = query.eq('payment_status', filters.paymentStatus.toLowerCase());
        }
        if (filters.institutionId && filters.institutionId !== 'ALL') {
          query = query.eq('institution_id', filters.institutionId);
        }
        if (filters.search) {
          const s = `%${filters.search}%`;
          query = query.or(`full_name.ilike.${s},email.ilike.${s},application_id.ilike.${s}`);
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        fullName: item.full_name,
        track_key: item.track_key as TrackKey,
        student_type: (item.student_type?.toUpperCase() || 'COLLEGE') as StudentType,
        course_progress: (item.course_progress?.toUpperCase() || 'PENDING') as CourseStatus
      }));
    } catch { return []; }
  },

  async fetchApplicationById(id: string): Promise<ApplicationRecord | null> {
    try {
      const { data, error } = await supabase.from('applications').select(`
        *,
        institutions (
          id,
          name,
          type
        )
      `).eq('id', id).single();
      if (error || !data) return null;
      return {
        ...data,
        fullName: data.full_name,
        track_key: data.track_key as TrackKey,
        student_type: (data.student_type?.toUpperCase() || 'COLLEGE') as StudentType,
        course_progress: (data.course_progress?.toUpperCase() || 'PENDING') as CourseStatus
      };
    } catch { return null; }
  },

  async updateApplicationStatus(id: string, status: CourseStatus) {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ course_progress: status?.toUpperCase() })
        .eq('id', id);
      
      if (error) throw error;
      return { success: true };
    } catch (err: any) { 
      console.error("Progress update failed:", err);
      return { success: false, error: err.message }; 
    }
  },

  async fetchAdminStats() {
    try {
      const { data: apps } = await supabase.from('applications').select(`
        amount_paid, 
        track_key, 
        email, 
        payment_status, 
        student_type, 
        course_progress,
        institutions ( name )
      `);
      const { data: reviews } = await supabase.from('reviews').select('id').eq('review_status', 'pending');
      const { data: institutions } = await supabase.from('institutions').select('id').eq('is_verified', false);
      
      const pendingReviews = reviews?.length || 0;
      const pendingInstitutions = institutions?.length || 0;
      const totalRevenue = apps?.reduce((sum, a) => sum + (Number(a.amount_paid) || 0), 0) || 0;
      
      const schoolCount = apps?.filter(a => a.student_type?.toUpperCase() === 'SCHOOL').length || 0;
      const collegeCount = apps?.filter(a => a.student_type?.toUpperCase() === 'COLLEGE').length || 0;
      const completedCoursesCount = apps?.filter(a => a.course_progress?.toUpperCase() === 'COMPLETED').length || 0;
      const pendingPaymentsCount = apps?.filter(a => a.payment_status?.toUpperCase() === 'PENDING').length || 0;

      const instRevenue: Record<string, number> = {};
      apps?.filter(a => a.payment_status === 'completed').forEach(a => {
        const name = (a.institutions as any)?.name || 'Individual';
        instRevenue[name] = (instRevenue[name] || 0) + (Number(a.amount_paid) || 0);
      });
      const institutionRevenue = Object.entries(instRevenue)
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue);

      const counts: Record<string, number> = { college_immersion: 0, college_prof: 0, school_skill: 0, school_tuition: 0 };
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
        pendingReviews,
        pendingInstitutions,
        schoolCount,
        collegeCount,
        completedCoursesCount,
        pendingPaymentsCount,
        distribution,
        institutionRevenue,
        totalInstitutions: new Set(apps?.map(a => (a.institutions as any)?.name)).size || 0,
        totalUsers: new Set(apps?.map(a => a.email)).size || 0
      };
    } catch { return null; }
  },

  async fetchRecentActivity() {
    try {
      const { data: apps } = await supabase.from('applications').select('full_name, created_at').order('created_at', { ascending: false }).limit(5);
      return (apps || []).map(a => ({ msg: 'New Application', user: a.full_name, time: a.created_at, type: 'app' }));
    } catch { return []; }
  },
  
  // --- Blog CMS Logic ---
  async uploadBlogImage(file: File): Promise<{ url: string | null; error?: string }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      return { url: data.publicUrl };
    } catch (err: any) {
      return { url: null, error: err.message };
    }
  },

  async fetchAllBlogPostsForAdmin(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data || [];
  },

  async fetchPublishedBlogPosts(): Promise<Partial<BlogPost>[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image, category, reading_time, is_featured, created_at, published_at')
      .or(`status.eq.published,and(status.eq.scheduled,published_at.lte.${now})`)
      .order('published_at', { ascending: false });
    
    if (error) return [];
    return data || [];
  },

  async fetchFeaturedPost(): Promise<BlogPost | null> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .or(`status.eq.published,and(status.eq.scheduled,published_at.lte.${now})`)
      .eq('is_featured', true)
      .limit(1)
      .single();
    
    if (error) return null;
    return data;
  },

  async fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .or(`status.eq.published,and(status.eq.scheduled,published_at.lte.${now})`)
      .single();
    
    if (error) return null;
    return data;
  },

  async createBlogPost(post: BlogPostInput): Promise<{ success: boolean; error?: string }> {
    try {
      // If this post is featured, unfeature others
      if (post.is_featured) {
        await supabase.from('blog_posts').update({ is_featured: false }).neq('id', '00000000-0000-0000-0000-000000000000');
      }

      const payload = {
        ...post,
        published_at: post.status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('blog_posts')
        .insert(payload);
      
      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateBlogPost(id: string, post: Partial<BlogPostInput>): Promise<{ success: boolean; error?: string }> {
    try {
      // If this post is featured, unfeature others
      if (post.is_featured) {
        await supabase.from('blog_posts').update({ is_featured: false }).neq('id', id);
      }

      const payload: any = {
        ...post,
        updated_at: new Date().toISOString()
      };

      if (post.status === 'published') {
        // Only set published_at if it wasn't already set
        const { data: current } = await supabase.from('blog_posts').select('published_at').eq('id', id).single();
        if (!current?.published_at) {
          payload.published_at = new Date().toISOString();
        }
      }

      const { error } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', id);
      
      return { success: !error, error: error?.message };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async deleteBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    return { success: !error, error: error?.message };
  },

  async fetchRelatedPosts(currentId: string, category: string, limit: number = 3): Promise<Partial<BlogPost>[]> {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, cover_image, created_at, published_at')
      .or(`status.eq.published,and(status.eq.scheduled,published_at.lte.${now})`)
      .eq('category', category)
      .neq('id', currentId)
      .order('published_at', { ascending: false })
      .limit(limit);
    
    if (error) return [];
    return data || [];
  },

  async fetchApprovedReviews(courseKey?: string): Promise<Review[]> {
    let q = supabase.from('reviews').select('*').eq('review_status', 'approved');
    if (courseKey) q = q.eq('course', courseKey);
    const { data } = await q.order('created_at', { ascending: false });
    return data || [];
  },

  async fetchAllReviewsForAdmin(): Promise<{ data: Review[], error?: string }> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: data || [], error: error?.message };
  },

  async approveReview(reviewId: string) {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ review_status: "approved" })
        .eq("id", reviewId);

      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("Approve failed:", err);
      return { success: false, error: err.message };
    }
  },

  async rejectReview(reviewId: string) {
    try {
      const { error } = await supabase
        .from("reviews")
        .update({ review_status: "rejected" })
        .eq("id", reviewId);
      
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      console.error("Reject failed:", err);
      return { success: false, error: err.message };
    }
  },

  async deleteReview(reviewId: string) {
     return this.rejectReview(reviewId);
  },

  async fetchUserReview(userId: string, courseKey: string) {
    const { data } = await supabase.from('reviews').select('*').eq('user_id', userId).eq('course', courseKey).limit(1);
    return data && data.length > 0 ? data[0] : null;
  },

  async upsertReview(review: any) {
    const { error } = await supabase.from('reviews').upsert({
      ...review,
      review_status: 'pending' 
    }, { onConflict: 'user_id,course' });
    return { success: !error, error: error?.message };
  },

  async fetchUserEnrollments(email: string): Promise<ApplicationRecord[]> {
    const { data } = await supabase.from('applications').select(`
      *,
      institutions (
        id,
        name,
        type
      )
    `).eq('email', email).order('created_at', { ascending: false });
    return (data || []).map(item => ({
      ...item,
      fullName: item.full_name,
      track_key: item.track_key as TrackKey,
      student_type: (item.student_type?.toUpperCase() || 'COLLEGE') as StudentType,
      course_progress: (item.course_progress?.toUpperCase() || 'PENDING') as CourseStatus
    }));
  }
};

