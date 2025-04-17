import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AddNewCardScreen from "./AddNewCards";

export default function CardScreenStack({ route }: any) {
  const CardScreenRoute = createNativeStackNavigator();

  return (
    <CardScreenRoute.Navigator screenOptions={{ headerShown: false,gestureEnabled:false }}>
      <CardScreenRoute.Screen
        name="AddNewCardScreen"
        component={AddNewCardScreen}
        initialParams={route?.params} 
      />
    </CardScreenRoute.Navigator>
  );
}
