import {
  Alert,
  Platform,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { profileStrings } from "./strings";
import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "../../Components/ReactIcons";
import CustomInput from "../../Components/CustomInput";
import { placeholderColor, seaBlueColor } from "../../Components/Colors";
import CustomButton from "../../Components/CustomButton/CustomButton";
import { Emailreg } from "../../Constants/ReuseVariables";
import CameraGallery from "../../Components/CustomAlerts/CameraGallery";
import requestMediaPermissions, { requestLocationPermission } from "../../Components/requestMediaPermissions";
import pickImage from "../../Components/PickImage";
import Loader from "../../Components/Loader";
import { postMultipartRequest } from "../../Components/CustomApi/PostApi";
import { updateProfile } from "../../Constants/ApiUrls";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { setAuthToken, setUser } from "../../Redux/UserSlice";

type profileScreenProps = NativeStackScreenProps<any, "ProfileScreen">;
export default function ProfileScreen({
  navigation,
  route,
}: profileScreenProps) {
  type FormDataType = {
    name: string;
    email: string;
    phonNumber: string;
    address: string;
    website: string;
    ailment: string;
    profileImage: string;
  };

  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phonNumber: "",
    address: "",
    website: "",
    ailment: "",
    profileImage: "",
  });
  const [LocationEnabled, setLocationEnabled] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showLoader, setShowLoader] = useState(false);


  type UserType = {
    email?: string;
    full_name?: string;
    // Add other properties from your API response if needed
  };
  
  type UserState = {
    user?: UserType;
  };
  
  const user = useSelector((state: RootState) => state.user) as unknown as UserState;
  const dispatch = useDispatch();
  const handleInputChange = (key: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value, // Dynamically update the field
    }));
  };









  useEffect(() => {
    const isUser = user?.user;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      email: isUser?.email ?? "", // Ensure `email` is always a string
      name: isUser?.full_name ?? "", // Ensure `name` is always a string
    }));
  }, [user]);
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
    thirdIconSecondName: string = "",
    editable: boolean = true
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
        backgroundColor={seaBlueColor}
        editable={editable}
        keyboardType={fieldKey === "phonNumber" ? "numeric" : "default"}
      />
    </View>
  );

  const updateProfileApiCalling = async () => {
    setShowLoader(true);
    const form = new FormData();
    let notification = 1;
    let userType = 1;
    let profile = formData.profileImage;
    let location = 1;
    if (notificationEnabled) {
      notification = 1;
    } else {
      notification = 0;
    }
    if (route?.params?.userType == "store") {
      userType = 1;
    } else {
      userType = 0;
    }
if ( Platform.OS === "android") {
  profile = formData.profileImage;
} else {
  profile = formData.profileImage.replace("file://", "");
}

if (LocationEnabled) {
  location = 1;
} else {
  location = 0;
}

    form.append("full_name", formData.name);
    form.append("ailment", formData.ailment);
    form.append("location", location);
    form.append("notification", notification);
    form.append("user_type", userType);
    form.append("website", formData.website);
    form.append("phone_number", formData.phonNumber);
    if (formData.profileImage) {
      form.append("profile_image", {
        uri:profile,
        name: "profile.jpg",
        type: "image/jpeg",
      });
    }

   // postMultipartRequest(updateProfile,form)
    try {
      const response = await postMultipartRequest(updateProfile, form);
      setShowLoader(false);
      Alert.alert(
        "Success!",
        response.message,
        [
          {
            text: "Ok",
            onPress: () => {
              dispatch(setUser(response.data));
              dispatch(setAuthToken(globalThis.token));
              navigation.navigate("BottomTab");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      setShowLoader(false);
      console.log("Upload failed:", error);
    }
  };

  const onNextClick = () => {
    if (!formData.name) {
      Alert.alert(profileStrings.error, profileStrings.nameisRequired);
    } else if (!formData.email) {
      Alert.alert(profileStrings.error, profileStrings.emailisRequired);
    } else if (Emailreg.test(formData.email.trim()) == false) {
      Alert.alert(profileStrings.error, profileStrings.emailNotValid);
    } else if (route?.params?.userType == "store" && !formData.phonNumber) {
      Alert.alert(profileStrings.error, profileStrings.phoneNumberIsRequired);
    } else if (route?.params?.userType == "store" && !formData.address) {
      Alert.alert(profileStrings.error, profileStrings.addressIsRequired);
    } else if (route?.params?.userType == "store" && !formData.website) {
      Alert.alert(profileStrings.error, profileStrings.websiteIsRequired);
    } else {
      updateProfileApiCalling();
    }
  };
  const locationSwitch = async () =>{
    const isEnabled = await requestLocationPermission();
    console.log("is enabled >>",isEnabled)
    if (isEnabled) {
      setLocationEnabled((previousState) => !previousState);
    }else{
      setLocationEnabled(false)
    }
// 
  }
    


  const notificationSwitch = () =>{
  //  requestPushNotificationPermission()
    setNotificationEnabled((previousState) => !previousState);
  }
    // 

  const onProfileImageClick = async () => {
    setShowPopup(true);
  };

  const handleImagePicked = (image: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      profileImage: image.path, // Set the image path in formData
    }));
  };

  const userChoseForProfile = async (choose: string) => {
    setShowPopup(false);
    const hasPermission = await requestMediaPermissions();
    if (hasPermission) {

       pickImage(choose,true, handleImagePicked);
 
    }
  };

  const deleteProfile = () => {
    Alert.alert(
      "Confirm?",
      profileStrings.confirmToDeleteAlert,
      [
        {
          text: "Yes",
          onPress: () =>
            setFormData((prevFormData) => ({
              ...prevFormData,
              profileImage: "", // Set the image path in formData
            })),
        },
        { text: "No", onPress: () => console.log("no") },
      ],
      { cancelable: false }
    );
  };

  console.log("route?.params?.userTyperoute?.params?.userType",route?.params?.userType);
  
  return (
    <View style={styles.profileContainer}>
      <TopBar
        showBack={true}
        backButtonPress={() => navigation.pop()}
        showTitle={true}
        title={
          route?.params?.userType == "store"
            ? profileStrings.store
            : "Individual"
        }
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center", // Keeps content centered
          paddingBottom: 80,
        }}
      >
        <Text style={styles.profileTitle}>{formData.name}</Text>

        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={() => onProfileImageClick()}
        >
          {route?.params?.userType == "store" ? (
            <>
            {formData.profileImage ? (
                <Image
                  source={{ uri: formData.profileImage }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <>
                 {/* @ts-expect-error: MaterialCommunityIcons type definition is missing */}
                 <MaterialCommunityIcons
                name="home-city-outline"
                color={"#000"}
                size={35}
              />
                </>
              )}
            
              
            </>
          ) : (
            <>
           
              {formData.profileImage ? (
                <Image
                  source={{ uri: formData.profileImage }}
                  style={styles.profileImage}
                  resizeMode="cover"
                />
              ) : (
                <>
                 {/* @ts-expect-error: AntDesign type definition is missing */}
                  <AntDesign name="user" color={"#000"} size={35} />
                </>
              )}
            </>
          )}

          <TouchableOpacity
            style={styles.deleteIconContainer}
            onPress={() => {
              if (formData.profileImage) {
                deleteProfile();
              }
            }}
          >
          {/* @ts-expect-error: MaterialIcons type definition is missing */}
            <MaterialIcons name="delete" size={18} />
          </TouchableOpacity>
        </TouchableOpacity>

        <View style={styles.inputViewContainer}>
          <Text style={styles.labelText}>
            {route?.params?.userType == "store"
              ? profileStrings.store + " " + profileStrings.name
              : profileStrings.name}
          </Text>
          {renderInput(
            profileStrings.name,
            formData.name,
            "FontAwesome",
            "user-o",
            "name",
            false
          )}

          <Text style={styles.labelText}>{profileStrings.email}</Text>
          {renderInput(
            profileStrings.ProductDesigner,
            formData.email,
            "FontAwesome",
            "envelope-o",
            "email",
            false,
            "",
            "",
            false,
            "",
            false
          )}
          {route?.params?.userType != "store" && (
            <>
              <Text style={styles.labelText}>{profileStrings.Ailment}</Text>
              {renderInput(
                profileStrings.notReq,
                formData.ailment,
                "",
                "",
                "ailment",
                false
              )}
            </>
          )}
          {route?.params?.userType == "store" && (
            <>
              <Text style={styles.labelText}>
                {profileStrings.phoneNumLabel}
              </Text>
              {renderInput(
                "1-000-000-0000",
                formData.phonNumber,
                "MaterialCommunityIcons",
                "cellphone-sound",
                "phonNumber",
                false
              )}
            </>
          )}

          {route?.params?.userType == "store" && (
            <>
              <Text style={styles.labelText}>{profileStrings.address}</Text>
              {renderInput(
                "123 America Street",
                formData.address,
                "MaterialCommunityIcons",
                "home-city-outline",
                "address",
                false
              )}
            </>
          )}

          {route?.params?.userType == "store" && (
            <>
              <Text style={styles.labelText}>{profileStrings.website}</Text>
              {renderInput(
                "https://www.website.com",
                formData.website,
                "MaterialCommunityIcons",
                "monitor-cellphone",
                "website",
                false
              )}
            </>
          )}

          <View style={styles.buttonContainer}>
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
                onValueChange={locationSwitch}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
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
                onValueChange={notificationSwitch}
              />
            </View>
          </View>
        </View>
        <View style={styles.nextButtonContainer}>
          <CustomButton text="Next" buttonPress={() => onNextClick()} />
        </View>
      </ScrollView>
      <CameraGallery
        visible={showPopup}
        close={() => setShowPopup(false)}
        userChosen={(choose: string) => userChoseForProfile(choose)}
      />
      <Loader visible={showLoader} />
    </View>
  );
}
