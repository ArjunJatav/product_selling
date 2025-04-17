import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "./HomeScreen";
import UserProfile from "./UserProfile";
import MyFriends from "../Chat/MyFriends";




export default function HomeStack() {
    const HomeRoute = createNativeStackNavigator();

    return(
       <HomeRoute.Navigator screenOptions={{headerShown:false,gestureEnabled:false}}>
        <HomeRoute.Screen name="HomeScreen" component={HomeScreen}/>
        <HomeRoute.Screen name="UserProfile" component={UserProfile}/>
        <HomeRoute.Screen name="MyFriends" component={MyFriends}/>
       </HomeRoute.Navigator> 
    )
}