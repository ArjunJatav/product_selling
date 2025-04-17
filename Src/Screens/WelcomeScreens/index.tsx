import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import WelcomeScreen from "./WelcomeScreen";
import LoginScreen from "../Login/LoginScreen";


export default function WelcomeStack() {
    const welcomeRoute = createNativeStackNavigator();

    return(
       <welcomeRoute.Navigator screenOptions={{headerShown:false,gestureEnabled:false}}>
        <welcomeRoute.Screen name="WelcomeScreen" component={WelcomeScreen}/>
        <welcomeRoute.Screen name="Login" component={LoginScreen}/>
       </welcomeRoute.Navigator> 
    )
}