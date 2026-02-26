
import React from 'react';

interface ProgramPageProps {
  type: 'influencer-cohort' | 'management-suite' | 'finance-pro' | 'corporate-immersion';
  onBack: () => void;
  onApply: () => void;
}

export const getProgramContent = (type: string) => {
  switch (type) {
    case 'influencer-cohort':
      return {
        title: 'Influencer Cohort',
        subtitle: 'Execution-Driven Digital Brand Immersion',
        description: 'The Influencer Cohort is designed for individuals who want structured exposure to digital growth, brand positioning, and content execution within real operational environments. Unlike conventional social media courses, this cohort focuses on measurable execution, audience strategy, and business alignment.',
        sections: [
          {
            title: 'What Participants Work On',
            items: [
              'Personal brand positioning frameworks',
              'Content strategy design',
              'Audience research and analytics',
              'Performance tracking dashboards',
              'Campaign execution support',
              'Brand collaboration documentation'
            ]
          },
          {
            title: 'Program Details',
            details: [
              { label: 'Duration', value: '4–8 Weeks' },
              { label: 'Outcome', value: 'Execution Certificate with documented portfolio assets' },
              { label: 'Who It’s For', value: 'Students exploring digital careers, Early-stage creators, Marketing-focused individuals' }
            ]
          }
        ]
      };
    case 'management-suite':
      return {
        title: 'Management Suite',
        subtitle: 'Business Operations & Execution Immersion',
        description: 'The Management Suite focuses on operational thinking, workflow systems, and structured business execution across live brands. Participants gain exposure to how companies manage internal systems, processes, and cross-functional collaboration.',
        sections: [
          {
            title: 'Core Focus Areas',
            items: [
              'Business process mapping',
              'Operational documentation',
              'Task tracking systems',
              'Revenue flow understanding',
              'Team coordination structures',
              'Strategic execution support'
            ]
          },
          {
            title: 'Industries Covered',
            items: ['Fashion & Apparel', 'Consumer Products', 'Technology', 'Service Agencies']
          },
          {
            title: 'Program Details',
            details: [
              { label: 'Duration', value: '6 Weeks' },
              { label: 'Outcome', value: 'Execution Certificate in Operational Management' }
            ]
          }
        ]
      };
    case 'finance-pro':
      return {
        title: 'Finance Pro',
        subtitle: 'Financial Systems & Business Intelligence Immersion',
        description: 'Finance Pro introduces participants to practical financial frameworks within operating businesses. This is not academic finance theory — it focuses on real-world business numbers, tracking systems, and financial discipline.',
        sections: [
          {
            title: 'Exposure Includes',
            items: [
              'Revenue tracking systems',
              'Cost structure analysis',
              'Commission logic systems',
              'Budget allocation basics',
              'Financial dashboard interpretation',
              'Basic forecasting support'
            ]
          },
          {
            title: 'Program Details',
            details: [
              { label: 'Ideal For', value: 'Commerce students, MBA aspirants, Founders-in-training' },
              { label: 'Duration', value: '6–8 Weeks' },
              { label: 'Outcome', value: 'Industrial Execution Certificate – Financial Systems Track' }
            ]
          }
        ]
      };
    case 'corporate-immersion':
      return {
        title: 'Corporate Immersion',
        subtitle: 'Enterprise-Level Execution Exposure',
        description: 'Corporate Immersion is an advanced track designed for individuals seeking deeper exposure within structured business environments. Participants are placed in live execution environments under defined supervision and performance evaluation.',
        sections: [
          {
            title: 'What This Track Offers',
            items: [
              'Live business project allocation',
              'Direct reporting structures',
              'Cross-functional coordination',
              'Deliverable-based evaluation',
              'Performance-based certification'
            ]
          },
          {
            title: 'Program Details',
            details: [
              { label: 'Designed For', value: 'Final-year students, Graduates, Individuals seeking serious industry exposure' },
              { label: 'Duration', value: '8–12 Weeks' },
              { label: 'Certification', value: 'Industrial Experience Certificate' }
            ]
          }
        ]
      };
    default:
      return null;
  }
};

const ProgramPages: React.FC<ProgramPageProps> = ({ type, onBack, onApply }) => {
  const content = getProgramContent(type);

  if (!content) return null;

  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4">
        <button 
          onClick={onBack}
          className="mb-12 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
        </button>

        <div className="glass-card p-12 md:p-20 rounded-[4rem] border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
            <div className="text-[10rem] font-black uppercase tracking-tighter leading-none">
              {content.title.split(' ')[0]}
            </div>
          </div>

          <div className="relative z-10">
            <h1 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-4">{content.title}</h1>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white uppercase tracking-tighter mb-8 max-w-2xl">
              {content.subtitle}
            </h2>
            
            <p className="text-gray-400 text-lg md:text-xl font-medium leading-relaxed mb-16 max-w-3xl">
              {content.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-12">
                {content.sections.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                      {section.title}
                      <span className="h-[1px] flex-1 bg-white/10" />
                    </h3>
                    {section.items ? (
                      <ul className="space-y-4">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-400 text-sm font-bold uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : section.details ? (
                      <div className="space-y-6">
                        {section.details.map((detail, i) => (
                          <div key={i}>
                            <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{detail.label}</p>
                            <p className="text-white text-sm font-bold uppercase tracking-wider">{detail.value}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="flex flex-col justify-end">
                <div className="glass-card p-10 rounded-[2.5rem] border-blue-500/20 bg-blue-600/5">
                  <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4">Ready to Start?</h4>
                  <p className="text-gray-500 text-xs mb-8 leading-relaxed font-bold uppercase tracking-widest">
                    Secure your spot in the next industrial immersion cohort.
                  </p>
                  <button 
                    onClick={onApply}
                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramPages;
