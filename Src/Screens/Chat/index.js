import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChatScreen from "./ChatScreen";
import ChatDetail from "./ChatDetail";
import UserProfile from "../Home/UserProfile";
import MyCards from "./MyCards";
import MyFriends from "./MyFriends";
import CardDetails from "./CardDetails";


export default function ChatStack() {
    const ChatRoute = createNativeStackNavigator();

    return(
       <ChatRoute.Navigator screenOptions={{headerShown:false,gestureEnabled:false}}>
        <ChatRoute.Screen name="ChatScreen" component={ChatScreen}/>
        <ChatRoute.Screen name="ChatDetail" component={ChatDetail}/>
        <ChatRoute.Screen name="UserProfile" component={UserProfile}/>
        <ChatRoute.Screen name="MyCards" component={MyCards}/>
        <ChatRoute.Screen name="MyFriends" component={MyFriends}/>
        <ChatRoute.Screen name="CardDetails" component={CardDetails}/>
       </ChatRoute.Navigator> 
    )
}