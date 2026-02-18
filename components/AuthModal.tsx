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
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);
  const [testPassword, setTestPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [formData, setFormData] = useState({ email: '', fullName: '' });
  const [resendTimer, setResendTimer] = useState(0);
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Test account details
  const TEST_EMAIL = 'test@stjufends.com';
  const ADMIN_EMAIL = 'admin@stjufends.com';
  const TEST_PASS = 'stjufends2026';

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleSendOtp = async (e?: React.FormEvent, isResend: boolean = false) => {
    if (e) e.preventDefault();
    if (!formData.email) return;

    const lowerEmail = formData.email.toLowerCase();
    
    // Check for test or admin account bypass
    if (lowerEmail === TEST_EMAIL || lowerEmail === ADMIN_EMAIL) {
      setIsTestMode(true);
      setNeedsVerification(true);
      return;
    }

    if (!isLogin && !formData.fullName) {
      setError("Please provide your full legal name.");
      return;
    }
    
    if (isResend) {
      setResending(true);
    } else {
      setLoading(true);
    }
    setError(null);
    setResendSuccess(false);
    
    try {
      const useSignup = isResend ? false : !isLogin;
      const result = await apiService.sendOtp(formData.email, isLogin ? undefined : formData.fullName, useSignup);
      
      if (result.success) {
        setNeedsVerification(true);
        setResendTimer(60);
        setOtp(['', '', '', '', '', '']);
        if (isResend) {
          setResendSuccess(true);
          setTimeout(() => setResendSuccess(false), 5000);
        }
      } else {
        if (result.error === "ACCOUNT_NOT_FOUND") {
          setError("SESSION REFUSED: EMAIL NOT REGISTERED.");
        } else if (result.error === "ALREADY_REGISTERED") {
          setError("ALREADY_REGISTERED"); 
        } else if (result.error?.includes("rate limit") || result.error?.includes("limit exceeded")) {
          setError("EMAIL RATE LIMIT EXCEEDED");
        } else {
          setError(result.error?.toUpperCase() || 'ERROR SENDING CONFIRMATION EMAIL');
        }
      }
    } catch (err: any) {
      setError(err.message.toUpperCase());
    } finally {
      setLoading(false);
      setResending(false);
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

  const handleTestLogin = () => {
    if (testPassword === TEST_PASS) {
      const lowerEmail = formData.email.toLowerCase();
      const isAdmin = lowerEmail === ADMIN_EMAIL;
      
      const testUser: User = {
        id: isAdmin ? 'admin-bypass-id' : 'test-user-id',
        email: lowerEmail,
        fullName: isAdmin ? 'System Administrator' : 'Test User (Internal)',
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${isAdmin ? 'admin' : 'test'}`,
        isAdmin: isAdmin
      };
      
      localStorage.setItem('ii_token', 'test-token-bypass');
      localStorage.setItem('ii_user', JSON.stringify(testUser));
      onSuccess(testUser);
    } else {
      setError("INVALID PRIVATE ACCESS KEY.");
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

  const isRateLimitError = error === "EMAIL RATE LIMIT EXCEEDED";
  const isSmtpError = error?.includes('CONFIRMATION') || error?.includes('SMTP') || error?.includes('MAIL') || isRateLimitError;
  const isAlreadyRegistered = error === "ALREADY_REGISTERED";

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
          
          <h2 className="text-3xl font-heading font-bold mb-4 text-white uppercase tracking-tight leading-none">
            {isTestMode ? 'Private Access' : 'Security Access'}
          </h2>
          <p className="text-gray-400 mb-8 text-[10px] uppercase tracking-[0.2em]">
            {isTestMode ? 'Bypass enabled for sensitive accounts' : `Authenticating ${formData.email}`}
          </p>

          {error && !isAlreadyRegistered && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {resendSuccess && (
            <div className="mb-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-500 text-[10px] font-bold uppercase tracking-widest animate-in slide-in-from-top-2">
              New Access Code Sent Successfully
            </div>
          )}

          {isTestMode ? (
            <div className="space-y-6">
              <input 
                type="password"
                placeholder="Enter Private Access Key"
                value={testPassword}
                onChange={(e) => setTestPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTestLogin()}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none transition-all text-center tracking-widest"
              />
              <button 
                onClick={handleTestLogin}
                className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
              >
                Access Account
              </button>
              <button 
                onClick={() => { setNeedsVerification(false); setIsTestMode(false); setError(null); }}
                className="text-[9px] text-gray-500 hover:text-white uppercase tracking-widest font-black"
              >
                Cancel Bypass
              </button>
            </div>
          ) : (
            <>
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

              <div className="space-y-8">
                <button 
                  onClick={handleVerifyClick} 
                  disabled={loading}
                  className="w-full py-5 bg-blue-600 text-white font-bold rounded-2xl uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all disabled:bg-blue-600/50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Confirm Access Code"}
                </button>

                <div className="pt-8 border-t border-white/5 space-y-5">
                  <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                    Didn't receive the email? Check spam or resend below.
                  </p>
                  <div className="flex flex-col items-center gap-4">
                    {resendTimer > 0 ? (
                      <div className="px-6 py-2 bg-white/5 rounded-full border border-white/5">
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                          Resend in <span className="text-blue-500">{resendTimer}s</span>
                        </p>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleSendOtp(undefined, true)}
                        disabled={loading || resending}
                        className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-blue-500 hover:text-blue-400 font-black rounded-xl uppercase tracking-[0.2em] transition-all disabled:opacity-50"
                      >
                        {resending ? "Sending New Code..." : "Resend Code Now"}
                      </button>
                    )}
                    
                    <button 
                      onClick={() => { setNeedsVerification(false); setError(null); }}
                      className="text-[9px] text-gray-500 hover:text-white uppercase tracking-widest font-black transition-colors"
                    >
                      Change Email Address
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="relative bg-[#080808] border border-white/10 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
          {/* Email Already Registered Popup Overlay */}
          {isAlreadyRegistered && (
            <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-md p-10 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
               <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mb-8 text-red-500 border border-red-500/20">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
               </div>
               <h3 className="text-2xl font-heading font-black text-white mb-4 uppercase tracking-tighter">Identity Conflict</h3>
               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-10 max-w-xs mx-auto">
                 The email <span className="text-white">{formData.email}</span> is already tied to an existing STJUFENDS profile.
               </p>
               <div className="space-y-4 w-full">
                  <button 
                    onClick={() => { setIsLogin(true); setError(null); }}
                    className="w-full py-5 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
                  >
                    Continue to Login
                  </button>
                  <button 
                    onClick={() => setError(null)}
                    className="w-full py-4 text-gray-500 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors"
                  >
                    Use different email
                  </button>
               </div>
            </div>
          )}

          <div className="p-10 overflow-y-auto custom-scrollbar">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center font-bold text-white text-3xl mx-auto mb-6 shadow-2xl shadow-blue-500/20">S</div>
              <h2 className="text-3xl font-heading font-bold mb-2 uppercase tracking-tight">
                {isLogin ? 'Member' : 'Join'} <span className="brand-text text-blue-500">STJUFENDS</span>
              </h2>
            </div>

            {error && !isAlreadyRegistered && (
              <div className="mb-8 space-y-4 animate-in slide-in-from-top-2">
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] text-center font-bold uppercase tracking-widest leading-relaxed">
                  {error}
                </div>
                
                {isSmtpError && (
                  <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-[2rem] text-[9px] text-blue-400 font-bold leading-loose uppercase tracking-widest">
                    <span className="text-white block mb-3 border-b border-blue-500/30 pb-2 text-center underline decoration-blue-500 decoration-2 underline-offset-4 font-black tracking-[0.2em]">
                      MISMATCH DETECTED
                    </span>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <p className="text-red-400 font-black border-l-2 border-red-500 pl-3 uppercase">Supabase Configuration Error</p>
                        <p className="text-white normal-case font-medium leading-relaxed italic">Your screenshot shows a major mismatch. Brevo will block your emails if this isn't fixed:</p>
                        
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-4">
                          <div className="space-y-1">
                            <span className="text-gray-500 uppercase text-[7px] font-black">Current Setting (Wrong):</span>
                            <div className="bg-red-500/10 p-2 rounded border border-red-500/20 font-mono text-red-500 text-[8px]">
                              Sender: stjufends@gmail.com
                            </div>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-green-500 uppercase text-[7px] font-black">Change To (Correct):</span>
                            <div className="bg-green-500/10 p-2 rounded border border-green-500/20 font-mono text-green-500 text-[8px]">
                              Sender: social@stjufends.com
                            </div>
                            <p className="text-[7px] text-gray-500 normal-case mt-1">※ This must match your verified Brevo sender exactly.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <p className="text-blue-400 font-black border-l-2 border-blue-500 pl-3 uppercase">Domain Propagation</p>
                        <p className="text-gray-400 normal-case font-medium">I see you've switched Nameservers to Vercel. <span className="text-white">This is correct!</span></p>
                        <p className="text-white normal-case text-[8px] italic leading-relaxed">It is currently in "Propagation". It can take 2-12 hours for the "Invalid Configuration" to turn green. You just need to wait for the world to update.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={(e) => handleSendOtp(e)} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Full Legal Name</label>
                  <input required type="text" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none transition-all" />
                </div>
              )}
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1">Professional Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-blue-500 outline-none transition-all" />
                {(formData.email.toLowerCase() === TEST_EMAIL || formData.email.toLowerCase() === ADMIN_EMAIL) && (
                  <p className="text-[8px] text-blue-500 font-black uppercase tracking-widest mt-2 animate-pulse">Special Account Detected: Private Key mode activated</p>
                )}
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





















