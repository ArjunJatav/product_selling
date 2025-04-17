import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LoginImages } from "../../Screens/Login/Images";
import { whiteButtonTextColor } from "../Colors";
import { MaterialIcons } from "../ReactIcons";
import LinearGradient from "react-native-linear-gradient";
import FastImage from "react-native-fast-image";

export default function BrowseCategory({
  data,
  categoryChoosen,
  alreadyChosen,
}: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(70)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  useEffect(() => {
    if (alreadyChosen?.Type && alreadyChosen.Type.name) {
      setCategoryName(alreadyChosen.Type.name);
    }
  }, [alreadyChosen]);

  useEffect(() => {
    setContentHeight(Math.ceil(data.length / 2) * 170);
  }, [data]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    Animated.timing(animatedHeight, {
      toValue: isExpanded ? 70 : contentHeight + 80,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  console.log("alreadyChosen", alreadyChosen);
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.animatedContainer, { height: animatedHeight }]}
      >
        <ImageBackground
          source={LoginImages.loginBackground}
          style={styles.backgroundImage}
        >
          <TouchableOpacity style={styles.touchable} onPress={toggleExpand}>
            <View style={styles.browseCategoryTextContainer}>
              <Text style={styles.browseCategoryText}>Browse by Category</Text>
            </View>
            <View style={styles.lowerContainer}>
              <View style={styles.nextBoxContainer}>
                {/* @ts-expect-error: MaterialIcons type definition is missing */}
                <MaterialIcons
                  name={
                    isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"
                  }
                  size={30}
                  color={whiteButtonTextColor}
                />
              </View>
            </View>
          </TouchableOpacity>
          {isExpanded && (
            <FlatList
              nestedScrollEnabled
              data={data}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              renderItem={({ item, index }) => {
                const gradientColors = item.colors.split(",");
                const isEven = index % 2 === 0;
              
                return (
                  <LinearGradient
                    colors={gradientColors}
                    style={[
                      styles.boxContainer,
                      {
                        marginLeft: isEven ? 10 : 20,
                        borderWidth:
                          categoryName && categoryName == item.name ? 3 : 0,
                        borderColor:
                          categoryName && categoryName == item.name
                            ? whiteButtonTextColor
                            : "transparent",
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[styles.boxTouchable]}
                      onPress={() => categoryChoosen(item)}
                    >
                      <FastImage
                        source={{ uri: item.image }}
                        style={styles.boxImage}
                        resizeMode="contain"
                      />
                      <Text style={styles.categoryText}>{item.name}</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                );
              }}
            />
          )}
        </ImageBackground>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    borderBottomStartRadius: 15,
    borderBottomEndRadius: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    backgroundColor: "#fff",
    marginHorizontal: 15,
  },
  animatedContainer: { width: "100%", overflow: "hidden" },
  backgroundImage: { width: "100%", flex: 1 },
  touchable: { height: 70, flexDirection: "row", alignItems: "center" },
  browseCategoryTextContainer: { flex: 1, justifyContent: "center" },
  browseCategoryText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 15,
  },
  lowerContainer: { justifyContent: "center" },
  nextBoxContainer: {
    height: 40,
    width: 40,
    backgroundColor: "#B4E2CE",
    alignSelf: "flex-end",
    marginRight: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  boxContainer: {
    height: 150,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 10,
  },
  boxTouchable: { width: "100%", alignItems: "center" },
  boxImage: { height: 100, width: 100 },
  categoryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    paddingVertical: 5,
    textAlign: "center",
  },
});
