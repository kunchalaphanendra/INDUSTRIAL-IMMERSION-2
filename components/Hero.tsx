
import React from 'react';

const Hero: React.FC = () => {
  const scrollToOrganisations = () => {
    const element = document.getElementById('organisations');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-12 overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="inline-flex items-center space-x-3 px-5 py-2.5 bg-blue-900/20 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-8">
          <span className="brand-text tracking-widest uppercase text-[11px]">STJUFENDS Industrial Partnerships</span>
        </div>
        
        <div className="mb-20">
          <h1 className="text-6xl md:text-9xl font-heading font-black mb-4 leading-none tracking-tighter text-white uppercase">
            Radical
          </h1>
          <h2 className="text-5xl md:text-8xl font-heading font-black leading-none tracking-tighter text-blue-500/90 uppercase">
            Industry Immersion
          </h2>
        </div>

        <div className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mb-12">
            <h3 className="text-4xl md:text-7xl font-heading font-black text-white mb-6 uppercase tracking-tighter leading-tight">
              WORK ON <span className="text-blue-500">REAL</span> BUSINESS <br className="hidden md:block" /> PROJECTS.
            </h3>
            <p className="text-sm md:text-lg font-black text-white uppercase tracking-[0.3em] mb-12">
              EARN INDUSTRY-VERIFIED EXECUTION EXPERIENCE.
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto space-y-10">
            <p className="text-gray-500 text-xs md:text-sm font-bold leading-relaxed uppercase tracking-widest">
              A structured industrial immersion program where students contribute to live business operations across fashion, consumer products, technology, and growth-driven companies.
            </p>
            <p className="text-white font-black text-xs md:text-sm uppercase tracking-[0.2em]">
              No simulations. No classroom theory. Real execution.
            </p>
          </div>
        </div>
        
        <p className="max-w-2xl mx-auto text-xs md:text-sm text-gray-600 mb-16 font-bold uppercase tracking-widest leading-relaxed">
          STJUFENDS collaborates with forward-thinking institutions to bridge the gap between education and high-growth industries through hands-on work experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <button 
            onClick={scrollToOrganisations}
            className="w-full sm:w-auto px-16 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/10 active:scale-95 uppercase tracking-widest"
          >
            Explore Programs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

