
import React from 'react';

const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNav = (view: string) => {
    window.dispatchEvent(new CustomEvent('nav-view', { detail: view }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="pt-24 pb-12 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2.5 mb-6 cursor-pointer group" onClick={() => handleNav('landing')}>
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/10">S</div>
              <span className="brand-text text-xl tracking-tighter uppercase text-white group-hover:text-blue-500 transition-colors">STJUFENDS</span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed font-medium">
              Pioneering the industrial immersion standard. Bridging the gap between theoretical education and business execution.
            </p>
            <div className="flex space-x-4">
              {/* Social links... */}
            </div>
          </div>
          
          <div>
            <h4 className="font-heading font-bold text-sm mb-8 uppercase tracking-[0.2em] text-white">Programs</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><button onClick={() => handleNav('student-program')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Student Program</button></li>
              <li><button onClick={() => handleNav('for-colleges')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">For Colleges</button></li>
              <li><button onClick={() => handleNav('influencer-cohort')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Influencer Cohort</button></li>
              <li><button onClick={() => handleNav('management-suit')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Management Suit</button></li>
              <li><button onClick={() => handleNav('finance-pro')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Finance Pro</button></li>
              <li><button onClick={() => handleNav('corporate-immersion')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Corporate Immersion</button></li>
              <li><button onClick={() => handleNav('blog')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Industrial Insights</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-8 uppercase tracking-[0.2em] text-white">Platform</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li><button onClick={() => handleNav('about')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">About Us</button></li>
              <li><button onClick={() => handleNav('institutions')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Institutions</button></li>
              <li><button onClick={() => handleNav('privacy')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Privacy Policy</button></li>
              <li><button onClick={() => handleNav('terms')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Terms & Conditions</button></li>
              <li><button onClick={() => handleNav('refund')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Refund Policy</button></li>
              <li><button onClick={() => handleNav('cookie')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">Cookie Policy</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm mb-8 uppercase tracking-[0.2em] text-white">Contact</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              <li className="uppercase tracking-widest text-[10px] font-black text-gray-400">Bangalore, India</li>
              <li><a href="mailto:contact@stjufends.com" className="hover:text-white transition-colors uppercase tracking-widest text-[10px] font-black">contact@stjufends.com</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <p>© 2026 STJUFENDS Ecosystem. All Rights Reserved.</p>
            <button 
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('nav-admin-login'));
              }}
              className="opacity-30 hover:opacity-100 transition-opacity text-[8px] uppercase tracking-tighter"
            >
              Admin Access
            </button>
          </div>
          <p className="mt-4 md:mt-0">Built for the future of professional excellence.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;







