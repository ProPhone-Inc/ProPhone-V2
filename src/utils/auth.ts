export async function handleGoogleAuth(): Promise<{ id: string; name: string; email: string }> {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    console.warn('Google client ID not configured, using mock auth');
    return {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Test User',
      email: 'test@example.com'
    };
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
    let popup: Window | null;
    
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

    try {
      popup = window.open(
        url,
        'google-auth',
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
      );
    } catch (error) {
      console.error('Failed to open popup:', error);
      reject(new Error('Failed to open authentication window'));
      return;
    }

    if (!popup) {
      reject(new Error('Please allow popups for this site to enable social login'));
      return;
    }

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
      console.warn('Facebook app ID not configured, using mock auth');
      resolve({
        id: Math.random().toString(36).substr(2, 9),
        name: 'Test User',
        email: 'test@example.com'
      });
      return;
    }

    if (!window.FB) {
      reject(new Error('Facebook SDK not loaded'));
      return;
    }

    window.FB.login((response) => {
      if (response.status === 'connected' && response.authResponse) {
        // In a real app, you would make an API call to get user data
        window.FB.api('/me', { fields: 'id,name,email' }, (userData) => {
          resolve({
            id: response.authResponse.userID,
            name: userData.name || 'Facebook User',
            email: userData.email || `${response.authResponse.userID}@facebook.com`
          });
        });
      } else {
        // User likely cancelled the login, resolve without error
        resolve(null);
      }
    }, { scope: 'public_profile,email' });
  });
}

export async function sendMagicCode(email: string): Promise<void> {
  // In a real app, check if user exists with this email first
  // For demo, we'll simulate the API call
  // For demo purposes, we'll simulate an API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Log the code for testing - in production this would be sent via email
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

  // In a real app, this would verify the code and return the user's data
  // including their auth method (google, facebook, email/password)
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: email.split('@')[0],
    email: email
  };
}