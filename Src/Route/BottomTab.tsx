import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import HomeStack from "../Screens/Home";
import ChatStack from "../Screens/Chat";
import FavouriteStack from "../Screens/Favourites";
import SettngStack from "../Screens/Settings";
import { BottomTabImages } from "./Images";
import { styles } from "./styles";
import {
  purpleColor,
  whiteButtonTextColor,
  whiteLessOpacityColor,
} from "../Components/Colors";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "../Components/ReactIcons";
import {
  getFocusedRouteNameFromRoute,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const Tab = createBottomTabNavigator();
type updateAddNewCardScreenProps = NativeStackScreenProps<any, "BottomTab">;

// const navigation = useNavigation();

export default function BottomTab({ navigation }: updateAddNewCardScreenProps) {
  // 🔹 Custom Floating Button
  const CustomTabButton = ({ onPress }: any) => (
    <TouchableOpacity
      style={customStyles.elevatedButton}
      onPress={() => handlePlusButtonPress()}
    >
      <View style={customStyles.elevatedButtonInner}>
        {/* 🔹 NEW ICON (Customizable) */}
        {/* @ts-expect-error: FontAwesome type definition is missing */}
        <Feather name="plus" size={30} color={"#fff"} />
      </View>
    </TouchableOpacity>
  );

const handlePlusButtonPress = () => {
  navigation.navigate("AddNewCardScreen", { fromScreen: "BottomTab" });

}

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveBackgroundColor: whiteButtonTextColor,
        tabBarInactiveBackgroundColor: whiteButtonTextColor,
        tabBarShowLabel: false,
        tabBarStyle: customStyles.tabBar,
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "Home";
          return {
            tabBarStyle: {
              display: routeName === "UserProfile" || routeName === "MyFriends"  ? "none" : "flex", 
              backgroundColor: whiteButtonTextColor,
            },
            tabBarIcon: ({ focused }) => (
              <Image
                source={BottomTabImages.homePage}
                style={[
                  styles.homeTabIcon,
                  { tintColor: focused ? "#fff" : whiteLessOpacityColor },
                ]}
              />
            ),
          };
        }}
        // options={{
        //   tabBarIcon: ({ focused }) => (
        //     <Image
        //       source={BottomTabImages.homePage}
        //       style={[
        //         styles.homeTabIcon,
        //         { tintColor: focused ? "#fff" : whiteLessOpacityColor },
        //       ]}
        //     />
        //   ),
        //   tabBarStyle: { backgroundColor: whiteButtonTextColor },
        // }}
      />

      {/* Favourite Tab */}
      <Tab.Screen
        name="Favourite"
        component={FavouriteStack}
        options={{
          tabBarIcon: ({ focused }) => (
            // @ts-expect-error: Entypo type definition is missing
            <Entypo
              name={focused ? "heart" : "heart-outlined"}
              size={30}
              color={focused ? "#fff" : whiteLessOpacityColor}
            />
          ),
          tabBarStyle: { backgroundColor: whiteButtonTextColor },
        }}
      />

      {/* Chat Tab */}
      <Tab.Screen
        name="Chat"
        component={ChatStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "ChatScreen";
          return {
            tabBarStyle: {
              display:
                routeName === "ChatDetail" || routeName == "UserProfile" || routeName == "MyCards" || routeName == "MyFriends" || routeName === "CardDetails"
                  ? "none"
                  : "flex", // ✅ Hide tab bar in ChangePassword
              backgroundColor: whiteButtonTextColor,
            },
            tabBarIcon: ({ focused }) => (
              //  @ts-expect-error: MaterialCommunityIcons type definition is missing
              <MaterialCommunityIcons
                name={focused ? "chat-processing" : "chat-processing-outline"}
                size={30}
                color={focused ? "#fff" : whiteLessOpacityColor}
              />
            ),
          };
        }}
        // options={{
        //   tabBarIcon: ({ focused }) => (
        //     //  @ts-expect-error: MaterialCommunityIcons type definition is missing
        //     <MaterialCommunityIcons
        //       name={focused ? "chat-processing" : "chat-processing-outline"}
        //       size={30}
        //       color={focused ? "#fff" : whiteLessOpacityColor}
        //     />
        //   ),
        //   tabBarStyle: { backgroundColor: whiteButtonTextColor },
        // }}
      />

      {/* Settings Tab */}
      <Tab.Screen
        name="Settings"
        component={SettngStack}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? "SettingScreen";
          return {
            tabBarStyle: {
              display:
                routeName === "ChangePassword" ||
                routeName === "EditProfile" ||
                routeName == "HiddenCards"
                  ? "none"
                  : "flex", // ✅ Hide tab bar in ChangePassword
              backgroundColor: whiteButtonTextColor,
            },
            tabBarIcon: ({ focused }) => (
              //  @ts-expect-error: Ionicons type definition is missing
              <Ionicons
                name="options-outline"
                size={30}
                color={focused ? "#fff" : whiteLessOpacityColor}
              />
            ),
          };
        }}
      />

      {/* 🔹 NEW Floating Tab at Last Position */}
      <Tab.Screen
        name="NewFeature"
        component={HomeStack} // Dummy component, replace if needed
        options={{
          tabBarButton: (props) => (
            // @ts-check
            <CustomTabButton {...props} />
          ),
          tabBarStyle: { backgroundColor: whiteButtonTextColor },
        }}
      />
    </Tab.Navigator>
  );
}

// 🔹 Custom Styles
const customStyles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    height: 70,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    elevation: 10,
  },
  elevatedButton: {
    top: -25, // Elevated effect
    justifyContent: "center",
    alignItems: "center",
    right: 5,
  },
  elevatedButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: purpleColor, // Customize button color
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 5 },
    // shadowOpacity: 0.3,
    // shadowRadius: 5,
    // elevation: 10,
    borderWidth: 10,
    borderColor: purpleColor,
  },
});
