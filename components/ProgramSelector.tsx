
import React, { useState } from 'react';
import { TrackKey, DomainKey } from '../types';
import { TRACKS, DOMAINS } from '../constants';
import TrackDetailModal from './TrackDetailModal';

interface ProgramSelectorProps {
  onSelect: (track: TrackKey, domain: DomainKey) => void;
  selected: TrackKey | null;
}

const ProgramSelector: React.FC<ProgramSelectorProps> = ({ onSelect, selected }) => {
  const [activeDomain, setActiveDomain] = useState<DomainKey>(DomainKey.FASHION);
  const [viewingDetails, setViewingDetails] = useState<TrackKey | null>(null);

  return (
    <section id="tracks" className="py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Step 1: Choose Your Domain */}
        <div className="text-center mb-16">
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Step 01</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 uppercase tracking-tight">Choose Your Domain</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Select the industry where you will build your execution proof-of-work.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-24">
          {Object.entries(DOMAINS).map(([key, domain]) => (
            <button 
              key={key}
              onClick={() => setActiveDomain(key as DomainKey)}
              className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-4 text-center group ${
                activeDomain === key 
                ? 'bg-blue-600/10 border-blue-500/50 shadow-2xl shadow-blue-500/5' 
                : 'bg-white/5 border-white/5 hover:border-white/10'
              }`}
            >
              <div className={`text-4xl transition-transform duration-500 ${activeDomain === key ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>{domain.icon}</div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${activeDomain === key ? 'text-white' : 'text-gray-500'}`}>{domain.title}</span>
            </button>
          ))}
        </div>

        {/* Step 2: Choose Track Intensity */}
        <div className="text-center mb-16">
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Step 02</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6 uppercase tracking-tight">Select Track Intensity</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {Object.entries(TRACKS).map(([key, track]) => {
            const isExp = key === TrackKey.INDUSTRIAL_EXP;
            
            return (
              <div 
                key={key}
                className={`group relative p-1 rounded-[2.5rem] transition-all duration-500 flex flex-col ${
                  selected === key ? 'bg-blue-500/40 scale-[1.02]' : 'bg-white/10'
                }`}
              >
                <div className="bg-[#0a0a0a] rounded-[calc(2.5rem-2px)] p-8 md:p-12 h-full flex flex-col justify-between border border-white/5">
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-400">
                        {track.duration}
                      </span>
                      <div className="text-right">
                        <span className="text-2xl font-heading font-bold text-white block">₹{track.price.toLocaleString()}</span>
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1 italic">Industrial Grade Pricing</p>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-heading font-bold mb-4 text-white uppercase tracking-tight">{track.title}</h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                      {track.description}
                    </p>
                    
                    <ul className="space-y-4 mb-12">
                      {track.features.map((f, i) => (
                        <li key={i} className="flex items-center text-xs font-bold text-gray-400 group-hover:text-gray-300 transition-colors uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => onSelect(key as TrackKey, activeDomain)}
                      className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${
                        selected === key 
                        ? 'bg-blue-600 text-white shadow-blue-500/20' 
                        : 'bg-white text-black hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      {selected === key ? 'Track Confirmed' : 'Enroll in Track'}
                    </button>
                    
                    <button 
                      onClick={() => setViewingDetails(key as TrackKey)}
                      className="w-full py-4 bg-transparent border border-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all rounded-2xl"
                    >
                      View Industrial Syllabus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {viewingDetails && (
        <TrackDetailModal 
          trackKey={viewingDetails}
          data={TRACKS[viewingDetails]}
          onClose={() => setViewingDetails(null)}
          onEnroll={(key) => onSelect(key, activeDomain)}
        />
      )}
    </section>
  );
};

export default ProgramSelector;

