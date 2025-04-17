import { Image, Text, View } from "react-native";
import React from "react";
import { images } from "./Images";
import { styles } from "./styles";

export default function UserHeader({ headerIcon, title }: any) {
  const imageUrl =
    typeof headerIcon === "string" && headerIcon.includes("http")
      ? { uri: headerIcon }
      : headerIcon;
  return (
    <View>
      <Image
        source={images.HeaderImageBackground}
        style={styles.colorfulImage}
      />
      <View style={styles.userHeaderImageContainer}>
        <Image
          source={imageUrl}
          style={
            typeof headerIcon === "string" && headerIcon.includes("http")
              ? styles.userImage
              : styles.iconImage
          }
          resizeMode="cover"
        />
      </View>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
