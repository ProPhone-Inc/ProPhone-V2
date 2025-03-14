import React from 'react';
import { AuthContainer } from './components/AuthContainer';
import { PricingPlansLayout } from './components/PricingPlansLayout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { useAuth } from './hooks/useAuth';

function App() {
  const [showPricing, setShowPricing] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = React.useState('');
  const [userData, setUserData] = React.useState<{
    firstName: string;
    lastName: string;
    email: string;
  } | null>(null);
  const { isAuthenticated, user, logout } = useAuth();

  // Listen for logout events
  React.useEffect(() => {
    const handleLogout = () => {
      logout();
      window.location.href = '/';
    };

    window.addEventListener('logout', handleLogout);
    return () => window.removeEventListener('logout', handleLogout);
  }, [logout]);

  if (isAuthenticated && user) {
    return <Dashboard />;
  }

  if (showPricing) {
    return (
      <PricingPlansLayout
        selectedPlan={selectedPlan}
        onSelect={(plan) => {
          setSelectedPlan(plan); 
        }}
        onBack={() => setShowPricing(false)}
        verifiedEmail={verifiedEmail}
        userData={userData}
      />
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