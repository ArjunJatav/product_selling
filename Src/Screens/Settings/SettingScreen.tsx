import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TopBar from "../../Components/Topbar";
import { styles } from "./styles";
import { settingStrings } from "./strings";
import {
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "../../Components/ReactIcons";
import { blueColor, placeholderColor } from "../../Components/Colors";
import { profileStrings } from "../Profile/strings";
import CustomButton from "../../Components/CustomButton/CustomButton";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import LoginFirst from "../../Components/CustomAlerts/LoginFirst";
import { postRequestWithToken } from "../../Components/CustomApi/PostApi";
import { deleteAccount, logoutApi, updateLocationAndNotification } from "../../Constants/ApiUrls";
import { loginStrings } from "../Login/strings";
import { useDispatch, useSelector } from "react-redux";
import { setAuthToken, setUser, updateUserLocation } from "../../Redux/UserSlice";
import Loader from "../../Components/Loader";
import LoginFirstScreen from "../../Components/ReuseComponents/LoginFirstScreen";
import { requestLocationPermission, requestPushNotificationPermission } from "../../Components/requestMediaPermissions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticatedGetRequest } from "../../Components/CustomApi/getApi";
import { getDeviceId } from "../../Constants/ReuseVariables";
import { useFocusEffect } from "@react-navigation/native";

type settingScreenProps = NativeStackScreenProps<any, "Settings">;
export default function SettingScreen({ navigation }: settingScreenProps) {
  const [LocationEnabled, setLocationEnabled] = useState(true);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [showLoginFirstAlert, setShowLoginFirstAlert] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
const authToken = useSelector((state: any) => state.user.authToken);
const user = useSelector((state: any) => state.user.user);
console.log("user>>>",user)

useFocusEffect(
  React.useCallback(() => {
    if (authToken) {
      if (user.location) {
        setLocationEnabled(true)
      } else {
        setLocationEnabled(false)
      }
    
      if (user.notification) {
        setNotificationEnabled(true)
      } else {
        setNotificationEnabled(false)
      }
    }
 
  }, [])
);


const locationSwitch = async (newValue: boolean) =>{
  const isGranted = await requestLocationPermission()
  console.log("is granted >>>",isGranted)
  if (isGranted) {
    setLocationEnabled(newValue)
    notificationAndLocationEnableApiCalling(notificationEnabled,newValue,"Location")
  }else{
    notificationAndLocationEnableApiCalling(notificationEnabled,false,"Location")
    setLocationEnabled(false)
  }
  
}

const notificationAndLocationEnableApiCalling = async (notify : boolean,location : boolean,forEnable : string) => {
  const apiData = {
    "location":location,
    "notification":notify 
  }
  try {
    const data = await postRequestWithToken(updateLocationAndNotification, apiData,dispatch);
  

    if (data.status === "success") {
      if (forEnable == "Location") {
        setLocationEnabled(location)
        dispatch(updateUserLocation(location == true ? 1 : 0)); 
      } else {
        setNotificationEnabled(notify)
      }
    
    } else {
      if (forEnable == "Location") {
        setLocationEnabled(user.location == 1 ? true : false)
      }else{
        setNotificationEnabled(false)
      }
      Alert.alert(loginStrings.error, data.message);
    }
  } catch (error) {
    console.log("API Error:", error);
    let errorMessage = "An unexpected error occurred.";
    if (forEnable == "Location") {
      setLocationEnabled(user.location == 1 ? true : false)
    }else{
      setNotificationEnabled(false)
    }

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
}
  const tokenClear = async () => {
    globalThis.token = "";
    dispatch(setAuthToken(null))
    dispatch(setUser(""));
    await AsyncStorage.removeItem("userToken");
    setLoading(false);
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginStack' }], // Replace current stack with only the Login screen
    });
 //   navigation.navigate("LoginStack");
  };
  const logoutClicked = async () => {
    setLoading(true);
    const device_id = await getDeviceId();
  
    const apiData = {
      device_id: device_id,
    };

    try {
      const data = await postRequestWithToken(logoutApi, apiData,dispatch);
   

      if (data.status === "success") {
        tokenClear();
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


  const deleteAccountClicked = async () => {
  
    try {
      setLoading(true);
    
 
      const data = await authenticatedGetRequest(deleteAccount);
     
      if (!data || data.status != "success") {
        throw new Error("Failed to fetch categories");
      }
  
    if (data.status == "success") {
      tokenClear()
    }
      
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };


  const handleError = (error: unknown) => {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) errorMessage = error.message;
    Alert.alert(loginStrings.error, errorMessage);
    console.log("API Error:", errorMessage);
  };

  const notificationSwitch = async (newValue : boolean) =>{
    const isGranted = await requestPushNotificationPermission()
  
    if (isGranted) {
      setNotificationEnabled(newValue)
      notificationAndLocationEnableApiCalling(newValue,LocationEnabled,"notifictaions")
    }else{
      notificationAndLocationEnableApiCalling(false,LocationEnabled,"notifictaions")
      setNotificationEnabled(false)
    }
    
  }

  return (
    <View style={styles.settingScreenContainer}>
      <TopBar
        showBack={false}
        backButtonPress={() => console.log("back button pressed")}
        showNotification={true}
        notificationPress={() => {
          if (authToken) {
            navigation.navigate("NotificationScreen");
          } else {
            setShowLoginFirstAlert(true);
          }
        }}
      />
      {authToken  && (
        <ScrollView>
        <View style={styles.screenContainer}>
          <Text style={styles.heading}>{settingStrings.settings}</Text>
          <Text style={styles.settingDescription}>
            {settingStrings.settingDescription}
          </Text>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() =>
            navigation.navigate("EditProfile")
            //  handlePlusPress()
            }
          >
            <View style={styles.buttonIconContainer}>
              {/* @ts-expect-error: Feather type definition is missing */}
              <Feather name="edit" color={placeholderColor} size={25} />
            </View>

            <View style={styles.buttonTitleContainer}>
              <Text style={styles.buttonTitle}>
                {settingStrings.editProfile}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={()=>navigation.navigate("ChangePassword")}
          >
            <View style={styles.buttonIconContainer}>
              {/* @ts-expect-error: Feather type definition is missing */}
              <SimpleLineIcons name="lock" color={placeholderColor} size={25} />
            </View>

            <View style={styles.buttonTitleContainer}>
              <Text style={styles.buttonTitle}>{settingStrings.chngpswrd}</Text>
            </View>
          </TouchableOpacity>

{/* ///////////////////////hidden-cards////////////////////// */}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() =>
            navigation.navigate("HiddenCards")
            //  handlePlusPress()
            }
          >
            <View style={styles.buttonIconContainer}>
              {/* @ts-expect-error: Feather type definition is missing */}
              <MaterialIcons name="hide-source" color={placeholderColor} size={25} />
            </View>

            <View style={styles.buttonTitleContainer}>
              <Text style={styles.buttonTitle}>
                {settingStrings.hiddenCards}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.locationButtonContainer}>
            <View style={styles.buttonIconContainer}>
              {/* @ts-expect-error: MaterialCommunityIcons type definition is missing */}
              <MaterialCommunityIcons
                name="map-marker-multiple-outline"
                size={25}
                color={placeholderColor}
              />
            </View>

            <View style={styles.buttonTitleContainer}>
              <Text style={styles.buttonTitle}>{profileStrings.location}</Text>
            </View>

            <View style={styles.buttonToggleContainer}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                value={LocationEnabled}
                onValueChange={(newValue) => locationSwitch(newValue)}
              />
            </View>
          </View>

          <View style={styles.locationButtonContainer}>
            <View style={styles.buttonIconContainer}>
              {/* @ts-expect-error: Feather type definition is missing */}
              <Feather name="bell" size={25} color={placeholderColor} />
            </View>

            <View style={styles.buttonTitleContainer}>
              <Text style={styles.buttonTitle}>
                {profileStrings.notifications}
              </Text>
            </View>

            <View style={styles.buttonToggleContainer}>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                value={notificationEnabled}
                onValueChange={(newValue) => notificationSwitch(newValue)}
               // onValueChange={notificationSwitch}
              />
            </View>
          </View>

          <View style={styles.logoutButtonContainer}>
            <CustomButton
              text={settingStrings.logout}
              buttonPress={() => logoutClicked()}
            />
          </View>

          <TouchableOpacity
            style={styles.deleteAccountButtonContainer}
            onPress={deleteAccountClicked}
          >
            <Text style={styles.deleteAccountText}>
              {settingStrings.deleteAccount}
            </Text>
          </TouchableOpacity>

          <Text style={styles.privacyPolicyText}>
            {settingStrings.view}
            <Text
              style={{ color: blueColor }}
              onPress={() =>
                navigation.navigate("ContentStack", {
                  screen: "PrivacyPolicy",
                  params: { type: "terms" },
                })
              }
            >
              {" "}
              {settingStrings.termsNconditions}
            </Text>{" "}
            and{" "}
            <Text
              style={{ color: blueColor }}
              onPress={() =>
                navigation.navigate("ContentStack", {
                  screen: "PrivacyPolicy",
                  params: { type: "privacy" },
                })
              }
            >
              {settingStrings.privacyPolicy}
            </Text>
          </Text>
        </View>
        </ScrollView>
      )}
      {authToken == null   && (
        <LoginFirstScreen buttonClick={()=>navigation.navigate("LoginStack")}/>
      )}

      <LoginFirst
        visible={showLoginFirstAlert}
        close={() => setShowLoginFirstAlert(false)}
        userChosen={() => {
          setShowLoginFirstAlert(false);
          navigation.navigate("LoginStack");
        }}
      />
      <Loader visible={loading} />
    </View>
  );
}
