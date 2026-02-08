
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
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
  const [formData, setFormData] = useState({ email: '', fullName: '' });
  const [resendTimer, setResendTimer] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    if (!isLogin && !formData.fullName) {
      setError("Please provide your full legal name.");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiService.sendOtp(formData.email, isLogin ? undefined : formData.fullName, !isLogin);
      
      if (result.success) {
        setNeedsVerification(true);
        setResendTimer(60);
      } else {
        if (result.error === "ACCOUNT_NOT_FOUND") {
          setError("SESSION REFUSED: THIS EMAIL IS NOT YET REGISTERED.");
        } else if (result.error === "ALREADY_REGISTERED") {
          setError("AUTHORIZATION CONFLICT: PROFILE ALREADY EXISTS.");
        } else {
          setError(result.error || 'AUTHORIZATION SERVER ERROR.');
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

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;
    
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.verifyOtp(formData.email, otpValue);
      if (result.success && result.user && result.token) {
        localStorage.setItem('ii_token', result.token);
        localStorage.setItem('ii_user', JSON.stringify(result.user));
        onSuccess(result.user);
      } else {
        setError(result.error || 'Incorrect code. Check your inbox.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    setError(null);
    const result = await apiService.sendOtp(formData.email, isLogin ? undefined : formData.fullName, !isLogin);
    setLoading(false);
    if (result.success) {
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
    } else {
      setError(result.error || 'Resend failed. Try again in a moment.');
    }
  };

  const isSmtpError = error?.toUpperCase().includes('EMAIL') || error?.toUpperCase().includes('SMTP') || error?.toUpperCase().includes('SERVER ERROR');

  if (needsVerification) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
        <div className="relative bg-[#080808] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.1)]">
            <svg className="w-10 h-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 013 11c0-5.523 4.477-10 10-10s10 4.477 10 10a10.003 10.003 0 01-6.73 9.421" />
            </svg>
          </div>
          <h2 className="text-3xl font-heading font-bold mb-4 text-white uppercase tracking-tight leading-none">Security <br/><span className="text-blue-500">Authorization</span></h2>
          <p className="text-gray-400 mb-10 leading-relaxed font-medium text-[10px] uppercase tracking-[0.2em]">
            Code dispatched to <span className="text-white font-bold">{formData.email}</span>.
          </p>

          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={el => { otpRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleOtpChange(idx, e.target.value)}
                onKeyDown={e => handleOtpKeyDown(idx, e)}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:border-blue-500 outline-none transition-all shadow-inner focus:ring-1 focus:ring-blue-500/50"
              />
            ))}
          </div>

          <div className="space-y-4">
            <button 
              onClick={handleVerifyOtp}
              disabled={loading || otp.some(d => !d)}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Access'}
            </button>
            <button 
              onClick={() => setNeedsVerification(false)}
              className="text-[9px] text-gray-500 hover:text-white font-black uppercase tracking-[0.3em] transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-[#080808] border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        <div className="p-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl mx-auto mb-6 shadow-2xl shadow-blue-500/20">S</div>
            <h2 className="text-3xl font-heading font-bold mb-2 uppercase tracking-tight">
              {isLogin ? 'Member' : 'Join'} <span className="brand-text text-blue-500">STJUFENDS</span>
            </h2>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
              {isLogin ? 'Authorize your existing profile' : 'Initialize your professional identity'}
            </p>
          </div>

          {error && (
            <div className="mb-8 space-y-4 animate-in slide-in-from-top-2">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] text-center font-bold uppercase tracking-widest leading-relaxed">
                {error}
              </div>
              
              {isSmtpError && (
                <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-[2rem] text-[9px] text-blue-400 font-bold leading-loose uppercase tracking-widest">
                  <span className="text-white block mb-3 border-b border-blue-500/30 pb-2">FINAL SUCCESS CHECKLIST:</span>
                  <div className="space-y-2 text-left">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">1.</span>
                      <span>Did you click <span className="text-white bg-green-900/40 px-1 rounded">Save Changes</span> in Supabase?</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">2.</span>
                      <span>Is <span className="text-white underline decoration-blue-500 underline-offset-2">Username</span> set to <span className="text-white">a1d682001@smtp-brevo.com</span>?</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">3.</span>
                      <span>Is <span className="text-white underline decoration-blue-500 underline-offset-2">Password</span> the <span className="text-white italic">Full</span> API Key string?</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-500">4.</span>
                      <span><span className="text-white">Wait 60 seconds</span> for the Supabase rate limit to clear before trying again.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSendOtp} className="space-y-6">
            {!isLogin && (
              <div className="animate-in slide-in-from-top-4 duration-300">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Full Legal Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-800 text-sm font-medium" 
                  placeholder="Legal Name"
                />
              </div>
            )}
            
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1">Professional Email</label>
              <input 
                required 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-800 text-sm font-medium" 
                placeholder="email@example.com"
              />
            </div>

            <button 
              disabled={loading || !formData.email}
              className="w-full py-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-[0.3em] text-[10px] mt-4 flex items-center justify-center group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Authorize Access' : 'Create Profile & Verify'}
                  <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-white/5">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(null); }}
              className="text-[9px] text-gray-500 hover:text-white font-black uppercase tracking-[0.3em] transition-colors"
            >
              {isLogin ? "Initialize Profile" : "Secure Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;




