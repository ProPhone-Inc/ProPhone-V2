import axios from "axios";

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

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: 'openid email profile',
    prompt: 'select_account'
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return new Promise((resolve, reject) => {
    let popup: Window | null = window.open(
      url,
      'google-auth',
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
    );

    if (!popup) {
      reject(new Error('Please allow popups for this site to enable social login'));
      return;
    }

    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        resolve(null);
      }
    }, 1000);

    const handleAuth = async () => {
      try {
        const urlParams = new URLSearchParams(popup?.location.hash.substring(1));
        const accessToken = urlParams.get("access_token");

        if (accessToken) {
          // Fetch user info
          const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });

          if (!userInfoResponse.ok) {
            throw new Error("Failed to fetch user info");
          }

          const userData = await userInfoResponse.json();
          const user = {
            name: userData.name || "Google User",
            email: userData.email ,
            google: "1",
            googleavater: userData.picture,
          };
  
         
          const apiResponse = await axios.post(`/api/auth/google-login`, {
            data: user,
            plan: "",
          });
          resolve(apiResponse.data.ownerData);
        } else {
          reject(new Error("Access token not found"));
        }
      } catch (error) {
        reject(error);
      } finally {
        clearInterval(checkClosed);
        if (popup) popup.close();
      }
    };

    const checkPopup = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(checkPopup);
        } else if (popup.location.href.includes("access_token")) {
          clearInterval(checkPopup);
          handleAuth();
        }
      } catch (e) {
        // Ignore cross-origin errors
      }
    }, 1000);

    setTimeout(() => {
      clearInterval(checkClosed);
      if (popup && !popup.closed) popup.close();
      reject(new Error("Authentication timeout"));
    }, 120000);
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
      if (response.status === "connected" && response.authResponse) {
        // Fetch user data from Facebook API
        window.FB.api("/me", { fields: "id,name,email" }, async (userData) => {
          try {
            const user = {
              fbid: response.authResponse.userID,
              firstName: userData.name || "Facebook User",
              email: userData.email || `${response.authResponse.userID}@facebook.com`,
              fb: "1", // Be careful storing sensitive data
            };
    
            // Send data to backend
            const apiResponse = await axios.post(`/api/auth/facebook-login`, {
              data: user,
              plan: "",
            });
    
            console.log("User registered:", apiResponse.data);
          } catch (error) {
            console.error("Error registering user:", error);
          }
        });
      } else {
        console.log("Facebook login cancelled or failed.");
      }
    }, { scope: "public_profile,email" });
    
    // window.FB.login((response) => {
    //   if (response.status === 'connected' && response.authResponse) {
    //     // In a real app, you would make an API call to get user data
    //     window.FB.api('/me', { fields: 'id,name,email' }, (userData) => {
    //       resolve({
    //         id: response.authResponse.userID,
    //         name: userData.name || 'Facebook User',
    //         email: userData.email || `${response.authResponse.userID}@facebook.com`
    //       });
    //       const user = {
    //         fbid: response.authResponse.userID,
    //         firstName: userData.name || "Facebook User",
    //         email: userData.email || `${response.authResponse.userID}@facebook.com`,
    //         fb: "1", // Be careful storing sensitive data
    //       };
  
    //       // Send data to backend
    //       const apiResponse = await axios.post(`/api/auth/register-user`, {
    //         data: user,
    //         plan: "",
    //       });
    //     });
        
    //   } else {
    //     // User likely cancelled the login, resolve without error
    //     resolve(null);
    //   }
    // }, { scope: 'public_profile,email' });
  });
}

export async function sendMagicCode(email: string): Promise<void> {
  // For demo purposes, we'll simulate an API call
  try {
    const response = await axios.post(`/api/auth/sendemail`, {
      email: email,
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Magic code for testing: 123456');
  } catch (error) {
    console.error("Failed to send Magic Code", error);
  }
 
}

export async function verifyMagicCode(email: string, code: string): Promise<{ id: string; name: string; email: string }> {
  // const validCode = "123456";
  const response = await axios.post(`/api/auth/verify-code`, {
    email: email,
    code: code,
  });
  if (!/^\d{6}$/.test(code)) {
    throw new Error('Please enter a valid 6-digit code');
  }
  
  if (response.data == 2) {
    throw new Error('Invalid verification code');
  }else if (response.data.token  ) {
    
    return {
      id: response.data.token,
      name: '',
      email: ''
    };
  }

  // Return mock user data
  
}