import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import SplashStack from "../Screens/SplashScreen";
import WelcomeStack from "../Screens/WelcomeScreens";
import SignUpStack from "../Screens/SignUp";
import LoginStack from "../Screens/Login";
import BottomTab from "./BottomTab";
import ProfileStack from "../Screens/Profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContentManagementStack from "../Screens/ContentManagement";
import NotificationScreen from "../Screens/Notification/NotificationScreen";
import AddNewCardScreen from "../Screens/Cards/screens/AddNewCards";
import { useSelector } from "react-redux";

export default function RouteStack() {
  const routeStack = createNativeStackNavigator();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);
  const user = useSelector((state: any) => state.user.user);

  // Function to fetch token from AsyncStorage
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log("token in useeffect >>>>>>", token);
        if (token) {
          const tokenAgain = JSON.parse(token);
          globalThis.token = tokenAgain ?? undefined;
        }
        if (user) {
          globalThis.userId = user.id
        }
        // ✅ Convert null to undefined
        setInitialRoute("SplashStack");
      } catch (error) {
        console.log("Error retrieving token:", error);
        setInitialRoute("WelcomeStack"); // Default to login in case of error
      }
    };

    checkToken();
  }, []);

  // Show a loading screen until token check is complete
  if (initialRoute === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <routeStack.Navigator
      screenOptions={{ headerShown: false, gestureEnabled: false }}
      initialRouteName={initialRoute}
    >
      <routeStack.Screen
        name="SplashStack"
        component={SplashStack}
        options={{ gestureEnabled: false }}
      />
      <routeStack.Screen
        name="WelcomeStack"
        component={WelcomeStack}
        options={{ gestureEnabled: false }}
      />
      <routeStack.Screen
        name="SignUpStack"
        component={SignUpStack}
        options={{ gestureEnabled: false }}
      />
      <routeStack.Screen
        name="ContentStack"
        component={ContentManagementStack}
        options={{ gestureEnabled: false }}
      />
      <routeStack.Screen
        name="LoginStack"
        component={LoginStack}
        options={{ gestureEnabled: false }}
      />
      <routeStack.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{ gestureEnabled: false }}
      />
      <routeStack.Screen
        name="BottomTab"
        component={BottomTab}
        options={{ gestureEnabled: false }}
      />
      <routeStack.Screen
        name="NotificationScreen"
        component={NotificationScreen}
        options={{ gestureEnabled: false }}
      />
      <routeStack.Screen
        name="AddNewCardScreen"
        component={AddNewCardScreen}
        options={{ gestureEnabled: false }}
      />
    </routeStack.Navigator>
  );
}
