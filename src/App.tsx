import React, { Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthContainer } from './components/AuthContainer';

const Dashboard = lazy(() => 
  import('./components/Dashboard/Dashboard').then(module => ({ default: module.Dashboard }))
);

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
  </div>
);

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <ErrorBoundary>
      {isAuthenticated ? (
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      ) : (
        <AuthContainer />
      )}
    </ErrorBoundary>
  );
}

export default App;