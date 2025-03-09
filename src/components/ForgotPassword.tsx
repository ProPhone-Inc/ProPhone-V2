import React from 'react';
import { Mail, Lock, Key, ArrowLeft, Send } from 'lucide-react';

interface ForgotPasswordProps {
  resetStep: 'email' | 'code' | 'password';
  setResetStep: (step: 'email' | 'code' | 'password') => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  cooldownTime: number;
  setCooldownTime: (time: number) => void;
  error: string;
  setError: (error: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showSuccess: boolean;
  setShowSuccess: (show: boolean) => void;
  setShowSuccessModal: (show: boolean) => void;
  setIsForgotPassword: (forgot: boolean) => void;
}

export function ForgotPassword({
  resetStep,
  setResetStep,
  resetEmail,
  setResetEmail,
  cooldownTime,
  setCooldownTime,
  error,
  setError,
  isLoading,
  setIsLoading,
  showSuccess,
  setShowSuccess,
  setShowSuccessModal,
  setIsForgotPassword,
}: ForgotPasswordProps) {
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (resetStep === 'email') {
      const email = (e.currentTarget as HTMLFormElement).email.value;
      if (!email) {
        setError('Please enter your email address to begin the reset process');
        return;
      }
      setError('');
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetEmail(email);
      setCooldownTime(30);
      setResetStep('code');
      setIsLoading(false);
      // Slide animation
      if (formRef.current) {
        formRef.current.style.transform = 'translateX(-50%) scale(0.9)';
        formRef.current.style.opacity = '0';
        setTimeout(() => {
          formRef.current!.style.transform = 'translateX(0) scale(1)';
          formRef.current!.style.opacity = '1';
        }, 50);
      }
    } else if (resetStep === 'code') {
      const inputs = Array.from(formRef.current?.querySelectorAll('input') || []);
      const code = inputs.map(input => input.value).join('');
      if (!/^\d{6}$/.test(code)) {
        setError('Please enter the 6-digit verification code sent to your email');
        return;
      }
      setError('');
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetStep('password');
      setIsLoading(false);
      if (formRef.current) {
        formRef.current.style.transform = 'translateX(-50%) scale(0.9)';
        formRef.current.style.opacity = '0';
        setTimeout(() => {
          formRef.current!.style.transform = 'translateX(0) scale(1)';
          formRef.current!.style.opacity = '1';
        }, 50);
      }
    } else {
      const form = e.currentTarget as HTMLFormElement;
      const newPassword = form.newPassword.value;
      const confirmPassword = form.confirmPassword.value;

      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setError('');
      setIsLoading(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setShowSuccessModal(true);
        setShowSuccess(true);
        
        setTimeout(() => {
          setShowSuccessModal(false);
          setShowSuccess(false);
          setIsForgotPassword(false);
          setResetStep('email');
          setResetEmail('');
          setError('');
        }, 2000);
      } catch (err) {
        setError('Failed to reset password. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form className="space-y-6 transition-transform duration-300" ref={formRef} onSubmit={handleResetSubmit}>
      <div className="space-y-4">
        {resetStep === 'email' && (
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-black/60 group-focus-within:text-black transition-colors" />
            </div>
            <div className="absolute -top-6 left-0 text-[#B38B3F] text-sm font-medium">
              Enter your email address
            </div>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#B38B3F]/20 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
              required
            />
            {error && (
              <div className="mt-2 text-[#FF6B6B] text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
            {cooldownTime > 0 && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60">
                {cooldownTime}s
              </div>
            )}
          </div>
        )}

        {resetStep === 'code' && (
          <div className="relative group">
            <div className="absolute -top-6 left-0 text-[#B38B3F] text-sm font-medium">
              Enter 6-digit verification code
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  pattern="\d"
                  inputMode="numeric"
                  className="w-full aspect-square text-center text-2xl font-mono bg-white/90 border border-[#B38B3F]/20 rounded-lg text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !e.currentTarget.value) {
                      const prev = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (prev) {
                        prev.focus();
                        prev.select();
                      }
                    }
                  }}
                  onInput={(e) => {
                    const input = e.currentTarget;
                    const next = input.nextElementSibling as HTMLInputElement;
                    
                    // Only allow numbers
                    input.value = input.value.replace(/\D/g, '');
                    
                    if (input.value && next) {
                      next.focus();
                      next.select();
                    }
                  }}
                />
              ))}
            </div>
            {error && (
              <div className="mt-2 text-[#FF6B6B] text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  if (cooldownTime === 0) {
                    setCooldownTime(30);
                    setIsLoading(true);
                    setTimeout(() => setIsLoading(false), 1000);
                  }
                }}
                disabled={cooldownTime > 0}
                className="text-[#B38B3F] hover:text-[#FFD700] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cooldownTime > 0 
                  ? `Wait ${cooldownTime}s to resend code` 
                  : "Didn't receive code? Send again"}
              </button>
            </div>
            <button 
              type="button"
              onClick={() => {
                setResetStep('email');
                if (formRef.current) {
                  formRef.current.style.transform = 'translateX(100%)';
                  setTimeout(() => {
                    formRef.current!.style.transform = 'translateX(0)';
                  }, 50);
                }
              }}
              disabled={cooldownTime > 0}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        )}

        {resetStep === 'password' && (
          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-black/60 group-focus-within:text-black transition-colors" />
              </div>
              <div className="absolute -top-6 left-0 text-[#B38B3F] text-sm font-medium">
                Create new password
              </div>
              <input
                name="newPassword"
                type="password"
                placeholder="Enter new password"
                className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#B38B3F]/20 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
                required
              />
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-black/60 group-focus-within:text-black transition-colors" />
              </div>
              <input
                name="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#B38B3F]/20 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
                required
              />
            </div>
            {error && (
              <div className="mt-2 text-[#FF6B6B] text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`space-y-4 ${error ? 'mt-4' : 'mt-8'}`}>
        <button
          type="submit" 
          disabled={resetStep === 'email' && cooldownTime > 0}
          className={`
            w-full bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] 
            text-black font-medium py-3 px-4 rounded-xl 
            flex items-center justify-center space-x-2 
            transform transition-all duration-500 
            hover:scale-[1.02] active:scale-[0.98] 
            bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0] 
            transition-[background-position] shadow-lg 
            hover:shadow-xl hover:shadow-[#B38B3F]/20
            disabled:opacity-50 disabled:cursor-not-allowed
            relative overflow-hidden
          `}
        >
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F]">
              <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {showSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F]">
              <span className="flex items-center font-medium">
                Your password has been securely updated
                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </span>
            </div>
          )}
          <span className={isLoading || showSuccess ? 'invisible' : ''}>
            {resetStep === 'email'
              ? cooldownTime > 0
                ? `Wait ${cooldownTime}s to resend`
                : 'Send Reset Code'
              : resetStep === 'code'
              ? 'Verify Code'
              : 'Reset Password'}
          </span>
          <Send className="w-5 h-5 ml-2" />
        </button>

        <button
          type="button"
          onClick={() => {
            setIsForgotPassword(false);
            setResetStep('email');
            setCodeSent(false);
            setResetEmail('');
            setCooldownTime(0);
            setError('');
            setIsLoading(false);
            setShowSuccess(false);
          }}
          className="w-full py-2 text-white/70 hover:text-[#B38B3F] transition-colors text-sm"
        >
          Back to Sign In
        </button>
      </div>
    </form>
  );
}