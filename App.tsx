
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProgramSelector from './components/ProgramSelector';
import PricingSection from './components/PricingSection';
import Features from './components/Features';
import Footer from './components/Footer';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import TrackDetailModal from './components/TrackDetailModal';
import Testimonials from './components/Testimonials';
import About from './components/About';
import AdminLayout from './components/AdminLayout';
import AdminDashboardView from './components/AdminDashboardView';
import AdminStudents from './components/AdminStudents';
import AdminPayments from './components/AdminPayments';
import AdminReviews from './components/AdminReviews';
import AdminInstitutions from './components/AdminInstitutions';
import AdminLogin from './components/AdminLogin';
import AdminStudentProfile from './components/AdminStudentProfile';
import AdminBlogCMS from './components/AdminBlogCMS';
import BlogList from './components/BlogList';
import BlogPostDetail from './components/BlogPostDetail';
import { PARTNERS, TRACKS } from './constants';
import { TrackKey, EnrollmentState, User, BlogPost, InstitutionType } from '@/types';
import { apiService } from './services/api';
import { isAdminLoggedIn } from './lib/adminAuth';

const BlogSection: React.FC<{ onPostClick: (slug: string) => void }> = ({ onPostClick }) => {
  const [featured, setFeatured] = useState<BlogPost | null>(null);
  const [latest, setLatest] = useState<Partial<BlogPost>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogData = async () => {
      const [featuredPost, latestPosts] = await Promise.all([
        apiService.fetchFeaturedPost(),
        apiService.fetchLatestPosts(3)
      ]);
      setFeatured(featuredPost);
      setLatest(latestPosts);
      setLoading(false);
    };
    loadBlogData();
  }, []);

  if (loading || (!featured && latest.length === 0)) return null;

  return (
    <section className="py-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Authority Layer</p>
          <h2 className="text-3xl md:text-6xl font-heading font-bold mb-6 uppercase tracking-tight">Insights & Industry Perspectives</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Featured Post */}
          {featured && (
            <div className="lg:col-span-7">
              <div 
                onClick={() => onPostClick(featured.slug)}
                className="group cursor-pointer glass-card rounded-[3rem] overflow-hidden border-blue-500/20 h-full flex flex-col"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img 
                    src={featured.cover_image} 
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 md:p-12 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-[8px] font-black uppercase tracking-widest">{featured.category}</span>
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{featured.reading_time} min read</span>
                  </div>
                  <h3 className="text-2xl md:text-4xl font-heading font-bold mb-6 text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{featured.title}</h3>
                  <p className="text-gray-400 text-lg mb-8 line-clamp-3">{featured.excerpt}</p>
                  <div className="mt-auto">
                    <button className="text-blue-500 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-2 group-hover:gap-4 transition-all">
                      Read Article <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Latest Posts */}
          <div className={`${featured ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-8`}>
            {latest.filter(p => p.id !== featured?.id).map((post) => (
              <div 
                key={post.id}
                onClick={() => onPostClick(post.slug!)}
                className="group cursor-pointer glass-card rounded-3xl overflow-hidden border-white/5 flex gap-6 p-4 hover:border-blue-500/20 transition-all"
              >
                <div className="w-32 h-32 shrink-0 rounded-2xl overflow-hidden">
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">{post.category}</span>
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{post.reading_time} min read</span>
                  </div>
                  <h4 className="text-lg font-heading font-bold text-white uppercase tracking-tight line-clamp-2 group-hover:text-blue-400 transition-colors">{post.title}</h4>
                  <p className="text-gray-500 text-[10px] mt-2 font-black uppercase tracking-widest">
                    {new Date(post.published_at!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PartnersSection: React.FC = () => (
  <section className="py-12 bg-black border-y border-white/5 overflow-hidden">
    <div className="mb-8 text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">Strategic Brand Partners</div>
    <div className="flex animate-marquee whitespace-nowrap opacity-40 hover:opacity-100 transition-opacity">
      {[...PARTNERS, ...PARTNERS].map((p, i) => (
        <span key={i} className="mx-12 text-2xl font-heading font-black text-white/50 hover:text-blue-500 transition-colors uppercase tracking-tighter">
          {p}
        </span>
      ))}
    </div>
  </section>
);

const GetStarted: React.FC = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById('organisations');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="get-started" className="py-24 bg-gradient-to-b from-[#050505] to-black border-t border-white/5">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="glass-card p-12 md:p-24 rounded-[4rem] border-blue-500/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-6">Built for the future of work</p>
          <h2 className="text-4xl md:text-7xl font-heading font-bold mb-10 uppercase tracking-tighter leading-none">Ready to <br /><span className="text-blue-500">Execute?</span></h2>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed font-medium">
            Stop wondering if you're ready. Start building your industrial proof-of-work today.
          </p>
          <div className="flex flex-col items-center justify-center">
            <button 
              onClick={() => scrollTo('organisations')} 
              className="w-full sm:w-auto px-16 py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 text-xl uppercase tracking-[0.2em] active:scale-95 transform duration-200"
            >
              Choose Your Program
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'dashboard' | 'admin' | 'admin-login' | 'blog' | 'blog-post' | 'about' | 'institutions'>('landing');
  const [adminSubView, setAdminSubView] = useState<'overview' | 'students' | 'payments' | 'reviews' | 'institutions' | 'blog'>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TrackKey | null>(null);
  const [detailTrack, setDetailTrack] = useState<TrackKey | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentState | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [initialInstitutionType, setInitialInstitutionType] = useState<InstitutionType | null>(null);

  useEffect(() => {
    const recoverSession = async () => {
      // 1. Check for Admin Session first
      if (isAdminLoggedIn()) {
        setView('admin');
        setIsInitializing(false);
        return;
      }

      // 2. Check for User Session
      const token = localStorage.getItem('ii_token');
      if (token) {
        const userData = await apiService.getCurrentUser(token);
        if (userData) {
          setUser(userData);
        } else {
          localStorage.removeItem('ii_token');
          localStorage.removeItem('ii_user');
        }
      }
      setIsInitializing(false);
    };
    recoverSession();

    const handleAdminNav = () => {
      if (isAdminLoggedIn()) {
        setView('admin');
        setAdminSubView('overview');
        setSelectedStudentId(null);
      } else {
        setView('admin-login');
      }
    };

    const handleAdminLoginNav = () => {
      setView('admin-login');
    };

    const handleHomeNav = () => {
      setView('landing');
      setSelectedBlogSlug(null);
    };

    const handleBlogPostNav = (e: any) => {
      setSelectedBlogSlug(e.detail);
      setView('blog-post');
    };

    const handleAboutNav = () => {
      setView('about');
    };

    const handleInstitutionsNav = (e: any) => {
      setView('institutions');
      if (e.detail === 'school') {
        setInitialInstitutionType(InstitutionType.SCHOOL);
      } else {
        setInitialInstitutionType(InstitutionType.COLLEGE);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('nav-admin', handleAdminNav);
    window.addEventListener('nav-admin-login', handleAdminLoginNav);
    window.addEventListener('nav-home', handleHomeNav);
    window.addEventListener('nav-blog-post', handleBlogPostNav);
    window.addEventListener('nav-about', handleAboutNav);
    window.addEventListener('nav-institutions', handleInstitutionsNav);
    
    // Ensure cornerstone article is featured
    apiService.featurePostBySlug('the-complete-guide-to-industrial-immersion-programs');
    
    // Seed authority content
    apiService.seedAuthorityContent();

    return () => {
      window.removeEventListener('nav-admin', handleAdminNav);
      window.removeEventListener('nav-admin-login', handleAdminLoginNav);
      window.removeEventListener('nav-home', handleHomeNav);
      window.removeEventListener('nav-blog-post', handleBlogPostNav);
      window.removeEventListener('nav-about', handleAboutNav);
      window.removeEventListener('nav-institutions', handleInstitutionsNav);
    };
  }, []);

  const handleTrackSelect = (track: TrackKey) => {
    setSelectedTrack(track);
    if (!user) {
      setShowAuthModal(true);
    } else {
      setEnrollment({ track });
    }
  };

  const handleAuthSuccess = (loggedUser: User) => {
    setUser(loggedUser);
    setShowAuthModal(false);
    if (selectedTrack) {
      setEnrollment({ track: selectedTrack });
    } else {
      setView('dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ii_token');
    localStorage.removeItem('ii_user');
    setUser(null);
    setView('landing');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
      </div>
    );
  }

  const renderAdminContent = () => {
    if (selectedStudentId) {
      return (
        <AdminStudentProfile 
          id={selectedStudentId} 
          onBack={() => setSelectedStudentId(null)} 
        />
      );
    }

    switch (adminSubView) {
      case 'overview': return <AdminDashboardView />;
      case 'students': return <AdminStudents onSelectStudent={(id) => setSelectedStudentId(id)} />;
      case 'payments': return <AdminPayments />;
      case 'reviews': return <AdminReviews />;
      case 'institutions': return <AdminInstitutions />;
      case 'blog': return <AdminBlogCMS />;
      default: return <AdminDashboardView />;
    }
  };

  if (view === 'admin-login') {
    return (
      <AdminLogin 
        onSuccess={() => setView('admin')} 
        onBack={() => setView('landing')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] selection:bg-blue-500/30">
      {view !== 'admin' && (
        <Navbar 
          user={user} 
          onLoginClick={() => setShowAuthModal(true)} 
          onDashboardClick={() => setView('dashboard')} 
          onBlogClick={() => setView('blog')}
          onAboutClick={() => setView('about')}
          onAdminClick={() => { 
            if (isAdminLoggedIn()) {
              setView('admin'); 
              setAdminSubView('overview'); 
              setSelectedStudentId(null);
            } else {
              setView('admin-login');
            }
          }}
        />
      )}
      
      <main>
        {view === 'admin' ? (
          <AdminLayout 
            activeView={adminSubView} 
            onViewChange={(v) => { setAdminSubView(v); setSelectedStudentId(null); }} 
            onExit={() => { setView('landing'); }}
          >
            {renderAdminContent()}
          </AdminLayout>
        ) : view === 'dashboard' && user ? (
          <Dashboard 
            user={user} 
            onLogout={handleLogout} 
            onBackToLanding={() => setView('landing')} 
          />
        ) : view === 'blog' ? (
          <BlogList 
            onPostClick={(slug) => {
              setSelectedBlogSlug(slug);
              setView('blog-post');
            }} 
          />
        ) : view === 'blog-post' && selectedBlogSlug ? (
          <BlogPostDetail 
            slug={selectedBlogSlug} 
            onBack={() => setView('blog')} 
            onPostClick={(slug) => setSelectedBlogSlug(slug)}
            onApplyClick={() => {
              setView('landing');
              setTimeout(() => {
                const element = document.getElementById('organisations');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        ) : view === 'about' ? (
          <About />
        ) : view === 'institutions' ? (
          <div className="pt-20">
            <ProgramSelector 
              selectedTrack={selectedTrack} 
              onSelect={handleTrackSelect}
              onViewDetails={(track) => setDetailTrack(track)}
              initialType={initialInstitutionType || undefined}
            />
          </div>
        ) : (
          <>
            <Hero />
            <PartnersSection />
            <Features />
            <Testimonials />
            <ProgramSelector 
              selectedTrack={selectedTrack} 
              onSelect={handleTrackSelect}
              onViewDetails={(track) => setDetailTrack(track)}
              hideToggle
              forceType={InstitutionType.COLLEGE}
            />
            <PricingSection />
            <BlogSection onPostClick={(slug) => {
              setSelectedBlogSlug(slug);
              setView('blog-post');
            }} />
            <GetStarted />
          </>
        )}
      </main>

      {view !== 'admin' && <Footer />}

      {detailTrack && (
        <TrackDetailModal 
          trackKey={detailTrack}
          data={TRACKS[detailTrack]}
          onClose={() => setDetailTrack(null)}
          onEnroll={handleTrackSelect}
        />
      )}

      {enrollment && (
        <CheckoutModal 
          enrollment={enrollment} 
          onClose={() => setEnrollment(null)} 
          onComplete={() => setView('dashboard')}
        />
      )}

      {showAuthModal && (
        <AuthModal 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleAuthSuccess} 
        />
      )}
    </div>
  );
};

export default App;



