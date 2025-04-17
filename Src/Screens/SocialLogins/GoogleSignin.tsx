// googleAuth.js
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { Platform } from 'react-native';

export const configureGoogleSignIn = () => {    
  GoogleSignin.configure({
    webClientId: '459587402560-canb19ojor5o8obnq6t1kamrnvbhuqu3.apps.googleusercontent.com', 
  });
};

export const signInWithGoogle = async (
  onSuccess: (userInfo: any) => void,
  onError: (error: string) => void
) => {
  console.log('signInWithGoogle called');
  console.log('onSuccess:', typeof onSuccess);
  console.log('onError:', typeof onError);

  try {
    if (Platform.OS == "android") {
      configureGoogleSignIn()
    }
  
    await GoogleSignin?.hasPlayServices();
    console.log("this")
    const userInfo = await GoogleSignin?.signIn();
    console.log("Google sign-in userInfo:", userInfo);
    onSuccess(userInfo); // <-- This is where the error happens
  } catch (error: any) {
    console.log('Google Sign-In error', error);
    let errorMessage = 'An unknown error occurred';

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      errorMessage = 'User cancelled the login flow';
    } else if (error.code === statusCodes.IN_PROGRESS) {
      errorMessage = 'Sign-in is in progress';
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      errorMessage = 'Play services are not available';
    } else {
      errorMessage = error.message;
    }

    onError(errorMessage);
  }
};

export const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    return { success: 'User signed out' };
  } catch (error:any) {
    return { error: error.message };
  }
};
