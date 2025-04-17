import React, { useState } from "react";
import { Alert, ImageBackground, Text, View } from "react-native";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signUpImages } from "../SignUp/Images";
import { loginStrings } from "./strings";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton/CustomButton";
import { postRequest } from "../../Components/CustomApi/PostApi";
import { resetPassword } from "../../Constants/ApiUrls";
import Loader from "../../Components/Loader";
import { passwordReg } from "../../Constants/ReuseVariables";

type otpScreenProps = NativeStackScreenProps<any, "OtpScreen">;
export default function SetPassword({ navigation, route }: otpScreenProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const onVerifyClick = () => {
    if (!password) {
      Alert.alert(loginStrings.alert, loginStrings.passwordRequiredText);
    } else if (!confirmPassword) {
      Alert.alert(loginStrings.alert, loginStrings.confirmpasswordRequiredText);
    } else if (passwordReg.test(password) == false) {
      Alert.alert(loginStrings.alert, loginStrings.passwordTestAlert);
    } else if (passwordReg.test(confirmPassword) == false) {
      Alert.alert(loginStrings.alert, loginStrings.passwordTestAlert);
    } else if (password != confirmPassword) {
      Alert.alert(
        loginStrings.alert,
        loginStrings.paswordandConfirmpasswordnotsameAlert
      );
    } else {
      resetPasswordApiCalling();
      //   navigation.navigate("Login");
    }
  };

  const resetPasswordApiCalling = async () => {
    setShowLoader(true);
    const apiData = {
      email: route?.params?.email,
      password: password,
    };
    try {
      const data = await postRequest(resetPassword, apiData);
      setShowLoader(false);
      if (data.status === "success") {
        Alert.alert(
          "Success!",
          loginStrings.passwordChangedMessage,
          [{ text: "OK", onPress: () => navigation.navigate("Login") }],
          { cancelable: false }
        );
      } else {
        Alert.alert(loginStrings.error, data.message); // Show error message to user
      }
    } catch (error) {
      console.log("in catch", error);
      let errorMessage = "An unexpected error occurred.";

      if (error instanceof Error) {
        // Standard JS Error (e.g., throw new Error("Your credentials do not match."))
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        // Check if error has a response (for Axios errors)
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
    <View style={styles.loginContainer}>
      <TopBar
        showBack={true}
        backButtonPress={() => navigation.pop()}
        showTitle={true}
        title="Set Password"
      />
      <ImageBackground
        source={signUpImages.signUpBackground}
        style={styles.setPasswordScreenContainer}
      >
        <Text style={styles.setPasswordHeading}>
          {loginStrings.setYourPasswordHeading}
        </Text>

        <View style={styles.inputContainer}>
          <CustomInput
            placeholder={"Password"}
            iconFrom={"AntDesign"}
            iconName={"lock"}
            showThirdIcon={true}
            thirdIconName={"eye"}
            thirdIconFrom={"Feather"}
            secureTextEntry={true}
            thirdIconSecondName={"eye-off"}
            onChangeText={(text) => setPassword(text)}
            value={password}
          />
        </View>

        <View style={styles.inputContainer}>
          <CustomInput
            placeholder={"Confirm Password"}
            iconFrom={"AntDesign"}
            iconName={"lock"}
            showThirdIcon={true}
            thirdIconName={"eye"}
            thirdIconFrom={"Feather"}
            secureTextEntry={true}
            thirdIconSecondName={"eye-off"}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
          />
        </View>

        <View style={styles.verifyButtonContainer}>
          <CustomButton
            text={loginStrings.verify}
            buttonPress={() => onVerifyClick()}
          />
        </View>
      </ImageBackground>
      <Loader visible={showLoader} />
    </View>
  );
}
