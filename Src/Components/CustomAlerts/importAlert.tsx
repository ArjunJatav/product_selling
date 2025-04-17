import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { textColor } from "../Colors";
import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome5Brands,
  FontAwesome6,
  FontAwesome6Brands,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
  MaterialIcons
} from "../ReactIcons";

const iconComponents: Record<string, any> = {
  FontAwesome,
  EvilIcons,
  AntDesign,
  Entypo,
  Feather,
  FontAwesome5,
  FontAwesome5Brands,
  FontAwesome6,
  FontAwesome6Brands,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
  MaterialIcons
};

export default function ImportAlert({
  visible,
  close,
  userChosen,
  iconName,
  iconFrom,
  iconFromSecond,
  iconNameSecond,
  title,
  showSubtitle= false,
  subTitle= "",
  firstButtonText = "Yes",
  secondButtonText = "No"
}: any) {
  const IconComponent = iconComponents[iconFrom];
const SecondIconComponent = iconComponents[iconFromSecond]

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
            style={styles.closeContainer}
            onPress={() => close()}
          >
            <Text style={{ fontSize: 15, marginRight: 10, color: "#000" }}>
              X
            </Text>
          </TouchableOpacity>

          <View style={styles.addCardTextContainer}>
            {/* <Text style={styles.importText}>{customAlertStrings.addCard}</Text> */}
            <Text style={styles.importText}>{title}</Text>
            {showSubtitle && <Text style={styles.editText}>
              {subTitle}
            </Text>}
            
          </View>

          <View style={styles.buttonsContainer}>
            <View style={styles.blackViewContainer}>
              <TouchableOpacity
                style={styles.buttonContainer}
                activeOpacity={0.5}
                onPress={() => userChosen("yes")}
              >
                {IconComponent && (
                  <IconComponent
                    name={iconName}
                    size={40}
                    style={{ alignSelf: "center", color: "#000" }}
                  />
                )}
               
                <Text style={{ alignSelf: "center", color: "#000" }}>{firstButtonText}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.blackViewContainer}>
              <TouchableOpacity
                style={[styles.buttonContainer, { backgroundColor: "#FCDDDE" }]}
                activeOpacity={0.5}
                onPress={() => userChosen("no")}
              >
              
             {SecondIconComponent && (
                  <SecondIconComponent
                    name={iconNameSecond}
                    size={40}
                    style={{ alignSelf: "center", color: "#000" }}
                  />
                )}
                <Text style={{ alignSelf: "center", color: "#000" }}>{secondButtonText}</Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 40,
    //   paddingVertical: 20,
  },
  closeContainer: {
    // backgroundColor: "red",
    alignItems: "flex-end",
    marginTop: 10,
  },
  addCardTextContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  importText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 18,
    textAlign:"center",marginHorizontal:20
  },
  editText: {
    color: textColor,
    fontSize: 13,
    marginTop: 5,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 100,
    gap: 20,
  },
  blackViewContainer: {
    height: 50,
    width: 105,
    backgroundColor: "#000",
    borderRadius: 15,
  },
  buttonContainer: {
    // height: 40,
    width: 100,
    backgroundColor: "#CCEDDC",
    position: "absolute",
    bottom: 5,
    padding: 25,
    alignSelf: "center",
    borderRadius: 20,
    right: 0,
  },
});
