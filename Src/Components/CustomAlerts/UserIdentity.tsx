import React from "react";
import {
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { customAlertStrings } from "./strings";
import { textColor, whiteButtonTextColor } from "../Colors";
import { signUpImages } from "../../Screens/SignUp/Images";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "../ReactIcons";

export default function UserIdentity({ visible, close,userChosen }: any) {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.mainView}>
          <TouchableOpacity
            style={styles.modalCloseContainer}
            onPress={() => close()}
          >
            <Text style={styles.modalClose}>X</Text>
          </TouchableOpacity>
          <Text style={styles.whoAreYouText}>
            {customAlertStrings.whoAreYou}
          </Text>
          <Text style={styles.areYouCustomerText}>
            {customAlertStrings.areYouCustomer}
          </Text>

          <View style={styles.boxContainer}>


            <TouchableOpacity style={styles.box} onPress={()=>userChosen("Individual")}>
              <ImageBackground
                source={signUpImages.signUpBackground}
                style={styles.backgroundImage}
                imageStyle={{ borderRadius: 10 }} // Ensures rounded corners match the box
              >
                <View style={styles.upperContainer}>
                  <Text style={styles.boxTitleText}>
                    {customAlertStrings.Individual}
                  </Text>
               {/* @ts-expect-error: AntDesign type definition is missing */}
                  <AntDesign name="user" color={"#000"} size={25} />
                </View>

                <View style={styles.midContainer}>
                  <Text>{customAlertStrings.individualDescription1}</Text>
                  <Text>{customAlertStrings.individualDescription2}</Text>
                  <Text>{customAlertStrings.individualDescription3}</Text>
                </View>

                <View style={styles.lowerContainer}>
                  <View style={styles.nextBoxContainer}>
                   {/* @ts-expect-error: MaterialIcons type definition is missing */}
                    <MaterialIcons
                      name="arrow-forward-ios"
                      size={30}
                      color={whiteButtonTextColor}
                    />
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.box} onPress={()=>userChosen("store")}>
              <ImageBackground
                source={signUpImages.signUpBackground}
                style={styles.backgroundImage}
                imageStyle={{ borderRadius: 10 }} 
              >
                <View style={styles.upperContainer}>
                  <Text style={styles.boxTitleText}>
                    {customAlertStrings.Store}
                  </Text>
               {/* @ts-expect-error: MaterialCommunityIcons type definition is missing */}
                  <MaterialCommunityIcons
                    name="home-city-outline"
                    color={"#000"}
                    size={25}
                  />
                </View>

                <View style={styles.midContainer}>
                  <Text style={styles.storeDescriptionText}>
                    {customAlertStrings.storeDescription1}
                  </Text>
                  <Text style={styles.storeDescriptionText}>
                    {customAlertStrings.storeDescription2}
                  </Text>
                  <Text style={styles.storeDescriptionText}>
                    {customAlertStrings.storeDescription3}
                  </Text>
                  <Text style={styles.storeDescriptionText}>
                    {customAlertStrings.storeDescription4}
                  </Text>
                </View>

                <View style={styles.lowerContainer}>
                  <View style={styles.nextBoxContainer}>
               {/* @ts-expect-error: MaterialIcons type definition is missing */}
                    <MaterialIcons
                      name="arrow-forward-ios"
                      size={30}
                      color={whiteButtonTextColor}
                    />
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  mainView: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 10,
    paddingBottom: 30,
  },
  whoAreYouText: {
    color: "#000",
    fontSize: 25,
    alignSelf: "center",
    fontWeight: "600",
  },
  areYouCustomerText: {
    color: textColor,
    fontSize: 15,
    alignSelf: "center",
    textAlign: "center",
    marginTop: 10,
  },
  boxContainer: {
    flexDirection: "row",
    marginHorizontal: 10,
    gap: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  box: {
    borderWidth: 1,
    borderRadius: 85,
    height: 170,
    width: "45%",
    borderColor: "transparent",
  },
  backgroundImage: {
    flex: 1,
    overflow: "hidden",
  },
  upperContainer: {
    height: "15%",
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  midContainer: {
    height: "40%",
    marginTop: 0,
    paddingHorizontal: 10,
  },
  lowerContainer: {
    height: "30%",
  },
  boxTitleText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "600",
  },
  nextBoxContainer: {
    height: 50,
    width: 50,
    backgroundColor: "rgba(0, 167, 81, 0.4)",
    alignSelf: "flex-end",
    marginRight: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  storeDescriptionText: {
    fontSize: 12,
  },
  modalCloseContainer: {
    alignItems: "flex-end",
  },
  modalClose: {
    fontSize: 20,
    color: "#000",
  },
});
