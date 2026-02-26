
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
          content: (
            <div className="space-y-6">
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">1. Introduction</h2>
                <p>STJUFENDS ("we," "our," or "us") operates an industrial immersion and partnership platform providing execution-based programs for individuals and institutions. This Privacy Policy explains how we collect, use, disclose, and protect personal information when you access our website, dashboards, portals, and related services.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">2. Information We Collect</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Personal Information:</strong> Full name, email, phone number, educational details, and institution affiliation.</li>
                  <li><strong>Institutional Data:</strong> Organization name, business registration, and partnership details.</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, and usage activity via cookies.</li>
                  <li><strong>Payment Data:</strong> Processed via third-party gateways (Razorpay). We do not store full banking details.</li>
                </ul>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">3. How We Use Information</h2>
                <p>We use your data to process enrollments, manage partnerships, calculate commissions, facilitate payments, and improve our industrial immersion ecosystem. We do not sell personal data.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">4. Data Security</h2>
                <p>We implement institutional-grade safeguards to protect your data. However, users are responsible for safeguarding their own login credentials.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">5. Contact</h2>
                <p>For privacy inquiries: contact@stjufends.com</p>
              </section>
            </div>
          )
        };
      case 'terms':
        return {
          title: 'Terms & Conditions',
          content: (
            <div className="space-y-6">
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">1. Introduction</h2>
                <p>These Terms & Conditions govern the use of the STJUFENDS website, dashboards, programs, and partnership services. By accessing our platform, you agree to comply with these terms.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">2. Nature of Services</h2>
                <p>STJUFENDS provides execution-based industrial immersion programs and institutional partnership systems. We do not guarantee employment, job placement, or specific financial returns.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">3. Program Participation</h2>
                <p>Participants must maintain professional conduct, respect confidentiality of partner businesses, and complete assigned deliverables. Failure to comply may result in termination of access.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">4. Intellectual Property</h2>
                <p>All content, frameworks, and branding are owned by STJUFENDS. Participants may not reproduce materials without written consent.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">5. Governing Law</h2>
                <p>These Terms are governed by the laws of India. Disputes shall fall under the jurisdiction of courts in Bangalore.</p>
              </section>
            </div>
          )
        };
      case 'refund':
        return {
          title: 'Refund & Cancellation',
          content: (
            <div className="space-y-6">
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">1. General Policy</h2>
                <p>Program fees are subject to the refund terms outlined below. Refunds are processed only through the original mode of payment.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">2. Individual Programs</h2>
                <p><strong>Before Start:</strong> Requests submitted before official commencement may be eligible for a partial refund after administrative deductions.</p>
                <p><strong>After Start:</strong> Once access to materials or assignments is granted, fees are generally non-refundable.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">3. Non-Refundable Cases</h2>
                <p>Refunds are not provided for change of mind after commencement, failure to complete tasks, or violation of program rules.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">4. Processing Time</h2>
                <p>Approved refunds typically take 7–14 business days to reflect in your account.</p>
              </section>
            </div>
          )
        };
      case 'cookie':
        return {
          title: 'Cookie Policy',
          content: (
            <div className="space-y-6">
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">1. What Are Cookies?</h2>
                <p>Cookies are small text files stored on your device to improve user experience and analyze platform usage.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">2. Usage</h2>
                <p>We use cookies to maintain login sessions, analyze traffic, and secure user interactions. Third-party providers like Razorpay may also use cookies for payment security.</p>
              </section>
              <section>
                <h2 className="text-white font-bold mb-3 uppercase tracking-widest text-sm">3. Management</h2>
                <p>Users may disable cookies via browser settings, though this may affect the functionality of the STJUFENDS dashboard.</p>
              </section>
            </div>
          )
        };
      default:
        return { title: '', content: null };
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
          <div className="text-gray-400 text-sm md:text-base font-medium leading-relaxed">
            {content}
            <div className="pt-12 border-t border-white/5 mt-12">
              <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest">Last Updated: February 26, 2026</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPages;

