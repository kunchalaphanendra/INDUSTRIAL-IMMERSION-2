
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
    password: '',
    studentType: 'school' as StudentType 
  });
  
  // Timer State for OTP Verification
  const [timer, setTimer] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer Effect
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        // 1. Check if user email exists in industrial records (skip for admin)
        const exists = await apiService.checkUserExists(formData.email);
        if (!exists) {
          setError("Access Denied: No industrial profile found for this email. Please apply first.");
          setLoading(false);
          return;
        }

        // 2. Perform Password Login
        const res = await apiService.login(formData.email, formData.password);
        if (res.success && res.user) {
          localStorage.setItem('ii_token', res.token || '');
          localStorage.setItem('ii_user', JSON.stringify({
            ...res.user,
            studentType: formData.studentType 
          }));
          onSuccess(res.user);
        } else {
          setError(res.error || 'Authentication failed. Check your password.');
        }
      } else {
        // 3. Perform Sign Up
        const res = await apiService.signUp(formData.email, formData.password, formData.fullName);
        if (res.success) {
          // Trigger OTP for verification
          await apiService.sendOtp(formData.email);
          setNeedsVerification(true);
          setTimer(60); 
        } else {
          setError(res.error || 'Registration failed.');
        }
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
      localStorage.setItem('ii_token', res.token || '');
      localStorage.setItem('ii_user', JSON.stringify({
        ...res.user,
        studentType: formData.studentType 
      }));
      onSuccess(res.user);
    } else {
      setError(res.error || 'Invalid verification code.');
    }
    setLoading(false);
  };

  const resendOtp = async () => {
    setLoading(true);
    const res = await apiService.sendOtp(formData.email);
    if (res.success) {
      setTimer(60);
      setError(null);
    } else {
      setError("Failed to resend. Try again later.");
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

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] text-center font-bold uppercase tracking-widest leading-relaxed">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-6">
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Legal Name</label>
                    <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all text-xs" />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Student Category</label>
                    <div className="grid grid-cols-2 gap-4">
                      {(['school', 'college'] as StudentType[]).map(type => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({...formData, studentType: type})}
                          className={`py-3 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${formData.studentType === type ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all text-xs" />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Access Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all text-xs" />
              </div>

              <button disabled={loading} className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl uppercase tracking-[0.3em] text-[10px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50">
                {loading ? "Processing..." : (isLogin ? 'Grant Access' : 'Create Profile')}
              </button>
            </form>

            <div className="mt-10 text-center pt-8 border-t border-white/5">
              <button onClick={() => { setIsLogin(!isLogin); setError(null); }} className="text-[9px] text-gray-500 hover:text-white font-black uppercase tracking-[0.3em]">
                {isLogin ? "Apply for New Profile" : "Existing Member? Sign In"}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-3xl font-heading font-black mb-4 text-white uppercase tracking-tighter">Verify Email</h2>
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest mb-10 leading-relaxed">
              Industrial verification code transmitted to <br />
              <span className="text-blue-500">{formData.email}</span>
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[9px] font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <div className="flex justify-between gap-3 mb-10">
              {otp.map((digit, idx) => (
                <input key={idx} ref={el => { otpRefs.current[idx] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleOtpChange(idx, e.target.value)} className="w-full h-12 bg-white/5 border border-white/10 rounded-xl text-center text-lg font-bold text-white focus:border-blue-500 outline-none transition-all" />
              ))}
            </div>

            <button onClick={() => performVerification(otp.join(''))} disabled={loading} className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all">
              {loading ? "Verifying..." : "Confirm Code"}
            </button>

            <div className="mt-10 pt-8 border-t border-white/5">
              {timer > 0 ? (
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                  Resend Sequence in <span className="text-blue-500 neon-text-blue">{timer}s</span>
                </p>
              ) : (
                <button 
                  onClick={resendOtp} 
                  disabled={loading}
                  className="text-[10px] text-blue-500 hover:text-white font-black uppercase tracking-[0.3em] transition-colors"
                >
                  Resend OTP
                </button>
              )}
            </div>
            
            <button onClick={() => setNeedsVerification(false)} className="mt-6 text-[8px] text-gray-700 hover:text-gray-400 font-bold uppercase tracking-widest">
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
























