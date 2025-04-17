import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import LoginScreen from "./LoginScreen";
import EmailValidationScreen from "./EmailValidation";
import OtpScreen from "../SignUp/OtpScreen";
import SetPassword from "./SetPassword";



export default function LoginStack() {
    const loginRoute = createNativeStackNavigator();

    return(
       <loginRoute.Navigator screenOptions={{headerShown:false,gestureEnabled:false}}>
        <loginRoute.Screen name="Login" component={LoginScreen}/>
        <loginRoute.Screen name="EmailValidation" component={EmailValidationScreen}/>
        <loginRoute.Screen name="OtpScreen" component={OtpScreen}/>
        <loginRoute.Screen name="SetPassword" component={SetPassword}/>
       </loginRoute.Navigator> 
    )
}