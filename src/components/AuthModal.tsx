import React from 'react';
import { X, Mail, Lock, ArrowRight, Facebook, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PricingPlans } from './PricingPlans';
import { SuccessModal } from './SuccessModal';
import { handleGoogleAuth, handleFacebookAuth, sendMagicCode, verifyMagicCode } from '../utils/auth';

type AuthMode = 'login' | 'signup' | 'magic' | 'google' | 'facebook';

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: (userData: { id: string; name: string; email: string; avatar?: string }) => void;
}

export function AuthModal({ mode, onClose, onModeChange, onSuccess }: AuthModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);
  const [showPlans, setShowPlans] = React.useState(false);
  const [verifiedEmail, setVerifiedEmail] = React.useState('');
  const [signupEmail, setSignupEmail] = React.useState('');
  const [isEmailSignup, setIsEmailSignup] = React.useState(true);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [magicEmail, setMagicEmail] = React.useState('');
  const [verificationComplete, setVerificationComplete] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState(['', '', '', '', '', '']);
  const formRef = React.useRef<HTMLFormElement>(null);
  const { login } = useAuth();
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  React.useEffect(() => {
    setVerificationCode(['', '', '', '', '', '']);
    setCodeSent(false);
    setShowPlans(false);
    setError('');
  }, [mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  React.useEffect(() => {
    if (mode === 'google' || mode === 'facebook') {
      const handleAuth = async () => {
        setIsEmailSignup(false);
        setIsLoading(true);
        setError('');
        try {
          const userData = await (mode === 'google' ? handleGoogleAuth() : handleFacebookAuth());
          if (userData) {
            setFormData({
              firstName: userData.name.split(' ')[0] || '',
              lastName: userData.name.split(' ')[1] || '',
              email: userData.email,
              password: ''
            });
            setShowPlans(true);
            setVerificationComplete(true);
            setIsLoading(false);
          }
        } catch (err) {
          if (err instanceof Error && !err.message.includes('cancelled')) {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      };
      handleAuth();
    }
  }, [mode, login, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'signup' && isEmailSignup) {
        const { firstName, lastName, email, password } = formData;

        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
          throw new Error('All fields are required');
        }

        if (!codeSent) {
          // Send verification code
          await sendMagicCode(email);
          setMagicEmail(email);
          setSignupEmail(email);
          setCodeSent(true);
          setIsLoading(false);
          return;
        }
        
        if (codeSent) {
          try {
            // Verify code for email signup only
            const code = verificationCode.join('');
            const userData = await verifyMagicCode(magicEmail || signupEmail, code);
            setVerifiedEmail(magicEmail || signupEmail);
            setVerificationComplete(true);
            setShowPlans(true);
            setIsLoading(false);
            return; 
          } catch (err) {
            throw new Error(err instanceof Error ? err.message : 'Invalid verification code');
          }
        }

        if (verificationComplete && !selectedPlan) {
          setError('Please select a plan to continue');
          setIsLoading(false);
          return;
        }

        if (verificationComplete && selectedPlan) {
          const userData = {
            id: Math.random().toString(36).substr(2, 9),
            name: `${firstName.trim()} ${lastName.trim()}`,
            email: verifiedEmail || email,
            plan: selectedPlan
          };

          login(userData);
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            onSuccess(userData);
          }, 1500);
        }
        return;
      }

      if (mode === 'magic') {
        if (!codeSent) {
          const email = formData.email.trim();
          if (!email) {
            throw new Error('Email is required');
          }
          await sendMagicCode(email);
          setMagicEmail(email);
          setSignupEmail(email);
          setCodeSent(true);
          setIsLoading(false);
          return;
        }

        const code = verificationCode.join('');
        const userData = await verifyMagicCode(magicEmail || signupEmail, code);
        login(userData);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onSuccess(userData);
        }, 1500);
        return;
      }

      // Regular login
      const { email, password } = formData;
      if (!email?.trim() || !password?.trim()) {
        throw new Error('All fields are required');
      }

      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email: email,
      };
      
      login(userData);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSuccess(userData);
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
          <SuccessModal 
            onClose={() => {}} 
            message={mode === 'signup' ? 'Account created successfully!' : 'Successfully signed in!'} 
          />
        </div>
      )}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-black/60 rounded-3xl p-8 shadow-2xl transform max-w-sm w-full mx-auto border border-[#B38B3F]/20 backdrop-blur-md transition-all duration-300 ${showSuccess ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center mb-6">
          {mode === 'google' ? (
            <div className="w-12 h-12 relative">
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
          ) : mode === 'facebook' ? (
            <div className="w-12 h-12 bg-[#1877F2] rounded-full flex items-center justify-center">
              <Facebook className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#B38B3F]/20 to-[#FFD700]/20 flex items-center justify-center border border-[#B38B3F]/40">
              {mode === 'magic' ? (
                <svg className="w-6 h-6 text-[#FFD700]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3zm7 14l1 2.5L22.5 21l-2.5 1L19 24.5l-1-2.5L15.5 21l2.5-1L19 17zm-14 0l1 2.5L7.5 21l-2.5 1L4 24.5l-1-2.5L.5 21l2.5-1L4 17z" />
                </svg>
              ) : (
                <Mail className="w-6 h-6 text-[#FFD700]" />
              )}
            </div>
          )}
        </div>

        <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text mb-3">
          {mode === 'signup' ? 'Create Account' : 
           mode === 'magic' ? 'Magic Code Sign In' :
           mode === 'google' ? 'Continue with Google' :
           mode === 'facebook' ? 'Continue with Facebook' : 'Welcome Back'}
        </h3>
        
        <p className="text-center text-white/70 mb-6">
          {mode === 'signup' ? 'Sign up to get started' 
           : mode === 'magic' 
             ? codeSent && !showPlans
               ? `Enter 6-digit verification code sent to ${signupEmail}`
               : 'Sign in with a magic code'
           : mode === 'google' || mode === 'facebook' 
             ? showPlans 
               ? 'Choose your plan to complete signup'
               : `Sign in with your ${mode} account`
           : showPlans
             ? 'Choose your plan to complete signup'
             : 'Sign in to continue to your account'}
        </p>
        
        {(mode === 'google' || mode === 'facebook') ? (
          <div className="text-center space-y-4">
            {showPlans ? (
              <PricingPlans onSelect={setSelectedPlan} selectedPlan={selectedPlan} />
            ) : (
              <>
                <p className="text-white/70 mb-4">
                  Connecting to {mode === 'google' ? 'Google' : 'Facebook'}...
                </p>
                <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin mx-auto" />
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {showPlans ? (
              <PricingPlans onSelect={setSelectedPlan} selectedPlan={selectedPlan} />
            ) : (
              <div className="space-y-4">
                {!codeSent && (
                  <>
                  {mode === 'signup' && (
                    <>
                      <div className="relative group">
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
                      <div className="relative group">
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
                  <div className="relative group">
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
                  
                  {!codeSent && mode !== 'magic' && (
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-black/60 group-focus-within:text-black transition-colors" />
                      </div>
                      <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-3 bg-white/90 border border-[#B38B3F]/20 rounded-xl text-black placeholder-black/60 focus:outline-none focus:ring-2 focus:ring-[#B38B3F]/50 focus:border-transparent transition-all hover:bg-white focus:bg-white focus:text-black"
                        required
                      />
                    </div>
                  )}
                  </>
                )}

                {codeSent && (
                  <div className="relative group space-y-4">
                    <div className="text-center">
                      <div className="text-[#B38B3F] text-base font-medium mb-1">
                        Enter verification code
                      </div>
                      <div className="text-white/70 text-sm">
                        Code sent to {magicEmail || signupEmail}
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

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] 
                text-black font-medium py-3 px-4 rounded-xl 
                flex items-center justify-center space-x-2 
                transform transition-all duration-500 
                hover:scale-[1.02] active:scale-[0.98] 
                bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0] 
                transition-[background-position] shadow-lg 
                hover:shadow-xl hover:shadow-[#B38B3F]/20
                disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden ${codeSent ? 'animate-pulse' : ''}`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'signup' ? 
                      (codeSent ? 'Verify Code' : 'Sign up') : 
                     showPlans ? 'Complete Signup' :
                     mode === 'magic' ?
                      (codeSent ? 'Verify Code' : 'Send Magic Code') :
                     'Sign in'}
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            
            {mode !== 'magic' && !codeSent && mode !== 'signup' && (
              <button
                type="button"
                onClick={() => onModeChange('magic')}
                className="w-full text-center text-white/70 hover:text-[#B38B3F] transition-colors text-sm"
              >
                Use Magic Code Instead
              </button>
            )}
            {showPlans && (
              <div className="text-center text-sm text-white/50 mt-4">
                You can change your plan at any time from your account settings
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}