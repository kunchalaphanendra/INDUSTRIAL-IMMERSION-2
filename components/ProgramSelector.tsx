
import React, { useState } from 'react';
import { TrackKey, InstitutionType } from '../types';
import { TRACKS } from '../constants';

interface ProgramSelectorProps {
  onSelect: (track: TrackKey) => void;
  selectedTrack: TrackKey | null;
}

const ProgramSelector: React.FC<ProgramSelectorProps> = ({ onSelect, selectedTrack }) => {
  const [activeTab, setActiveTab] = useState<InstitutionType>(InstitutionType.SCHOOL);

  const schoolTracks = [TrackKey.SCHOOL_TUITION, TrackKey.SCHOOL_SKILL];
  const collegeTracks = [TrackKey.COLLEGE_PROF, TrackKey.COLLEGE_IMMERSION];

  const currentTracks = activeTab === InstitutionType.SCHOOL ? schoolTracks : collegeTracks;

  return (
    <section id="organisations" className="py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Our Education Programs</p>
          <h2 className="text-3xl md:text-6xl font-heading font-bold mb-6 uppercase tracking-tight">Organisations</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our programs are designed for institutions and students seeking structured learning, measurable outcomes, and industry relevance.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-2">
            <button 
              onClick={() => setActiveTab(InstitutionType.SCHOOL)}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest ${activeTab === InstitutionType.SCHOOL ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'}`}
            >
              For School Students
            </button>
            <button 
              onClick={() => setActiveTab(InstitutionType.COLLEGE)}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all uppercase tracking-widest ${activeTab === InstitutionType.COLLEGE ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:text-white'}`}
            >
              For College Students
            </button>
          </div>
        </div>

        <div className="mb-12 text-center animate-in fade-in duration-700">
           <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed italic">
             {activeTab === InstitutionType.SCHOOL 
               ? "After-school programs designed to strengthen academics, communication, and digital skills while providing clear progress tracking for institutions and parents."
               : "Industry-aligned programs that help college students build practical skills, certifications, and career readiness."
             }
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {currentTracks.map((key) => {
            const track = TRACKS[key];
            const isSelected = selectedTrack === key;
            
            return (
              <div 
                key={key}
                className={`group relative p-1 rounded-[2.5rem] transition-all duration-500 flex flex-col ${
                  isSelected ? 'bg-blue-500/40 scale-[1.02]' : 'bg-white/10'
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
                        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-1 italic">
                          {track.billingType === 'monthly' ? '/ Student / Month' : 'One-time fee'}
                        </p>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-heading font-bold mb-4 text-white uppercase tracking-tight">{track.title}</h3>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed font-medium">
                      {track.description}
                    </p>

                    <div className="mb-8">
                      <p className="text-[10px] font-black uppercase text-blue-500 mb-3 tracking-widest">Ideal For</p>
                      <p className="text-gray-400 text-xs font-medium">{track.idealFor}</p>
                    </div>
                    
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
                      onClick={() => onSelect(key)}
                      className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${
                        isSelected 
                        ? 'bg-blue-600 text-white shadow-blue-500/20' 
                        : 'bg-white text-black hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramSelector;


