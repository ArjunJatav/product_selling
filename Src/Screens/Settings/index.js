import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import SettingScreen from "./SettingScreen";
import ChangePassword from "./ChangePassword";
import EditProfile from "./EditProfile";
import HiddenCards from "./HiddenCards";


export default function SettngStack() {
    const SettingRoute = createNativeStackNavigator();
 
    return(
       <SettingRoute.Navigator screenOptions={{headerShown:false,gestureEnabled:false}}>
        <SettingRoute.Screen name="SettingScreen" component={SettingScreen}/>
        <SettingRoute.Screen name="ChangePassword" component={ChangePassword} />
        <SettingRoute.Screen name="EditProfile" component={EditProfile} />
        <SettingRoute.Screen name="HiddenCards" component={HiddenCards} />
       </SettingRoute.Navigator> 
    )
}