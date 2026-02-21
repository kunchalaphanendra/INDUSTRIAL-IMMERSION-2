import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, BarChart3, Layers, Globe, Zap, Users, FileText } from 'lucide-react';

interface InstitutionPartnershipPageProps {
  onContactClick: () => void;
}

const InstitutionPartnershipPage: React.FC<InstitutionPartnershipPageProps> = ({ onContactClick }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Industrial Immersion for Colleges | Industry Partnership Model";
  }, []);

  return (
    <div className="bg-black text-white pt-20">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-blue-600/5 blur-[120px] rounded-full -top-24 -right-24" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-6">Institutional Partnership</p>
            <h1 className="text-5xl md:text-8xl font-heading font-bold uppercase tracking-tighter leading-none mb-8">
              Structured <br /><span className="text-blue-500">Industry</span> <br />Integration
            </h1>
            <p className="text-gray-400 text-xl md:text-2xl font-medium leading-relaxed mb-12 max-w-2xl">
              Execution-based immersion programs aligned with academic ecosystems. Scalable, structured, and outcome-driven.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <button 
                onClick={onContactClick}
                className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3"
              >
                Schedule Discussion <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Industry Integration Matters */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tighter">Why Industry Integration Matters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Employability Gap", desc: "Theoretical knowledge alone is insufficient for the modern industrial landscape. Students need execution-based proof-of-work." },
              { title: "Operational Exposure", desc: "Understanding how businesses actually function, beyond case studies and classroom simulations." },
              { title: "Industry Alignment", desc: "Ensuring academic learning is continuously aligned with evolving industrial requirements and process flows." }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-blue-500">{item.title}</h3>
                <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structured Immersion Model */}
      <section className="py-24 bg-white/[0.01] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tighter mb-8">
                Structured <br /><span className="text-blue-500">Immersion</span> Model
              </h2>
              <div className="space-y-6">
                {[
                  { title: "Bulk Allocation Model", desc: "Efficiently managing large batches of students through defined allocation frameworks." },
                  { title: "Defined Supervision", desc: "Every student operates under a structured supervision model with clear reporting lines." },
                  { title: "Execution Evaluation", desc: "Performance is measured by actual deliverables and process adherence, not just attendance." },
                  { title: "Certification Framework", desc: "Standardized industry-recognized certification issued upon successful completion." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="text-blue-500" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-1 uppercase tracking-tight">{item.title}</h3>
                      <p className="text-gray-400 text-sm font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="glass-card p-12 rounded-[3rem] border-white/5 relative z-10">
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">Model Efficiency</span>
                    <span className="text-blue-500 font-black">98%</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">Scalability Index</span>
                    <span className="text-blue-500 font-black">High</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">Industry Alignment</span>
                    <span className="text-blue-500 font-black">Direct</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-blue-600/10 blur-[100px] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Scalability Framework */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter">Scalability Framework</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Layers, title: "Batch Deployment", desc: "Deploying students in structured batches aligned with academic cycles." },
              { icon: Globe, title: "Calendar Alignment", desc: "Seamless integration with institutional academic calendars and internship windows." },
              { icon: BarChart3, title: "Reporting Structure", desc: "Detailed reporting on student progress, deliverables, and performance metrics." },
              { icon: FileText, title: "Outcome Documentation", desc: "Comprehensive documentation of learning outcomes and industrial exposure." }
            ].map((item, i) => (
              <div key={i} className="glass-card p-8 rounded-3xl border-white/5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="text-blue-500" size={24} />
                </div>
                <h3 className="text-lg font-bold mb-3 uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-400 text-sm font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Benefits */}
      <section className="py-24 bg-white/[0.01] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square rounded-3xl bg-white/5 border border-white/5 p-8 flex flex-col justify-end">
                  <Zap className="text-blue-500 mb-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Practical Exposure</span>
                </div>
                <div className="aspect-square rounded-3xl bg-blue-600 p-8 flex flex-col justify-end">
                  <Users className="text-white mb-4" />
                  <span className="text-xs font-black uppercase tracking-widest text-white">Industry Alignment</span>
                </div>
                <div className="aspect-square rounded-3xl bg-white/5 border border-white/5 p-8 flex flex-col justify-end">
                  <BarChart3 className="text-blue-500 mb-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Structured Execution</span>
                </div>
                <div className="aspect-square rounded-3xl bg-white/5 border border-white/5 p-8 flex flex-col justify-end">
                  <ShieldCheck className="text-blue-500 mb-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Credibility</span>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-heading font-bold uppercase tracking-tighter mb-8">
                Institutional <br /><span className="text-blue-500">Benefits</span>
              </h2>
              <p className="text-gray-400 text-lg font-medium leading-relaxed mb-8">
                Partnering with STJUFENDS enhances the institutional value proposition by providing students with direct, structured industrial exposure that translates into real-world readiness.
              </p>
              <ul className="space-y-4">
                {['Enhanced Employability Metrics', 'Direct Industry Linkages', 'Standardized Evaluation Models', 'Scalable Internship Solutions'].map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    <span className="font-bold uppercase tracking-widest text-xs">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Model */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter">Partnership Model</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Custom MoU Structure", desc: "Tailored agreements that respect institutional requirements and academic standards." },
              { title: "Defined Responsibilities", desc: "Clear demarcation of roles between the institution, the student, and the immersion platform." },
              { title: "Scalable Engagement", desc: "Models designed to grow from single-batch pilots to institution-wide integration." }
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 text-center">
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight text-blue-500">{item.title}</h3>
                <p className="text-gray-400 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass-card p-12 md:p-24 rounded-[4rem] border-blue-500/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5" />
            <h2 className="text-4xl md:text-7xl font-heading font-bold mb-10 uppercase tracking-tighter leading-none relative z-10">
              Scale Your <br /><span className="text-blue-500">Industry</span> <br />Integration
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <button 
                onClick={onContactClick}
                className="w-full sm:w-auto px-16 py-6 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 text-sm uppercase tracking-[0.2em]"
              >
                Schedule Partnership Discussion
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default InstitutionPartnershipPage;
