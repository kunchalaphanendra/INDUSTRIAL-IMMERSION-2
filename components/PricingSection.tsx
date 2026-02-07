
import React from 'react';
import { ENROLLMENT_STEPS, FAQS } from '../constants';

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

        {/* FAQ Section */}
        <div id="faq" className="max-w-3xl mx-auto pt-20 border-t border-white/5">
          <h2 className="text-3xl font-heading font-bold text-center mb-12 uppercase tracking-tight">Common Inquiries</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group glass-card rounded-3xl p-8 border-white/5 cursor-pointer">
                <summary className="flex justify-between items-center list-none font-bold text-gray-200 uppercase tracking-widest text-sm">
                  {faq.question}
                  <span className="text-blue-500 group-open:rotate-180 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-6 text-gray-500 text-xs leading-relaxed font-medium uppercase tracking-widest">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;


