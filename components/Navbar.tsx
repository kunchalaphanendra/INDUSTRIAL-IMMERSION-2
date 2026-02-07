
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLoginClick: () => void;
  onDashboardClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLoginClick, onDashboardClick }) => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-heading font-extrabold text-white text-xl">E</div>
            <span className="font-heading font-bold text-lg tracking-tight hidden sm:block uppercase">EdTech Institutional</span>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-8 text-sm font-medium">
            <div className="hidden lg:flex items-center space-x-8 text-gray-400">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-white transition-colors">Home</button>
              <button onClick={() => scrollTo('organisations')} className="hover:text-white transition-colors">Organisations</button>
              <button onClick={() => scrollTo('about')} className="hover:text-white transition-colors">About</button>
              <button onClick={() => scrollTo('faq')} className="hover:text-white transition-colors">FAQ</button>
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
                    onClick={() => scrollTo('organisations')} 
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


