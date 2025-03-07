import React from 'react';
import { AuthContainer } from './components/AuthContainer';
import { useAuth } from './hooks/useAuth';
import { PricingPlansLayout } from './components/PricingPlansLayout';
import { Dashboard } from './components/Dashboard/Dashboard';

function App() {
  const [showPricing, setShowPricing] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = React.useState('');
  const [userData, setUserData] = React.useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  // Listen for logout events
  React.useEffect(() => {
    const handleLogout = () => {
      logout();
    };

    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, [logout]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="animate-fade-in duration-300">
        <Dashboard />
      </div>
    );
  }

  return (
    <AuthContainer
      onVerified={(email, data) => {
        setVerifiedEmail(email);
        setUserData(data);
        setShowPricing(true);
      }}
    />
  );
}

export default App;