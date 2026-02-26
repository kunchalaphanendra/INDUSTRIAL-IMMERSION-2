
import React from 'react';

interface LegalPageProps {
  type: 'privacy' | 'terms' | 'refund' | 'cookie';
  onBack: () => void;
}

const LegalPages: React.FC<LegalPageProps> = ({ type, onBack }) => {
  const getContent = () => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: 'Our Privacy Policy is currently being updated to reflect our commitment to data protection and transparency. Please check back soon for the full text.'
        };
      case 'terms':
        return {
          title: 'Terms & Conditions',
          content: 'Our Terms and Conditions are currently being finalized to ensure a clear and fair agreement for all our participants. Please check back soon for the full text.'
        };
      case 'refund':
        return {
          title: 'Refund Policy',
          content: 'Our Refund Policy is being structured to provide clarity on enrollment cancellations and fee adjustments. Please check back soon for the full text.'
        };
      case 'cookie':
        return {
          title: 'Cookie Policy',
          content: 'Our Cookie Policy is being drafted to explain how we use cookies to enhance your experience on our platform. Please check back soon for the full text.'
        };
      default:
        return { title: '', content: '' };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="pt-32 pb-24 min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={onBack}
          className="mb-12 flex items-center gap-2 text-gray-500 hover:text-white transition-colors group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
        </button>

        <div className="glass-card p-12 md:p-20 rounded-[4rem] border-white/5">
          <h1 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-8">{title}</h1>
          <div className="space-y-8 text-gray-300 text-lg md:text-xl font-medium leading-relaxed">
            <p>{content}</p>
            <div className="pt-12 border-t border-white/5 mt-12">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Last Updated: February 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPages;
