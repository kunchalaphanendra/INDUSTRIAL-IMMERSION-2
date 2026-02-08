
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
  const [form, setForm] = useState({ email: '', password: '', fullName: '' });
  const [resendTimer, setResendTimer] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const isEmailError = error?.toLowerCase().includes('confirmation email') || error?.toLowerCase().includes('smtp');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        const result = await apiService.signIn(form.email, form.password);
        if (result.success && result.user && result.token) {
          localStorage.setItem('ii_token', result.token);
          localStorage.setItem('ii_user', JSON.stringify(result.user));
          onSuccess(result.user);
        } else {
          setError(result.error || 'Invalid credentials');
        }
      } else {
        const result = await apiService.signUp(form.email, form.password, form.fullName);
        if (result.success) {
          setNeedsVerification(true);
          setResendTimer(60);
        } else {
          setError(result.error || 'Signup failed');
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

    // Focus next
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
      const result = await apiService.verifyOtp(form.email, otpValue);
      if (result.success && result.user && result.token) {
        localStorage.setItem('ii_token', result.token);
        localStorage.setItem('ii_user', JSON.stringify(result.user));
        onSuccess(result.user);
      } else {
        setError(result.error || 'Incorrect code. Please try again.');
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
    const result = await apiService.resendOtp(form.email);
    setLoading(false);
    if (result.success) {
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
    } else {
      setError(result.error || 'Failed to resend code');
    }
  };

  if (needsVerification) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={onClose} />
        <div className="relative bg-[#080808] border border-white/10 w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-500 shadow-[0_0_40px_rgba(37,99,235,0.1)]">
            <svg className="w-10 h-10 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A10.003 10.003 0 013 11c0-5.523 4.477-10 10-10s10 4.477 10 10a10.003 10.003 0 01-6.73 9.421" />
            </svg>
          </div>
          <h2 className="text-3xl font-heading font-bold mb-4 text-white uppercase tracking-tight leading-none">Identity <br/><span className="text-blue-500">Verification</span></h2>
          <p className="text-gray-400 mb-10 leading-relaxed font-medium text-xs uppercase tracking-widest">
            We've dispatched a 6-digit code via <span className="text-blue-400">Brevo Relay</span> to <span className="text-white font-bold">{form.email}</span>.
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

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button 
              onClick={handleVerifyOtp}
              disabled={loading || otp.some(d => !d)}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em] text-[10px] flex items-center justify-center"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Authorization'}
            </button>

            <div className="flex flex-col gap-4 pt-4 border-t border-white/5 mt-6">
              <button 
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="text-[9px] text-gray-500 hover:text-white font-black uppercase tracking-[0.3em] transition-colors disabled:opacity-30"
              >
                {resendTimer > 0 ? `Retry in ${resendTimer}s` : 'Resend Verification Code'}
              </button>
              <button 
                onClick={() => setNeedsVerification(false)}
                className="text-[9px] text-blue-500 hover:text-blue-400 font-black uppercase tracking-[0.3em] transition-colors"
              >
                Back to Account Setup
              </button>
            </div>
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
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl mx-auto mb-6 shadow-2xl shadow-blue-500/20">S</div>
            <h2 className="text-3xl font-heading font-bold mb-2 uppercase tracking-tight">{isLogin ? 'Member Access' : 'Join'} <span className="brand-text text-blue-500">STJUFENDS</span></h2>
            <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{isLogin ? 'Authorize your professional session' : 'Secure your spot in the execution cycle'}</p>
          </div>

          {error && (
            <div className="mb-6 space-y-3">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] text-center font-bold uppercase tracking-widest leading-relaxed">
                {error}
              </div>
              {isEmailError && (
                <div className="p-5 bg-blue-600/5 border border-blue-500/20 rounded-2xl text-[10px] text-blue-400 text-center font-bold leading-relaxed uppercase tracking-widest">
                  <span className="text-blue-500 block mb-2 underline">SMTP Integration Required</span>
                  1. Go to Supabase Dashboard &gt; Auth &gt; Providers &gt; Email<br/>
                  2. Enable SMTP &amp; use Brevo Relay (smtp-relay.brevo.com)<br/>
                  3. Use your Brevo SMTP Key as Password
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  value={form.fullName}
                  onChange={e => setForm({...form, fullName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-700" 
                  placeholder="Legal Full Name"
                />
              </div>
            )}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Work Email</label>
              <input 
                required 
                type="email" 
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-700" 
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Access Pin/Password</label>
              <input 
                required 
                type="password" 
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-blue-500 outline-none transition-all placeholder:text-gray-700" 
                placeholder="••••••••"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 uppercase tracking-[0.2em] text-[10px] mt-4 flex items-center justify-center group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Authorize Access' : 'Create Profile & Verify'}
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/5">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-[9px] text-gray-500 hover:text-white font-black uppercase tracking-[0.3em] transition-colors"
            >
              {isLogin ? "New to STJUFENDS? Build profile" : "Member already? Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;





