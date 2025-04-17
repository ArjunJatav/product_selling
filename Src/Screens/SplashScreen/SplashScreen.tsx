import React from 'react';
import {Image, ImageBackground,} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {styles} from './styles';
import {splashBackground, splashLogo} from './Images';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SplashScreenProps = NativeStackScreenProps<any, 'SplashScreen'>;
export default function SplashScreen({navigation}: SplashScreenProps) {
    setTimeout(() => {
      checkToken()
    }, 5000);

    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        console.log("token in useeffect >>>>>>",token)
        if (token) {
          const tokenAgain = JSON.parse(token);
          globalThis.token = tokenAgain ?? undefined;
        }
      
        if (token) {
          navigation.navigate("BottomTab")
        } else {
          navigation.navigate("WelcomeStack")
        }
      } catch (error) {
        console.log("Error retrieving token:", error);
        navigation.navigate("WelcomeStack")
      }
    };

    
  return (
    <ImageBackground style={styles.splashBackground} source={splashBackground}>
      <Image
        source={splashLogo}
        style={styles.splashLogo}
        resizeMode="contain"
      />
    </ImageBackground>
  );
}
