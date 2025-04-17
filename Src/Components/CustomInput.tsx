import React, { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
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
} from "./ReactIcons";
import { placeholderColor } from "./Colors";
import { KeyboardTypeOptions } from "react-native";

type InputProps = {
  placeholder: string;
  iconFrom: string;
  iconName: string;
  secureTextEntry?: boolean;
  onChangeText?: (text: string) => void;
  showThirdIcon:boolean,
  thirdIconFrom: string,
  thirdIconName: string,
  thirdIconSecondName:string,
  value:string,
  backgroundColor? :string,
  editable? : boolean;
  keyboardType?: KeyboardTypeOptions; 
};

// Icon Mapping for Efficiency
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
};

export default function CustomInput({
  placeholder,
  iconFrom,
  iconName,
  secureTextEntry = false,
  onChangeText,
  showThirdIcon,
  thirdIconName,
  thirdIconFrom,
  thirdIconSecondName,
  value,
  backgroundColor,
  editable,
  keyboardType = "default",
}: InputProps) {
     const [isSecure, setIsSecure] = useState(secureTextEntry);
  const IconComponent = iconComponents[iconFrom];
  const ThirdIconComponent =
  showThirdIcon && thirdIconFrom ? iconComponents[thirdIconFrom] : null;
  return (
    <View style={[styles.container,{backgroundColor:backgroundColor? backgroundColor : "#fff"}]}>
      {/* Icon Container */}
      <View style={styles.iconContainer}>
        {IconComponent && <IconComponent name={iconName} size={22} color={placeholderColor} />}
      </View>

      {/* Input Field */}
      <TextInput
        placeholder={placeholder}
        style={styles.textInput}
        placeholderTextColor={placeholderColor}
        secureTextEntry={isSecure}
        onChangeText={onChangeText}
        value={value}
        editable={editable}
        keyboardType={keyboardType}
      />

{showThirdIcon && ThirdIconComponent && thirdIconName && (
        <TouchableOpacity style={styles.iconContainer} onPress={() => setIsSecure(!isSecure)}>
        <ThirdIconComponent name={isSecure ? thirdIconSecondName : thirdIconName} size={22} color={placeholderColor} />
      </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  iconContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    color: "#000",
    fontSize: 15,
    paddingHorizontal: 10,
  },
});
