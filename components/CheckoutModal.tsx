
import React, { useState, useEffect } from 'react';
import { EnrollmentState, TrackKey, UserRegistration, StudentType } from '../types';
import { TRACKS } from '../constants';
import { apiService } from '../services/api';

/**
 * TEST MODE CONFIGURATION
 * -----------------------
 * Set to true for ₹1 payments (Testing).
 * Set to false for live production prices.
 * 
 * IMPORTANT: To use Razorpay Test Mode properly, ensure your 
 * VITE_RAZORPAY_KEY environment variable is set to a Test Key (starts with rzp_test_).
 */
const PAYMENT_TEST_MODE = true;

interface CheckoutModalProps {
  enrollment: EnrollmentState;
  onClose: () => void;
  onComplete?: () => void;
}

declare global { interface Window { Razorpay: any; } }

const getEnvVar = (key: string): string => {
  try { return (import.meta as any).env['VITE_RAZORPAY_KEY'] || ''; } catch { return ''; }
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

  if (!enrollment.track || !TRACKS[enrollment.track]) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/98" onClick={onClose} />
        <div className="relative bg-[#080808] border border-red-500/20 p-10 rounded-3xl text-center">
          <p className="text-red-500 font-bold uppercase tracking-widest text-xs">Invalid Program Selection</p>
          <button onClick={onClose} className="mt-4 text-gray-500 hover:text-white text-[10px] uppercase font-black">Close</button>
        </div>
      </div>
    );
  }

  const trackData = TRACKS[enrollment.track];
  const displayPrice = PAYMENT_TEST_MODE ? 1 : trackData.price;
  const razorpayKey = getEnvVar('VITE_RAZORPAY_KEY');

  const handlePayment = () => {
    if (!razorpayKey) { 
      setErrorMessage("Razorpay API Key (VITE_RAZORPAY_KEY) is missing in environment."); 
      return; 
    }
    
    setIsProcessing(true);
    setErrorMessage(null);

    const options = {
      key: razorpayKey,
      amount: displayPrice * 100, // paise
      currency: "INR",
      name: "STJUFENDS",
      description: `${PAYMENT_TEST_MODE ? '[TEST] ' : ''}Enrollment: ${trackData.title}`,
      handler: async function (response: any) {
        try {
          const res = await apiService.submitApplication({
            ...formData,
            track: enrollment.track,
            programType: enrollment.track?.includes('school') ? 'school_program' : 'college_program',
            amountPaid: displayPrice,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature
          });
          
          if (res.success) {
            setStep(4);
          } else {
            setErrorMessage(res.error || "Failed to sync application.");
          }
        } catch (err: any) {
          setErrorMessage(err.message || "An unexpected error occurred.");
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: { 
        name: formData.fullName,
        email: formData.email, 
        contact: formData.phone 
      },
      theme: { color: PAYMENT_TEST_MODE ? "#ef4444" : "#2563eb" },
      modal: { 
        ondismiss: () => setIsProcessing(false) 
      }
    };
    
    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (resp: any) {
      setErrorMessage(`Payment Failed: ${resp.error.description}`);
      setIsProcessing(false);
    });
    rzp.open();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={onClose} />
      <div className="relative bg-[#080808] border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        {/* Test Mode Banner */}
        {PAYMENT_TEST_MODE && (
          <div className="bg-red-600/20 text-red-500 py-2 text-[9px] font-black uppercase tracking-[0.4em] text-center border-b border-red-500/20 animate-pulse">
            ⚠️ Payment Test Mode Active — ₹1 Simulation
          </div>
        )}
        
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Step {step}: Enrollment</p>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex gap-1">
             {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? (PAYMENT_TEST_MODE ? 'bg-red-500' : 'bg-blue-600') : 'bg-white/5'}`} />)}
          </div>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-bold uppercase text-center tracking-widest">
              {errorMessage}
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Identity</label>
                    <input disabled value={formData.fullName} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs opacity-50 font-bold" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Tier</label>
                    <input disabled value={formData.studentType?.toUpperCase()} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-[10px] font-black text-blue-500 opacity-80" />
                  </div>
               </div>
               <div>
                  <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Contact Number *</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 00000 00000" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:border-blue-500 outline-none" />
               </div>
               <div>
                  <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Industrial Goals *</label>
                  <textarea rows={3} value={formData.careerGoals} onChange={e => setFormData({...formData, careerGoals: e.target.value})} placeholder="Describe your objectives..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:border-blue-500 outline-none resize-none" />
               </div>
               <button onClick={() => setStep(2)} className={`w-full py-5 ${PAYMENT_TEST_MODE ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all`}>Continue to Verification</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
               <div className={`bg-white/5 p-8 rounded-3xl border ${PAYMENT_TEST_MODE ? 'border-red-500/20' : 'border-white/10'} group hover:border-blue-500/30 transition-all`}>
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Selected Program</p>
                  <h3 className="text-xl font-heading font-black text-white mb-4 uppercase tracking-tighter">{trackData.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className={`${PAYMENT_TEST_MODE ? 'text-red-500' : 'text-blue-500'} text-4xl font-black`}>₹{displayPrice.toLocaleString()}</span>
                    <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                      {PAYMENT_TEST_MODE ? 'Test Environment Price' : 'Program Fee'}
                    </span>
                  </div>
                  {PAYMENT_TEST_MODE && (
                    <p className="mt-4 text-[8px] text-red-500/60 font-black uppercase tracking-widest leading-relaxed">
                      Note: Real amounts are bypassed. Only ₹1 will be charged for gateway testing.
                    </p>
                  )}
               </div>
               <button onClick={() => setStep(3)} className={`w-full py-5 ${PAYMENT_TEST_MODE ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all`}>Confirm to Proceed</button>
               <button onClick={() => setStep(1)} className="w-full text-[9px] text-gray-600 font-bold uppercase hover:text-white transition-colors">Edit Application Profile</button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-in zoom-in">
               <div className="mb-8 opacity-20">
                  <svg className={`w-20 h-20 mx-auto ${PAYMENT_TEST_MODE ? 'text-red-500' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               </div>
               <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Secure Settlement</h3>
               <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8">
                 {PAYMENT_TEST_MODE ? 'SIMULATED TRANSACTION' : 'ENCRYPTED TRANSACTION'}
               </p>
               <button 
                 onClick={handlePayment} 
                 disabled={isProcessing} 
                 className={`w-full py-6 rounded-2xl text-xl uppercase tracking-[0.2em] shadow-2xl transition-all ${isProcessing ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : (PAYMENT_TEST_MODE ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700') + ' text-white'}`}
               >
                 {isProcessing ? 'Syncing...' : `Pay ₹${displayPrice}`}
               </button>
               <p className="mt-8 text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em]">Institutional Grade Encryption (Razorpay)</p>
            </div>
          )}

          {step === 4 && (
            <div className="text-center py-10 animate-in zoom-in">
               <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8 text-green-500">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
               </div>
               <h3 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">Seat Secured</h3>
               <p className="text-gray-500 mb-10 text-[10px] font-bold uppercase tracking-widest leading-relaxed">Verification Complete. Industrial Profile Synced.</p>
               <button onClick={onComplete} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest hover:bg-gray-200 transition-all">Go to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;





