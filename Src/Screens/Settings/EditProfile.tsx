import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useCallback, useEffect, useState } from "react";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { styles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import {
  AntDesign,
  EvilIcons,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "../../Components/ReactIcons";
import { settingStrings } from "./strings";
import CustomInput from "../../Components/CustomInput";
import { placeholderColor, seaBlueColor } from "../../Components/Colors";
import { profileStrings } from "../Profile/strings";
import CameraGallery from "../../Components/CustomAlerts/CameraGallery";
import requestMediaPermissions from "../../Components/requestMediaPermissions";
import pickImage from "../../Components/PickImage";
import CustomButton from "../../Components/CustomButton/CustomButton";
import { setAuthToken, setUser } from "../../Redux/UserSlice";
import { postMultipartRequest } from "../../Components/CustomApi/PostApi";
import { updateProfile } from "../../Constants/ApiUrls";
import Loader from "../../Components/Loader";
import { signUpImages } from "../SignUp/Images";

type updateProfileScreenProps = NativeStackScreenProps<any, "EditProfile">;
export default function EditProfile({ navigation }: updateProfileScreenProps) {
  const user = useSelector((state: any) => state.user.user);
  type FormDataType = {
    name: string;
    email: string;
    phonNumber: string;
    address: string;
    ailment: string;
    description: string;
    profileImage: string;
  };
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<FormDataType>({
    name: "",
    email: "",
    phonNumber: "",
    address: "",
    description: "",
    ailment: "",
    profileImage: "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value, // Dynamically update the field
    }));
  };

  const [selectedOption, setSelectedOption] = useState<
    "public" | "friend" | "private" | null
  >("public");

  const options = [
    {
      key: "public",
      label: "Public",
      iconName: "user",
      IconComponent: EvilIcons,
    },
    {
      key: "friend",
      label: "Friends",
      iconName: "account-multiple-outline",
      IconComponent: MaterialCommunityIcons,
    },
    {
      key: "private",
      label: "Private",
      iconName: "eye-off-outline",
      IconComponent: Ionicons,
    },
  ];

  const handleSelection = useCallback(
    (key: "public" | "friend" | "private") => {
      setSelectedOption(key);
    },
    []
  );

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      email: user.email ?? "",
      name: user.full_name ?? "",
      ailment: user.ailment ?? "",
      description: user.description ?? "",
      phonNumber: user.phoneNumber ?? "",
      profileImage: user.imageLoc ?? "",
    }));
    setSelectedOption(user.profileType);
  }, [user]);

  const onProfileImageClick = async () => {
    setShowPopup(true);
  };
  const handleImagePicked = (image: any) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      profileImage: image.path, // Set the image path in formData
    }));
  };

  const PrivacyButton = memo(
    ({
      iconName,
      IconComponent,
      isSelected,
      onPress,
    }: {
      iconName: string;
      IconComponent: any;
      isSelected: boolean;
      onPress: () => void;
    }) => {
      return (
        <TouchableOpacity
          style={[
            styles.publicButtonContainer,
            {
              shadowColor: isSelected ? "green" : "#000",
              borderColor: isSelected ? "green" : "transparent",
            },
          ]}
          onPress={onPress}
        >
          <ImageBackground
            source={signUpImages.signUpBackground}
            resizeMode="cover"
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 15,
              borderWidth: 1,
              overflow: "hidden",
              borderColor: "transparent",
            }}
          >
            <IconComponent name={iconName} size={35} color={placeholderColor} />
          </ImageBackground>
        </TouchableOpacity>
      );
    }
  );
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

  const userChoseForProfile = async (choose: string) => {
    setShowPopup(false);
    const hasPermission = await requestMediaPermissions();
    if (hasPermission) {
      pickImage(choose, true, handleImagePicked);
    }
  };
  const updateProfileApiCalling = async () => {
    setShowLoader(true);
    const form = new FormData();
    form.append("full_name", formData.name);
    form.append("ailment", formData.ailment);
    //  form.append("profile_type", user.userType);
    form.append("phone_number", formData.phonNumber);
    form.append("profile_type", selectedOption);
    form.append("description", formData.description);
    if (formData.profileImage != user.imageLoc) {
      if (formData.profileImage) {
        form.append("profile_image", {
          uri:
            Platform.OS === "android"
              ? formData.profileImage
              : formData.profileImage.replace("file://", ""),
          name: "profile.jpg",
          type: "image/jpeg",
        });
      }
    }
    console.log("form:::", form);
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
              navigation.pop();
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



  const onUpdateClick = () => {
    if (!formData.name) {
      Alert.alert(profileStrings.error, profileStrings.nameisRequired);
    } else if (!selectedOption) {
      Alert.alert(profileStrings.error, settingStrings.privacyTypeRequired);
    } else {
      updateProfileApiCalling();
    }
  };

  return (
 <View style={styles.settingScreenContainer}>
          <TopBar
            showBack={true}
            backButtonPress={() => navigation.pop()}
            showTitle={true}
            title="Edit Profile"
          />

<KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0} // adjust this as per your header height
    >
   
      <View style={{flex:1,}}>
      <ScrollView>

          <Text style={styles.profileTitle}>{user.full_name}</Text>

          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={() => onProfileImageClick()}
          >
            {user.userType ? (
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
              {user.userType
                ? settingStrings.store + " " + settingStrings.name
                : settingStrings.name}
            </Text>
            <CustomInput
              placeholder={settingStrings.name}
              iconFrom={"FontAwesome"}
              iconName={"user-o"}
              showThirdIcon={false}
              thirdIconFrom={""}
              thirdIconName={""}
              thirdIconSecondName={""}
              value={formData.name}
              //  secureTextEntry={true}
              backgroundColor={seaBlueColor}
              onChangeText={(text) => handleInputChange("name", text)}
            />
          </View>

          {user.userType ? (
            <View style={styles.inputViewContainer}>
              <Text style={styles.labelText}>
                {profileStrings.phoneNumLabel}
              </Text>
              <CustomInput
                placeholder={"1-000-000-0000"}
                iconFrom={"MaterialCommunityIcons"}
                iconName={"cellphone-sound"}
                showThirdIcon={false}
                thirdIconFrom={"Feather"}
                thirdIconName={"eye"}
                thirdIconSecondName={"eye-off"}
                value={formData.phonNumber}
                //  secureTextEntry={true}
                backgroundColor={seaBlueColor}
                onChangeText={(text) => handleInputChange("phoneNumber", text)}
                keyboardType="numeric"
                editable={formData.phonNumber ? false : true}
              />
            </View>
          ) : null}
          <View style={styles.inputViewContainer}>
            <Text style={styles.labelText}>{profileStrings.email}</Text>
            <CustomInput
              placeholder={profileStrings.ProductDesigner}
              iconFrom={"FontAwesome"}
              iconName={"envelope-o"}
              showThirdIcon={false}
              thirdIconFrom={"Feather"}
              thirdIconName={"eye"}
              thirdIconSecondName={"eye-off"}
              value={formData.email}
              // secureTextEntry={true}
              backgroundColor={seaBlueColor}
              onChangeText={(text) => handleInputChange("email", text)}
              // keyboardType="numeric"
              editable={false}
            />
          </View>

          {!user.userType && (
            <View style={styles.inputViewContainer}>
              <Text style={styles.labelText}>{profileStrings.Ailment}</Text>
              <CustomInput
                placeholder={profileStrings.notReq}
                iconFrom={""}
                iconName={""}
                showThirdIcon={false}
                thirdIconFrom={"Feather"}
                thirdIconName={"eye"}
                thirdIconSecondName={"eye-off"}
                value={formData.ailment}
                //  secureTextEntry={true}
                backgroundColor={seaBlueColor}
                onChangeText={(text) => handleInputChange("ailment", text)}
              />
            </View>
          )}

          <View style={styles.inputViewContainer}>
            <Text style={styles.labelText}>{settingStrings.description}</Text>

            <View style={styles.descriptionInputContainer}>
              <TextInput
                placeholder="............"
                placeholderTextColor={placeholderColor}
                value={formData.description}
                onChangeText={(text) => handleInputChange("description", text)}
                textAlignVertical="top"
               multiline={formData.description ? true : false}
                style={{ color: "#000" }}
              />
            </View>
          </View>

          <Text style={styles.privacyText}>{settingStrings.privacy}</Text>
          <View style={styles.privacyButtonContainer}>
            {options.map(({ key, iconName, IconComponent }) => (
              <PrivacyButton
                key={key}
                iconName={iconName}
                IconComponent={IconComponent}
                isSelected={selectedOption === key} // ✅ Only update selected button
                onPress={() => handleSelection(key)}
              />
            ))}
          </View>

          {/* Privacy Labels */}
          <View style={styles.privacyButtonContainer}>
            {options.map(({ key, label }) => (
              <Text
                key={key}
                style={[
                  styles.publicButtonText,
                  selectedOption === key && { color: "green" },
                ]}
              >
                {label}
              </Text>
            ))}
          </View>

          <CameraGallery
            visible={showPopup}
            close={() => setShowPopup(false)}
            userChosen={(choose: string) => userChoseForProfile(choose)}
          />
          <View
            style={[
              styles.updatebuttonContainer,
              { marginHorizontal: 15, marginBottom: 20 },
            ]}
          >
            <CustomButton text="Update" buttonPress={() => onUpdateClick()} />
          </View>

          <Loader visible={showLoader} />
          </ScrollView>
     </View>
   
      </KeyboardAvoidingView>

      </View>
     
   
  );
}
