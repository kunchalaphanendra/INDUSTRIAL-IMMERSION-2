import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Users, GraduationCap, Zap, ShieldCheck, BarChart3, Briefcase } from 'lucide-react';
import { apiService } from '../services/api';
import { BlogPost } from '../types';

interface HomepageProps {
  onExplorePrograms: () => void;
  onPartnerWithUs: () => void;
  onStudentProgramClick: () => void;
  onInstitutionProgramClick: () => void;
  onBlogClick: () => void;
  onPostClick: (slug: string) => void;
  onApplyClick: () => void;
}

const Homepage: React.FC<HomepageProps> = ({ 
  onExplorePrograms, 
  onPartnerWithUs, 
  onStudentProgramClick, 
  onInstitutionProgramClick,
  onBlogClick,
  onPostClick,
  onApplyClick
}) => {
  const [latestPosts, setLatestPosts] = useState<Partial<BlogPost>[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await apiService.fetchPublishedBlogPosts();
      setLatestPosts(posts.slice(0, 3));
    };
    loadPosts();
  }, []);

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-8">Industrial Immersion Platform</p>
            <h1 className="text-5xl md:text-8xl font-heading font-bold mb-10 leading-[1] tracking-tighter uppercase">
              Bridging <span className="text-blue-500">Education</span> <br />& Business Execution
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 mb-12 font-medium leading-relaxed">
              Structured execution programs for students and scalable integration models for institutions. Move beyond theoretical learning.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={onExplorePrograms}
                className="w-full sm:w-auto px-16 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-2xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest"
              >
                Explore Programs
              </button>
              <button 
                onClick={onPartnerWithUs}
                className="w-full sm:w-auto px-16 py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-sm transition-all active:scale-95 uppercase tracking-widest"
              >
                Partner With Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Audience Split Cards */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-12 rounded-[3rem] border-white/5 group hover:border-blue-500/30 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-8">
                <GraduationCap className="text-blue-500" size={32} />
              </div>
              <h2 className="text-3xl font-heading font-bold uppercase tracking-tighter mb-6">For Students</h2>
              <p className="text-gray-400 text-lg font-medium mb-10 leading-relaxed">
                Build your industrial proof-of-work through structured execution inside live business environments.
              </p>
              <button 
                onClick={onStudentProgramClick}
                className="flex items-center gap-3 text-blue-500 font-black uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform"
              >
                Explore Student Program <ArrowRight size={16} />
              </button>
            </div>

            <div className="glass-card p-12 rounded-[3rem] border-white/5 group hover:border-blue-500/30 transition-all">
              <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-8">
                <Users className="text-blue-500" size={32} />
              </div>
              <h2 className="text-3xl font-heading font-bold uppercase tracking-tighter mb-6">For Institutions</h2>
              <p className="text-gray-400 text-lg font-medium mb-10 leading-relaxed">
                Scalable industry integration models aligned with your academic ecosystem and calendar.
              </p>
              <button 
                onClick={onInstitutionProgramClick}
                className="flex items-center gap-3 text-blue-500 font-black uppercase tracking-widest text-xs group-hover:translate-x-2 transition-transform"
              >
                Explore Partnership Model <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes This Different */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">The STJUFENDS Advantage</p>
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter">Execution-First Model</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Zap, title: "Execution-Based", desc: "Move beyond simulations. Work on live business deliverables." },
              { icon: Briefcase, title: "Real Deliverables", desc: "Experience the accountability of professional output." },
              { icon: ShieldCheck, title: "Structured Supervision", desc: "Defined process flows and professional oversight." },
              { icon: BarChart3, title: "Certification Standards", desc: "Industry-recognized credentials for proof-of-work." }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="text-blue-500" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{item.title}</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works (Simplified) */}
      <section className="py-24 bg-white/[0.01] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-white/10 -translate-y-1/2 z-0" />
            {[
              { title: "Apply & Screen", desc: "Submit your application for skill assessment and track allocation." },
              { title: "Execute & Learn", desc: "Join a live business track and work on structured deliverables." },
              { title: "Certify & Scale", desc: "Receive industry-recognized certification for your proof-of-work." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-black text-2xl mx-auto mb-8 shadow-lg shadow-blue-500/20">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{step.title}</h3>
                <p className="text-gray-400 text-sm font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Section */}
      <section className="py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <p className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Industrial Insights</p>
              <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter">Latest From Blog</h2>
            </div>
            <button 
              onClick={onBlogClick}
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              View All Insights
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestPosts.map((post) => (
              <article 
                key={post.id}
                onClick={() => onPostClick(post.slug || '')}
                className="glass-card rounded-[2.5rem] border-white/5 overflow-hidden group cursor-pointer hover:border-blue-500/30 transition-all flex flex-col"
              >
                <div className="aspect-video overflow-hidden relative">
                  <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{post.category}</span>
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{post.reading_time} min read</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight uppercase tracking-tight">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-6 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white group-hover:translate-x-2 transition-transform inline-block">
                      Read More →
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="glass-card p-12 md:p-24 rounded-[4rem] border-blue-500/20 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-600/5" />
            <h2 className="text-4xl md:text-7xl font-heading font-bold mb-10 uppercase tracking-tighter leading-none relative z-10">
              Move Beyond <br /><span className="text-blue-500">Theoretical</span> <br />Learning
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
              <button 
                onClick={onApplyClick}
                className="w-full sm:w-auto px-16 py-6 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/20 text-sm uppercase tracking-[0.2em]"
              >
                Apply Now
              </button>
              <button 
                onClick={onPartnerWithUs}
                className="w-full sm:w-auto px-16 py-6 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 border border-white/10 transition-all text-sm uppercase tracking-[0.2em]"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
