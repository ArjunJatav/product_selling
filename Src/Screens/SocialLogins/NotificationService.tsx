import { 
  getMessaging, 
  getToken, 
  onMessage, 
  onTokenRefresh, 
  setBackgroundMessageHandler 
} from '@react-native-firebase/messaging';

import notifee, { AndroidImportance } from '@notifee/react-native';
import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';


import { setFcmToken } from '../../Redux/fcmToken';
import AsyncStorage from '@react-native-async-storage/async-storage';

class NotificationService {
  static async requestPermission() {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Allow Notifications',
            message: 'This app requires notification permissions to send you updates.',
            buttonPositive: 'OK',
          }
        );

        console.log('Notification Permission Result:', result);
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } else if (Platform.OS === 'ios') {
      console.log("Permisiifn ");
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        // console.error('iOS Notification Permissions Denied');
      }
      return enabled;
    }
    return false;
  }

 

  // static async getFcmToken() {
  //   console.log('Fetching stored FCM Token...');

  //   try {
  //     let fcmToken = await AsyncStorageWrapper.getItem('FCM_TOKEN');
  //     const messaging = getMessaging();

  //     if (!fcmToken) {
  //       fcmToken = await getToken(messaging);
  //       if (fcmToken) {
  //         await AsyncStorageWrapper.setItem('FCM_TOKEN', fcmToken);
  //       }
  //     }

  //     console.log('FCM Token:', fcmToken);
  //     return fcmToken;
  //   } catch (error) {
  //     console.log('Error fetching FCM Token:', error);
  //     return null;
  //   }
  // }

  static async getFcmToken(): Promise<string | null> {
    try {
      let fcmToken: string | null = await AsyncStorage.getItem('FCM_TOKEN');
  
      if (!fcmToken) {
        const isRegistered = messaging().isDeviceRegisteredForRemoteMessages;
        if (!isRegistered) {
          await messaging().registerDeviceForRemoteMessages();
        }
  
        fcmToken = await messaging().getToken();
        if (fcmToken) {
          await AsyncStorage.setItem('FCM_TOKEN', fcmToken);
        }
      }
  
      console.log('FCM Token:', fcmToken);
      return fcmToken;
    } catch (error) {
      console.log('Error fetching FCM Token:', error);
      return null;
    }
  }



  static async updateFcmToken(dispatch:any) {
    try {
      const messaging = getMessaging();
      const newFcmToken = await getToken(messaging);

      if (newFcmToken) {
        await AsyncStorage.setItem('FCM_TOKEN', newFcmToken);
        dispatch(setFcmToken(newFcmToken));
        console.log('FCM Token Updated:', newFcmToken);
      }
    } catch (error) {
      console.log('Error updating FCM Token:', error);
    }
  }

  static async listenToForegroundNotifications() {
   
    const messaging = getMessaging();
    console.log('Foreground message Listemrnrrnrn:');
    

    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });

    return onMessage(messaging, async remoteMessage => {
      console.log('Foreground message received:',messaging);

      if (!remoteMessage.notification) {
        console.warn('Received message without notification payload');
        return;
      }

      await notifee.displayNotification({
        title: remoteMessage.notification.title || 'New Message',
        body: remoteMessage.notification.body || 'You have a new notification',
        android: {
          channelId: 'default',
          smallIcon: 'ic_launcher',
          pressAction: { id: 'default' },
        },
        // ios: {
        //   sound: 'default', // Ensure the app can play a sound
        //   badgeCount: Number(remoteMessage?.notification?.ios?.badge), // Updates app badge count
        //   foregroundPresentationOptions: {
        //     badge: true,
        //     sound: true,
        //     alert: true,
        //   },
        // },
      });
    });
  }

  static setBackgroundMessageHandler() {
    const messaging = getMessaging();
    setBackgroundMessageHandler(messaging, async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }

  static handleTokenRefresh(dispatch:any) {
    const messaging = getMessaging();
    return onTokenRefresh(messaging, async newToken => {
      console.log('FCM Token Refreshed:', newToken);
      await AsyncStorage.setItem('FCM_TOKEN', newToken);
      dispatch(setFcmToken(newToken));
    });
  }
}

export default NotificationService;
