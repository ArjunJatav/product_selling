import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type CustomButtonProps = {
  text: string;
  buttonPress: () => void;
  borderColor? : string;
  textColor? : string
};

export default function CustomTransparentButton({
  text,
  buttonPress,
  borderColor,
  textColor
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.buttonContainer,{borderColor:borderColor ? borderColor : "#fff"}]}
      onPress={() => buttonPress()}
    >
      <Text style={[styles.buttonText,{color: textColor ? textColor : "#fff"}]}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
});
