import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { customAlertStrings } from "./strings";
import { yellowColor } from "../Colors";

export default function LoginFirst({ visible, close, userChosen }: any) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={close}
    >
      <TouchableOpacity style={styles.container} activeOpacity={1} onPress={close}>
        <View style={styles.modalView}>
          <Text style={styles.warningText}>⚠ Warning</Text>
          <Text style={styles.loginFirstText}>{customAlertStrings.loginFirst}</Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={userChosen}>
              <Text style={styles.primaryButtonText}>{customAlertStrings.proceedToLogin}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={close}>
              <Text style={styles.secondaryButtonText}>{customAlertStrings.staylogout}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={close}>
              <Text style={styles.cancelButtonText}>{customAlertStrings.cancel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Dark overlay
  },
  modalView: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  warningText: {
    color: yellowColor,
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginFirstText: {
    color: "#333",
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 15,
  },
  buttonsContainer: {
    marginTop: 50,
    width: "100%",
  },
  button: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 6,
  },
  primaryButton: {
    backgroundColor: "#007BFF",
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#F5F5F5",
  },
  secondaryButtonText: {
    color: "#007BFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
