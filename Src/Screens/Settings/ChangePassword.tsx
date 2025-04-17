import { Alert, ImageBackground, Text, View } from "react-native";
import React, {  useState } from "react";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LoginImages } from "../Login/Images";
import { settingStrings } from "./strings";
import CustomInput from "../../Components/CustomInput";
import { seaBlueColor } from "../../Components/Colors";
import CustomButton from "../../Components/CustomButton/CustomButton";
import { passwordReg } from "../../Constants/ReuseVariables";
import { postRequestWithToken } from "../../Components/CustomApi/PostApi";
import { changePasswordApi } from "../../Constants/ApiUrls";
import { loginStrings } from "../Login/strings";
import Loader from "../../Components/Loader";
import { useDispatch } from "react-redux";

type changePasswordScreenProps = NativeStackScreenProps<any, "OtpScreen">;
export default function ChangePassword({
  navigation,
}: changePasswordScreenProps) {
  const [passwordsForm, setPasswordsForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (key: string, value: string) => {
    setPasswordsForm((prevState) => ({
      ...prevState,
      [key]: value, // Dynamically update the field
    }));
  };

  const onUpdateButtonClick = () => {
    if (!passwordsForm.oldPassword) {
      Alert.alert(settingStrings.alert, settingStrings.oldPasswordisRequired);
    } else if (!passwordsForm.newPassword) {
      Alert.alert(settingStrings.alert, settingStrings.newPasswordisRequired);
    } else if (!passwordsForm.confirmNewPassword) {
      Alert.alert(
        settingStrings.alert,
        settingStrings.confirmNewPasswordisRequired
      );
    } else if (passwordReg.test(passwordsForm.newPassword) == false) {
      Alert.alert(settingStrings.alert, settingStrings.passwordTestAlert);
    } else if (passwordReg.test(passwordsForm.confirmNewPassword) == false) {
      Alert.alert(settingStrings.alert, settingStrings.passwordTestAlert);
    } else if (passwordsForm.newPassword != passwordsForm.confirmNewPassword) {
      Alert.alert(
        settingStrings.alert,
        settingStrings.paswordandConfirmpasswordnotsameAlert
      );
    } else {
      changePasswordApiCalling();
    }
  };

  const changePasswordApiCalling = async () => {
    setLoading(true);
    const apiData = {
      old_password: passwordsForm.oldPassword,
      password: passwordsForm.newPassword,
    };
    try {
      const data = await postRequestWithToken(
        changePasswordApi,
        apiData,
        dispatch
      );

      if (data.status === "success") {
        setLoading(false);
        Alert.alert(
          "Success!",
          settingStrings.passwordChangedSuccess,
          [
            {
              text: "Ok",
              onPress: () => {
                navigation.pop();
              },
            },
          ],
          { cancelable: false }
        );
      } else {
        setLoading(false);
        Alert.alert(loginStrings.error, data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("API Error:", error);
      let errorMessage = "An unexpected error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      if (errorMessage !== "Session expired") {
        Alert.alert(loginStrings.error, errorMessage);
      }
      console.log("API Call Failed:", error);
    }
  };
  return (
    <View style={[styles.settingScreenContainer, { backgroundColor: "#000" }]}>
      <TopBar
        showBack={true}
        backButtonPress={() => navigation.pop()}
        showTitle={true}
        title="Change Password"
      />
      <View style={styles.changePasswordMainView}>
        <ImageBackground
          style={styles.imageBackground}
          resizeMode="cover"
          source={LoginImages.loginBackground}
        >
          <Text style={styles.changePasswordHeading}>
            {settingStrings.changePassword}
          </Text>
          <Text style={styles.changePasswordDescription}>
            {settingStrings.changePasswordDescription}
          </Text>

          <View style={styles.inputContainer}>
            <CustomInput
              placeholder={settingStrings.oldPassword}
              iconFrom={"SimpleLineIcons"}
              iconName={"lock"}
              showThirdIcon={true}
              thirdIconFrom={"Feather"}
              thirdIconName={"eye"}
              thirdIconSecondName={"eye-off"}
              value={passwordsForm.oldPassword}
              secureTextEntry={true}
              backgroundColor={seaBlueColor}
              onChangeText={(text) => handleInputChange("oldPassword", text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomInput
              placeholder={settingStrings.newPassword}
              iconFrom={"SimpleLineIcons"}
              iconName={"lock"}
              showThirdIcon={true}
              thirdIconFrom={"Feather"}
              thirdIconName={"eye"}
              thirdIconSecondName={"eye-off"}
              value={passwordsForm.newPassword}
              secureTextEntry={true}
              backgroundColor={seaBlueColor}
              onChangeText={(text) => handleInputChange("newPassword", text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomInput
              placeholder={settingStrings.confirmNewPassword}
              iconFrom={"SimpleLineIcons"}
              iconName={"lock"}
              showThirdIcon={true}
              thirdIconFrom={"Feather"}
              thirdIconName={"eye"}
              thirdIconSecondName={"eye-off"}
              value={passwordsForm.confirmNewPassword}
              secureTextEntry={true}
              backgroundColor={seaBlueColor}
              onChangeText={(text) =>
                handleInputChange("confirmNewPassword", text)
              }
            />
          </View>

          <View style={styles.updatebuttonContainer}>
            <CustomButton
              text={settingStrings.update}
              buttonPress={() => onUpdateButtonClick()}
            />
          </View>

          <Loader visible={loading} />
        </ImageBackground>
      </View>
    </View>
  );
}
