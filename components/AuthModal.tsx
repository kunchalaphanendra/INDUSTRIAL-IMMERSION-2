
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
          setError("SESSION REFUSED: EMAIL NOT REGISTERED.");
        } else if (result.error === "ALREADY_REGISTERED") {
          setError("CONFLICT: PROFILE ALREADY EXISTS.");
        } else {
          setError(result.error?.toUpperCase() || 'SMTP GATEWAY TIMEOUT.');
        }
      }
    } catch (err: any) {
      setError(err.message.toUpperCase());
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
    
    // Auto-verify if last digit entered
    if (index === 5 && value) {
      const finalOtp = newOtp.join('');
      if (finalOtp.length === 6) {
        setTimeout(() => performVerification(finalOtp), 100);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const performVerification = async (otpValue: string) => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiService.verifyOtp(formData.email, otpValue);
      if (result.success && result.user && result.token) {
        localStorage.setItem('ii_token', result.token);
        localStorage.setItem('ii_user', JSON.stringify(result.user));
        onSuccess(result.user);
      } else {
        setError(result.error || 'The code entered is invalid or has expired.');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyClick = () => {
    const otpValue = otp.join('');
    if (otpValue.length === 6) {
      performVerification(otpValue);
    } else {
      setError("Please enter the full 6-digit code.");
    }
  };

  const isSmtpError = error?.includes('CONFIRMATION') || error?.includes('SMTP') || error?.includes('MAIL');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
      
      {needsVerification ? (
        <div className="relative bg-[#080808] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.1)]">
            <svg className="w-10 h-10 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 013 11c0-5.523 4.477-10 10-10s10 4.477 10 10a10.003 10.003 0 01-6.73 9.421" />
            </svg>
          </div>
          <h2 className="text-3xl font-heading font-bold mb-4 text-white uppercase tracking-tight leading-none">Security Access</h2>
          <p className="text-gray-400 mb-8 text-[10px] uppercase tracking-[0.2em]">Authenticating {formData.email}</p>

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="flex justify-between gap-2 mb-10">
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
                disabled={loading}
                className="w-full h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:border-blue-500 outline-none transition-all disabled:opacity-50"
              />
            ))}
          </div>

          <button 
            onClick={handleVerifyClick} 
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:bg-blue-600/50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Confirm Access Code"}
          </button>
          
          <div className="mt-8">
            <button 
              onClick={() => { setNeedsVerification(false); setError(null); }}
              className="text-[9px] text-gray-500 hover:text-white font-black uppercase tracking-widest transition-colors"
            >
              Wait, go back to email
            </button>
          </div>
        </div>
      ) : (
        <div className="relative bg-[#080808] border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
          <div className="p-10">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl mx-auto mb-6 shadow-2xl shadow-blue-500/20">S</div>
              <h2 className="text-3xl font-heading font-bold mb-2 uppercase tracking-tight">
                {isLogin ? 'Member' : 'Join'} <span className="brand-text text-blue-500">STJUFENDS</span>
              </h2>
            </div>

            {error && (
              <div className="mb-8 space-y-4 animate-in slide-in-from-top-2">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] text-center font-bold uppercase tracking-widest leading-relaxed">
                  {error}
                </div>
                
                {isSmtpError && (
                  <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-[2rem] text-[9px] text-blue-400 font-bold leading-loose uppercase tracking-widest">
                    <span className="text-white block mb-3 border-b border-blue-500/30 pb-2 text-center underline decoration-blue-500 decoration-2 underline-offset-4 font-black tracking-[0.2em]">SMTP AUTHENTICATION GUIDE:</span>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <span className="text-blue-500 font-black">1.</span>
                        <p>In <span className="text-white">Brevo</span>, go to <span className="text-white">Senders, Domains & IPs</span> → <span className="text-white">Senders</span>. Click <span className="text-white font-bold">"Add a sender"</span> and verify <span className="text-blue-500 underline font-black">info@stjufends.com</span>. Brevo blocks all unverified senders.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-blue-500 font-black">2.</span>
                        <p>In <span className="text-white">Supabase</span>, toggle <span className="text-white">"Enable custom SMTP"</span> to <span className="text-red-500">OFF</span>, Save, then back to <span className="text-green-500">ON</span>. This force-refreshes the connection.</p>
                      </div>
                      <div className="flex gap-3">
                        <span className="text-blue-500 font-black">3.</span>
                        <p><span className="text-white font-bold italic">Wait for the 60s cooldown</span>. If you click too fast, Supabase returns the SMTP error even if you fixed the settings!</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSendOtp} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Legal Name</label>
                  <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none transition-all" />
                </div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthModal;










