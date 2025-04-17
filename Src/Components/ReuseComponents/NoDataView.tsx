import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { logo } from "../Images";
import { yellowColor } from "../Colors";

export default function NoDataView() {
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} resizeMode="contain"/>
      <Text style={styles.title}>NO DATA FOUND</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    height: 150,
    width: 150,
  },
  title:{
    fontSize:25,marginTop:20,color:yellowColor,fontWeight:"bold"
  }
});
