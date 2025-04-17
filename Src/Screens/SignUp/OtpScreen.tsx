import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ImageBackground,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LoginImages } from "../Login/Images";
import { styles } from "./styles";
import { signupText } from "./strings";
import { placeholderColor } from "../../Components/Colors";
import CustomButton from "../../Components/CustomButton/CustomButton";
import Loader from "../../Components/Loader";
import { postRequest } from "../../Components/CustomApi/PostApi";
import { resentOtp, verifyOtp } from "../../Constants/ApiUrls";
import { setAuthToken, setUser } from "../../Redux/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserIdentity from "../../Components/CustomAlerts/UserIdentity";
import SocketService from "../../Components/Socket/SocketService";
import { getDeviceId } from "../../Constants/ReuseVariables";

type otpScreenProps = NativeStackScreenProps<any, "OtpScreen">;

export default function OtpScreen({ navigation, route }: otpScreenProps) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);
  const [showLoader, setShowLoader] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);

  const [timer, setTimer] = useState(30);
  const dispatch = useDispatch();
  const fcmToken = useSelector((state: any) => state.fcmToken.fcmToken);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // 🔐 Check if all 4 digits are filled (and not empty strings)
    if (newOtp.every((digit) => digit !== "")) {
      handleOtpSubmit();
    }
  };

  const userSelectedIdentity = (text: string) => {
    setShowAlertModal(false);
    navigation.navigate("ProfileStack", { userType: text });
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 4) {
      Alert.alert("Error", "Please enter a valid 4-digit OTP");
      return;
    }
    verifyOtpApiCalling();
  };

  const verifyOtpApiCalling = async () => {
    const enteredOtp = otp.join("");
    setShowLoader(true);
    const device_id = await getDeviceId();
    const otpData = {
      email: route?.params?.email,
      otp: Number(enteredOtp),
      verify_type:
        route?.params?.fromScreen == "EmailValidation"
          ? "reset_password"
          : "signup",
      device_token: fcmToken,
      device_id: device_id,
    };
    try {
      const data = await postRequest(verifyOtp, otpData);
      setShowLoader(false);
      if (data.status === "success") {
        if (route?.params?.fromScreen == "EmailValidation") {
          navigation.navigate("SetPassword", { email: route?.params?.email });
        } else {
          dispatch(setUser(data.data.user));
          globalThis.token = data.data.token ?? "";
          SocketService.initializeSocket(data.data.token);
          if (data.data.user.is_profile_completed) {
            dispatch(setAuthToken(data.data.token));
            const tokenStr = JSON.stringify(data.data.token);

            await AsyncStorage.setItem("userToken", tokenStr);
            navigation.navigate("BottomTab");
          } else {
            setTimeout(() => {
              setShowLoader(false);
            }, 300);
            setTimeout(() => {
              setShowAlertModal(true);
            }, 1000);
          }
        }
      } else {
        Alert.alert(signupText.error, data.message);
      }
    } catch (error: any) {
      setShowLoader(false);
      Alert.alert(signupText.error, error.message);
      console.log("OTP verification failed:", error);
    }
  };

  const paramsData = {
    email: route?.params?.email,
  };

  const handleResendOtp = () => {
    Alert.alert("Otp sent successfully.");
    if (timer === 0) {
      setTimer(30);
      postRequest(resentOtp, paramsData);
    }
  };

  return (
    <View style={styles.otpContainer}>
      <TopBar
        showBack={true}
        backButtonPress={() => navigation.pop()}
        showTitle={true}
        title="Otp Screen"
      />
      <View style={styles.otpMainView}>
        <ImageBackground
          style={styles.imageBackground}
          resizeMode="cover"
          source={LoginImages.loginBackground}
        >
          <Text style={styles.otpHeading}>{signupText.otpHeading}</Text>

          <View style={styles.otpBoxContainer}>
            {[...Array(4)].map((_, index) => (
              <View key={index} style={styles.otpBox}>
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  placeholder="•"
                  style={styles.otpInput}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  value={otp[index]}
                  textAlignVertical="center"
                  autoCapitalize="none"
                  placeholderTextColor={placeholderColor}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              </View>
            ))}
          </View>

          <View style={styles.otpButtonContainer}>
            <CustomButton
              text={signupText.otpButtonText}
              buttonPress={handleOtpSubmit}
            />
          </View>

          <TouchableOpacity onPress={handleResendOtp} disabled={timer > 0}>
            <Text
              style={[
                styles.otpHeading,
                {
                  marginTop: 10,
                  color: timer === 0 ? "green" : "gray",
                  fontSize: 16,
                },
              ]}
            >
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </Text>
          </TouchableOpacity>

          <Loader visible={showLoader} />
          {showAlertModal ? (
            <UserIdentity
              visible={showAlertModal}
              close={() => setShowAlertModal(false)}
              userChosen={(text: string) => userSelectedIdentity(text)}
            />
          ) : null}
        </ImageBackground>
      </View>
    </View>
  );
}
