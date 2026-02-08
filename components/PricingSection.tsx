
import React from 'react';
import { ENROLLMENT_STEPS, FAQ_CATEGORIES } from '../constants';

const PricingSection: React.FC = () => {
  return (
    <section id="process" className="py-24 bg-[#050505] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4">Onboarding Flow</p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 uppercase tracking-tight">Radical Transparency</h2>
          <p className="text-gray-500">How to get from where you are to the industry floor.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-32">
          {ENROLLMENT_STEPS.map((step, idx) => (
            <div key={idx} className="relative group">
              <div className="glass-card p-10 rounded-[2.5rem] h-full border-white/5 group-hover:border-blue-500/20 transition-all text-center">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-[10px] font-black mx-auto mb-8 text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xl">
                  {idx + 1}
                </div>
                <h4 className="text-xs font-black mb-4 uppercase tracking-[0.2em] text-white">{step}</h4>
                <p className="text-gray-500 text-[11px] leading-relaxed font-bold uppercase tracking-widest">
                  {idx === 0 && "Submit professional profile review."}
                  {idx === 1 && "Complete 15-min assessment."}
                  {idx === 2 && "Choose your industry vertical."}
                  {idx === 3 && "Finalize industrial reservation."}
                  {idx === 4 && "Access brand Slack & Onboard."}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Brand Ecosystem Info Section */}
        <div className="max-w-5xl mx-auto mb-32">
          <div className="p-12 md:p-16 bg-[#080808] border border-white/5 rounded-[3rem] relative overflow-hidden group">
             {/* Large faint icon on the right */}
             <div className="absolute top-1/2 right-0 -translate-y-1/2 p-8 opacity-[0.03] pointer-events-none">
               <svg className="w-48 h-48 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
             </div>

             <h3 className="text-2xl md:text-3xl font-heading font-bold mb-6 text-white uppercase tracking-tight">Early & Growth Stage Brands</h3>
             <p className="text-gray-400 text-base md:text-lg mb-10 leading-relaxed max-w-3xl">
               These include startups and growing businesses that need execution support across operations, marketing, and systems.
             </p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 mb-12">
                {[
                  "Fashion & Apparel brands",
                  "Food & Beverage brands",
                  "Consumer Product companies",
                  "D2C and E-commerce businesses",
                  "Tech & SaaS (Software as a Service)"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />
                    {item}
                  </div>
                ))}
             </div>

             <div className="border-t border-white/[0.03] pt-8">
               <p className="text-blue-500 text-[11px] font-black uppercase tracking-[0.3em] leading-loose">
                 Participants contribute to live business functions, not observation tasks.
               </p>
             </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="max-w-4xl mx-auto pt-20 border-t border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 uppercase tracking-tight">Common Inquiries</h2>
            <p className="text-gray-500 text-sm">Everything you need to know about the STJUFENDS immersion standard.</p>
          </div>
          
          <div className="space-y-16">
            {FAQ_CATEGORIES.map((category, catIdx) => (
              <div key={catIdx} className="space-y-6">
                <h3 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                  <span className="h-[1px] flex-1 bg-blue-500/20" />
                  {category.title}
                  <span className="h-[1px] flex-1 bg-blue-500/20" />
                </h3>
                <div className="space-y-4">
                  {category.items.map((faq, idx) => (
                    <details key={idx} className="group glass-card rounded-[2rem] p-8 border-white/5 cursor-pointer transition-all hover:border-white/10">
                      <summary className="flex justify-between items-center list-none font-bold text-gray-200 uppercase tracking-[0.15em] text-xs">
                        {faq.question}
                        <span className="text-blue-500 group-open:rotate-180 transition-transform ml-4 shrink-0">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </summary>
                      <div className="mt-6 text-gray-500 text-[13px] leading-relaxed font-medium uppercase tracking-wider animate-in fade-in slide-in-from-top-2">
                        {faq.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
