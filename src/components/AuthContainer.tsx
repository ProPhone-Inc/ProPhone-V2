import React from 'react';
import { Mail, Lock, Key, ArrowLeft, Wand2, Send } from 'lucide-react';
import { ForgotPassword } from './ForgotPassword';
import { AuthModal } from './AuthModal';
import { LoginForm } from './LoginForm';
import { SuccessModal } from './SuccessModal';
import { useFireworks } from '../hooks/useFireworks';
import { useMagicSparkles } from '../hooks/useMagicSparkles';
import { useAuth } from '../hooks/useAuth';

const backgroundImage = 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/7FD4503E-BCAE-4AAE-8852-9F7926E959A4.jpeg';
const logoUrl = 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/26F25F1E-C8E9-4DE6-BEE2-300815C83882.png';

interface TeamInviteData {
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AuthContainerProps {
  onVerified: (email: string, userData: { firstName: string; lastName: string; email: string }) => void;
  teamInviteData?: {
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

export function AuthContainer({ onVerified, teamInviteData }: AuthContainerProps) {
  const [isCodeLogin, setIsCodeLogin] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);
  const [isForgotPassword, setIsForgotPassword] = React.useState(false);
  const [resetStep, setResetStep] = React.useState<'email' | 'code' | 'password'>('email');
  const [cooldownTime, setCooldownTime] = React.useState(0);
  const [resetEmail, setResetEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [isRegistering, setIsRegistering] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<'login' | 'signup' | 'magic' | 'google' | 'facebook'>('login');

  const resetAllStates = () => {
    setIsCodeLogin(false);
    setCodeSent(false);
    setResetStep('email');
    setResetEmail('');
    setCooldownTime(0);
    setError('');
    setIsLoading(false);
    setShowSuccess(false);
    setShowSuccessModal(false);
  };
  
  const { isAuthenticated, user } = useAuth();
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const buttonWrapperRef = React.useRef<HTMLDivElement>(null);
  
  const { launchFireworks } = useFireworks(containerRef);
  const { createSparkles } = useMagicSparkles(buttonWrapperRef);

  React.useEffect(() => {
    let timer: number;
    if (cooldownTime > 0) {
      timer = window.setInterval(() => {
        setCooldownTime(time => Math.max(0, time - 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldownTime]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black" ref={containerRef}>
      {showSuccessModal && (
        <SuccessModal 
          onClose={() => setShowSuccessModal(false)} 
          message={isAuthenticated ? `Welcome back, ${user?.name}!` : undefined}
        />
      )}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onModeChange={setAuthMode}
          onSuccess={(userData) => {
            if (userData) {
              setShowAuthModal(false);
              setShowSuccessModal(true);
              launchFireworks();
            }
          }}
        />
      )}

      <div 
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
      >
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/25 animated-gradient" />
      </div>

      <div className="relative w-full max-w-md p-8">
        <div className="relative bg-black/60 rounded-3xl p-8 shadow-2xl border border-[#B38B3F]/20 transform transition-all duration-500 hover:scale-[1.02] hover:border-[#B38B3F]/40 hover:shadow-[#B38B3F]/10 hover:shadow-2xl">
          <div className="absolute inset-0 backdrop-blur-md rounded-3xl pointer-events-none" />
          <div className="relative">
            <div className="space-y-8">
              <div className="text-center -mt-8 -mx-8 mb-8">
                <img 
                  src={logoUrl} 
                  alt="Logo" 
                  className="w-40 h-40 mx-auto object-contain drop-shadow-[0_0_15px_rgba(179,139,63,0.2)]"
                />
                <div className="-mt-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text">
                    {isForgotPassword ? 'Reset Password' : isRegistering ? 'Welcome To ProPhone' : 'Welcome Back'}
                  </h1>
                  <p className="text-white/70 mt-2 mb-8 max-w-[280px] mx-auto leading-relaxed text-sm">
                    {isForgotPassword 
                      ? resetStep === 'email'
                        ? 'Enter your email to receive a reset code'
                        : resetStep === 'code'
                        ? 'Enter the code sent to your email'
                        : 'Create your new password'
                      : isCodeLogin 
                        ? 'Sign in with a magic code'
                        : isRegistering
                          ? teamInviteData
                            ? `Welcome to the team! Complete your account setup to join as ${teamInviteData.role}`
                            : "Unlock Your Exclusive Marketing Suite! Create Your FREE Account to Begin! 🚀"
                          : 'Sign In to Continue Elevating Your Brand 💎'}
                  </p>
                </div>
              </div>

              {isForgotPassword ? (
                <ForgotPassword
                  resetStep={resetStep}
                  setResetStep={setResetStep}
                  resetEmail={resetEmail}
                  setResetEmail={setResetEmail}
                  cooldownTime={cooldownTime}
                  setCooldownTime={setCooldownTime}
                  error={error}
                  setError={setError}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  showSuccess={showSuccess}
                  setShowSuccess={setShowSuccess}
                  setShowSuccessModal={setShowSuccessModal}
                  setIsForgotPassword={(value) => {
                    if (!value) {
                      resetAllStates();
                    }
                    setIsForgotPassword(value);
                  }}
                />
              ) : (
                <LoginForm
                  isCodeLogin={isCodeLogin}
                  setIsCodeLogin={setIsCodeLogin}
                  codeSent={codeSent}
                  setCodeSent={setCodeSent}
                  setIsForgotPassword={setIsForgotPassword}
                  buttonWrapperRef={buttonWrapperRef}
                  isRegistering={isRegistering}
                  setIsRegistering={setIsRegistering}
                  onShowAuth={(mode) => {
                    setAuthMode(mode);
                    setShowAuthModal(true);
                  }}
                  onVerified={(email, userData) => {
                    onVerified(email, userData);
                  }}
                  createSparkles={createSparkles}
                  launchFireworks={launchFireworks}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}