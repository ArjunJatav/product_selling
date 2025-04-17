import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { signUpImages } from "./Images";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton/CustomButton";
import { signupText } from "./strings";
import { AntDesign } from "../../Components/ReactIcons";
import { facebookBlueColor } from "../../Components/Colors";
import { postRequest } from "../../Components/CustomApi/PostApi";
import { baseUrlV1, signupApi, socialLogin } from "../../Constants/ApiUrls";
import Loader from "../../Components/Loader";
import {
  Emailreg,
  getDeviceId,
  passwordReg,
} from "../../Constants/ReuseVariables";
import { signInWithGoogle } from "../SocialLogins/GoogleSignin";
import AppleSignInHelper from "../SocialLogins/AppleSignInHelper";
import { setUserInfo } from "../../Redux/SocialLoginSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken, setUser } from "../../Redux/UserSlice";
import { socialLoginApi } from "../SocialLogins/ApiProvider";
import UserIdentity from "../../Components/CustomAlerts/UserIdentity";

type signupScreenProps = NativeStackScreenProps<any, "SignUp">;
export default function SignUpScreen({ navigation }: signupScreenProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showLoader, setShowLoader] = useState(false);
  const dispatch = useDispatch();
  const [showAlertModal, setShowAlertModal] = useState(false);
  const fcmToken =useSelector((state: any) => state.fcmToken.fcmToken);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value, // Dynamically update the field
    }));
  };
  const renderInput = (
    placeholder: string,
    value: string,
    iconFrom: string,
    iconName: string,
    fieldKey: keyof typeof formData,
    showThirdIcon: boolean = false,
    thirdIconName: string = "",
    thirdIconFrom: string = "",
    secureTextEntry: boolean = false,
    thirdIconSecondName: string = ""
  ) => (
    <View style={styles.inputContainer}>
      <CustomInput
        placeholder={placeholder}
        iconFrom={iconFrom}
        iconName={iconName}
        showThirdIcon={showThirdIcon}
        thirdIconName={thirdIconName}
        thirdIconFrom={thirdIconFrom}
        secureTextEntry={secureTextEntry}
        thirdIconSecondName={thirdIconSecondName}
        onChangeText={(text) => handleInputChange(fieldKey, text)}
        value={value}
      />
    </View>
  );

  // Social Login Data
  const socialLogins = [
    {
      id: "facebook",
      iconType: "AntDesign",
      iconName: "facebook-square",
      iconSize: 30,
      iconColor: facebookBlueColor,
      text: signupText.facebook,
    },
    {
      id: "google",
      image: signUpImages.googleIcon,
      text: signupText.google,
    },
    {
      id: "apple",
      iconType: "AntDesign",
      iconName: "apple1",
      iconSize: 20,
      iconColor: "#fff",
      customStyle: styles.appleBox,
      text: signupText.apple,
    },
  ];

  const googleSignInError = (Error: any) => {
    Alert.alert("Error", Error);
  };

  const handleSignInError = (error: any) => {
    Alert.alert("Error", error);
  };

  const googleSignInSuccess = async (userInfo: any) => {
    setShowLoader(true);
    console.log("Google Sigin In Sucess", userInfo);
    dispatch(
      setUserInfo({
        user: userInfo.user,
        provider: "google",
      })
    );
    const device_id = await getDeviceId();
    const userParamsData = {
      social_login_id: userInfo.user.id,
      social_login_type: "google",
      device_type: Platform.OS == "android" ? "android" : "ios",
      device_token: fcmToken, 
      device_id: device_id,
    };
    socialLoginMethod(userParamsData, userInfo);
  };

  const socialLoginMethod = async (userParamsData: any, userInfo: any) => {
    console.log("userParamsData", userParamsData);
    console.log("userInfo", userInfo);

    const result = await socialLoginApi(
      baseUrlV1 + socialLogin,
      userParamsData
    );

    console.log("resultresultresult", result);

    if (result.success && result.data) {
      if (result.data.is_already_registered == 0) {
        const device_id = await getDeviceId();

        const googleData = {
          signup_type: "social",
          full_name: userInfo.user.name ?? "",
          email: userInfo.user.email ?? "",
          social_login_type: userParamsData.social_login_type ?? "",
          social_login_id: userInfo.user.id ?? "",
          device_id: device_id,
          device_type: Platform.OS == "android" ? "android" : "ios",
          device_token: fcmToken,
        };

        const signUpResult = await socialLoginApi(
          baseUrlV1 + signupApi, //@ts-expect-error
          googleData
        );

        if (signUpResult.success && signUpResult.data) {
          setShowLoader(false);
          dispatch(setUser(signUpResult.data.user));
          if (signUpResult.data.user.is_profile_completed == 0) {
            globalThis.token = result.data.token ?? "";
            dispatch(setAuthToken(result.data.token));
            console.log("User token 1>>>>>>", globalThis.token);
            const tokenStr = JSON.stringify(result.data.token);

            await AsyncStorage.setItem("userToken", tokenStr);

            setTimeout(() => {
              setShowLoader(false);
            }, 500);
            setTimeout(() => {
              setShowAlertModal(true);
            }, 1200);
          } else {
            globalThis.token = result.data.token ?? "";
            dispatch(setAuthToken(result.data.token));
            console.log("User token2 >>>>>>", globalThis.token);
            const tokenStr = JSON.stringify(result.data.token);

            await AsyncStorage.setItem("userToken", tokenStr);
            setTimeout(() => {
              setShowLoader(false);
              navigation.navigate("BottomTab");
            }, 300);
          }

          console.log("signUpResult:", signUpResult.data);
        } else {
          setTimeout(() => {
            setShowLoader(false);
          }, 300);

          console.log("Social login failed:", result.error);
        }
      } else {
        setShowLoader(false);
        if (result.data.user.is_profile_completed == 0) {
          dispatch(setUser(result.data.user));
          globalThis.token = result.data.token ?? "";
          dispatch(setAuthToken(result.data.token));
          console.log("User token3 >>>>>>", globalThis.token);
          const tokenStr = JSON.stringify(result.data.token);

          await AsyncStorage.setItem("userToken", tokenStr);

          setTimeout(() => {
            setShowLoader(false);
          }, 500);
          setTimeout(() => {
            setShowAlertModal(true);
          }, 1200);
        } else {
          dispatch(setUser(result.data.user));
          globalThis.token = result.data.token ?? "";
          dispatch(setAuthToken(result.data.token));
          console.log("User token4 >>>>>>", globalThis.token);
          const tokenStr = JSON.stringify(result.data.token);
          setTimeout(() => {
            setShowLoader(false);
            navigation.navigate("BottomTab");
          }, 300);

          await AsyncStorage.setItem("userToken", tokenStr);
        }
      }
    } else {
      setTimeout(() => {
        setShowLoader(false);
      }, 300);

      console.log("Social login failed:", result.error);
    }
  };

  const handleSignInSuccess = async (user: any) => {
    if (
      !user.email ||
      !user.fullName?.givenName ||
      !user.fullName?.familyName
    ) {
      // console.log("Applew Sign-In Success", user);
      // navigation.navigate("SignUpStack");
    } else {
      console.log("Applew Sign-In Success", user);
      const device_id = await getDeviceId();
      const userParamsData = {
        social_login_id: user.user,
        social_login_type: "apple",
        device_type: Platform.OS == "android" ? "android" : "ios",
        device_token: fcmToken, 
        device_id: device_id,
      };
      socialLoginMethod(userParamsData, user);
    }
  };

  const handleSignIn = (item: any) => {
    console.log("googleSignInSuccess:", typeof googleSignInSuccess);
    console.log("googleSignInError:", typeof googleSignInError);
    const signInActions = {
      google: () => signInWithGoogle(googleSignInSuccess, googleSignInError),
      apple: () =>
        AppleSignInHelper.onAppleButtonPress(
          handleSignInSuccess,
          handleSignInError
        ),
      // facebook: handleLogin,
    };

   // @ts-expect-error
    const action = signInActions[item.id];
    if (action) {
      action();
    } else {
      console.log("Unknown sign-in type:", item.id);
    }
  };

  // Social Login Button Component
  const SocialLoginButton = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.socialLoginConatiner}
      onPress={() => {
        handleSignIn(item);
      }}
    >
      <View style={styles.socialLoginIconConatiner}>
        {item.image ? (
          <Image
            source={item.image}
            style={styles.googleImage}
            resizeMode="contain"
          />
        ) : (
          <View style={item.customStyle}>
            {/* Ignore TypeScript error for this line */}
            {/* @ts-expect-error: AntDesign type definition is missing */}
            <AntDesign
              name={item.iconName}
              size={item.iconSize}
              color={item.iconColor}
            />
          </View>
        )}
      </View>
      <View style={styles.socialLoginTextConatiner}>
        <Text style={styles.socialLoginText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  const signUpButtonClick = () => {
    if (!formData.name) {
      Alert.alert(signupText.alert, signupText.nameRequiredAlert);
    } else if (!formData.email) {
      Alert.alert(signupText.alert, signupText.emailRequiredAlert);
    } else if (Emailreg.test(formData.email.trim()) == false) {
      Alert.alert(signupText.alert, signupText.emailNotValidAlert);
    } else if (!formData.password) {
      Alert.alert(signupText.alert, signupText.passwordRequiredAlert);
    } else if (passwordReg.test(formData.password) == false) {
      Alert.alert(signupText.alert, signupText.passwordTestAlert);
    } else if (!formData.confirmPassword) {
      Alert.alert(signupText.alert, signupText.confirmPasswordRequiredAlert);
    } else if (passwordReg.test(formData.confirmPassword) == false) {
      Alert.alert(signupText.alert, signupText.passwordTestAlert);
    } else if (formData.password != formData.confirmPassword) {
      Alert.alert(
        signupText.alert,
        signupText.paswordandConfirmpasswordnotsameAlert
      );
    } else {
      signUpApiCall();
      // navigation.navigate("OtpScreen",{fromScreen:"SignUp"})
    }
  };

  const signUpApiCall = async () => {
    setShowLoader(true);
    const device_id = await getDeviceId();
    const signUpData = {
      signup_type: "email",
      full_name: formData.name,
      email: formData.email,
      password: formData.password,
      social_login_type: null,
      social_login_id: null,
      device_id:device_id,
      device_type: Platform.OS == "android" ? "android" : "ios",
      device_token: fcmToken,
    };
    try {
      const data = await postRequest(signupApi, signUpData);

      setShowLoader(false);
      if (data.status === "success") {
        navigation.navigate("OtpScreen", {
          fromScreen: "SignUp",
          email: formData.email,
        });
      } else {
        Alert.alert(signupText.error, data.message); // Show error message to user
      }
    } catch (error) {
      setShowLoader(false);

      /* @ts-expect-error: alert type definition is missing */

      Alert.alert(signupText.error, error.message);
      console.log("signup Failed:", error);
    }
  };

  const userSelectedIdentity = (text: string) => {
    setShowAlertModal(false);
    navigation.navigate("ProfileStack", { userType: text });
  };
  return (
    <View style={styles.signupScreenContainer}>
      <TopBar showBack={true} backButtonPress={() => navigation.pop()} showTitle={true} title="Sign Up" />

      <ImageBackground
        source={signUpImages.signUpBackground}
        style={styles.signupScreenContainer}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center", // Keeps content centered
              paddingBottom: 50,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.signupMainView}>
              <Text style={styles.signUpHeading}>
                {signupText.signupHeading}
              </Text>

              {renderInput(
                "Name",
                formData.name,
                "FontAwesome",
                "user-o",
                "name",
                false
              )}
              {renderInput(
                "Email",
                formData.email,
                "FontAwesome",
                "envelope-o",
                "email",
                false
              )}
              {renderInput(
                "Password",
                formData.password,
                "SimpleLineIcons",
                "lock",
                "password",
                true,
                "eye",
                "Feather",
                true,
                "eye-off"
              )}
              {renderInput(
                "Confirm Password",
                formData.confirmPassword,
                "SimpleLineIcons",
                "lock",
                "confirmPassword",
                true,
                "eye",
                "Feather",
                true,
                "eye-off"
              )}

              <View style={styles.signUpButtonContainer}>
                <CustomButton
                  text={signupText.buttonText}
                  buttonPress={() => signUpButtonClick()}
                />
              </View>

              <Text style={styles.privacyPolicyPara}>
                {signupText.privacyPolicyPara}{" "}
                <Text
                  style={styles.termsNconditionText}
                  onPress={() =>
                    navigation.navigate("ContentStack", {
                      screen: "PrivacyPolicy",
                      params: { type: "terms" },
                    })
                  }
                >
                  {signupText.termsNconditionText}
                </Text>{" "}
                {signupText.and}{" "}
                <Text
                  style={styles.termsNconditionText}
                  onPress={() =>
                    //privacy
                    navigation.navigate("ContentStack", {
                      screen: "PrivacyPolicy",
                      params: { type: "privacy" },
                    })
                  }
                >
                  {signupText.privacyPolicyText}
                </Text>
              </Text>

              <View style={[styles.continueTextView]}>
                <View style={[styles.continueTextLeftView]} />
                <View>
                  <Text style={[styles.continueText]}>
                    {signupText.continueWithText}
                  </Text>
                </View>
                <View style={[styles.continueTextRightView]} />
              </View>

              {socialLogins.map((item) => (
                <SocialLoginButton key={item.id} item={item} />
              ))}

              <View style={styles.alreadyTextContainer}>
                <Text style={styles.alreadyText}>
                  {signupText.alreadyAccountText}
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("LoginStack")}
                >
                  <Text style={styles.loginText}>{signupText.login}</Text>
                </TouchableOpacity>
              </View>
            </View>
            {showAlertModal ? (
              <UserIdentity
                visible={showAlertModal}
                close={() => setShowAlertModal(false)}
                userChosen={(text: string) => userSelectedIdentity(text)}
              />
            ) : null}
            <Loader visible={showLoader} />
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}
