import messaging from '@react-native-firebase/messaging';
// import PushNotification from "react-native-push-notification";
import { PermissionsAndroid, Platform } from 'react-native';

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      // Check if POST_NOTIFICATIONS is granted
      const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, {
        title: 'Allow Notifications',
        message: 'This app requires notification permissions to send you updates.',
        buttonPositive: 'OK',
      });

      console.log('Notification Permission Result:', result);
      return result === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // Permission not required for Android < 13
  } else if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.error('iOS Notification Permissions Denied');
    }
    return enabled;
  }
  return false;
};

/**
 * Get FCM token
 */
export const getFcmToken = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      console.error('Notification permissions are not granted.');
      return null;
    }

    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
};

/**
 * Listen to FCM token refresh
 */
export const listenToTokenRefresh = (): void => {
  messaging().onTokenRefresh(newToken => {
    console.log('FCM Token Refreshed:', newToken);
    // Handle the refreshed token (e.g., send it to your server)
  });
};

/**
 * Register for APNs token (iOS only)
 */
const registerForAPNSToken = async (): Promise<void> => {
  if (Platform.OS === 'ios') {
    const apnsToken = await messaging().getAPNSToken();
    if (!apnsToken) {
      console.error('APNs token is null. Ensure Push Notifications are enabled.');
    } else {
      console.log('APNs Token:', apnsToken);
    }
  }
};

/**
 * Initialize Firebase for notifications
 */
export const initializeFirebase = async (): Promise<void> => {
  await requestNotificationPermission();

  if (Platform.OS === 'ios') {
    await registerForAPNSToken();
  }

  const fcmToken = await messaging().getToken();
  console.log('FCM Token:', fcmToken);

  // Listen for FCM token refresh
  listenToTokenRefresh();
};

// Call this function during app initialization
initializeFirebase();


// export const configureNotifications = () => {
//   PushNotification.configure({
//     onNotification: function (notification) {
//       console.log("Notification received:", notification);
//       moveToScreen("Notification", {})
//     },
//     requestPermissions: true,
//   });

//   PushNotification.createChannel(
//     {
//       channelId: "default-channel", // Must match with the notification's channelId
//       channelName: "Default Channel",
//       channelDescription: "A default channel for notifications",
//       importance: 4,
//       vibrate: true,
//     },
//     (created) => console.log(`Channel created: ${created}`)
//   );
// };

// messaging().onMessage(async (remoteMessage) => {
//   console.log("Received FCM notification:", remoteMessage);
//   sendLocalNotification(remoteMessage.notification?.title, remoteMessage.notification?.body)
// });


// export const sendLocalNotification = (title: string, body: string) => {
//   PushNotification.localNotification({
//     channelId: "default-channel",
//     title: title,
//     message: body,
//     bigText: "",
//     color: "blue",
//     vibrate: true,
//     playSound: true,
//     soundName: "default",
//     userInfo: { screen: "Notification" }
//   });
// };



// export const NavigationRef = createNavigationContainerRef();

// export function moveToScreen(name: string, params?: any) {
//   if (NavigationRef.isReady()) {
//     NavigationRef.navigate(name, params);
//   }
// }