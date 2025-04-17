import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SplashScreen from "./SplashScreen";

export default function SplashStack() {
    const splashRoute = createNativeStackNavigator();

    return(
       <splashRoute.Navigator screenOptions={{headerShown:false,gestureEnabled:false}}>
        <splashRoute.Screen name="SplashScreen" component={SplashScreen}/>
       </splashRoute.Navigator> 
    )
}