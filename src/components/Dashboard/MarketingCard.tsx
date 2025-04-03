import React from 'react';
import { Zap, ArrowRight, Sparkles, Bolt, Users } from 'lucide-react';
import { useFireworks } from '../../hooks/useFireworks';
import { useAuth } from '../../hooks/useAuth';
import { SettingsModal } from '../SettingsModal';
import { TeamPanelModal } from './TeamPanel/components/TeamPanelModal';

export function MarketingCard() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { launchFireworks } = useFireworks(containerRef);
  const [isHovered, setIsHovered] = React.useState(false);
  const [showSparkles, setShowSparkles] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showTeamPanelLocal, setShowTeamPanelLocal] = React.useState(false);

  // Create sparkle effect
  const createSparkle = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Create multiple sparkles
    for (let i = 0; i < 8; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'absolute w-2 h-2 bg-[#FFD700] rounded-full pointer-events-none';
      sparkle.style.left = `${x}px`;
      sparkle.style.top = `${y}px`;
      sparkle.style.transform = `rotate(${(i / 8) * 360}deg)`;
      sparkle.style.animation = 'sparkleOut 0.8s ease-out forwards';
      
      containerRef.current.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative z-0 bg-gradient-to-br from-[#B38B3F]/30 to-[#FFD700]/10 rounded-xl p-6 overflow-hidden border border-[#B38B3F]/20 transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/10 group"
      onMouseEnter={() => {
        setIsHovered(true);
        setShowSparkles(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowSparkles(false);
      }}
      onMouseMove={createSparkle}
    >
      {/* Animated background effects */}
      <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#FFD700]/10 rounded-full blur-xl"></div>
      <div className="absolute right-10 bottom-10 w-16 h-16 bg-[#B38B3F]/20 rounded-full blur-lg"></div>
      
      {/* Floating bolts */}
      <div className="absolute top-4 right-8 animate-float-slow">
        <Bolt className="w-4 h-4 text-[#FFD700]" />
      </div>
      <div className="absolute top-12 right-16 animate-float-slower">
        <Bolt className="w-3 h-3 text-[#FFD700]" />
      </div>
      
      {/* Sparkles */}
      {showSparkles && (
        <>
          <div className="absolute top-2 left-2 animate-sparkle-1">
            <Sparkles className="w-3 h-3 text-[#FFD700]" />
          </div>
          <div className="absolute bottom-4 right-8 animate-sparkle-2">
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
          </div>
          <div className="absolute top-8 right-4 animate-sparkle-3">
            <Sparkles className="w-3 h-3 text-[#FFD700]" />
          </div>
        </>
      )}
      
      <div className="relative">
        <div 
          className={`w-12 h-12 rounded-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] flex items-center justify-center shadow-lg mb-4 transition-transform duration-300 ${
            isHovered ? 'scale-110' : ''
          }`}
        >
          <Zap className="w-6 h-6 text-black" />
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 relative">
          Want To Remove Ads Or Add Members To Your Team?
          {/* Gradient underline */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700] to-[#B38B3F]/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
        </h3>
        
        <p className="text-white/70 mb-4">
          Support the platform by upgrading your experience. Remove all ads for just $10/month, or add team members for $5/month each. Every dollar helps us build better tools for you.
        </p>
        
        <button 
          onClick={(e) => {
            launchFireworks(e);
            // If user wants to add team members, show team panel directly
            if (e.currentTarget.getAttribute('data-action') === 'team') {
              setShowTeamPanelLocal(true);
            } else {
              setShowSettings(true);
            }
          }}
          data-action="upgrade"
          className="w-full bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black font-medium py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transform transition-all duration-500 hover:scale-[1.02] bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0] shadow-lg hover:shadow-[#FFD700]/20 relative overflow-hidden group"
        >
          {/* Button shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <span className="relative z-10">Upgrade Now</span>
          <Users className="w-4 h-4 relative z-10" />
          
          {/* Button sparkles */}
          {isHovered && (
            <>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 animate-sparkle-left">
                <Users className="w-4 h-4 text-black/40" />
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 animate-sparkle-right">
                <Users className="w-4 h-4 text-black/40" />
              </div>
            </>
          )}
        </button>
      </div>
      
      {showSettings && (
        <SettingsModal 
          isOpen={showSettings && !showTeamPanelLocal} 
          onClose={() => setShowSettings(false)}
          initialSection="billing"
          setShowTeamPanel={setShowTeamPanelLocal}
        />
      )}
      
      {showTeamPanelLocal && (
        <TeamPanelModal
          isOpen={showTeamPanelLocal}
          onClose={() => {
            setShowTeamPanelLocal(false);
            setShowSettings(false);
          }}
        />
      )}

      {/* Add styles for animations */}
      <style jsx>{`
        @keyframes sparkleOut {
          0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(1) rotate(180deg) translate(50px, -50px);
            opacity: 0;
          }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-slower {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes sparkle-1 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { transform: translate(-10px, -10px) scale(1.2); opacity: 0.7; }
        }
        
        @keyframes sparkle-2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { transform: translate(10px, -15px) scale(1.1); opacity: 0.8; }
        }
        
        @keyframes sparkle-3 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 1; }
          50% { transform: translate(-5px, -5px) scale(1.15); opacity: 0.9; }
        }
        
        @keyframes sparkle-left {
          0% { transform: translateX(-100%) rotate(-45deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(0) rotate(0deg); opacity: 0; }
        }
        
        @keyframes sparkle-right {
          0% { transform: translateX(100%) rotate(45deg); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateX(0) rotate(0deg); opacity: 0; }
        }
        
        .animate-float-slow {
          animation: float-slow 3s ease-in-out infinite;
        }
        
        .animate-float-slower {
          animation: float-slower 4s ease-in-out infinite;
        }
        
        .animate-sparkle-1 {
          animation: sparkle-1 2s ease-in-out infinite;
        }
        
        .animate-sparkle-2 {
          animation: sparkle-2 2.5s ease-in-out infinite;
        }
        
        .animate-sparkle-3 {
          animation: sparkle-3 3s ease-in-out infinite;
        }
        
        .animate-sparkle-left {
          animation: sparkle-left 1s ease-out forwards;
        }
        
        .animate-sparkle-right {
          animation: sparkle-right 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
