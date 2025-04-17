import { LoginManager, AccessToken } from 'react-native-fbsdk-next';


class FacebookAuth {
  static async login() {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
     
        return { success: false, message: "Login cancelled" };
      } else {
        const data = await AccessToken.getCurrentAccessToken();
        if (data) {
      
          // Fetch user data from Facebook Graph API
          const userResponse = await fetch(
            `https://graph.facebook.com/me?access_token=${data.accessToken}`
          );
          const userData = await userResponse.json();
        
          return { success: true, user: userData, token: data.accessToken.toString() };
        }
      }
    } catch (error:any) {
      console.error("Error with Facebook login", error);
      return { success: false, message: error.message };
    }
  }

 
}

export default FacebookAuth;
