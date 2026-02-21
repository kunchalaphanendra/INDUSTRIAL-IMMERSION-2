import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Briefcase, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface CertificatePageProps {
  onBack: () => void;
}

const IndustryExperienceCertificatePage: React.FC<CertificatePageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Industry Experience Certificate | STJUFENDS";
  }, []);

  return (
    <div className="bg-black text-white pt-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-24">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 uppercase tracking-widest text-[10px] font-black">
          <ArrowLeft size={14} /> Back to Program
        </button>

        <div className="glass-card p-12 md:p-20 rounded-[3rem] border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px]" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 rounded-2xl bg-blue-600/20 flex items-center justify-center mb-8">
              <Briefcase className="text-blue-500" size={40} />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-heading font-bold uppercase tracking-tighter mb-8">
              Industry <br /><span className="text-blue-500">Experience</span> <br />Certificate
            </h1>
            
            <div className="space-y-8 text-gray-400 font-medium text-lg leading-relaxed">
              <p>
                The Industry Experience Certificate documents the duration and nature of the industrial immersion undergone by the participant inside a live business environment.
              </p>
              
              <div className="space-y-4 pt-8">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm">What it documents:</h3>
                {[
                  "Total hours of industrial immersion",
                  "Specific business track and industry domain",
                  "Exposure to live organizational ecosystems",
                  "Professional conduct and industry alignment"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle2 className="text-blue-500" size={18} />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryExperienceCertificatePage;
