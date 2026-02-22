
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="pt-32 pb-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-32">
        <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-6">The STJUFENDS Vision</p>
        <h1 className="text-5xl md:text-8xl font-heading font-bold uppercase tracking-tighter leading-[0.9] mb-8">
          Execution-First <br />
          <span className="text-blue-500">Industrial Immersion</span> Platform
        </h1>
        <p className="text-gray-400 text-xl md:text-2xl font-medium max-w-3xl mx-auto leading-relaxed">
          Bridging education and real business execution.
        </p>
      </section>

      {/* About Us */}
      <section className="max-w-4xl mx-auto px-4 mb-32">
        <div className="glass-card p-12 md:p-20 rounded-[4rem] border-white/5">
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-8">About Us</h2>
          <div className="space-y-8 text-gray-300 text-lg md:text-xl font-medium leading-relaxed">
            <p>
              We are an execution-first industrial immersion platform designed to bridge the gap between academic learning and real business operations.
            </p>
            <p>
              Our programs place participants inside live operating environments where they contribute to real deliverables across industries such as fashion, consumer products, technology, digital services, and emerging ventures.
            </p>
            <p className="text-white font-bold">
              We do not run simulation-based training or theoretical classroom modules. Every assignment is tied to a working business function.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="max-w-7xl mx-auto px-4 mb-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-8">Our Mission</h2>
          <p className="text-3xl md:text-5xl font-heading font-bold text-white uppercase tracking-tighter leading-tight mb-8">
            Integrating Structured Execution into Education
          </p>
          <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed">
            To build industry-ready individuals by integrating structured execution experience into education and institutional ecosystems. We believe practical exposure should not begin after graduation — it should be integrated during learning.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-8 rounded-3xl border-white/5 text-center">
            <p className="text-4xl font-heading font-bold text-white mb-2">100%</p>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Real Projects</p>
          </div>
          <div className="glass-card p-8 rounded-3xl border-white/5 text-center mt-8">
            <p className="text-4xl font-heading font-bold text-white mb-2">0%</p>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Simulations</p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="max-w-7xl mx-auto px-4 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-4">What We Do</h2>
          <p className="text-3xl md:text-5xl font-heading font-bold text-white uppercase tracking-tighter">The Immersion Framework</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-12 rounded-[3rem] border-white/5">
            <h3 className="text-lg font-heading font-bold text-white mb-8 uppercase tracking-widest">For Participants</h3>
            <ul className="space-y-4">
              {[
                'Work on real business projects',
                'Contribute to operational tasks',
                'Build measurable outputs',
                'Develop execution discipline',
                'Understand business workflows'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-400 font-medium">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-card p-12 rounded-[3rem] border-white/5">
            <h3 className="text-lg font-heading font-bold text-white mb-8 uppercase tracking-widest">Supported Groups</h3>
            <ul className="space-y-4">
              {[
                'Individuals seeking career acceleration',
                'Schools looking for practical integration',
                'Colleges & Universities bridging the gap'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-gray-400 font-medium">
                  <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Industries We Work With */}
      <section className="max-w-7xl mx-auto px-4 mb-32">
        <div className="glass-card p-12 md:p-20 rounded-[4rem] border-white/5">
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-12 text-center">Industries We Work With</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              'Fashion & Apparel',
              'Food & Beverage Brands',
              'Consumer Electronics',
              'Social Media & Growth',
              'Technology & SaaS'
            ].map((industry, i) => (
              <div key={i} className="text-center">
                <p className="text-sm font-black text-white uppercase tracking-widest leading-tight">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="max-w-7xl mx-auto px-4 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Our Approach</h2>
          <p className="text-3xl md:text-5xl font-heading font-bold text-white uppercase tracking-tighter">The 3 Pillars of Immersion</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Real Business Exposure', desc: 'Direct involvement in live operations and deliverables.' },
            { title: 'Structured Supervision', desc: 'Guided execution under industry-standard workflows.' },
            { title: 'Measurable Outcomes', desc: 'Tangible proof-of-work that validates professional capability.' }
          ].map((pillar, i) => (
            <div key={i} className="glass-card p-10 rounded-[2.5rem] border-white/5 text-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 font-bold text-xl mb-6 mx-auto">0{i+1}</div>
              <h3 className="text-lg font-heading font-bold text-white mb-4 uppercase tracking-widest">{pillar.title}</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder's Message */}
      <section className="max-w-4xl mx-auto px-4 mb-32">
        <div className="relative">
          <div className="absolute -top-12 -left-12 text-9xl text-blue-500/10 font-heading">“</div>
          <div className="glass-card p-12 md:p-20 rounded-[4rem] border-blue-500/20 relative z-10">
            <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-12">Founder's Message</h2>
            <div className="space-y-6 text-gray-300 text-lg md:text-xl font-medium leading-relaxed">
              <p>
                Education should not end at understanding concepts. It should extend into execution.
              </p>
              <p>
                During my journey through academia and entrepreneurship, I observed a consistent gap — students graduate with theoretical knowledge but limited exposure to how businesses actually function.
              </p>
              <p>
                Industries operate on timelines, accountability, systems, and measurable outcomes. Classrooms rarely replicate that environment.
              </p>
              <p className="text-white">
                This platform was built to reduce that gap.
              </p>
              <p>
                Our objective is simple: Place individuals inside real business environments where they contribute to actual deliverables, understand operational workflows, and experience professional accountability before entering the workforce.
              </p>
              <p>
                We do not position ourselves as a training institute or a job guarantee platform. We position ourselves as a structured industrial immersion ecosystem.
              </p>
              <p>
                Every participant who joins is expected to execute, take responsibility, and deliver measurable output.
              </p>
              <p>
                The long-term vision is larger than a program. It is to build a sustainable bridge between education and industry.
              </p>
              <div className="pt-8">
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent('nav-blog-post', { detail: 'the-complete-guide-to-industrial-immersion-programs' }))}
                  className="text-blue-500 text-sm font-bold hover:underline"
                >
                  Explore our complete guide to industrial immersion →
                </button>
              </div>
              <div className="pt-12 border-t border-white/5 mt-12">
                <p className="text-white font-heading font-bold text-2xl uppercase tracking-tighter">— Founder</p>
                <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mt-2">STJUFENDS Industrial Immersion</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
