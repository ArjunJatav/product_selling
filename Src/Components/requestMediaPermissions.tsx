import { PermissionsAndroid, Platform, Alert } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import messaging from "@react-native-firebase/messaging";
let isRequestingPermission = false; // Prevent duplicate requests

const requestMediaPermissions = async () => {
  if (isRequestingPermission) return false; // Prevent duplicate requests
  isRequestingPermission = true;

  let result = false; // Track permission result

  if (Platform.OS === "android") {
    try {
      const cameraGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );

      const galleryGranted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      );

      if (
        cameraGranted === PermissionsAndroid.RESULTS.GRANTED &&
        galleryGranted === PermissionsAndroid.RESULTS.GRANTED
      ) {
        result = true;
      } else {
        Alert.alert("Permissions Denied", "Enable permissions in settings.");
      }
    } catch (err) {
      console.warn(err);
    }
  } else {
    try {
      const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
      const galleryPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);

    

      if (galleryPermission === RESULTS.LIMITED) {
        Alert.alert(
          "Limited Access",
          "You have granted limited access to photos. Go to Settings > Privacy > Photos for full access."
        );
        result = true;
      }

      if (cameraPermission === RESULTS.GRANTED && galleryPermission === RESULTS.GRANTED) {
        result = true;
      } else {
        Alert.alert("Permissions Denied", "Enable Camera and Gallery access in Settings.");
      }
    } catch (err) {
      console.warn(err);
    }
  }

  isRequestingPermission = false; // ✅ Reset flag
  return result;
};

export const requestPushNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === "ios") {
    // iOS: Use Firebase Messaging to request permission
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("✅ Push Notifications enabled on iOS");
      return true;
    } else {
      Alert.alert(
        "Notification Permission",
        "Please enable notifications in Settings to receive updates."
      );
      return false;
    }
  } else {
    // Android: Use react-native-permissions
    const permission = PERMISSIONS.ANDROID.POST_NOTIFICATIONS;
    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      console.log("✅ Push Notification Permission already granted on Android");
      return true;
    }

    if (status === RESULTS.DENIED) {
      const newStatus = await request(permission);
      if (newStatus === RESULTS.GRANTED) {
        console.log("✅ Push Notification Permission granted after request");
        return true;
      } else {
        Alert.alert(
          "Notification Permission",
          "Please enable notifications in settings to receive updates."
        );
        return false;
      }
    }

    if (status === RESULTS.BLOCKED) {
      Alert.alert(
        "Permission Blocked",
        "You have permanently disabled notifications. Please enable them in Settings."
      );
      return false;
    }

    return false;
  }
};

export const requestLocationPermission = async () => {
  const permission =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE // Use LOCATION_ALWAYS if needed
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const result = await request(permission);

  if (result === RESULTS.GRANTED) {
   
    return true;
  } else {
    Alert.alert(
      "Location Permission Required",
      "Please enable location access in Settings."
    );
    return false;
  }
};


export default requestMediaPermissions;
