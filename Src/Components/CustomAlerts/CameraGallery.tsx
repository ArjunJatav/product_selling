import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { EvilIcons, Foundation } from "../ReactIcons";
import { customAlertStrings } from "./strings";
import { blueColor } from "../Colors";

export default function CameraGallery({ visible, close, userChosen }: any) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={() => close()}
    >
      <TouchableOpacity style={styles.container} onPress={() => close()}>
        <View style={styles.mainView}>
          <TouchableOpacity
            style={styles.closeModalContainer}
            onPress={() => close()}
          >
            <Text style={styles.close}>X</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{customAlertStrings.chooseFrom}</Text>
          <View style={styles.buttonViewContainer}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => userChosen("camera")}
            >
              {/* @ts-expect-error: EvilIcons type definition is missing */}
              <EvilIcons name="camera" size={45} color={"#000"} />
              <Text style={styles.buttonText}>{customAlertStrings.camera}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => userChosen("gallery")}
            >
              {/* @ts-expect-error: Foundation type definition is missing */}
              <Foundation name="photo" size={45} color={"#000"} />
              <Text style={styles.buttonText}>
                {customAlertStrings.gallery}
              </Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  mainView: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
  },
  buttonViewContainer: {
    // backgroundColor: "green",
    flexDirection: "row",
    alignSelf: "center",
    gap: 50,
    marginTop: 20,
  },
  buttonContainer: {
    // backgroundColor: "red",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderWidth: 1,
    borderColor: blueColor,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 15,
    color: "#000",
    marginTop: 5,
  },
  title: {
    color: "#000",
    fontSize: 22,
    alignSelf: "center",
    fontWeight: "600",
  },
  closeModalContainer: {
    position: "absolute",
    right: 10,
    top: 5,
  },
  close: {
    fontSize: 18,
    color: "#000",
  },
});
