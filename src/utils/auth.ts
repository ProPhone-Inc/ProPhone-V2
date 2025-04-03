export async function handleGoogleAuth(): Promise<{ id: string; name: string; email: string }> {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    throw new Error('Google client ID not configured');
  }

  const redirectUri = window.location.origin;
  const width = 600;
  const height = 700;
  const left = Math.max(0, (window.innerWidth - width) / 2 + window.screenX);
  const top = Math.max(0, (window.innerHeight - height) / 2 + window.screenY);

  // Construct URL using URLSearchParams for proper encoding
  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: 'openid email profile',
    prompt: 'select_account'
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return new Promise((resolve, reject) => {
    const width = 600;
    const height = 700;
    const left = Math.max(0, (window.innerWidth - width) / 2 + window.screenX);
    const top = Math.max(0, (window.innerHeight - height) / 2 + window.screenY);
    
    const popup = window.open(
      url,
      'google-auth',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );
    
    if (!popup) {
      reject(new Error('Please allow popups for this site to enable social login'));
      return;
    }
    
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      // Only handle plain objects, not Symbols
      if (typeof event.data === 'object' && event.data !== null) {
        const { type, userData, error } = event.data;
        
        if (type === 'GOOGLE_AUTH_SUCCESS' && userData) {
          cleanup();
          resolve(userData);
        } else if (type === 'GOOGLE_AUTH_ERROR') {
          cleanup();
          reject(new Error(error || 'Authentication failed'));
        }
      }
    };
    
    const cleanup = () => {
      clearInterval(checkClosed);
      window.removeEventListener('message', handleMessage);
      if (popup && !popup.closed) popup.close();
    };

    window.addEventListener('message', handleMessage);

    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        cleanup();
        resolve(null);
      }
    }, 1000);

    // Set timeout to prevent hanging
    setTimeout(() => {
      cleanup();
      resolve(null);
    }, 120000); // 2 minutes timeout
  });
}

export async function handleFacebookAuth(): Promise<{ id: string; name: string; email: string }> {
  return new Promise((resolve, reject) => {
    const facebookAppId = import.meta.env.VITE_FACEBOOK_APP_ID;
    if (!facebookAppId) {
      reject(new Error('Facebook app ID not configured'));
      return; 
    }

    // Open a popup for Facebook auth
    const width = 600;
    const height = 700;
    const left = Math.max(0, (window.innerWidth - width) / 2 + window.screenX);
    const top = Math.max(0, (window.innerHeight - height) / 2 + window.screenY);
    
    const redirectUri = window.location.origin;
    const url = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${facebookAppId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=email,public_profile`;
    
    const popup = window.open(
      url,
      'facebook-auth',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );
    
    if (!popup) {
      reject(new Error('Please allow popups for this site to enable social login'));
      return;
    }
    
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'FB_AUTH_SUCCESS' && event.data.userData) {
        cleanup();
        resolve(event.data.userData);
      } else if (event.data.type === 'FB_AUTH_ERROR') {
        cleanup();
        reject(new Error(event.data.error || 'Authentication failed'));
      }
    };
    
    const cleanup = () => {
      clearInterval(checkClosed);
      window.removeEventListener('message', handleMessage);
      if (popup && !popup.closed) popup.close();
    };
    
    window.addEventListener('message', handleMessage);
    
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        cleanup();
        resolve(null);
      }
    }, 1000);
    
    // Set timeout to prevent hanging
    setTimeout(() => {
      cleanup();
      resolve(null);
    }, 120000); // 2 minutes timeout

  });
}

export async function sendMagicCode(email: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Magic code for testing: 123456');
}

export async function verifyMagicCode(email: string, code: string): Promise<{ id: string; name: string; email: string }> {
  const validCode = "123456";
  
  if (!/^\d{6}$/.test(code)) {
    throw new Error('Please enter a valid 6-digit code');
  }
  
  if (code !== validCode) {
    throw new Error('Invalid verification code. For testing, use code: 123456');
  }
  
  // In a real app, this would verify the code with the backend
  // For testing, we'll simulate a successful verification
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: email.split('@')[0],
    email: email
  };
}

/**
 * Register a new user
 * @param userData User registration data
 * @returns The created user object
 */
export async function registerUser(userData: { 
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<{ id: string; name: string; email: string }> {
  // In a real app, this would call the backend API to create the user
  // For testing, we'll simulate a successful registration
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email
  };
}