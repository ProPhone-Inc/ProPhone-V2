import React from 'react';
import { Check, Sparkles, Rocket, Crown } from 'lucide-react';
import { SuccessModal } from './SuccessModal';

const backgroundImage = 'https://dallasreynoldstn.com/wp-content/uploads/2025/02/7FD4503E-BCAE-4AAE-8852-9F7926E959A4.jpeg';

interface PricingPlanCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  selected: boolean;
  isProcessing?: boolean;
  onSelect: () => void;
}

function PricingPlanCard({
  title,
  price,
  description,
  features,
  icon,
  popular,
  selected,
  isProcessing,
  onSelect
}: PricingPlanCardProps) {
  return (
    <div 
      className={`relative p-8 rounded-2xl border transition-all duration-300 transform hover:scale-[1.02] cursor-pointer
        ${selected
          ? 'bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border-[#FFD700] shadow-xl shadow-[#B38B3F]/20'
          : 'bg-black/40 border-[#B38B3F]/20 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/10'
        }
      `}
      onClick={onSelect}
    >
      {popular && (
        <div className="absolute -top-4 -right-4">
          <div className="bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
            Popular
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold text-white">{title}</h3>
          <div className="flex items-baseline mt-1">
            <span className="text-4xl font-bold text-[#FFD700]">{price}</span>
            {price !== 'Free' && (
              <span className="text-white/50 ml-2">/month</span>
            )}
          </div>
        </div>
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#B38B3F]/10 to-[#FFD700]/5 flex items-center justify-center border border-[#B38B3F]/20">
          {icon}
        </div>
      </div>

      <p className="text-white/70 text-lg mb-8">{description}</p>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-base">
            <div className="w-6 h-6 rounded-full bg-[#FFD700]/10 flex items-center justify-center mr-3 flex-shrink-0">
              <Check className="w-4 h-4 text-[#FFD700]" />
            </div>
            <span className="text-white/90">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all duration-300 relative
          bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black
          hover:shadow-lg hover:shadow-[#B38B3F]/20
          transform transition-all duration-500 hover:scale-[1.02] active:scale-[0.98]
          bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0] transition-[background-position]
          ${selected ? 'ring-2 ring-[#FFD700]' : 'opacity-90 hover:opacity-100'} 
          ${isProcessing ? 'cursor-wait' : ''}
        `}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
            <span>Processing...</span>
          </div>
        ) : selected ? (
          'Account Created Successfully ✨'
        ) : (
          `Choose ${title}`
        )}
      </button>
    </div>
  );
}

interface PricingPlansLayoutProps {
  selectedPlan: string | null;
  onSelect: (planId: string) => void;
  onBack: () => void;
  verifiedEmail: string;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export function PricingPlansLayout({ selectedPlan, onSelect, onBack, verifiedEmail, userData }: PricingPlansLayoutProps) {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [fireworksContainer, setFireworksContainer] = React.useState<HTMLDivElement | null>(null);
  const [processingPlan, setProcessingPlan] = React.useState<string | null>(null);

  React.useEffect(() => {
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none z-50';
    document.body.appendChild(container);
    setFireworksContainer(container);
    return () => container.remove();
  }, []);

  const launchFireworks = React.useCallback(() => {
    if (!fireworksContainer) return;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.top = '100%';
        fireworksContainer.appendChild(firework);

        setTimeout(() => {
          const particles = 30;
          const colors = ['#FFD700', '#B38B3F', '#FFFFFF'];
          
          for (let j = 0; j < particles; j++) {
            const particle = document.createElement('div');
            particle.className = 'firework-particle';
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.left = firework.style.left;
            particle.style.top = '50%';
            
            const angle = (j / particles) * 360;
            const velocity = 50 + Math.random() * 50;
            particle.style.setProperty('--tx', `${Math.cos(angle * Math.PI / 180) * velocity}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle * Math.PI / 180) * velocity}px`);
            
            fireworksContainer.appendChild(particle);
          }
        }, 300);
      }, i * 200);
    }
  }, [fireworksContainer]);

  const handlePlanSelect = (planId: string) => {
    onSelect(planId);
    setProcessingPlan(planId);

    setTimeout(() => {
      setShowSuccess(true);
      launchFireworks();
      setProcessingPlan(null);
      
      setTimeout(() => {
        setShowSuccess(false);
        onBack();
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-black">
      {showSuccess && (
        <SuccessModal
          onClose={() => {}}
          message={`Account Created Successfully! Welcome to ProPhone, ${userData?.firstName || verifiedEmail}!`}
        />
      )}

      <div 
        style={{ backgroundImage: `url(${backgroundImage})` }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-100"
      >
        <div className="absolute inset-0 backdrop-blur-[2px] bg-black/25 animated-gradient" />
      </div>
      
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text">
            Choose Your Plan
          </h2>
          <p className="text-white/70 mt-2 text-lg">
            Select the perfect plan for your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PricingPlanCard
            title="Business Starter"
            price="Free"
            description="Start your journey with essential features"
            icon={<Sparkles className="w-8 h-8 text-[#FFD700]" />}
            features={[
              'Basic Marketing Tools',
              'Up to 100 Contacts',
              'Email Support',
              'Basic Analytics',
              'Standard Templates'
            ]}
            popular
            selected={selectedPlan === 'starter'}
            isProcessing={processingPlan === 'starter'}
            onSelect={() => handlePlanSelect('starter')}
          />

          <PricingPlanCard
            title="Business Pro"
            price="$29"
            description="Scale your business with advanced features"
            icon={<Rocket className="w-8 h-8 text-[#FFD700]" />}
            features={[
              'Advanced Marketing Tools',
              'Up to 2500 Contacts',
              'Priority Support',
              'Advanced Analytics',
              'Premium Templates',
              'Custom Branding',
              'API Access'
            ]}
            selected={selectedPlan === 'pro'}
            isProcessing={processingPlan === 'pro'}
            onSelect={() => handlePlanSelect('pro')}
          />

          <PricingPlanCard
            title="Business Elite"
            price="$99"
            description="Ultimate solution for large organizations"
            icon={<Crown className="w-8 h-8 text-[#FFD700]" />}
            features={[
              'Enterprise Marketing Suite',
              'Unlimited Contacts',
              '24/7 Dedicated Support',
              'Custom Analytics',
              'Custom Templates',
              'White Labeling',
              'API Access',
              'Custom Integrations',
              'Dedicated Account Manager'
            ]}
            selected={selectedPlan === 'enterprise'}
            isProcessing={processingPlan === 'enterprise'}
            onSelect={() => handlePlanSelect('enterprise')}
          />
        </div>

        <p className="text-center text-sm text-white/50 mt-8">
          You can change your plan at any time from your account settings
        </p>
      </div>
    </div>
  );
}