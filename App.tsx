
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
import AdminLayout from './components/AdminLayout';
import AdminDashboardView from './components/AdminDashboardView';
import AdminStudents from './components/AdminStudents';
import AdminPayments from './components/AdminPayments';
import AdminReviews from './components/AdminReviews';
import AdminInstitutions from './components/AdminInstitutions';
import AdminLogin from './components/AdminLogin';
import AdminStudentProfile from './components/AdminStudentProfile';
import { PARTNERS, TRACKS } from './constants';
import { TrackKey, EnrollmentState, User } from './types';
import { apiService } from './services/api';
import { isAdminLoggedIn } from './lib/adminAuth';

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
  const [view, setView] = useState<'landing' | 'dashboard' | 'admin' | 'admin-login'>('landing');
  const [adminSubView, setAdminSubView] = useState<'overview' | 'students' | 'payments' | 'reviews' | 'institutions'>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<TrackKey | null>(null);
  const [detailTrack, setDetailTrack] = useState<TrackKey | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentState | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

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

    window.addEventListener('nav-admin', handleAdminNav);
    window.addEventListener('nav-admin-login', handleAdminLoginNav);
    return () => {
      window.removeEventListener('nav-admin', handleAdminNav);
      window.removeEventListener('nav-admin-login', handleAdminLoginNav);
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
            />
            <PricingSection />
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






