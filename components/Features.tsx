
import React from 'react';

const Features: React.FC = () => {
  return (
    <div id="about" className="space-y-32 py-24 border-t border-white/5">
      {/* Manifesto / About Section */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="p-12 md:p-20 bg-blue-600/5 rounded-[4rem] border border-blue-500/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 text-4xl opacity-10 font-heading">“</div>
           <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-8">The STJUFENDS Manifesto</p>
           <h3 className="text-2xl md:text-4xl font-heading font-bold text-white mb-8 uppercase tracking-tight">Bridging Execution and Academics</h3>
           <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed max-w-3xl mx-auto">
             "At STJUFENDS, we don't just teach. We execute. Our mission is to transform education into a live industrial process where students build proof-of-work alongside industry veterans."
           </p>
           <div className="mt-12 flex justify-center gap-12">
              <div className="text-center">
                <p className="text-3xl font-heading font-bold text-white">50+</p>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-2">Partner Brands</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-heading font-bold text-white">10k+</p>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-2">Active Professionals</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-heading font-bold text-white">100%</p>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mt-2">Industrial Immersion</p>
              </div>
           </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6 flex flex-wrap items-center justify-center gap-x-4">
            The <span className="brand-text text-5xl md:text-7xl lowercase first-letter:uppercase tracking-normal">STJUFENDS</span> <span className="text-blue-500 text-shadow-blue">Edge</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Structured immersion that meets actual global business standards.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card rounded-3xl p-10 border-white/5">
            <h3 className="text-xl font-heading font-bold mb-8 uppercase text-gray-500">Traditional Pathways</h3>
            <ul className="space-y-6">
              {[
                { label: 'Theory Only', sub: 'Limited focus on real-world industry tools.' },
                { label: 'Isolated Learning', sub: 'Static curriculum without live feedback loops.' },
                { label: 'Paper Credentials', sub: 'Certificates without verifiable professional output.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="text-red-500/50 shrink-0 font-bold">✕</span>
                  <div>
                    <p className="font-bold text-gray-400 uppercase tracking-widest text-xs">{item.label}</p>
                    <p className="text-[11px] text-gray-600 uppercase tracking-wider mt-1">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card rounded-3xl p-10 border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-[8px] font-black uppercase tracking-widest">Immersion Standard</span>
            </div>
            <h3 className="text-xl font-heading font-bold mb-8 uppercase text-blue-400">STJUFENDS Ecosystem</h3>
            <ul className="space-y-6">
              {[
                { label: 'Live Execution', sub: 'Curriculum mapped to actual industrial campaigns.' },
                { label: 'Real-time Mentorship', sub: 'Weekly sprints with verified brand partners.' },
                { label: 'Joint Proof-of-Work', sub: 'Experience letters issued with partner brands.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="text-blue-500 shrink-0 font-bold">✓</span>
                  <div>
                    <p className="font-bold text-white uppercase tracking-widest text-xs">{item.label}</p>
                    <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-1">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
