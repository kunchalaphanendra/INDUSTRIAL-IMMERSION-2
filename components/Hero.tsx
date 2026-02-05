
import React from 'react';
import { INDUSTRIES } from '../constants';

const Hero: React.FC = () => {
  const scrollToTracks = () => {
    const element = document.getElementById('tracks');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-12 overflow-hidden">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-8">
          <span className="font-heading font-bold tracking-[0.2em] uppercase text-[10px]">Multi-Industry Immersion</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-heading font-extrabold mb-8 leading-[1.05] tracking-tight">
          Cross-Industry <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Execution Program</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-12 font-medium leading-relaxed">
          Work directly with real brands across <span className="text-white">Fashion, Consumer Goods, Electronics, and Tech</span> — delivering live business outcomes, not simulations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <button 
            onClick={scrollToTracks}
            className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/10 active:scale-95"
          >
            Start Your Immersion
          </button>
        </div>

        {/* Industry Strip */}
        <div className="border-t border-white/5 pt-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Industries You’ll Work In</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-6 md:gap-x-16">
            {INDUSTRIES.map((industry, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-125 transition-transform" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

