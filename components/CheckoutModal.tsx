
import React, { useState, useEffect } from 'react';
import { EnrollmentState, TrackKey, UserRegistration, StudentType } from '../types';
import { TRACKS } from '../constants';
import { apiService } from '../services/api';

interface CheckoutModalProps {
  enrollment: EnrollmentState;
  onClose: () => void;
  onComplete?: () => void;
}

declare global { interface Window { Razorpay: any; } }

const getEnvVar = (key: string): string => {
  try { return (import.meta as any).env[key] || ''; } catch { return ''; }
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ enrollment, onClose, onComplete }) => {
  const [step, setStep] = useState(1); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const loggedInUserStr = localStorage.getItem('ii_user');
  const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;

  const [formData, setFormData] = useState<UserRegistration>({
    fullName: loggedInUser?.fullName || '',
    email: loggedInUser?.email || '',
    phone: '',
    currentStatus: loggedInUser?.studentType || 'Student',
    careerGoals: '',
    studentType: loggedInUser?.studentType || 'school'
  });

  if (!enrollment.track) return null;
  const trackData = TRACKS[enrollment.track];
  const razorpayKey = getEnvVar('VITE_RAZORPAY_KEY');

  const handlePayment = () => {
    if (!razorpayKey) { setErrorMessage("Key Missing"); return; }
    setIsProcessing(true);
    const options = {
      key: razorpayKey,
      amount: trackData.price * 100,
      currency: "INR",
      name: "STJUFENDS",
      handler: async function (response: any) {
        const res = await apiService.submitApplication({
          ...formData,
          track: enrollment.track,
          programType: enrollment.track?.includes('school') ? 'school_program' : 'college_program',
          amountPaid: trackData.price,
          paymentId: response.razorpay_payment_id
        });
        if (res.success) setStep(4);
        else setErrorMessage(res.error || "Sync Error");
        setIsProcessing(false);
      },
      prefill: { email: formData.email, contact: formData.phone },
      modal: { ondismiss: () => setIsProcessing(false) }
    };
    new window.Razorpay(options).open();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={onClose} />
      <div className="relative bg-[#080808] border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[95vh] neon-border">
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Step {step}: Enrollment</p>
            <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
          </div>
          <div className="flex gap-1">
             {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-white/5'}`} />)}
          </div>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar">
          {errorMessage && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] uppercase font-bold text-center tracking-widest">{errorMessage}</div>}
          
          {step === 1 && (
            <div className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block">Name</label>
                    <input disabled value={formData.fullName} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs opacity-50" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block">Student Type</label>
                    <input disabled value={formData.studentType?.toUpperCase()} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-black text-blue-500 opacity-80" />
                  </div>
               </div>
               <div>
                  <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block">Phone *</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:border-blue-500 outline-none" />
               </div>
               <div>
                  <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block">Industrial Objectives *</label>
                  <textarea rows={3} value={formData.careerGoals} onChange={e => setFormData({...formData, careerGoals: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:border-blue-500 outline-none resize-none" />
               </div>
               <button onClick={() => setStep(2)} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl">Verify Selection</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
               <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                  <h3 className="text-xl font-heading font-black text-white mb-2">{trackData.title}</h3>
                  <p className="text-blue-500 text-3xl font-black">₹{trackData.price.toLocaleString()}</p>
               </div>
               <button onClick={() => setStep(3)} className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest">Proceed to Payment</button>
               <button onClick={() => setStep(1)} className="w-full text-[9px] text-gray-600 font-bold uppercase hover:text-white">Edit Details</button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10">
               <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-widest">Secure Gateway</h3>
               <button onClick={handlePayment} disabled={isProcessing} className="w-full py-6 bg-blue-600 text-white font-black rounded-2xl text-xl uppercase tracking-[0.2em] shadow-2xl">
                 {isProcessing ? 'Processing...' : `Pay ₹${trackData.price}`}
               </button>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-10">
               <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">✓</div>
               <h3 className="text-3xl font-heading font-black text-white mb-4">Confirmed</h3>
               <p className="text-gray-500 mb-10 text-xs font-bold uppercase tracking-widest leading-relaxed">Identity Verified. Application ID Generated. Industrial Seat Reserved.</p>
               <button onClick={onComplete} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest">Enter Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;


