import React, { useState } from "react";
import { Alert, ImageBackground, Text, View } from "react-native";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LoginImages } from "./Images";
import { loginStrings } from "./strings";
import CustomInput from "../../Components/CustomInput";
import CustomButton from "../../Components/CustomButton/CustomButton";
import { postRequest } from "../../Components/CustomApi/PostApi";
import { verifyEmail } from "../../Constants/ApiUrls";
import Loader from "../../Components/Loader";
import { Emailreg } from "../../Constants/ReuseVariables";

type loginScreenProps = NativeStackScreenProps<any, "EmailValidation">;
export default function EmailValidationScreen({
  navigation,
}: loginScreenProps) {
  const [email, setEmail] = useState("");
  const [showLoader, setShowLoader] = useState(false);

  const onButtonClick = () => {
    if (!email) {
      Alert.alert(loginStrings.alert, loginStrings.emailRequiredInOtp);
    } else if (Emailreg.test(email.trim()) == false) {
      Alert.alert(loginStrings.alert, loginStrings.emailNotValidAlert);
    } else {
      verifyEmailApiCalling();
    }
  };

  const verifyEmailApiCalling = async () => {
    setShowLoader(true);
    const apiData = {
      email: email,
    };
    try {
      const data = await postRequest(verifyEmail, apiData);
      setShowLoader(false);
      if (data.status === "success") {
        navigation.navigate("OtpScreen", {
          fromScreen: "EmailValidation",
          email: email,
        });
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
        title="Email Validation"
      />
      <View style={styles.emailScreenMainView}>
        <ImageBackground
          style={styles.emailImageBackground}
          resizeMode="cover"
          source={LoginImages.loginBackground}
        >
          <Text style={styles.emailVerifyHeading}>
            {loginStrings.emailVerify}
          </Text>

          <View style={styles.inputContainer}>
            <CustomInput
              placeholder={"Email"}
              iconFrom={"FontAwesome"}
              iconName={"envelope-o"}
              showThirdIcon={false}
              thirdIconName={""}
              thirdIconFrom={""}
              secureTextEntry={false}
              thirdIconSecondName={""}
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>

          <View style={styles.verifyButtonContainer}>
            <CustomButton
              text={loginStrings.verify}
              buttonPress={() => onButtonClick()}
            />
          </View>

          <Loader visible={showLoader} />
        </ImageBackground>
      </View>
    </View>
  );
}
