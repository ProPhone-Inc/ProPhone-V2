export function initFacebookSDK(appId: string) {
  return new Promise<void>((resolve) => {
    if (!appId) {
      console.warn('Facebook App ID not configured, skipping SDK initialization');
      resolve();
      return;
    }

    // Wait for the Facebook SDK to be loaded
    window.fbAsyncInit = function() {
      FB.init({
        appId,
        cookie: true,
        xfbml: true,  // Enable XFBML parsing for social plugins
        version: 'v18.0'
      });
      
      resolve();
    };

    // Load the SDK if it's not already loaded
    if (typeof FB === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.id = 'facebook-jssdk';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}