import React from 'react'
import PrivacyPolicy from './PrivacyPolicy';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function ContentManagementStack() {
    const ContentRoute = createNativeStackNavigator();

  return (
    <ContentRoute.Navigator screenOptions={{headerShown:false,gestureEnabled:false}}>
    <ContentRoute.Screen name="PrivacyPolicy" component={PrivacyPolicy}/>
   </ContentRoute.Navigator> 
  )
}

