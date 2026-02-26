
import React, { useState } from 'react';
import { TrackKey, InstitutionType, BillingType } from '@/types';
import { TRACKS } from '../constants';

interface ProgramSelectorProps {
  onSelect: (track: TrackKey) => void;
  onViewDetails?: (track: TrackKey) => void;
  selectedTrack: TrackKey | null;
  hideToggle?: boolean;
  forceType?: InstitutionType;
  initialType?: InstitutionType;
  isSchoolsPage?: boolean;
}

const ProgramSelector: React.FC<ProgramSelectorProps> = ({
  onSelect,
  onViewDetails,
  selectedTrack,
  hideToggle = false,
  forceType,
  initialType,
  isSchoolsPage = false
}) => {
  const [activeTab, setActiveTab] = useState<InstitutionType>(isSchoolsPage ? InstitutionType.SCHOOL : (initialType || forceType || InstitutionType.SCHOOL));

  const schoolTracks = [TrackKey.SCHOOL_TUITION, TrackKey.SCHOOL_SKILL];
  const collegeTracks = [
    TrackKey.COLLEGE_PROF, 
    TrackKey.COLLEGE_IMMERSION,
    TrackKey.INFLUENCER_COHORT,
    TrackKey.MANAGEMENT_SUIT,
    TrackKey.FINANCE_PRO,
    TrackKey.CORPORATE_IMMERSION
  ];

  const currentTracks = activeTab === InstitutionType.SCHOOL ? schoolTracks : collegeTracks;
  const isSchoolView = activeTab === InstitutionType.SCHOOL;

  const showToggle = !hideToggle && !isSchoolsPage;

  return (
    <section id="institutions" className="py-24 bg-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className={`text-center mb-16 ${isSchoolsPage ? 'pt-12 pb-8' : ''}`}>
          <h2 className={`font-heading font-black mb-6 uppercase tracking-tight ${isSchoolsPage ? 'text-4xl md:text-7xl leading-none' : 'text-3xl md:text-6xl'}`}>
            {isSchoolsPage ? "Structured Academic & Skill Programs for Schools" : "Education Programs"}
          </h2>
          <p className={`text-gray-500 mx-auto mb-4 ${isSchoolsPage ? 'text-lg md:text-xl max-w-3xl' : 'max-w-2xl'}`}>
            {isSchoolsPage
              ? "After-school academic and skill development programs designed to support measurable student progress and institutional clarity."
              : "Structured learning programs designed for students seeking measurable outcomes, industry relevance, and career readiness."
            }
          </p>
        </div>

        {/* Tab Switcher */}
        {showToggle && (
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
        )}

        <div className="mb-12 text-center animate-in fade-in duration-700">
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed italic">
            {isSchoolView
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
                className={`group relative p-[1px] rounded-[2.5rem] transition-all duration-500 flex flex-col ${isSelected ? 'bg-blue-500/50 scale-[1.01]' : 'bg-white/10'
                  }`}
              >
                <div className="bg-[#080808] rounded-[calc(2.5rem-1px)] p-8 md:p-12 h-full flex flex-col justify-between border border-transparent">
                  <div>
                    {/* Header: Badge and Price */}
                    <div className="flex justify-between items-center mb-10">
                      <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-400">
                        {track.duration}
                      </span>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <span className="text-3xl font-heading font-bold text-white">₹{track.price.toLocaleString()}</span>
                        </div>
                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mt-1">
                          {track.billingType === BillingType.MONTHLY ? '/ Student / Month' : 'One-time Enrollment'}
                        </p>
                      </div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-white uppercase tracking-tight leading-tight">{track.title}</h3>
                    <p className="text-gray-500 text-sm mb-10 leading-relaxed font-medium">
                      {track.description}
                    </p>

                    <div className="mb-10">
                      <p className="text-[10px] font-black uppercase text-blue-500 mb-3 tracking-widest">Ideal For</p>
                      <p className="text-gray-400 text-xs font-medium leading-relaxed">{track.idealFor}</p>
                    </div>

                    <ul className="space-y-4 mb-12">
                      {track.features.slice(0, 3).map((f, i) => (
                        <li key={i} className="flex items-center text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-4 shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.4)]" /> {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-4">
                    {/* Only show "View Full Syllabus" for College Tracks */}
                    {!isSchoolView && (
                      <button
                        onClick={() => onViewDetails?.(key)}
                        className="w-full py-4 text-gray-500 hover:text-white font-bold text-[10px] uppercase tracking-[0.3em] transition-all hover:tracking-[0.4em]"
                      >
                        View Full Syllabus
                      </button>
                    )}

                    <button
                      onClick={() => onSelect(key)}
                      className={`w-full py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] transition-all shadow-2xl active:scale-[0.98] ${isSchoolView && !isSelected
                        ? 'bg-white text-black hover:bg-gray-200'
                        : isSelected
                          ? 'bg-blue-600 text-white shadow-blue-500/20'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/10'
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




