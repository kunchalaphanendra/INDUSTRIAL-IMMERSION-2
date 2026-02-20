
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onDashboardClick: () => void;
  onBlogClick: () => void;
  onAdminClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onDashboardClick, onBlogClick, onAdminClick }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // If we are on blog page, we need to navigate back to landing
    const event = new CustomEvent('nav-home');
    window.dispatchEvent(event);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleHomeClick}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">S</div>
            <span className="brand-text text-2xl hidden sm:block uppercase text-white transition-colors group-hover:text-blue-500">STJUFENDS</span>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-8 text-sm font-medium">
            <div className="hidden lg:flex items-center space-x-8 text-gray-400">
              <button onClick={handleHomeClick} className="hover:text-white transition-colors">Home</button>
              <button onClick={() => scrollTo('organisations')} className="hover:text-white transition-colors">Programs</button>
              <button onClick={onBlogClick} className="hover:text-white transition-colors">Blog</button>
              <button onClick={() => scrollTo('faq')} className="hover:text-white transition-colors">FAQ</button>
              {user?.isAdmin && (
                <button 
                  onClick={onAdminClick}
                  className="text-blue-500 font-black uppercase tracking-[0.2em] animate-pulse"
                >
                  Admin
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <button 
                  onClick={onDashboardClick}
                  className="flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all group"
                >
                  <img src={user.avatarUrl} className="w-8 h-8 rounded-full border border-blue-500/30 group-hover:border-blue-500" alt="Profile" />
                  <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">{user.fullName.split(' ')[0]}</span>
                </button>
              ) : (
                <>
                  <button 
                    onClick={onLoginClick}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-xs"
                  >
                    Login
                  </button>
                  <button 
                    onClick={onLoginClick} 
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all text-xs uppercase tracking-widest"
                  >
                    Apply Now
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


