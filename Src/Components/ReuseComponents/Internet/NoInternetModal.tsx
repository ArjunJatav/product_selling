import React from "react";
import { Modal, View, Text, StyleSheet, Image } from "react-native";
import { windowWidth } from "../../../Constants/ReuseVariables";

const NoInternetModal = ({ visible }: { visible: boolean }) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Image
            source={require("../../../Assets/Common/nointernet.gif")} 
            style={styles.icon}
            resizeMode="contain"
          />
          <Text style={styles.title}>No Internet Connection</Text>
          <Text style={styles.message}>
            You are currently offline. Please check your internet connection and
            try again.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // fixed typo and improved background
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    width: windowWidth * 0.9,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 15,

  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#333",
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default NoInternetModal;
