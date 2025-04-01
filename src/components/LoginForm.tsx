import React from 'react';
import { Mail, Lock, ArrowRight, Wand2, Facebook, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SuccessModal } from './SuccessModal';
import { useFireworks } from '../hooks/useFireworks';
import { sendMagicCode, verifyMagicCode } from '../utils/auth';

interface LoginFormProps {
  isCodeLogin: boolean;
  setIsCodeLogin: (isCode: boolean) => void;
  codeSent: boolean;
  setCodeSent: (sent: boolean) => void;
  isRegistering: boolean;
  setIsRegistering: (isRegistering: boolean) => void;
  setIsForgotPassword: (forgot: boolean) => void;
  buttonWrapperRef: React.RefObject<HTMLDivElement>;
  onShowAuth: (mode: 'login' | 'signup' | 'magic' | 'google' | 'facebook') => void;
  createSparkles: (e: React.MouseEvent) => void;
  launchFireworks: () => void;
}

export function LoginForm({
  isCodeLogin,
  setIsCodeLogin,
  codeSent,
  setCodeSent,
  isRegistering,
  setIsRegistering,
  setIsForgotPassword,
  buttonWrapperRef,
  onShowAuth,
  createSparkles,
  launchFireworks
}: LoginFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const { login } = useAuth();
  const [magicEmail, setMagicEmail] = React.useState('');
  const [verificationCode, setVerificationCode] = React.useState(['', '', '', '', '', '']);
  const [signupStep, setSignupStep] = React.useState<'form' | 'verify' | 'password'>('form');
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '' 
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { email, password, firstName, lastName } = formData;
      
      // Handle signup flow
      if (isRegistering) {
        if (signupStep === 'form') {
          // Validate form data
          if (!firstName || !lastName || !email) {
            throw new Error('Please fill in all fields');
          }
          
          // Send verification code
          await sendMagicCode(email);
          setSignupStep('verify');
          setIsLoading(false);
          return;
        }
        
        if (signupStep === 'verify') {
          // Verify code
          const code = verificationCode.join('');
          await verifyMagicCode(email, code);
          setSignupStep('password');
          setIsLoading(false);
          return;
        }
        
        if (signupStep === 'password') {
          // Create account with password
          if (!password || !formData.confirmPassword) {
            throw new Error('Please enter and confirm your password');
          }
          
          if (password !== formData.confirmPassword) {
            throw new Error('Passwords do not match');
          }

          // Show success message with fireworks
          setShowSuccess(true);
          launchFireworks();
          
          // In a real app, this would call an API to create the account
          await login({ email, password });
          
          // Redirect to dashboard after a delay
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
          return;
        }
      }

      // Special case for owner login
      if (email === 'dallas@prophone.io' && password === 'owner') {
        await login({ email, password });
        launchFireworks();
        setShowSuccess(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
        return;
      }

      // Handle magic code login
      if (isCodeLogin && !codeSent) {
        setMagicEmail(email);
        // Send magic code regardless of auth method
        await sendMagicCode(email);
        setCodeSent(true);
        setIsLoading(false);
        return;
      }
      
      // Handle code verification
      if (codeSent) {
        const code = verificationCode.join('');
        const userData = await verifyMagicCode(magicEmail, code);
        
        // Log in user directly after code verification
        await login({ email: userData.email, password: 'magic-code' });
        setShowSuccess(true);
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
        return;
      }

      // Regular password login
      await login({ email, password });
      setShowSuccess(true);
      launchFireworks();
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : typeof err === 'object' && err && 'message' in err
          ? String(err.message)
          : 'Authentication failed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <SuccessModal 
            onClose={() => {}} 
            message="Successfully signed in!" 
          />
        </div>
      )}
      <div className="space-y-4">
        {(!codeSent) && (
          <>
            {isRegistering && signupStep === 'form' && (
              <>
                <div className="relative group animate-slide-down">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-black/60 group-focus-within:text-black transition-colors" />
                  </div>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#B38B3F]/20 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
                    required
                  />
                </div>
                <div className="relative group animate-slide-down">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-black/60 group-focus-within:text-black transition-colors" />
                  </div>
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#B38B3F]/20 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
                    required
                  />
                </div>
              </>
            )}
            {((!isRegistering || signupStep === 'form') && !codeSent) && (
              <div className="relative group animate-slide-down">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                 <Mail className="h-5 w-5 text-black/60 group-focus-within:text-black transition-colors" />
               </div>
               <input
                 name="email"
                 type="email"
                 placeholder="Email address"
                 value={formData.email}
                 onChange={handleInputChange}
                 className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#B38B3F]/20 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
                 required
               />
             </div>
            )}
          </>
        )}
        
        {/* Password input for login and final signup step */}
        {(!isCodeLogin && !codeSent && !isRegistering) || (isRegistering && signupStep === 'password') ? (
          <div className="relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-black/60 group-focus-within:text-black transition-colors" />
            </div>
            <input
              name="password"
              type="password"
              placeholder={isRegistering ? "Create Password" : "Password"}
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#B38B3F]/20 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
              required
            />
            {isRegistering && signupStep === 'password' && (
              <div className="mt-4 relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-black/60 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#B38B3F]/20 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
                  required
                />
              </div>
            )}
          </div>
        ) : null}

        {/* Verification code input */}
        {isRegistering && signupStep === 'verify' && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-[#B38B3F] text-base font-medium mb-1">
                Enter verification code
              </div>
              <div className="text-white/70 text-sm">
                Code sent to {formData.email}
              </div>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  pattern="\d"
                  inputMode="numeric"
                  value={verificationCode[i]}
                  className="w-full aspect-square text-center text-2xl font-mono bg-white/90 border border-[#B38B3F]/20 rounded-lg text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
                  onKeyDown={(e) => {
                    if (e.key === 'Backspace' && !e.currentTarget.value) {
                      const prev = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (prev) {
                        prev.focus();
                        prev.select();
                        const newCode = [...verificationCode];
                        newCode[i - 1] = '';
                        setVerificationCode(newCode);
                      }
                    }
                  }}
                  onInput={(e) => {
                    const input = e.currentTarget;
                    const next = input.nextElementSibling as HTMLInputElement;
                    
                    const value = input.value.replace(/\D/g, '');
                    const newCode = [...verificationCode];
                    newCode[i] = value;
                    setVerificationCode(newCode);
                    
                    if (value && next && i < 5) {
                      next.focus();
                      next.select();
                    }
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-[#FF6B6B] text-sm font-medium flex items-center">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex justify-center mt-4 magic-button-wrapper" ref={buttonWrapperRef}>
          {!isRegistering && (
            <button
              type="button" 
              onClick={(e) => {
                createSparkles(e);
                launchFireworks();
                onShowAuth('magic');
              }}
              className={`
                  flex items-center space-x-2 px-4 py-2 rounded-xl
                  transition-all duration-300 transform hover:scale-105
                  bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/20 text-[#FFD700]
                  border border-[#B38B3F]/20 hover:border-[#B38B3F]/40
                  group
                `}
            >
              <Wand2 className="w-4 h-4 text-[#FFD700] group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-sm font-medium">
                Use Magic Code
              </span>
           </button>
          )}
        </div>
      </div>

      {!isCodeLogin && !codeSent && !isRegistering && (
        <div className="flex items-center justify-between text-sm mt-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-[#B38B3F]/30 text-[#B38B3F] bg-black/40 focus:ring-[#B38B3F]/50" />
            <span className="text-white/70">Remember me</span>
          </label>
          <button 
            type="button" 
            onClick={() => setIsForgotPassword(true)}
            className="text-white/70 hover:text-[#B38B3F] transition-colors"
          >
            Forgot password?
          </button>
        </div>
      )}

      <button 
        type="submit"
        disabled={isLoading}
        className={`w-full bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] 
          text-black font-medium py-3 px-4 rounded-xl flex items-center justify-center space-x-2 
          transform transition-all duration-500 hover:scale-[1.02] active:scale-[0.98] 
          bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0] transition-[background-position] 
          shadow-lg hover:shadow-xl hover:shadow-[#B38B3F]/20 
          disabled:opacity-50 disabled:cursor-not-allowed ${codeSent ? 'mb-0' : 'mb-4'}`}
      >
        {isLoading ? (
          <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <span>
              {isCodeLogin ? (codeSent ? 'Verify Code' : 'Send Magic Code') : 
               isRegistering ? (
                 signupStep === 'form' ? 'Continue' :
                 signupStep === 'verify' ? 'Verify Email' :
                 'Complete Sign Up'
               ) : 'Sign In'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </div>
        )}
      </button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        {(!isRegistering || signupStep === 'form') && (
          <div className="relative flex justify-center text-sm">
            <span className="px-2 text-white/50 bg-black/60">Or continue with</span>
          </div>
        )}
      </div>

      {(!isRegistering || signupStep === 'form') && (
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => onShowAuth('google')}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200 group relative overflow-hidden"
          >
            <div className="w-5 h-5 relative">
              <svg viewBox="0 0 24 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <span className="text-white">Google</span>
          </button>
          <button
            type="button"
            onClick={() => onShowAuth('facebook')}
            disabled={isLoading}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200 group relative overflow-hidden"
          >
            <Facebook className="w-5 h-5 text-[#1877F2]" />
            <span className="text-white">Facebook</span>
          </button>
        </div>
      )}

      <div className="text-center mt-6">
        <p className="text-white/60 text-sm">
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          {(!isRegistering || signupStep === 'form') && (
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setSignupStep('form');
              }}
              className="text-[#FFD700] hover:text-[#FFD700]/80 transition-colors"
            >
              {isRegistering ? 'Sign in' : 'Sign up'}
            </button>
          )}
        </p>
      </div>
    </form>
  );
}