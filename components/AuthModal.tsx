
import React, { useState, useRef, useEffect } from 'react';
import { User, StudentType } from '../types';
import { apiService } from '../services/api';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({ 
    email: '', 
    fullName: '', 
    studentType: 'school' as StudentType 
  });
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const res = await apiService.sendOtp(formData.email, isLogin ? undefined : formData.fullName, !isLogin);
      if (res.success) {
        setNeedsVerification(true);
      } else {
        setError(res.error || 'Gateway Error');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (index === 5 && value) performVerification(newOtp.join(''));
  };

  const performVerification = async (otpValue: string) => {
    setLoading(true);
    const res = await apiService.verifyOtp(formData.email, otpValue);
    if (res.success && res.user) {
      // Store session and metadata locally for persistence
      localStorage.setItem('ii_token', res.token || '');
      localStorage.setItem('ii_user', JSON.stringify({
        ...res.user,
        studentType: formData.studentType // Pass metadata for first-time session
      }));
      onSuccess(res.user);
    } else {
      setError(res.error || 'Invalid code');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#080808] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in duration-300">
        {!needsVerification ? (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl mx-auto mb-6 shadow-2xl shadow-blue-500/20">S</div>
              <h2 className="text-3xl font-heading font-bold mb-2 uppercase tracking-tight text-white">
                {isLogin ? 'Member' : 'Join'} <span className="brand-text text-blue-500">STJUFENDS</span>
              </h2>
            </div>

            {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] text-center font-bold uppercase tracking-widest">{error}</div>}

            <form onSubmit={handleSendOtp} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Legal Name</label>
                    <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none transition-all" />
                  </div>
                  
                  {/* Student Type Selector */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Select Student Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      {(['school', 'college'] as StudentType[]).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, studentType: type})}
                          className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${formData.studentType === type ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
                        >
                          {type} Student
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Professional Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none transition-all" />
              </div>

              <button disabled={loading} className="w-full py-6 bg-blue-600 text-white font-bold rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
                {loading ? "Initializing..." : (isLogin ? 'Authorize Access' : 'Create Profile')}
              </button>
            </form>

            <div className="mt-10 text-center pt-8 border-t border-white/5">
              <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-[9px] text-gray-500 hover:text-white font-black uppercase tracking-[0.3em]">
                {isLogin ? "Request New Profile" : "Existing Member? Login"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold mb-8 text-white uppercase tracking-widest">Verify Email</h2>
            <div className="flex justify-between gap-2 mb-10">
              {otp.map((digit, idx) => (
                <input key={idx} ref={el => { otpRefs.current[idx] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleOtpChange(idx, e.target.value)} className="w-full h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:border-blue-500 outline-none" />
              ))}
            </div>
            <button onClick={() => performVerification(otp.join(''))} className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl uppercase tracking-widest text-xs">Verify Code</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;






















