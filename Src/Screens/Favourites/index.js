import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import FavouriteScreen from "./FavouritesScreen";

export default function FavouriteStack() {
    const FavouriteRoute = createNativeStackNavigator();

    return(
       <FavouriteRoute.Navigator screenOptions={{headerShown:false,gestureEnabled:false}}>
        <FavouriteRoute.Screen name="FavouriteScreen" component={FavouriteScreen}/>
       </FavouriteRoute.Navigator> 
    )
}