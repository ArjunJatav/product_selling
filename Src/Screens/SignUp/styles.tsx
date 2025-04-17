import {StyleSheet} from 'react-native';
import {
  blueColor,
  darkGray,
  placeholderColor,
  purpleColor,
  textColor,
} from '../../Components/Colors';
import {windowWidth} from '../../Constants/ReuseVariables';

export const styles = StyleSheet.create({
  signupScreenContainer: {
    flex: 1,
  },
  signupMainView: {
    marginHorizontal: 20,
  },
  signUpHeading: {
    color: '#000',
    marginTop: 20,
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 15,
  },
  signUpButtonContainer: {
    marginTop: 20,
  },
  privacyPolicyPara: {
    color: textColor,
    fontSize: 17,
  },
  termsNconditionText: {
    color: blueColor,
  },
  continueTextView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  continueTextLeftView: {
    flex: 1,
    height: 1.5,
    backgroundColor: placeholderColor,
  },
  continueText: {
    width: 150,
    textAlign: 'center',
    color: placeholderColor,
    fontWeight: '600',
    fontSize: 18,
  },

  continueTextRightView: {
    flex: 1,
    height: 1.5,
    backgroundColor: placeholderColor,
  },
  socialLoginConatiner: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  socialLoginIconConatiner: {
    width: '10%',
  },
  socialLoginTextConatiner: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialLoginText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  googleImage: {
    height: 30,
    width: 30,
  },
  appleBox: {
    height: 30,
    width: 30,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alreadyTextContainer: {
    marginTop: 20,
    marginLeft:5,
  //  justifyContent: 'center',
  alignItems: 'center',
    flexDirection:"row"
  },
  alreadyText: {
    color: textColor,
    fontSize: 18,
  },
  loginText: {
    color: purpleColor,
    fontWeight: '600',
    fontSize: 18,
  },
  otpContainer: {
    flex: 1,
    backgroundColor: darkGray,
  },
  otpMainView: {
    marginTop: 80,
    borderTopWidth: 5,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
    alignSelf: 'center',
  },
  imageBackground: {
    flex: 1,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    overflow: 'hidden',
    paddingHorizontal: 15,
  },
  otpHeading: {
    color: '#000',
    marginTop: 50,
    fontSize: 25,
    fontWeight: '600',
    marginBottom: 20,
    alignSelf: 'center',
  },
  otpBoxContainer: {
    flexDirection: 'row',
   // width: windowWidth - 20,
    justifyContent: 'center',
    marginTop:50
  },
  otpBox: {
    height: 60,
    width: (windowWidth - 200) / 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  otpInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    height:"100%",
    alignSelf:"center",
    width:"100%",
   // textAlign: 'center', // Keeps cursor in center
   // textAlignVertical: 'center', // Ensures vertical centering
 // includeFontPadding: false, // Helps with proper vertical alignment
   // paddingVertical: 0, 
  },
  otpButtonContainer:{
    marginTop:40
  }
});
