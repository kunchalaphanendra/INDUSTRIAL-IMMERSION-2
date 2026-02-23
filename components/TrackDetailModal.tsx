
import React from 'react';
import { TrackKey, TrackData } from '@/types';
import ReviewSection from './ReviewSection';

interface TrackDetailModalProps {
  trackKey: TrackKey;
  data: TrackData;
  onClose: () => void;
  onEnroll?: (key: TrackKey) => void;
}

const TrackDetailModal: React.FC<TrackDetailModalProps> = ({ trackKey, data, onClose, onEnroll }) => {
  const isImmersion = trackKey === TrackKey.COLLEGE_IMMERSION;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-[#050505] border border-white/10 w-full max-w-4xl max-h-[92vh] rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.1)] flex flex-col animate-in zoom-in duration-300">
        
        {/* Header Section */}
        <div className="p-8 border-b border-white/5 flex justify-between items-start bg-black/40 backdrop-blur-xl">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] mb-3 block text-blue-500">
              Detailed Syllabus & Roadmap
            </span>
            <h2 className="font-heading font-black text-3xl md:text-5xl uppercase tracking-tighter text-white leading-none">
              {data.title.replace(' Program', '')} <br />
              <span className="text-blue-500">Track Details</span>
            </h2>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-full transition-all text-gray-500 hover:text-white">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar space-y-20">
          
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div>
                <h3 className="text-xl font-heading font-bold text-white uppercase tracking-tight mb-6">Program Structure</h3>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-gray-400 uppercase tracking-widest text-[9px]">Training</div>
                  <span className="text-blue-500 font-black">→</span>
                  <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-gray-400 uppercase tracking-widest text-[9px]">Execution</div>
                  <span className="text-blue-500 font-black">→</span>
                  <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-gray-400 uppercase tracking-widest text-[9px]">Evaluation</div>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                This {data.duration} program is designed as a deep-dive into industry execution. You will focus on high-intensity practical training sessions with weekly deliverables that simulate real-world agency tasks. 
                {isImmersion && " The second half provides guaranteed work experience where you build live industrial proof-of-work alongside brand partners."}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#0a0a0a] rounded-[2rem] p-8 border border-white/5 shadow-inner">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6">Core Modules</h4>
                <ul className="space-y-4">
                  {data.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-gray-300 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* New Review Section Integration */}
          <div className="pt-12 border-t border-white/5">
            <ReviewSection courseKey={trackKey} />
          </div>

          {/* Roadmap Section */}
          <div className="pt-12 border-t border-white/5">
            <h3 className="text-xl font-heading font-bold text-white mb-10 uppercase tracking-tight">Execution Roadmap</h3>
            <div className="space-y-6">
              {[
                { 
                  time: isImmersion ? 'Month 1-2' : 'Week 1-2', 
                  title: 'Foundational Strategy & Tooling', 
                  detail: 'Onboarding to industry-standard project management and analytics tools.' 
                },
                { 
                  time: isImmersion ? 'Month 3-4' : 'Week 3-4', 
                  title: 'Creative Execution & Branding', 
                  detail: 'Developing content calendars and visual identity assets for live pilots.' 
                },
                { 
                  time: isImmersion ? 'Month 5-6' : 'Week 5-6', 
                  title: 'Performance Optimization', 
                  detail: 'Analyzing delivery data and refining execution quality.' 
                },
              ].map((item, i) => (
                <div key={i} className="group flex flex-col md:flex-row gap-6 p-8 rounded-3xl hover:bg-white/[0.02] transition-all border border-transparent hover:border-white/5">
                  <div className="shrink-0 md:w-40 text-blue-500 font-black text-xs uppercase tracking-[0.3em]">{item.time}</div>
                  <div>
                    <h5 className="font-bold text-white mb-2 uppercase text-base tracking-tight">{item.title}</h5>
                    <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 md:p-10 bg-black/40 border-t border-white/5 flex flex-col sm:flex-row gap-4 justify-center items-center">
           <button 
             onClick={onClose}
             className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-gray-300 font-black rounded-2xl hover:bg-white/10 transition-all text-[11px] uppercase tracking-[0.3em]"
           >
             Close Details
           </button>
           {onEnroll && (
             <button 
               onClick={() => {
                 onEnroll(trackKey);
                 onClose();
               }}
               className="w-full sm:w-auto px-14 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 text-[11px] uppercase tracking-[0.3em] active:scale-95"
             >
               Apply for this Track
             </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default TrackDetailModal;


