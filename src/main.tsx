import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './hooks/useAuth';
import App from './App';
import './styles/index.css';
import { initFacebookSDK } from './utils/facebook';

// Initialize Facebook SDK with the configured app ID
initFacebookSDK(import.meta.env.VITE_FACEBOOK_APP_ID);
import { initFacebookSDK } from './utils/facebook';

// Initialize Facebook SDK with the configured app ID
initFacebookSDK(import.meta.env.VITE_FACEBOOK_APP_ID);
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);