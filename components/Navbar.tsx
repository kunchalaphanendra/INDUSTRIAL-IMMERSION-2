
import React, { useState } from 'react';
import { User } from '@/types';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onDashboardClick: () => void;
  onBlogClick: () => void;
  onAboutClick: () => void;
  onProgramsClick: () => void;
  onFAQClick: () => void;
  onAdminClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  user, 
  onLoginClick, 
  onDashboardClick, 
  onBlogClick, 
  onAboutClick, 
  onProgramsClick,
  onFAQClick,
  onAdminClick 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const event = new CustomEvent('nav-home');
    window.dispatchEvent(event);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { label: 'Home', onClick: handleHomeClick },
    { 
      label: 'Schools', 
      onClick: () => {
        const event = new CustomEvent('nav-institutions', { detail: 'school' });
        window.dispatchEvent(event);
        setIsMenuOpen(false);
      } 
    },
    { label: 'About', onClick: () => { onAboutClick(); setIsMenuOpen(false); } },
    { label: 'Programs', onClick: () => { onProgramsClick(); setIsMenuOpen(false); } },
    { label: 'Blog', onClick: () => { onBlogClick(); setIsMenuOpen(false); } },
    { label: 'FAQ', onClick: () => { onFAQClick(); setIsMenuOpen(false); } },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleHomeClick}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105">S</div>
            <span className="brand-text text-2xl hidden sm:block uppercase text-white transition-colors group-hover:text-blue-500">STJUFENDS</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-400">
            {navLinks.map((link) => (
              <button key={link.label} onClick={link.onClick} className="hover:text-white transition-colors">
                {link.label}
              </button>
            ))}
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
              <div className="hidden sm:flex items-center space-x-4">
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
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-black border-t border-white/10 animate-in slide-in-from-top duration-300">
          <div className="px-4 py-8 space-y-6">
            {navLinks.map((link) => (
              <button 
                key={link.label} 
                onClick={link.onClick} 
                className="block w-full text-left text-2xl font-heading font-bold text-white uppercase tracking-tighter hover:text-blue-500 transition-colors"
              >
                {link.label}
              </button>
            ))}
            {user?.isAdmin && (
              <button 
                onClick={() => { onAdminClick?.(); setIsMenuOpen(false); }}
                className="block w-full text-left text-2xl font-heading font-bold text-blue-500 uppercase tracking-tighter"
              >
                Admin
              </button>
            )}
            {!user && (
              <div className="pt-6 space-y-4">
                <button 
                  onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                  className="block w-full py-4 bg-white/5 text-white rounded-2xl font-bold uppercase tracking-widest text-sm text-center"
                >
                  Login
                </button>
                <button 
                  onClick={() => { onLoginClick(); setIsMenuOpen(false); }} 
                  className="block w-full py-4 bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-sm text-center"
                >
                  Apply Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;






