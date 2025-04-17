import {
  ActivityIndicator,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { windowHeight, windowWidth } from "../../Constants/ReuseVariables";
import { redColor, whiteButtonTextColor } from "../../Components/Colors";
import { BottomTabImages } from "../../Route/Images";
import { Entypo, Feather, Ionicons } from "../../Components/ReactIcons";
import { images } from "../../Components/ReuseComponents/Images";

type cardDetailProps = NativeStackScreenProps<any, "CardDetails">;
export default function CardDetails({ route, navigation }: cardDetailProps) {
  let paramsData = route?.params?.item;
  let cardName = paramsData?.strainName ?? "Card Details";
  const [loadingImageIndex, setLoadingImageIndex] = useState<number | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
    setCurrentIndex(index);
  };

  console.log("paramsData", paramsData);
  

  const moonSunIcons = (item: { energy: string }) => {
    if (item.energy == "e1" || item.energy == "e2") {
      return (
        <>
          {/*  @ts-expect-error: Feather type definition is missing */}
          <Feather
            name="sun"
            size={25}
            color={"orange"}
            style={{ marginLeft: 5 }}
          />
        </>
      );
    } else if (item.energy == "n1" || item.energy == "n2") {
      return (
        <>
          {/* @ts-expect-error: Ionicons type definition is missing */}
          <Ionicons
            name="moon-sharp"
            size={25}
            color={"#000"}
            style={{ marginLeft: 5 }}
          />
        </>
      );
    } else {
      return (
        <Image
          source={images.sunMoonIcon}
          style={{ height: 25, width: 25, marginLeft: 5 }}
        />
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TopBar
        showBack={true}
        backButtonPress={() => navigation.pop()}
        showTitle={true}
        title={cardName}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          flex: 1,
          backgroundColor: "white",
          // marginHorizontal: 10,
        }}
        contentContainerStyle={{
          alignItems: "center",
          paddingBottom: 50,
        }}
      >
        <View
          style={{
            height: windowHeight / 2.5,
            width: windowWidth,
          }}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
           {paramsData.imagelinks.map((imageItem: any, index: any) => (
  <View
    key={index}
    style={{
      height: "100%",
      width: windowWidth,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    {loadingImageIndex === index && (
      <ActivityIndicator
        size="large"
        color="green"
        style={{
          position: "absolute",
          zIndex: 1,
        }}
      />
    )}

    <Image
      source={{ uri: imageItem   }}
      style={{
        height: "100%",
        width: windowWidth,
        borderRadius: 10,
      }}
      resizeMode="cover"
      onLoadStart={() => setLoadingImageIndex(index)}
      onLoadEnd={() => setLoadingImageIndex(null)}
    />
  </View>
))}
          </ScrollView>
        </View>
        {/* Indicator */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          {paramsData.imagelinks.map((_: any, index: any) => (
            <View
              key={index}
              style={{
                height: 8,
                width: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === index ? "green" : "#ccc",
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>
        <View
          style={{
            width: windowWidth,
            paddingHorizontal: 10,
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#000",
              fontWeight: "600",
              marginTop: 5,
            }}
          >
            {paramsData?.strainName + "  "}
            <Text
              style={{
                color: whiteButtonTextColor,
                fontSize: 20,
                fontWeight: "600",
                marginTop: 5,
              }}
            >
              {paramsData?.cost_unit}
              {paramsData?.cost}
            </Text>
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            height: 30,
            alignItems: "center",
            width: windowWidth - 20,
            // marginLeft: 10,
          }}
        >
          <Image
            source={
              paramsData?.weedType == "flower"
                ? BottomTabImages.homePage
                : paramsData?.weedType == "concentrate"
                ? images.concentrateIcon
                : paramsData?.weedType == "edible"
                ? images.edibleIcon
                : paramsData?.weedType == "cBD"
                ? images.cbdIcon
                : paramsData?.weedType == "vape"
                ? images.vapeIcon
                : images.preRollIcon
            }
            style={{ height: 25, width: 25, tintColor: whiteButtonTextColor }}
            resizeMode="contain"
          />
          <Text style={{ color: redColor, marginLeft: 5, fontSize: 18 }}>
            {paramsData?.state_code}
          </Text>
          <Text style={{ color: "#000", marginLeft: 10, fontSize: 18 }}>
            {paramsData?.weight}
            {paramsData?.weight_unit}
          </Text>
          <Text style={{ color: redColor, marginLeft: 10, fontSize: 18 }}>
            {paramsData?.rating}
          </Text>
          {/*  @ts-expect-error: Entypo type definition is missing */}
          <Entypo
            name="star"
            size={25}
            color={redColor}
            style={{ marginLeft: 3 }}
          />

          {moonSunIcons(paramsData)}
        </View>
        <View
          style={{
            width: windowWidth - 20,
            marginTop: 10,
            backgroundColor: "#f0f0f0",
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Text style={{ color: "#000", fontSize: 18 }}>
            {paramsData?.comment}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
