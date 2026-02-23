
import React from 'react';
import { User as UserIcon, Landmark } from 'lucide-react';

const AudienceSection: React.FC = () => {
  const audiences = [
    {
      title: 'INDIVIDUALS',
      description: 'Students and graduates seeking structured, real-world business exposure.',
      icon: <UserIcon className="w-6 h-6 text-purple-500" />,
      iconBg: 'bg-purple-500/10'
    },
    {
      title: 'INSTITUTIONS',
      description: 'Schools and colleges integrating execution-based industry immersion into their ecosystem.',
      icon: <Landmark className="w-6 h-6 text-blue-500" />,
      iconBg: 'bg-blue-500/10'
    }
  ];

  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-7xl font-heading font-black text-white uppercase tracking-tighter">
            WHO IS THIS DESIGNED FOR?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="group relative bg-[#080808] border border-white/5 rounded-[2.5rem] p-12 text-center transition-all duration-500 hover:border-white/10 hover:bg-[#0a0a0a]"
            >
              <div className="flex justify-center mb-8">
                <div className={`w-16 h-16 ${audience.iconBg} rounded-2xl flex items-center justify-center border border-white/5 shadow-2xl`}>
                  {audience.icon}
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-6 uppercase tracking-tight">
                {audience.title}
              </h3>
              
              <p className="text-gray-500 text-sm md:text-base font-medium leading-relaxed max-w-xs mx-auto">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
