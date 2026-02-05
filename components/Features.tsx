
import React from 'react';
import { WORK_ITEMS } from '../constants';

const Features: React.FC = () => {
  return (
    <div id="why" className="space-y-32 py-24 border-t border-white/5">
      {/* Manifesto Section */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-12 md:p-16 bg-blue-600/5 rounded-[3rem] border border-blue-500/10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 text-4xl opacity-10">“</div>
           <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-6 uppercase tracking-tight">The Positioning</h3>
           <p className="text-gray-300 text-lg md:text-xl font-medium leading-relaxed italic">
             "Industrial Immersion is not a course platform. It is a business execution ecosystem where talent is trained inside operating companies."
           </p>
           <p className="mt-8 text-[10px] font-black text-blue-500 uppercase tracking-[0.4em]">Built by operators, for operators.</p>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-heading font-bold mb-6">The <span className="text-blue-500 text-shadow-blue">Industry Gap</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Every output is produced for an active business, not a classroom exercise.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traditional Education */}
          <div className="glass-card rounded-3xl p-10 border-white/5">
            <h3 className="text-xl font-heading font-bold mb-8 uppercase text-gray-500">Standard Learning</h3>
            <ul className="space-y-6">
              {[
                { label: 'Heavy Theory', sub: 'Lectures and rote memorization.' },
                { label: 'Mock Assignments', sub: 'Simulated tasks with zero stakes.' },
                { label: 'Static Resume', sub: 'Certificates that show hours, not impact.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="text-red-500/50 shrink-0 font-bold">✕</span>
                  <div>
                    <p className="font-bold text-gray-400">{item.label}</p>
                    <p className="text-sm text-gray-600">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Industrial Immersion */}
          <div className="glass-card rounded-3xl p-10 border-blue-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <span className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-full text-[8px] font-black uppercase tracking-widest">Industrial Grade</span>
            </div>
            <h3 className="text-xl font-heading font-bold mb-8 uppercase text-blue-400">Our Immersion</h3>
            <ul className="space-y-6">
              {[
                { label: 'Execution Focus', sub: '100% focused on business delivery.' },
                { label: 'Live Deliverables', sub: 'Work for real brands with active budgets.' },
                { label: 'Verifiable Proof', sub: 'Founder recommendations and letters.' }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4">
                  <span className="text-blue-500 shrink-0 font-bold">✓</span>
                  <div>
                    <p className="font-bold text-white">{item.label}</p>
                    <p className="text-sm text-gray-400">{item.sub}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Student Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-y border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-bold uppercase tracking-tight">What You Actually Do</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { week: 'Week 1–2', title: 'Asset Assignment', desc: 'Onboard to your partner brand and assigned functional domain.' },
            { week: 'Week 3–6', title: 'Execution Sprints', desc: 'Deliver weekly business outcomes under direct mentor supervision.' },
            { week: 'Week 7+', title: 'Functional Ownership', desc: 'Own a business vertical and contribute to live revenue growth.' }
          ].map((phase, i) => (
            <div key={i} className="relative pl-8 border-l border-blue-500/20">
              <div className="absolute top-0 left-0 -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">{phase.week}</p>
              <h4 className="text-xl font-bold mb-3 text-white uppercase tracking-tight">{phase.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">{phase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Deliverables Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Industrial Output</h2>
          <p className="text-gray-500">Build a portfolio of verifiable business assets.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WORK_ITEMS.map((item, idx) => (
            <div key={idx} className="glass-card p-10 rounded-[2rem] flex flex-col items-center hover:border-blue-500/20 transition-all">
              <div className="text-5xl mb-8 grayscale hover:grayscale-0 transition-all transform hover:scale-110 duration-500">{item.icon}</div>
              <h4 className="text-lg font-bold text-white uppercase tracking-widest text-center">{item.title}</h4>
              <p className="text-[10px] text-gray-500 mt-4 font-black uppercase tracking-[0.2em]">Validated Asset</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Features;

