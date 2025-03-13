import React, { useEffect } from 'react';
import { Check, Sparkles, Rocket, Crown } from 'lucide-react';
import { PricingPlan } from './PricingPlan';
import { SuccessModal } from './SuccessModal';
import { usePlans } from '../hooks/usePlans';

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

interface PricingPlansProps {
  onSelect: (planId: string) => void;
  selectedPlan: string | null;
}

export function PricingPlans({ onSelect, selectedPlan }: PricingPlansProps) {
  const { plans, syncWithStripe } = usePlans();
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [fireworksContainer, setFireworksContainer] = React.useState<HTMLDivElement | null>(null);

  // Sync with Stripe on mount
  useEffect(() => {
    syncWithStripe();
  }, [syncWithStripe]);

  const planFeatures = {
    starter: [
      'Basic Marketing Tools',
      'Up to 100 Contacts',
      'Email Support',
      'Basic Analytics',
      'Standard Templates'
    ],
    pro: [
      'Advanced Marketing Tools',
      'Up to 2500 Contacts',
      'Priority Support',
      'Advanced Analytics',
      'Premium Templates',
      'Custom Branding',
      'API Access'
    ],
    enterprise: [
      'Enterprise Marketing Suite',
      'Unlimited Contacts',
      '24/7 Dedicated Support',
      'Custom Analytics',
      'Custom Templates',
      'White Labeling',
      'API Access',
      'Custom Integrations',
      'Dedicated Account Manager'
    ]
  };

  const planIcons = {
    starter: <Sparkles className="w-6 h-6 text-[#FFD700]" />,
    pro: <Rocket className="w-6 h-6 text-[#FFD700]" />,
    enterprise: <Crown className="w-6 h-6 text-[#FFD700]" />
  };

  const planDescriptions = {
    starter: 'Perfect for trying out ProPhone',
    pro: 'Best for growing businesses',
    enterprise: 'For large scale operations'
  };
  React.useEffect(() => {
    // Create fireworks container
    const container = document.createElement('div');
    container.className = 'fixed inset-0 pointer-events-none';
    document.body.appendChild(container);
    setFireworksContainer(container);

    return () => {
      container.remove();
    };
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {showSuccess && (
        <SuccessModal
          onClose={() => {}}
          message="Account Created Successfully! Welcome to ProPhone!"
        />
      )}

      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-transparent bg-clip-text">
          Choose Your Plan
        </h2>
        <p className="text-white/70 mt-2">
          Select the perfect plan for your business needs
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingPlan
            key={plan.id}
            id={plan.id}
            name={plan.name}
            price={plan.price}
            description={planDescriptions[plan.id as keyof typeof planDescriptions]}
            features={planFeatures[plan.id as keyof typeof planFeatures]}
            icon={planIcons[plan.id as keyof typeof planIcons]}
            popular={plan.id === 'pro'}
            selected={selectedPlan === plan.id}
            onSelect={() => {
              // First select the plan
              onSelect(plan.id);
              
              // Show success modal and launch fireworks
              setTimeout(() => {
                setShowSuccess(true);
                launchFireworks();
                
                // Show dashboard after animation
                setTimeout(() => {
                  setShowSuccess(false);
                  window.location.href = '/dashboard';
                }, 3000);
              }, 500);
            }}
          />
        ))}
      </div>
    </div>
  );
}