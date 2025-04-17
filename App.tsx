import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import notifee, { EventType } from '@notifee/react-native';

import { StatusBar, useColorScheme, View } from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";
import RouteStack from "./Src/Route/RouteStack";
import { persistor, store } from "./Src/Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NetworkStatusProvider } from "./Src/Constants/NetworkStatusProvider";
import { setAuthToken } from "./Src/Redux/UserSlice";
import Toast from "./Src/Components/CustomToast/Toast";
import { toastRef } from "./Src/Components/CustomToast/Action";
import { navigationRef } from "./Src/Components/NavigationService";
import SocketService from "./Src/Components/Socket/SocketService";
import NotificationService from "./Src/Screens/SocialLogins/NotificationService";
import { useNetworkStatus } from "./Src/Components/ReuseComponents/Internet/useNetworkStatus";
import NoInternetModal from "./Src/Components/ReuseComponents/Internet/NoInternetModal";
import { setFcmToken } from "./Src/Redux/fcmToken";

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
 const { isConnected } = useNetworkStatus();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log("token in useeffect >>>>>>", token);
        if (token) {
          const tokenAgain = JSON.parse(token);
          dispatch(setAuthToken(tokenAgain));
          globalThis.token = tokenAgain ?? undefined;
          SocketService.initializeSocket(tokenAgain);
        }
      } catch (error) {
        console.log("Error retrieving token:", error);
      }
    };

    checkToken();
  }, []);


  useEffect(() => {
    let unsubscribeForeground :any;
    let unsubscribeTokenRefresh :any;
  
    const initNotifications = async () => {
      console.log('Initial FCM Token:');
  const Persimmion =     await NotificationService.requestPermission();
      console.log('Persimmion', Persimmion);
      let fcmToken = await NotificationService.getFcmToken();
      console.log('Initial FCM Token:', fcmToken);
  
      if (!fcmToken) {
        console.log('FCM Token is null, updating...');
        await NotificationService.updateFcmToken(dispatch);
      } else {
        dispatch(setFcmToken(fcmToken));
      }
  
      unsubscribeForeground = await NotificationService.listenToForegroundNotifications();
      NotificationService.setBackgroundMessageHandler();
      unsubscribeTokenRefresh = NotificationService.handleTokenRefresh(dispatch);
    };
  
    initNotifications();
  
    return () => {
      if (unsubscribeForeground) {
        unsubscribeForeground();
      }
      if (unsubscribeTokenRefresh) {
        unsubscribeTokenRefresh();
      }
    };
  }, []);


  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Notification Pressed:', detail.notification);
  
        // 👉 Navigate or do something
        // e.g., navigate to a screen based on notification data
        // navigation.navigate('MessageDetail', { id: detail.notification.data?.messageId });
      }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('Background Notification Pressed:', detail.notification);
        // Handle logic (maybe deep link or store in AsyncStorage)
      }
    });
  
    return () => unsubscribe();
  }, []);

  

  const isDarkMode = useColorScheme() === "dark";

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle={isDarkMode ? "light-content" : "dark-content"}
            backgroundColor={backgroundStyle.backgroundColor}
          />
          <NavigationContainer ref={navigationRef}>
            
             <NetworkStatusProvider>
              <Toast {...{ ref: toastRef }} />
              <Stack.Navigator screenOptions={{ headerShown: false }}> 
                <Stack.Screen name="Route" component={RouteStack} />
              </Stack.Navigator>
              <NoInternetModal visible={!isConnected} />
            </NetworkStatusProvider>
          </NavigationContainer>
        </View>
      </PersistGate>
    </Provider>
  );
}

export default App;
