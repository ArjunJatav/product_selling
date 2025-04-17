import React from "react";
import { ImageBackground, StyleSheet, Text, TouchableOpacity } from "react-native";
import { button } from "../Images";

type CustomButtonProps = {
  text: string;
  buttonPress : ()=>void;
};

export default function CustomButton({ text,buttonPress }: CustomButtonProps) {
  return (
    <TouchableOpacity onPress={()=>buttonPress()}>
    <ImageBackground source={button} style={styles.buttonContainer} resizeMode="contain">
      <Text style={styles.buttonText}>{text}</Text>
    </ImageBackground>
    </TouchableOpacity>
  );
}



const styles = StyleSheet.create({
  buttonContainer: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText:{
color:"#fff",fontSize:22,alignSelf:"center",marginTop:-8
  }
});
