
import React, { useState, useEffect } from 'react';
import { EnrollmentState, TrackKey, UserRegistration, StudentType, Institution } from '@/types';
import { TRACKS } from '../constants';
import { apiService } from '../services/api';
import { supabase } from '../lib/supabaseClient';

/**
 * PAYMENT CONFIGURATION
 */
const PAYMENT_TEST_MODE = false;

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
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstId, setSelectedInstId] = useState<string>('');
  const [customInstName, setCustomInstName] = useState<string>('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [agreedToRefund, setAgreedToRefund] = useState(false);
  
  const loggedInUserStr = localStorage.getItem('ii_user');
  const loggedInUser = loggedInUserStr ? JSON.parse(loggedInUserStr) : null;

  const [formData, setFormData] = useState<UserRegistration>({
    fullName: loggedInUser?.fullName || '',
    email: loggedInUser?.email || '',
    phone: '',
    institutionName: '', 
    currentStatus: loggedInUser?.studentType || 'Student',
    careerGoals: '',
    studentType: enrollment.track?.includes('school') ? 'SCHOOL' : ((loggedInUser?.studentType as StudentType) || 'COLLEGE')
  });

  const isSchoolTrack = enrollment.track?.includes('school');

  // TASK 1 & 2: Fetch and Filter Institutions from Supabase
  useEffect(() => {
    const fetchInsts = async () => {
      // Use tier from formData.studentType
      const list = await apiService.fetchVerifiedInstitutions(formData.studentType || 'COLLEGE');
      setInstitutions(list);
      // Reset selection when tier changes
      setSelectedInstId('');
      setCustomInstName('');
    };
    fetchInsts();
  }, [formData.studentType]);

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

  const handlePayment = async () => {
    // TASK 4: Store institution_id during enrollment submit
    let finalInstitutionId: string | null = null;

    if (selectedInstId === 'other') {
      if (!customInstName.trim()) {
        setErrorMessage("Please type your institution name.");
        return;
      }
      // Insert new unverified institution to get a valid ID
      const instRes = await apiService.createInstitution(customInstName.trim(), formData.studentType || 'COLLEGE');
      if (instRes.error) {
        setErrorMessage("Failed to register new institution. Please try again.");
        return;
      }
      finalInstitutionId = instRes.id;
    } else {
      finalInstitutionId = selectedInstId;
    }

    // TASK 5: Validation check before proceeding to payment
    if (!finalInstitutionId) {
      setErrorMessage("Please select your institution.");
      return;
    }

    if (!razorpayKey) { 
      setErrorMessage("Razorpay API Key missing. Please check configuration."); 
      return; 
    }
    
    setIsProcessing(true);
    setErrorMessage(null);

    const options = {
      key: razorpayKey,
      amount: displayPrice * 100, // paise
      currency: "INR",
      name: "STJUFENDS",
      description: `Enrollment: ${trackData.title}`,
      handler: async function (response: any) {
        try {
          // Task 4: Store application with institution_id
          const res = await apiService.submitApplication({
            ...formData,
            institution_id: finalInstitutionId,
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
            setErrorMessage(res.error || "Database sync failed.");
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
      theme: { color: "#2563eb" },
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

  const handleGoToDashboard = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = "/";
      return;
    }
    if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={onClose} />
      <div className="relative bg-[#080808] border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]">
        
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Step {step}: Enrollment</p>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="flex gap-1">
             {[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-white/5'}`} />)}
          </div>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar">
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-bold uppercase text-center tracking-widest leading-relaxed">
              {errorMessage}
            </div>
          )}
          
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Full Name</label>
                    <input disabled value={formData.fullName} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs opacity-50 font-bold" />
                  </div>
                  {!isSchoolTrack && (
                    <div>
                      <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Student Tier *</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setFormData({...formData, studentType: 'SCHOOL'})}
                          className={`flex-1 py-3 px-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${formData.studentType === 'SCHOOL' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10' : 'bg-white/5 border-white/10 text-gray-500'}`}
                        >
                          School
                        </button>
                        <button 
                          onClick={() => setFormData({...formData, studentType: 'COLLEGE'})}
                          className={`flex-1 py-3 px-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${formData.studentType === 'COLLEGE' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/10' : 'bg-white/5 border-white/10 text-gray-500'}`}
                        >
                          College
                        </button>
                      </div>
                    </div>
                  )}
               </div>
               
               {/* TASK 3: Replace Institution Input with Dropdown */}
               <div>
                  <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Educational Institution *</label>
                  <select 
                    value={selectedInstId} 
                    onChange={e => {
                      setSelectedInstId(e.target.value);
                      if (e.target.value !== 'other') setErrorMessage(null);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:border-blue-500 outline-none appearance-none cursor-pointer mb-3 text-white"
                  >
                    <option value="" className="bg-black">Select your institution</option>
                    {institutions.map(inst => (
                      <option key={inst.id} value={inst.id} className="bg-black">
                        {inst.name.toUpperCase()}
                      </option>
                    ))}
                    <option value="other" className="bg-black">My institution not listed</option>
                  </select>

                  {/* TASK 4: Show Manual Input when "Not Listed" selected */}
                  {selectedInstId === 'other' && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <input 
                        required 
                        type="text" 
                        value={customInstName} 
                        onChange={e => setCustomInstName(e.target.value)} 
                        placeholder="Type your institution name..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:border-blue-500 outline-none text-white" 
                      />
                    </div>
                  )}
               </div>

               <div>
                  <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">Contact Number *</label>
                  <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 00000 00000" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:border-blue-500 outline-none text-white" />
               </div>
               <div>
                  <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">
                    {isSchoolTrack ? 'Learning Objectives *' : 'Industrial Goals *'}
                  </label>
                  <textarea rows={3} value={formData.careerGoals} onChange={e => setFormData({...formData, careerGoals: e.target.value})} placeholder={isSchoolTrack ? "What do you hope to achieve?" : "Describe your objectives..."} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs focus:border-blue-500 outline-none resize-none text-white" />
               </div>

               <div className="space-y-3 pt-2">
                 <label className="flex items-start gap-3 cursor-pointer group">
                   <div className="relative flex items-center mt-0.5">
                     <input 
                       type="checkbox" 
                       checked={agreedToTerms}
                       onChange={(e) => setAgreedToTerms(e.target.checked)}
                       className="peer h-4 w-4 appearance-none rounded border border-white/20 bg-white/5 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
                     />
                     <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                     I agree to the <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('nav-view', { detail: 'terms' })); }} className="text-blue-500 hover:underline">Terms & Conditions</button> *
                   </span>
                 </label>

                 <label className="flex items-start gap-3 cursor-pointer group">
                   <div className="relative flex items-center mt-0.5">
                     <input 
                       type="checkbox" 
                       checked={agreedToPrivacy}
                       onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                       className="peer h-4 w-4 appearance-none rounded border border-white/20 bg-white/5 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
                     />
                     <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                     I agree to the <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('nav-view', { detail: 'privacy' })); }} className="text-blue-500 hover:underline">Privacy Policy</button> *
                   </span>
                 </label>
               </div>

               <button 
                onClick={() => {
                  // Task 5: Safety Validation
                  if (!selectedInstId) {
                    setErrorMessage("Please select your institution.");
                    return;
                  }
                  if (selectedInstId === 'other' && !customInstName.trim()) {
                    setErrorMessage("Institution name is required.");
                    return;
                  }
                  if (!agreedToTerms || !agreedToPrivacy) {
                    setErrorMessage("Please agree to the Terms and Privacy Policy.");
                    return;
                  }
                  setStep(2);
                }} 
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
               >
                 Continue to Verification
               </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
               <div className="bg-white/5 p-8 rounded-3xl border border-white/10 group hover:border-blue-500/30 transition-all">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Selected Program</p>
                  <h3 className="text-xl font-heading font-black text-white mb-4 uppercase tracking-tighter">{trackData.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-blue-500 text-4xl font-black">₹{displayPrice.toLocaleString()}</span>
                    <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Program Fee</span>
                  </div>
               </div>
               <button onClick={() => setStep(3)} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl text-[10px] uppercase tracking-widest transition-all">Confirm & Pay</button>
               <button onClick={() => setStep(1)} className="w-full text-[9px] text-gray-600 font-bold uppercase hover:text-white transition-colors">Edit Profile</button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center py-10 animate-in zoom-in">
               <div className="mb-8 opacity-20">
                  <svg className="w-20 h-20 mx-auto text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               </div>
               <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-widest">Secure Checkout</h3>
               <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-8">SSL ENCRYPTED</p>
               
               <div className="mb-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-left">
                 <label className="flex items-start gap-4 cursor-pointer group">
                   <div className="relative flex items-center mt-0.5">
                     <input 
                       type="checkbox" 
                       checked={agreedToRefund}
                       onChange={(e) => setAgreedToRefund(e.target.checked)}
                       className="peer h-5 w-5 appearance-none rounded border border-white/20 bg-white/5 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer" 
                     />
                     <svg className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none left-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                   </div>
                   <div className="flex-1">
                     <p className="text-[11px] font-black text-white uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">Refund Policy Agreement *</p>
                     <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                       I have read and agree to the <button onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('nav-view', { detail: 'refund' })); }} className="text-blue-500 hover:underline">Refund Policy</button> regarding this enrollment.
                     </p>
                   </div>
                 </label>
               </div>

               <button 
                 onClick={() => {
                   if (!agreedToRefund) {
                     setErrorMessage("Please agree to the Refund Policy to proceed.");
                     return;
                   }
                   handlePayment();
                 }} 
                 disabled={isProcessing} 
                 className={`w-full py-6 rounded-2xl text-xl uppercase tracking-[0.2em] shadow-2xl transition-all ${isProcessing ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
               >
                 {isProcessing ? 'Redirecting...' : `Pay ₹${displayPrice}`}
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
               <p className="text-gray-500 mb-10 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                 {isSchoolTrack ? 'Enrollment Complete. Profile Synced.' : 'Verification Complete. Industrial Profile Synced.'}
               </p>
               <button onClick={handleGoToDashboard} className="w-full py-5 bg-white text-black font-black rounded-2xl uppercase tracking-widest hover:bg-gray-200 transition-all">Go to Dashboard</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;





















