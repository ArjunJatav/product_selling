import { StyleSheet } from "react-native";
import {
  darkGray,
  placeholderColor,
  textColor,
  whiteButtonTextColor,
} from "../../Components/Colors";

export const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: darkGray,
  },
  loginMainView: {
    marginTop: 50,
    borderTopWidth: 5,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  imageBackground: {
    flex: 1,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    overflow: "hidden",
    paddingHorizontal: 15,
    marginTop: -15,
  },
  loginHeading: {
    color: "#000",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 20,
  },
  inputContainer: {
    marginTop: 15,
  },
  loginButtonContainer: {
    marginTop: 20,
  },
  forgotPasswordText: {
    marginTop: 10,
    fontSize: 18,
    color: "#000",
    fontWeight: "500",
    marginLeft: 10,
  },
  continueTextView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginHorizontal: 20,
  },
  continueTextLeftView: {
    flex: 1,
    height: 1.5,
    backgroundColor: placeholderColor,
  },
  continueText: {
    width: 150,
    textAlign: "center",
    color: placeholderColor,
    fontWeight: "600",
    fontSize: 18,
  },

  continueTextRightView: {
    flex: 1,
    height: 1.5,
    backgroundColor: placeholderColor,
  },
  appleBox: {
    height: 30,
    width: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  socialLoginConatiner: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 10,
    marginTop: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  socialLoginIconConatiner: {
    width: "10%",
  },
  socialLoginTextConatiner: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  socialLoginText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  googleImage: {
    height: 30,
    width: 30,
  },
  alreadyTextContainer: {
    marginTop: 20,
    // justifyContent: 'center',
    alignItems: "center",
    marginLeft: 5,
    flexDirection: "row",
  },
  alreadyText: {
    color: textColor,
    fontSize: 18,
  },
  loginText: {
    color: whiteButtonTextColor,
    fontWeight: "600",
    fontSize: 18,
  },
  emailScreenMainView: {
    marginTop: 80,
    borderTopWidth: 5,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    backgroundColor: "#fff",
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  emailImageBackground: {
    flex: 1,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    overflow: "hidden",
    paddingHorizontal: 15,
  },
  emailVerifyHeading: {
    color: "#000",
    marginTop: 50,
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 20,
    alignSelf: "center",
  },
  verifyButtonContainer: {
    marginTop: 50,
  },
  setPasswordScreenContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  setPasswordHeading: {
    color: "#000",
    marginTop: 20,
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 20,
  },
});
