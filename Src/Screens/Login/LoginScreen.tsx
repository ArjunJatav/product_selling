import React, { useState } from "react";
import {
  Alert,
  Image,
  ImageBackground,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LoginImages } from "./Images";
import { loginStrings } from "./strings";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton/CustomButton";
import { facebookBlueColor } from "../../Components/Colors";
import { signUpImages } from "../SignUp/Images";
import { AntDesign } from "../../Components/ReactIcons";
import { postRequest } from "../../Components/CustomApi/PostApi";
import {
  baseUrlV1,
  loginApi,
  signupApi,
  socialLogin,
} from "../../Constants/ApiUrls";
import UserIdentity from "../../Components/CustomAlerts/UserIdentity";
import Loader from "../../Components/Loader";
import { Emailreg, getDeviceId } from "../../Constants/ReuseVariables";
import { setAuthToken, setUser } from "../../Redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SocketService from "../../Components/Socket/SocketService";

import { signInWithGoogle, signOutFromGoogle } from "../SocialLogins/GoogleSignin";
import AppleSignInHelper from "../SocialLogins/AppleSignInHelper";
import { setUserInfo } from "../../Redux/SocialLoginSlice";
import { socialLoginApi } from "../SocialLogins/ApiProvider";

type loginScreenProps = NativeStackScreenProps<any, "Login">;
export default function LoginScreen({ navigation }: loginScreenProps) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const fcmToken =useSelector((state: any) => state.fcmToken.fcmToken);

  const dispatch = useDispatch();
  const [showLoader, setShowLoader] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const userSelectedIdentity = (text: string) => {
    setShowAlertModal(false);
    navigation.navigate("ProfileStack", { userType: text });
  };
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

  const loginButtonClick = () => {
    if (!formData.email) {
      Alert.alert(loginStrings.alert, loginStrings.emailRequiredAlert);
    } else if (Emailreg.test(formData.email.trim()) == false) {
      Alert.alert(loginStrings.alert, loginStrings.emailNotValidAlert);
    } else if (!formData.password) {
      Alert.alert(loginStrings.alert, loginStrings.passwordRequiredAlert);
    } else {
      LoginApiCalling();
      // navigation.navigate("BottomTab")
    }
  };

  type SocialLoginType = {
    id: string;
    iconType?: string;
    iconName?: string;
    iconSize?: number;
    iconColor?: string;
    image?: any;
    text: string;
    customStyle?: any;
  };

  const socialLogins: SocialLoginType[] = [
    {
      id: "facebook",
      iconType: "AntDesign",
      iconName: "facebook-square",
      iconSize: 30,
      iconColor: facebookBlueColor,
      text: loginStrings.facebook,
    },
    {
      id: "google",
      image: signUpImages.googleIcon,
      text: loginStrings.google,
    },
    {
      id: "apple",
      iconType: "AntDesign",
      iconName: "apple1",
      iconSize: 20,
      iconColor: "#fff",
      customStyle: styles.appleBox,
      text: loginStrings.apple,
    },
  ];

  const handleSignInSuccess = async (user: any) => {
console.log("in handle sign in succes")
    if (
      !user.email ||
      !user.fullName?.givenName ||
      !user.fullName?.familyName
    ) {
      // setShowAlertModal(true);
      navigation.navigate("SignUpStack");

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

    console.log("resultresultresult",result);
    

    if (result.success && result.data) {
      if (result.data.is_already_registered == 0) {
        console.log("in iff::::")
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
        console.log("googleData",googleData)
        const signUpResult = await socialLoginApi(
          baseUrlV1 + signupApi, // @ts-expect-error
          googleData
        );
      
        if (signUpResult.success && signUpResult.data) {
          console.log("in this if")
          setShowLoader(false);
          dispatch(setUser(signUpResult.data.user));
          if (signUpResult.data.user.is_profile_completed == 0) {
            globalThis.token = signUpResult.data.token ?? "";
            dispatch(setAuthToken(signUpResult.data.token));
            console.log("User token 1>>>>>>", globalThis.token);
            // const tokenStr = JSON.stringify(signUpResult.data.token);

            // await AsyncStorage.setItem("userToken", tokenStr);

            setTimeout(() => {
              setShowLoader(false);
            }, 500);
            setTimeout(() => {
              setShowAlertModal(true);
            }, 1200);
          } else {
            console.log("in this else")
            globalThis.token = result.data.token ?? "";
            dispatch(setAuthToken(result.data.token));
            console.log("User token2 >>>>>>", globalThis.token);
            const tokenStr = JSON.stringify(result.data.token);

            await AsyncStorage.setItem("userToken", tokenStr);
            setTimeout(() => {
              setShowLoader(false);
              navigation.navigate("BottomTab");
            }, 300);

            signOutFromGoogle()
          }

          console.log("signUpResult:", signUpResult.data);
          // signOutFromGoogle()
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
          // const tokenStr = JSON.stringify(result.data.token);

          // await AsyncStorage.setItem("userToken", tokenStr);

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

  const googleSignInError = (Error: any) => {
    console.log("Google Sigin Error", Error);
   // Alert.alert("Error", Error);
  };



  const handleSignIn = (item: any) => {
    console.log('googleSignInSuccess:', typeof googleSignInSuccess);
    console.log('googleSignInError:', typeof googleSignInError);
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
            {/* @ts-expect-error: AntDesign type definition is missing */}
            <AntDesign
              name={item.iconName}
              size={item.iconSize || 24}
              color={item.iconColor || "#000"}
            />
          </View>
        )}
      </View>
      <View style={styles.socialLoginTextConatiner}>
        <Text style={styles.socialLoginText}>{item.text}</Text>
      </View>
    </TouchableOpacity>
  );

  const LoginApiCalling = async () => {
    setShowLoader(true);
    const device_id = await getDeviceId();
    const loginData = {
      email: formData.email,
      password: formData.password,
      device_type: Platform.OS == "android" ? "android" : "ios",
      device_token: fcmToken,
      device_id: device_id,
    };
    console.log("login data::",loginData)
    try {
      const data = await postRequest(loginApi, loginData);

      if (data.status === "success") {
        dispatch(setUser(data.data.user));
        globalThis.userId = data.data.user.id
        if (data.data.user.is_profile_completed == 1) {
          setShowLoader(false);
          globalThis.token = data.data.token ?? "";
          dispatch(setAuthToken(data.data.token));
          console.log("User token >>>>>>", globalThis.token);
          const tokenStr = JSON.stringify(data.data.token);
          SocketService.initializeSocket(data.data.token);
          await AsyncStorage.setItem("userToken", tokenStr);

          navigation.navigate("BottomTab");
        } else {
          globalThis.token = data.data.token ?? "";
          dispatch(setAuthToken(data.data.token));
          const tokenStr = JSON.stringify(data.data.token);

          await AsyncStorage.setItem("userToken", tokenStr);

          setTimeout(() => {
            setShowLoader(false);
          }, 300);
          setTimeout(() => {
            setShowAlertModal(true);
          }, 1000);
        }
      } else {
        console.log("in first else",data)
        setShowLoader(false);
        Alert.alert(loginStrings.error, data.message);
      }
    } catch (error) {
      console.log("in first catch",error)
      setShowLoader(false);
      console.log("in catch", error);
      let errorMessage = "An unexpected error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        if (
          "response" in error &&
          error.response &&
          typeof error.response === "object"
        ) {
          const axiosError = error as {
            response?: { data?: { message?: string } };
          };
          if (axiosError.response?.data?.message) {
            errorMessage = axiosError.response.data.message;
          }
        }
      }

      console.log("Final error message:", errorMessage);
      setShowLoader(false);

      Alert.alert(loginStrings.error, errorMessage);
      console.log("signup Failed:", error);
    }
  };

  return (

    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.loginContainer}>
      <TopBar showBack={false} backButtonPress={() => navigation.pop()} />
      <View style={styles.loginMainView}>
        <ImageBackground
          style={styles.imageBackground}
          resizeMode="cover"
          source={LoginImages.loginBackground}
        >
          <Text style={styles.loginHeading}>{loginStrings.loginHeading}</Text>

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

          <View style={styles.loginButtonContainer}>
            <CustomButton
              text={loginStrings.loginButtonText}
              buttonPress={() => loginButtonClick()}
            />
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("LoginStack", { screen: "EmailValidation" })
            }
          >
            <Text style={styles.forgotPasswordText}>
              {loginStrings.forgotPasswordText}
            </Text>
          </TouchableOpacity>

          <View style={[styles.continueTextView]}>
            <View style={[styles.continueTextLeftView]} />
            <View>
              <Text style={[styles.continueText]}>
                {loginStrings.continueWithText}
              </Text>
            </View>
            <View style={[styles.continueTextRightView]} />
          </View>

          {socialLogins.map((item) => (
            <SocialLoginButton key={item.id} item={item} />
          ))}

          <View style={styles.alreadyTextContainer}>
            <Text style={styles.alreadyText}>
              {loginStrings.dontAccountText}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpStack")}
            >
              <Text style={styles.loginText}> {loginStrings.signup}</Text>
            </TouchableOpacity>
          </View>
          {showAlertModal ? (
            <UserIdentity
              visible={showAlertModal}
              close={() => setShowAlertModal(false)}
              userChosen={(text: string) => userSelectedIdentity(text)}
            />
          ) : null}

          <Loader visible={showLoader} />
        </ImageBackground>
      </View>
    </View>
    </TouchableWithoutFeedback>
  );
}
