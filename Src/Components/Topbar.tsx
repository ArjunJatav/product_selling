import React from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { logo } from "./Images";

import {
  Feather,
  Ionicons,
  MaterialIcons,
} from "./ReactIcons";

type TopbarProps = {
  showBack: boolean;
  backButtonPress: () => void;
  showTitle?: boolean;
  title?: string;
  showNotification?: boolean;
  notificationPress?: () => void;
  showDelete?: boolean;
  deletePress?: () => void;
  showUserIcon?: boolean;
  userIconClick?: () => void;
  
};

export default function TopBar({
  showBack,
  backButtonPress,
  showTitle,
  title,
  showNotification,
  notificationPress,
  showDelete,
  deletePress,
  showUserIcon,
  userIconClick,
}: TopbarProps) {
  return (
    <SafeAreaView style={{ backgroundColor: "#fff" }}>
      <View style={styles.topbarContainer}>
        {showBack == true && (
          <TouchableOpacity
            style={styles.backButtonContainer}
            onPress={() => backButtonPress()}
          >
            {/*@ts-expect-error: Icon type definition is missing */}
            <Ionicons name="chevron-back" size={22} color={"#000"} />
          </TouchableOpacity>
        )}
        {showTitle == true && (
          <TouchableOpacity
            style={styles.titleContainer}
            onPress={() => (showBack ? backButtonPress() : console.log("b"))}
          >
            <Text style={styles.title}>{title}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.topBarLogoContainer}>
          <Image source={logo} style={styles.topBarLogo} resizeMode="contain" />
        </View>

        {showNotification == true && (
          <TouchableOpacity
            style={styles.topBarNotificationContainer}
            onPress={notificationPress}
          >
            {/* @ts-expect-error: Feather type definition is missing */}
            <Feather name="bell" color={"#000"} size={28} />
          </TouchableOpacity>
        )}
        {showUserIcon == true && globalThis.token && (
          <TouchableOpacity
            style={[
              styles.topBarNotificationContainer,
              { right: showNotification == true ? 50 : 15 },
            ]}
            onPress={userIconClick}
          >
            {/* @ts-expect-error: Feather type definition is missing */}
            <Ionicons name="person-circle-outline" color={"#000"} size={28} />
          </TouchableOpacity>
        )}
        {showDelete == true && (
          <TouchableOpacity
            style={styles.topBarDeleteContainer}
            onPress={deletePress}
          >
            {/* @ts-expect-error: Feather type definition is missing */}
            <MaterialIcons name="delete-outline" color={"#000"} size={28} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topbarContainer: {
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    flexDirection: "row", // ✅ Arrange items in a row
    alignItems: "center", // ✅ Align items vertically in the center
    borderBottomWidth:0.5,
    borderColor:"#ccc",
  },
  topBarLogo: {
    height: 40,
    width: 40,
  },
  topBarLogoContainer: {
    flex: 1, // ✅ Makes the logo container take available space
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonContainer: {
    position: "absolute", // ✅ Ensures it stays on the left
    left: 10, // ✅ Moves it to the left side
    top: "50%",
    transform: [{ translateY: -10 }],
    zIndex: 100,
  },
  titleContainer: {
    position: "absolute", // ✅ Ensures it stays on the left
    left: 35, // ✅ Moves it to the left side
    // top: '50%',
    zIndex: 100,
  },
  title: {
    fontSize: 18,
    color: "#000",
  },
  topBarNotificationContainer: {
    position: "absolute", // ✅ Ensures it stays on the left
    right: 15, // ✅ Moves it to the left side
    top: 15,
    zIndex: 100,
    // backgroundColor:"red"
  },
  topBarDeleteContainer: {
    position: "absolute",
    right: 15, // ✅ Moves it to the left side
    top: 15,
    zIndex: 100,
  },
});
