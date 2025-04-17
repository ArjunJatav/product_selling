import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ProfileScreen from "./ProfileScreen";


export default function ProfileStack({ route }) {
  const ProfileRoute = createNativeStackNavigator();

  return (
    <ProfileRoute.Navigator screenOptions={{ headerShown: false,gestureEnabled:false }}>
      <ProfileRoute.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        initialParams={route?.params} // ✅ Pass params from stack to screen
      />
      
    </ProfileRoute.Navigator>
  );
}
