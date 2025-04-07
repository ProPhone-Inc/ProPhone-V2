import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight, Facebook, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { SocialVerificationModal } from './SocialVerificationModal';
import { handleGoogleAuth, handleFacebookAuth, sendMagicCode, verifyMagicCode } from '../utils/auth';
import { SuccessModal } from './SuccessModal';
import axios from 'axios';

type AuthMode = 'login' | 'signup' | 'magic' | 'google' | 'facebook';

interface AuthModalProps {
  mode: AuthMode;
  onClose: () => void;
  onModeChange: (mode: AuthMode) => void;
  onSuccess: (userData: { id: string; name: string; email: string; avatar?: string }) => void;
}

export function AuthModal({ mode, onClose, onModeChange, onSuccess }: AuthModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState<'google' | 'facebook' | null>(null);



  const [isLoading, setIsLoading] = React.useState(false);
  
  const [codeSent, setCodeSent] = React.useState(false);
  const [showPlans, setShowPlans] = React.useState(false);
  const [verifiedEmail, setVerifiedEmail] = React.useState('');
  const [signupEmail, setSignupEmail] = React.useState('');
  const [isEmailSignup, setIsEmailSignup] = React.useState(false);
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
  const handleSocialAuthClick = (provider: 'google' | 'facebook') => {
    setShowSocialModal(provider);
  };
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
    const { firstName, lastName, email, password } = formData;

    // if (!codeSent) {
    //   // Send verification code
    //   const response = await axios.post(`http://localhost:3000/api/auth/sendemail`, {
    //     email: email,
    //   });
    //   if (response.data == 1) {
    //     setMagicEmail(email);
    //     setSignupEmail(email);
    //     setCodeSent(true);
    //     setIsLoading(false);
    //     setIsLoading(false);
    //   } else if (response.data == 2) {
    //     setError('No Account Were Found');
    //   }
   
     
    //   return;
    // }else if (codeSent) {
    //   try {
    //     // Verify code for email signup only
    //     const code = verificationCode.join('');
    //     const userData = await verifyMagicCode(magicEmail || signupEmail, code);
    //     setVerifiedEmail(magicEmail || signupEmail);
    //     setVerificationComplete(true);
    //     setShowPlans(true);
    //     setIsLoading(false);
    //     return; 
    //   } catch (err) {
    //     setIsLoading(false);
    //     setError('Invalid verification code');
    //     throw new Error(err instanceof Error ? err.message : 'Invalid verification code');
    //   }
    // }
    try {
      if ( isEmailSignup) {
        const { firstName, lastName, email, password } = formData;

        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
          throw new Error('All fields are required');
        }

        if (!codeSent) {
          // Send verification code
          const response = await axios.post(`/api/auth/sendemail`, {
            email: email,
          });
          if (response.data == 1) {
            setMagicEmail(email);
            setSignupEmail(email);
            setCodeSent(true);
            setIsLoading(false);
          } else if (response.data == 2) {
            throw new Error('Email not found');
          }
       
         
          return;
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
      }else{
        if (!codeSent) {
          const email = formData.email.trim();
          if (!email) {
            throw new Error('Email is required');
          }
          // await sendMagicCode(email);
          const response = await axios.post(`/api/auth/sendemail`, {
              email: email,
            });
            if (response.data == 1) {
              setMagicEmail(email);
              setSignupEmail(email);
              setCodeSent(true);
              setIsLoading(false);
            } else if (response.data == 2) {
              setError('Email not found')
              throw new Error('Email not found');
            }
         
          return;
        }
        try {
        const code = verificationCode.join('');
        const userData = await verifyMagicCode(magicEmail || signupEmail, code);
        console.log(userData)
        // sessionStorage.setItem("token", userData.token);
        login(userData);
        // setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onSuccess(userData);
        }, 1500);
      } catch (err) {
        setIsLoading(false);
        setError('Invalid verification code');
        throw new Error(err instanceof Error ? err.message : 'Invalid verification code');
      }
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

  const handleSocialAuthSuccess = () => {
    setShowSocialModal(null);
    setShowSuccess(true);
    
    // Store mock user data in localStorage
    localStorage.setItem('auth_user', JSON.stringify({
      id: Math.random().toString(36).substr(2, 9),
      name: `${showSocialModal === 'google' ? 'Google' : 'Facebook'} User`,
      email: `user@${showSocialModal === 'google' ? 'google' : 'facebook'}.com`,
      role: 'user'
    }));
    
    // Set auth token
    localStorage.setItem('auth_token', 'test-token-' + Math.random().toString(36).substr(2));
    
    // Notify parent component
    onSuccess?.({
      id: Math.random().toString(36).substr(2, 9),
      name: `${showSocialModal === 'google' ? 'Google' : 'Facebook'} User`,
      email: `user@${showSocialModal === 'google' ? 'google' : 'facebook'}.com`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {showSuccess && (
        <SuccessModal onClose={onClose} />
      )}

      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-md transform animate-fade-in">
        <div className="p-6">
          {showSocialModal && (
            <SocialVerificationModal
              provider={showSocialModal}
              onClose={() => setShowSocialModal(null)}
              onVerify={handleSocialAuthSuccess}
              handleGoogleAuth={handleGoogleAuth}
              handleFacebookAuth={handleFacebookAuth}
            />
          )}
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <>
            {mode === 'google' && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4">
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
                <h3 className="text-xl font-bold text-white mb-4">Sign in with Google</h3>
                <p className="text-white/60 mb-6">Click the button below to continue with your Google account</p>
                
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2 mb-4">
                    <span>{error}</span>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => handleSocialAuthClick('google')}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <span>Google</span>
                  )}
                </button>
              </div>
            )}
            
            {mode === 'facebook' && (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#1877F2] rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Sign in with Facebook</h3>
                <p className="text-white/60 mb-6">Click the button below to continue with your Facebook account</p>
                
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2 mb-4">
                    <span>{error}</span>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => handleSocialAuthClick('facebook')}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <span>Facebook</span>
                  )}
                </button>
              </div>
            )}
            
            {mode === 'login' && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Sign in</h3>
                <p className="text-white/60 mb-6">Choose a login method to continue</p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => onModeChange('google')}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200"
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
                    <span className="text-white">Continue with Google</span>
                  </button>
                  
                  <button
                    onClick={() => onModeChange('facebook')}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-white">Continue with Facebook</span>
                  </button>
                </div>
              </div>
            )}
            <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' &&  (
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Create Account</h3>
                <p className="text-white/60 mb-6">Choose a signup method to continue</p>
                
                <div className="space-y-4">
                  <button
                    onClick={() => onModeChange('google')}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200"
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
                    <span className="text-white">Sign up with Google</span>
                  </button>
                  
                  <button
                    onClick={() => onModeChange('facebook')}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200"
                  >
                    <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-white">Sign up with Facebook</span>
                  </button>
                </div>
              </div>
            )}
            
            {mode === 'magic' && !codeSent && (
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-4">Magic Link</h3>
                <p className="text-white/60 mb-6">We'll send you a magic link to sign in instantly</p>
                {error && (
              <div className="text-[#FF6B6B] text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {error}
              </div>
            )}
                
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                      onChange={handleInputChange}
                      name="email"
                    className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                    required
                  />
                  
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-4 mt-2 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Send Magic Link
                  </button>
              
              </div>
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
                          required
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
                    {error && (
              <div className="text-[#FF6B6B] text-sm font-medium flex items-center mt-1 mb-1">
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
                    
                   Verify Code
                  </span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
                  
                  </div>
                  
                )}
</form>
          </>
        </div>
      </div>
    </div>
  );
}