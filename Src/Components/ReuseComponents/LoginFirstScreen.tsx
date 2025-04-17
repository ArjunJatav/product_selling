import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import CustomButton from '../CustomButton/CustomButton';

type loginFirstScreenProps = {
    buttonClick: ()=>void
  };

export default function LoginFirstScreen({buttonClick} : loginFirstScreenProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.warningText}>⚠️</Text>
      <Text style={styles.messageText}>You are currently in Guest Mode.</Text>
      <Text style={[styles.messageText,{marginTop:0}]}>Please log in to access this screen.</Text>
      <View style={styles.buttonContainer}>
      <CustomButton text={'Proceed to Login'} buttonPress={buttonClick}/>
      </View>
    

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  warningText: {
    fontSize: 100,
    fontWeight: 'bold',
    color: '#721c24',
    marginBottom: 10,
  },
  messageText: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
    marginTop:20
  },
  button: {
    marginTop: 20,
    backgroundColor: '#721c24',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer:{
    width:"90%",
    marginTop:20
  }
});
