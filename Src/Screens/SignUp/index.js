import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SignUpScreen from "./SignUpScreen";
import OtpScreen from "./OtpScreen";
import SetPassword from "../Login/SetPassword";
import ProfileScreen from "../Profile/ProfileScreen";



export default function SignUpStack({route}) {
    const signupRoute = createNativeStackNavigator();

    return(
       <signupRoute.Navigator screenOptions={{headerShown:false,gestureEnabled:false}}>
        <signupRoute.Screen name="SignUp" component={SignUpScreen}/>
        <signupRoute.Screen name="OtpScreen" component={OtpScreen}/>
        <signupRoute.Screen name="SetPassword" component={SetPassword}/>
        <signupRoute.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        initialParams={route?.params} // ✅ Pass params from stack to screen
      />
       </signupRoute.Navigator> 
    )
}