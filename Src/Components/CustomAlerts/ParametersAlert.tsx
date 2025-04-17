import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { signUpImages } from "../../Screens/SignUp/Images";
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
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "../ReactIcons";
import { button } from "../Images";

const iconComponents: Record<string, React.ComponentType<any>> = {
  FontAwesome: FontAwesome as unknown as React.ComponentType<any>,
  EvilIcons: EvilIcons as unknown as React.ComponentType<any>,
  AntDesign: AntDesign as unknown as React.ComponentType<any>,
  Entypo: Entypo as unknown as React.ComponentType<any>,
  Feather: Feather as unknown as React.ComponentType<any>,
  FontAwesome5: FontAwesome5 as unknown as React.ComponentType<any>,
  FontAwesome5Brands: FontAwesome5Brands as unknown as React.ComponentType<any>,
  FontAwesome6: FontAwesome6 as unknown as React.ComponentType<any>,
  FontAwesome6Brands: FontAwesome6Brands as unknown as React.ComponentType<any>,
  Fontisto: Fontisto as unknown as React.ComponentType<any>,
  Foundation: Foundation as unknown as React.ComponentType<any>,
  Ionicons: Ionicons as unknown as React.ComponentType<any>,
  MaterialCommunityIcons:
    MaterialCommunityIcons as unknown as React.ComponentType<any>,
  Octicons: Octicons as unknown as React.ComponentType<any>,
  SimpleLineIcons: SimpleLineIcons as unknown as React.ComponentType<any>,
  Zocial: Zocial as unknown as React.ComponentType<any>,
  MaterialIcons: MaterialIcons as unknown as React.ComponentType<any>,
};

// Define the type for each icon entry
type IconItem = {
  iconFrom: string;
  iconName: string;
  title: string;
  onPress: () => void;
};

// Define the props for the component
type ParameterAlertProps = {
  numberOfRow: number;
  iconData: IconItem[];
  showBackgroundImage?: boolean;
  selectedData?: string;
};

export default function ParametersAlert({
  numberOfRow,
  iconData,
  selectedData,
  showBackgroundImage,
}: ParameterAlertProps) {
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

  return (
    <ImageBackground
      source={signUpImages.signUpBackground}
      style={styles.backgroundImage}
      resizeMode="stretch"
    >
      <View style={styles.container}>
        {iconData.slice(0, numberOfRow).map((item, index) => {
          const IconComponent = iconComponents[item.iconFrom];
          const title = selectedTitle ? selectedTitle : selectedData;
          const isSelected = title == item.title;
          return (
            IconComponent && (
              <TouchableOpacity
                style={[styles.rowBackground]}
                onPress={
                  showBackgroundImage
                    ? () => {
                        item.onPress(); // ✅ Call the function
                        setSelectedTitle(item.title);
                      }
                    : item.onPress
                }
                key={index}
              >
                {showBackgroundImage ? (
                  <>
                    {isSelected ? (
                      <ImageBackground
                        source={button}
                        resizeMode="stretch"
                        style={[styles.rowBackground,{width:140,marginLeft:-15}]}
                      >
                        <IconComponent
                          name={item.iconName}
                          size={22}
                          color={isSelected? "#fff" : "#000"}
                        />
                        <Text style={{color:isSelected? "#fff" : "#000"}}>{item.title}</Text>
                      </ImageBackground>
                    ) : (
                      <View  style={[styles.rowBackground,{width:140,marginLeft:-15}]}>
                        <IconComponent
                          name={item.iconName}
                          size={22}
                          color={"#000"}
                        />
                        <Text>{item.title}</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <>
                    <IconComponent
                      name={item.iconName}
                      size={22}
                      color={"#000"}
                    />
                    <Text>{item.title}</Text>
                  </>
                )}
              </TouchableOpacity>
            )
          );
        })}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140,
    paddingLeft: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    zIndex: 1000,
    // backgroundColor:"#fff"
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  rowContainer: {
    flexDirection: "row",
    marginVertical: 8,
    // gap: 10,
    alignItems: "center",
    // padding: 8,
    //  borderRadius: 5,
  },
  rowBackground: {
    flexDirection: "row",
    // backgroundColor:"red",
    // marginVertical: 8,
    gap: 10,
    alignItems: "center",
    width: "100%",
    padding: 8,
    // borderRadius: 5,
  },
  imageBackground: {
    flex: 1, // Allows ImageBackground to stretch
    width: "100%", // Ensures full width
    justifyContent: "center",
    alignItems: "center",
  },
  selectedRow: {
    //  backgroundColor: "#d3d3d3", // Light gray background for selected row
  },
});
