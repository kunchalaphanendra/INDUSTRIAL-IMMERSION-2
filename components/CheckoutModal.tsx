
import React, { useState } from 'react';
import { EnrollmentState, TrackKey, UserRegistration } from '../types';
import { TRACKS } from '../constants';
import { apiService } from '../services/api';

interface CheckoutModalProps {
  enrollment: EnrollmentState;
  onClose: () => void;
}

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ enrollment, onClose }) => {
  const [step, setStep] = useState(1); // 1: Info, 2: Review, 3: Payment UI, 4: Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UserRegistration>({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    currentStatus: 'Student',
    workExperience: '',
    careerGoals: ''
  });

  if (!enrollment.track) return null;
  const trackData = TRACKS[enrollment.track];
  const razorpayKey = (import.meta as any).env?.VITE_RAZORPAY_KEY || '';
  const isTestMode = razorpayKey.startsWith('rzp_test_');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const validateForm = () => {
    const required = ['fullName', 'email', 'phone', 'currentStatus', 'careerGoals'];
    const missing = required.filter(field => !formData[field as keyof UserRegistration]);
    if (missing.length > 0) {
      setErrorMessage("Please complete all required fields (*)");
      return false;
    }
    return true;
  };

  const handlePayment = () => {
    if (!razorpayKey) {
      setErrorMessage("Configuration Error: Payment Key (VITE_RAZORPAY_KEY) is missing in Vercel.");
      return;
    }

    if (typeof window.Razorpay === 'undefined') {
      setErrorMessage("Payment gateway failed to load. Please check your internet connection.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const options = {
      key: razorpayKey,
      amount: trackData.price * 100, // Amount in paise
      currency: "INR",
      name: "Industrial Immersion",
      description: `${trackData.title} Enrollment`,
      image: "https://via.placeholder.com/128/3b82f6/ffffff?text=II",
      handler: async function (response: any) {
        setIsProcessing(true);
        const submissionResult = await apiService.submitApplication({
          ...formData,
          track: enrollment.track,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature
        });

        if (submissionResult.success) {
          setStep(4);
        } else {
          setErrorMessage("Payment received but profile update failed. Contact support with ID: " + response.razorpay_payment_id);
        }
        setIsProcessing(false);
      },
      prefill: {
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone
      },
      theme: { color: "#2563eb" },
      modal: { ondismiss: () => setIsProcessing(false) }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (err: any) => {
        setErrorMessage(`Payment Failed: ${err.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setErrorMessage("Gateway initialization failed.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={onClose} />
      
      <div className="relative bg-[#080808] border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[95vh] neon-border">
        {/* Header with Mode Indicator */}
        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                {step === 1 && "Phase 01: Profile"}
                {step === 2 && "Phase 02: Verification"}
                {step === 3 && "Phase 03: Settlement"}
                {step === 4 && "Phase 04: Confirmed"}
              </p>
              {razorpayKey && (
                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${isTestMode ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'}`}>
                  {isTestMode ? 'Test Mode' : 'Live Mode'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : 'bg-white/5'}`} />
              ))}
            </div>
          </div>
          <button onClick={onClose} className="ml-6 p-2 hover:bg-white/10 rounded-full transition-colors text-gray-500">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-10 custom-scrollbar">
          {errorMessage && (
            <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] rounded-2xl flex gap-3 items-center">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {errorMessage}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); if (validateForm()) setStep(2); }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Full Legal Name *</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none transition-all" placeholder="Arnav Sharma" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Email *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none" placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Phone *</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none" placeholder="+91" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Status *</label>
                  <select name="currentStatus" value={formData.currentStatus} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none appearance-none">
                    <option value="Student">Student</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Professional">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">LinkedIn</label>
                  <input name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none" placeholder="Optional" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Career Goals *</label>
                <textarea required name="careerGoals" value={formData.careerGoals} onChange={handleInputChange} rows={3} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-blue-500 outline-none resize-none" placeholder="What do you want to achieve?" />
              </div>
              <button type="submit" className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-500/20">Continue to Review</button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
              <div className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-3xl relative overflow-hidden">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-2 tracking-widest">Enrolling in</p>
                <p className="font-heading font-bold text-white text-2xl mb-6">{trackData.title}</p>
                
                {/* Summary Table */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                  <div>
                    <span className="text-gray-600 text-[9px] uppercase font-bold tracking-widest block mb-1">Full Name</span>
                    <span className="text-white text-sm font-medium">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-[9px] uppercase font-bold tracking-widest block mb-1">Email</span>
                    <span className="text-white text-sm font-medium truncate block">{formData.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-[9px] uppercase font-bold tracking-widest block mb-1">Phone</span>
                    <span className="text-white text-sm font-medium">{formData.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 text-[9px] uppercase font-bold tracking-widest block mb-1">Current Status</span>
                    <span className="text-white text-sm font-medium">{formData.currentStatus}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                   <div className="flex flex-col">
                      <span className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Total Payable</span>
                      <span className="text-white font-bold text-3xl">₹{trackData.price.toLocaleString()}</span>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <button onClick={() => setStep(3)} className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-2xl shadow-blue-500/30 text-lg uppercase tracking-widest flex items-center justify-center gap-3">
                  Confirm Details
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </button>
                <button onClick={() => setStep(1)} className="w-full text-[10px] text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-[0.2em]">Edit Information</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-10 animate-in zoom-in duration-300">
               <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto text-blue-500 border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.1)]">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
               </div>
               <div>
                  <h3 className="text-2xl font-bold mb-3 text-white">Secure Checkout</h3>
                  <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                    Powered by <strong>Razorpay</strong>. {isTestMode && <span className="text-yellow-500 font-bold block mt-2">Note: You are in Test Mode. Real payments will not work.</span>}
                  </p>
               </div>
               <button onClick={handlePayment} disabled={isProcessing} className={`w-full py-6 rounded-2xl font-black text-lg flex items-center justify-center gap-4 transition-all ${isProcessing ? 'bg-blue-600/20 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/40'}`}>
                  {isProcessing ? "Connecting..." : `Pay ₹${trackData.price.toLocaleString()}`}
               </button>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-10 animate-in zoom-in duration-700">
              <div className="w-24 h-24 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500 shadow-[0_0_80px_rgba(34,197,94,0.2)]">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-4xl font-heading font-bold mb-4 text-white uppercase tracking-tighter">Cohort Confirmed</h3>
              <p className="text-gray-400 mb-12 text-base max-w-sm mx-auto leading-relaxed">Your application has been received successfully. Welcome to the program.</p>
              <button onClick={onClose} className="w-full py-6 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-all text-xl uppercase tracking-widest shadow-2xl">Return to Site</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
