
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
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-900/20 border border-blue-500/30 rounded-full text-blue-400 text-sm mb-8">
          <span className="font-heading font-bold tracking-[0.2em] uppercase text-[10px]">Institutional Partnership Program</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-heading font-extrabold mb-8 leading-[1.05] tracking-tight">
          Industry-Aligned <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 text-shadow-blue">Education for Institutions</span>
        </h1>
        
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-300 mb-12 font-medium leading-relaxed">
          We partner with schools and colleges to deliver skill-based, outcome-driven programs that prepare students for academics, communication, and real-world industries.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <button 
            onClick={scrollToOrganisations}
            className="w-full sm:w-auto px-16 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-500/10 active:scale-95 uppercase tracking-widest"
          >
            Partner With Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;


