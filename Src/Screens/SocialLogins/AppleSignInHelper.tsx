import * as AppleAuthentication from '@invertase/react-native-apple-authentication';
import { Alert } from 'react-native';

class AppleSignInHelper {
  static async onAppleButtonPress(onSignInSuccess: any, onSignInError: any) {
    try {
      if (!AppleAuthentication?.appleAuth.isSupported) {
        Alert.alert('Error', 'Apple Sign-In is not supported on this device.');
        return;
      }

      const appleAuthRequestResponse = await AppleAuthentication?.appleAuth.performRequest({
        requestedOperation: AppleAuthentication.appleAuth.Operation.LOGIN,
        requestedScopes: [
          AppleAuthentication.appleAuth.Scope.FULL_NAME,
          AppleAuthentication.appleAuth.Scope.EMAIL,
        ],
      });

  

      const { identityToken, fullName, email, user } = appleAuthRequestResponse;

      console.log('Identity Token:', identityToken);
      console.log('Full Name:', fullName);
      console.log('Email:', email);

      onSignInSuccess({
        fullName,
        email,
        identityToken,
        user,
      });
     } catch (error: any) {
        const errorCode = error?.code;
        const errorMessage = error?.message || 'Unknown Apple Sign-In error occurred';
      
        if (errorCode === '1001') {
          console.log('Apple Sign-In cancelled by user.');
          onSignInError('Apple Sign-In cancelled by user.');
          return; // or you can call onSignInError if needed
        }
      
        console.log('Apple Sign-In Error:', JSON.stringify(error));
      
        if (onSignInError) {
          onSignInError(errorMessage);
        }
     }
  }
}
export default AppleSignInHelper;
