import {
  StyleSheet,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { placeholderColor, whiteLessOpacityColor2 } from "./Colors";
import { searchBardisbaledImage } from "./Images";
import { AntDesign, Entypo, Feather } from "./ReactIcons";

interface CustomSearchBarProps {
  searchValue: string;
  setSearchValue: (text: string) => void;
  onSearch: (text: string) => void;
  showDisabledImage?: boolean;
  placeholder: string;
  showThreeDot?: boolean;
  threeDotClick?: () => void;
  editable? :boolean;
  showCross? : boolean;
  crossFunction? : ()=> void;
}

export default function CustomSearchBar({
  searchValue,
  setSearchValue,
  onSearch,
  showDisabledImage,
  placeholder,
  showThreeDot,
  threeDotClick,
  editable,
  showCross,
  crossFunction
}: CustomSearchBarProps) {

  const edit = editable !== undefined ? editable : true;
  return (
    <View style={styles.searchBarContainer}>
      {showDisabledImage && (
        <Image source={searchBardisbaledImage} style={styles.disabledImage} />
      )}
      {/* @ts-expect-error: AntDesign type definition is missing */}
      <AntDesign
        name="search1"
        color="#000"
        size={20}
        style={styles.searchIcon}
      />
      
      <TextInput
        style={styles.textInput}
        editable={edit}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={searchValue}
        onChangeText={setSearchValue}
        onSubmitEditing={() => onSearch(searchValue)}
        returnKeyType="search"
        autoCapitalize="none"
      />
      {showCross && (
        <TouchableOpacity
        style={styles.threeDotContainer} onPress={crossFunction}>
           {/* @ts-expect-error: AntDesign type definition is missing */}
          <Entypo name="cross" size={20} color={"#000"}/>
        </TouchableOpacity>
      )}
      {showThreeDot && (
        <TouchableOpacity
          style={styles.threeDotContainer}
          onPress={threeDotClick}
        >
             {/* @ts-expect-error: AntDesign type definition is missing */}
          <Feather name="more-vertical" size={20} color={"#000"} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    backgroundColor: whiteLessOpacityColor2,
   // borderRadius: 25,
    paddingHorizontal: 15,
  //  marginHorizontal: 10,
    elevation: 3,
  },
  disabledImage: { height: 30, width: 30, marginRight: 10 },
  searchIcon: { marginRight: 10 },
  textInput: { flex: 1, fontSize: 16, color: "#000" },
  threeDotContainer: {
    width: "10%",
    alignItems: "flex-end",
  },
});
