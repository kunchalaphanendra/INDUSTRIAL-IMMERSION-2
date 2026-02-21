import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, ShieldCheck, Briefcase, Zap, Users, GraduationCap, ClipboardCheck } from 'lucide-react';

interface StudentConversionPageProps {
  onApplyClick: () => void;
}

const StudentConversionPage: React.FC<StudentConversionPageProps> = ({ onApplyClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Industrial Immersion Program | Structured Industry Exposure";
  }, []);

  const steps = [
    { title: "Screening & Allocation", desc: "Initial assessment of skills and allocation to appropriate business tracks based on aptitude." },
    { title: "Business Orientation", desc: "Deep dive into the operational ecosystem, tools, and specific business objectives of the immersion." },
    { title: "Execution Phase", desc: "Hands-on work on live deliverables under structured supervision and defined process flows." },
    { title: "Evaluation & Certification", desc: "Final assessment of performance against industry standards and issuance of execution certificates." }
  ];

  const workExamples = [
    { title: "Operations Support", desc: "Assisting in day-to-day business process execution and workflow management." },
    { title: "Growth Initiatives", desc: "Executing tasks related to market expansion, outreach, and business development." },
    { title: "Documentation Systems", desc: "Building and maintaining structured knowledge bases and process documentation." },
    { title: "Process Optimization", desc: "Identifying bottlenecks and implementing more efficient operational steps." },
    { title: "Research Implementation", desc: "Conducting market research and translating findings into actionable business data." }
  ];

  return (
    <div className="bg-black text-white pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full -top-24 -left-24" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Industrial Immersion</p>
            <h1 className="text-5xl md:text-8xl font-heading font-bold uppercase tracking-tighter leading-none mb-8">
              Industrial <br /><span className="text-blue-500">Immersion</span> <br />Program
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl font-medium leading-relaxed mb-12">
              Structured execution-based exposure inside live business environments. Move beyond theoretical learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={onApplyClick}
                className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3"
              >
                Apply Now <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 border border-white/10 transition-all uppercase tracking-widest text-sm"
              >
                Explore How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What is Industrial Immersion */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tighter mb-8">
                Execution-Based <br /><span className="text-blue-500">Exposure</span>
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                    <Zap className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Not a Simulation</h3>
                    <p className="text-gray-400 font-medium">Work on real business processes and live deliverables that actually matter to an organization.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 uppercase tracking-tight">Real Deliverables</h3>
                    <p className="text-gray-400 font-medium">Experience the accountability of delivering results in a professional environment, not just observation.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="glass-card p-8 rounded-[2.5rem] border-white/5 aspect-square flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-600/5 animate-pulse" />
              <div className="text-center relative z-10">
                <div className="text-6xl font-black text-blue-500 mb-4">100%</div>
                <div className="text-xl font-bold uppercase tracking-widest">Industrial Focus</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-white/[0.01] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">The Framework</p>
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="text-8xl font-black text-white/5 absolute -top-12 -left-4 select-none">0{i + 1}</div>
                <div className="glass-card p-8 rounded-3xl border-white/5 h-full relative z-10">
                  <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-blue-500">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Work On */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1">
              <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tighter mb-6">
                What You <br /><span className="text-blue-500">Work On</span>
              </h2>
              <p className="text-gray-400 font-medium text-lg">
                We focus on core business execution areas that are universal across industries.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {workExamples.map((ex, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group">
                  <h3 className="text-lg font-bold mb-3 uppercase tracking-tight group-hover:text-blue-500 transition-colors">{ex.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed font-medium">{ex.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Program Tracks */}
      <section className="py-24 bg-white/[0.01] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter">Program Tracks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Business Operations', 'Brand & Growth', 'Technology & SaaS', 'Cross-Industry Projects'].map((track, i) => (
              <div key={i} className="glass-card p-10 rounded-[2rem] border-white/5 text-center hover:border-blue-500/40 transition-all">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold uppercase tracking-tight">{track}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="glass-card p-12 md:p-20 rounded-[3rem] border-blue-500/10 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tighter mb-8">
                  Industry <br /><span className="text-blue-500">Certification</span>
                </h2>
                <p className="text-gray-400 text-lg font-medium mb-10 leading-relaxed">
                  Every participant receives dual certification upon successful completion of the immersion program.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="text-blue-500" size={20} />
                    <span className="font-bold uppercase tracking-widest text-sm">Execution Certificate</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="text-blue-500" size={20} />
                    <span className="font-bold uppercase tracking-widest text-sm">Industry Experience Certificate</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                  <span className="font-bold uppercase tracking-widest text-xs">Execution Certificate Details</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/10 transition-all">
                  <span className="font-bold uppercase tracking-widest text-xs">Industry Experience Details</span>
                  <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Should Apply */}
      <section className="py-24 bg-white/[0.01] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter">Who Should Apply</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: GraduationCap, title: "College Students", desc: "Seeking early exposure to business environments." },
              { icon: Users, title: "Final-Year Students", desc: "Preparing for the transition into the workforce." },
              { icon: Briefcase, title: "Graduates", desc: "Looking to build a practical proof-of-work portfolio." },
              { icon: Zap, title: "Skill Seekers", desc: "Individuals seeking structured operational exposure." }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-400 text-sm font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter">Application Process</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-12">
              {[
                { title: "Submit Application", icon: ClipboardCheck },
                { title: "Screening", icon: Users },
                { title: "Allocation", icon: Briefcase },
                { title: "Start Immersion", icon: Zap }
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-lg shadow-blue-500/20">
                    <step.icon size={24} />
                  </div>
                  <div className="flex-1 h-px bg-white/10 hidden md:block" />
                  <div className="text-xl font-bold uppercase tracking-widest">{step.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Block */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass-card p-12 md:p-24 rounded-[4rem] border-blue-500/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5" />
            <h2 className="text-4xl md:text-7xl font-heading font-bold mb-10 uppercase tracking-tighter leading-none relative z-10">
              Ready for <br /><span className="text-blue-500">Structured</span> <br />Industry Exposure?
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <button 
                onClick={onApplyClick}
                className="w-full sm:w-auto px-16 py-6 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 text-sm uppercase tracking-[0.2em]"
              >
                Apply Now
              </button>
              <button 
                className="w-full sm:w-auto px-16 py-6 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 border border-white/10 transition-all text-sm uppercase tracking-[0.2em]"
              >
                Contact Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentConversionPage;
