import React from 'react';

const Features: React.FC = () => {
  return (
    <div className="space-y-32 py-24 border-t border-white/5">
      {/* Who Is This Designed For? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-6xl font-heading font-bold uppercase tracking-tight">Who Is This Designed For?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="glass-card p-12 rounded-[3rem] border-white/5 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 text-3xl mb-8 group-hover:scale-110 transition-transform">👤</div>
            <h3 className="text-2xl font-heading font-bold text-white mb-4 uppercase tracking-widest">Individuals</h3>
            <p className="text-gray-400 font-medium leading-relaxed">
              Students and graduates seeking structured, real-world business exposure.
            </p>
          </div>
          <div className="glass-card p-12 rounded-[3rem] border-white/5 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all">
            <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-500 text-3xl mb-8 group-hover:scale-110 transition-transform">🏛️</div>
            <h3 className="text-2xl font-heading font-bold text-white mb-4 uppercase tracking-widest">Institutions</h3>
            <p className="text-gray-400 font-medium leading-relaxed">
              Schools and colleges integrating execution-based industry immersion into their ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* What Participants Actually Work On */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-6xl font-heading font-bold uppercase tracking-tight">What Participants Actually Work On</h2>
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4">Every deliverable contributes to a live business function.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { title: 'Business operations support', icon: '⚙️' },
            { title: 'Growth & marketing execution', icon: '📈' },
            { title: 'Process documentation', icon: '📄' },
            { title: 'Product research & analysis', icon: '🔍' },
            { title: 'Campaign implementation', icon: '🚀' },
            { title: 'Workflow optimization', icon: '⚡' },
            { title: 'Web & app development', icon: '💻' },
            { title: 'Data analytics & automation', icon: '📊' },
            { title: 'UI/UX design & prototyping', icon: '🎨' }
          ].map((item, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl border-white/5 flex items-center gap-6 hover:bg-white/[0.02] transition-colors">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm font-bold text-white uppercase tracking-widest leading-tight">{item.title}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-12">
          Typical execution engagement: 8–15 structured hours per week (varies by cohort).
        </p>
      </section>

      {/* How the Program Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-6xl font-heading font-bold uppercase tracking-tight">How the Program Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2" />
          {[
            { step: '01', title: 'Screening & Allocation', desc: 'Rigorous selection process to match skills with cohort requirements.' },
            { step: '02', title: 'Orientation & Domain Assignment', desc: 'Deep dive into business functions and specific operational domains.' },
            { step: '03', title: 'Execution Phase (Live Projects)', desc: 'Hands-on contribution to real deliverables under supervision.' },
            { step: '04', title: 'Performance Evaluation & Certification', desc: 'Measurable output review and industry-verified certification.' }
          ].map((item, i) => (
            <div key={i} className="relative z-10 glass-card p-8 rounded-[2rem] border-white/5 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl mb-6 shadow-lg shadow-blue-500/20">{item.step}</div>
              <h3 className="text-sm font-heading font-bold text-white mb-4 uppercase tracking-widest leading-tight">{item.title}</h3>
              <p className="text-gray-500 text-[11px] font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Industries We Work With */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-12 md:p-20 rounded-[4rem] border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tight">Industries We Work With</h2>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Industry availability varies by cohort and business alignment.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { name: 'Fashion & Apparel', desc: 'Operational support for apparel manufacturing and retail.' },
              { name: 'Food & Beverage Brands', desc: 'Growth execution for emerging F&B consumer brands.' },
              { name: 'Consumer Electronics', desc: 'Market analysis and campaign support for wearables.' },
              { name: 'Social Media & Growth', desc: 'Execution for growth-driven marketing agencies.' },
              { name: 'Technology & SaaS', desc: 'Process documentation and research for tech ventures.' }
            ].map((industry, i) => (
              <div key={i} className="text-center space-y-4">
                <p className="text-sm font-black text-white uppercase tracking-widest leading-tight">{industry.name}</p>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed uppercase tracking-wider">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Execution Outcomes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-6xl font-heading font-bold uppercase tracking-tight">Execution Outcomes</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mt-4 font-medium">Our model is built on structured execution and measurable contribution within defined business frameworks.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
          {[
            'Structured live business projects',
            'Performance-based certification',
            'Portfolio-ready deliverables',
            'Real operational exposure',
            'Supervised execution standards',
            'Industry-verified experience certificate',
            'Performance-based Letter of Recommendation (LOR)'
          ].map((outcome, i) => (
            <div key={i} className="glass-card p-8 rounded-3xl border-blue-500/10 flex items-center gap-6">
              <span className="text-blue-500 font-bold">✓</span>
              <p className="text-sm font-bold text-white uppercase tracking-widest">{outcome}</p>
            </div>
          ))}
        </div>

        {/* Testimonial Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[1, 2].map((_, i) => (
            <div key={i} className="glass-card p-10 rounded-[3rem] border-white/5 relative">
              <div className="absolute top-0 right-0 p-8 text-6xl opacity-5 font-heading">“</div>
              <p className="text-gray-300 text-lg font-medium leading-relaxed mb-8 italic">
                "The immersion program provided a level of operational exposure that I couldn't find in any internship. Working on real deliverables changed my perspective on business execution."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-full border border-white/10" />
                <div>
                  <p className="text-white font-bold uppercase tracking-widest text-xs">Participant Name</p>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">College Name • Program Type</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who Should Not Apply? */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="glass-card p-10 md:p-16 rounded-[3rem] border-red-500/10 bg-red-500/5 flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -mr-32 -mt-32" />
          <div className="w-20 h-20 bg-red-500/20 rounded-3xl flex items-center justify-center text-red-500 text-4xl shrink-0 shadow-[0_0_30px_rgba(239,68,68,0.2)]">⚠️</div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-4xl font-heading font-bold text-white mb-6 uppercase tracking-tight">Who Should Not Apply?</h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed mb-6">
              Individuals seeking passive training, job guarantees, or theoretical coursework should not apply.
            </p>
            <p className="text-red-400 font-black uppercase tracking-[0.2em] text-xs md:text-sm">
              This program is strictly for those prepared for professional accountability and real operational contribution.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;




