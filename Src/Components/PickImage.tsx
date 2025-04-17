import ImagePicker, { ImageOrVideo } from "react-native-image-crop-picker";
import { Alert } from "react-native";

const pickImage = async (
  type: string,
  showCropper: boolean,
  callback: (arg0: ImageOrVideo) => void
) => {
  try {
    await ImagePicker.clean(); // 🔹 Clear previous picker session

    const options = {
      width: 300,
      height: 300,
      cropping: showCropper,
      compressImageQuality: 0.5,
      cropperCircleOverlay: showCropper,
      mediaType: 'photo' as const,
    };

    let image;
    if (type === "camera") {
      setTimeout(async () => {
        image = await ImagePicker.openCamera(options);

        if (image) {
          callback(image);
        }
      }, 700);
    } else if (type === "gallery") {
      setTimeout(async () => {
        image = await ImagePicker.openPicker(options);

        if (image) {
          callback(image);
        }
      }, 700);
    } else {
      Alert.alert("Invalid Selection", "Please choose a valid option.");
      return;
    }
  } catch (error: any) {
    console.log("Image picker error:", error);
    if (error.code === "E_PERMISSION_MISSING") {
      Alert.alert(
        "Permission Error",
        "Gallery permission might have been revoked. Check iOS Settings."
      );
    } else if (error.code === "E_PICKER_NO_CAMERA_PERMISSION") {
      Alert.alert(
        "Camera Error",
        "Camera permission is missing. Please enable it in Settings."
      );
    } else if (error.code !== "E_PICKER_CANCELLED") {
      Alert.alert("Error", error.message);
    }
  }
};

export default pickImage;
