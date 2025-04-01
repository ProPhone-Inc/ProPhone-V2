import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './hooks/useAuth';
import App from './App';
import './styles/index.css';
import { initFacebookSDK } from './utils/facebook';

// Get Google client ID from environment variables
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Validate Google Client ID format
const isValidGoogleClientId = Boolean(googleClientId && 
  googleClientId !== 'your-google-client-id' && 
  googleClientId !== '' && 
  googleClientId !== 'your-google-client-id-here');

if (!isValidGoogleClientId) {
  console.warn('Valid Google Client ID not found in environment variables. Google Calendar integration will be disabled.');
}

// Initialize Facebook SDK with the configured app ID
initFacebookSDK(import.meta.env.VITE_FACEBOOK_APP_ID);
 
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={isValidGoogleClientId ? googleClientId : 'disabled'}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);