import axios from "axios";
import { useAuth } from '../hooks/useAuth';

// export async function handleGoogleAuth(): Promise<{ id: string; name: string; email: string }> {
//   const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
//   if (!googleClientId) {
//     console.error('Google client ID not configured');
//     throw new Error('Google authentication is not properly configured');
//   }

//   const redirectUri = window.location.origin; 
//   const width = 600;
//   const height = 700;
//   const left = Math.max(0, (window.innerWidth - width) / 2 + window.screenX);
//   const top = Math.max(0, (window.innerHeight - height) / 2 + window.screenY);

//   // Construct URL using URLSearchParams for proper encoding
//   const params = new URLSearchParams({
//     client_id: googleClientId,
//     redirect_uri: redirectUri,
//     response_type: 'token',
//     scope: 'openid email profile',
//     prompt: 'select_account'
//   });

//   const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

//   return new Promise((resolve, reject) => {
//     let popup: Window | null;
    
//     const handleMessage = (event: MessageEvent) => {
//       if (event.origin !== window.location.origin) return;
      
//       // Only handle plain objects, not Symbols
//       if (typeof event.data === 'object' && event.data !== null) {
//         const { type, userData, error } = event.data;
        
//         if (type === 'GOOGLE_AUTH_SUCCESS' && userData) {
//           cleanup();
//           resolve(userData);
//         } else if (type === 'GOOGLE_AUTH_ERROR') {
//           cleanup();
//           reject(new Error(error || 'Authentication failed'));
//         }
//       }
//     };
    
//     const cleanup = () => {
//       clearInterval(checkClosed);
//       window.removeEventListener('message', handleMessage);
//       if (popup && !popup.closed) popup.close();
//     };

//     window.addEventListener('message', handleMessage);

//     try {
//       popup = window.open(
//         url,
//         'google-auth',
//         `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
//       );
//     } catch (error) {
//       console.error('Failed to open popup:', error);
//       reject(new Error('Failed to open authentication window'));
//       return;
//     }

//     if (!popup) {
//       reject(new Error('Please allow popups for this site to enable social login'));
//       return;
//     }

//     const checkClosed = setInterval(() => {
//       if (popup?.closed) {
//         cleanup();
//         resolve(null);
//       }
//     }, 1000);

//     // Set timeout to prevent hanging
//     setTimeout(() => {
//       cleanup();
//       resolve(null);
//     }, 120000); // 2 minutes timeout
//   });
// }
export async function handleGoogleAuth(): Promise<{
  id: string;
  name: string;
  email: string;
  picture: string;
} | null> {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    throw new Error("Google client ID not configured");
  }

  const redirectUri = window.location.origin;
  const width = 600;
  const height = 700;
  const left = Math.max(0, (window.innerWidth - width) / 2 + window.screenX);
  const top = Math.max(0, (window.innerHeight - height) / 2 + window.screenY);

  const params = new URLSearchParams({
    client_id: googleClientId,
    redirect_uri: redirectUri,
    response_type: "token",
    scope: "openid email profile",
    prompt: "select_account",
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return new Promise((resolve, reject) => {
    let popup: Window | null;
    let hasResolved = false; // ✅ Prevent multiple submissions

    try {
      popup = window.open(
        url,
        "google-auth",
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no`
      );
    } catch (error) {
      console.error("Failed to open popup:", error);
      reject(new Error("Failed to open authentication window"));
      return;
    }

    if (!popup) {
      reject(new Error("Please allow popups for this site to enable social login"));
      return;
    }

    const checkPopup = setInterval(async () => {
      try {
        if (popup.closed) {
          clearInterval(checkPopup);
          if (!hasResolved) resolve(null);
        }

        const popupUrl = popup.location.href;
        if (popupUrl.includes("access_token") && !hasResolved) {
          hasResolved = true;

          const hash = new URLSearchParams(popup.location.hash.substring(1));
          const accessToken = hash.get("access_token");

          if (!accessToken) {
            clearInterval(checkPopup);
            popup.close();
            reject(new Error("Access token not found"));
            return;
          }

          const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          popup.close();

          const userData = await res.json();

          const user = {
            name: userData.name,
            email: userData.email,
            avatar: userData.picture,
          };
          try{
            const apiResponse = await axios.post(`/api/auth/register-user`, {
              data: user,
              plan: "free",
              google: 1,
            });
  
            clearInterval(checkPopup);
            popup.close();
  
            resolve(apiResponse.data.ownerData);
          }catch (err) {
            resolve(null);

          }
          
        }
      } catch (err) {
        // Cross-origin access will throw error before Google redirects
      }
    }, 500);

    // Timeout after 2 minutes
    setTimeout(() => {
      clearInterval(checkPopup);
      if (!hasResolved) {
        if (popup && !popup.closed) popup.close();
        resolve(null);
      }
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
            const apiResponse = await axios.post(`/api/auth/register-user`, {
              data: user,
              plan: "free",
              fb: 1,
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
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Magic code for testing: 123456');
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
  }else if (response.data.ownerData  ) {
    
    return response.data.ownerData ;
  }

  // Return mock user data
  
}
// export async function verifyMagicCode(email: string, code: string): Promise<{ id: string; name: string; email: string }> {
//   const validCode = "123456";
  
//   if (!/^\d{6}$/.test(code)) {
//     throw new Error('Please enter a valid 6-digit code');
//   }
  
//   if (code !== validCode) {
//     throw new Error('Invalid verification code. For testing, use code: 123456');
//   }
  
//   // In a real app, this would verify the code with the backend
//   // For testing, we'll simulate a successful verification
//   await new Promise(resolve => setTimeout(resolve, 500));
  
//   return {
//     id: Math.random().toString(36).substr(2, 9),
//     name: email.split('@')[0],
//     email: email
//   };
// }

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