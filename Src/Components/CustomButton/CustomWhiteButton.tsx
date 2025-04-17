import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {whiteButtonColor, whiteButtonTextColor} from '../Colors';

type CustomButtonProps = {
  text: string;
  onButtonPress:()=>void,
};

export default function CustomWhiteButton({text,onButtonPress}: CustomButtonProps) {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onButtonPress}>
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: whiteButtonColor,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
  buttonText: {
    color: whiteButtonTextColor,
    fontSize: 20,
    fontWeight: '600',
  },
});
