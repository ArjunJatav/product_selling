import React from "react";
import {
  ImageBackground,
  Platform,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import Swiper from "react-native-swiper";
import TopBar from "../../Components/Topbar";
import CustomButton from "../../Components/CustomButton/CustomButton";
import CustomTransparentButton from "../../Components/CustomButton/CustomTransparentButton";
import CustomWhiteButton from "../../Components/CustomButton/CustomWhiteButton";
import { welcomeImages } from "./Images";
import { welcomeStrings } from "./strings";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type WelcomeScreenProps = NativeStackScreenProps<any, "WelcomeScreen">;

const titles = [
  welcomeStrings.welcomeText,
  welcomeStrings.discoverText,
  welcomeStrings.connectText,
  welcomeStrings.shopText,
];

const descriptions = [
  welcomeStrings.welcomePara,
  welcomeStrings.explorePara,
  welcomeStrings.connectPara,
  welcomeStrings.shopPara,
];

const imageArray = [
  welcomeImages.firstWelcomeBackground,
  welcomeImages.secondWelcomeBackground,
  welcomeImages.thirdWelcomeBackground,
  welcomeImages.fourthWelcomeBackground,
];

export default function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const onShare = async () => {
    try {
      const result = await Share.share({
        title: "Check out weedColors!",
        message: "Hey! I am using a new app called weedColors. Have a look!",
        url:
          Platform.OS == "android"
            ? "https://play.google.com/store/apps/details?id=io.cordova.weedcolors1"
            : "https://apps.apple.com/us/app/weedcolors/id1580885593",
      });
      if (result.action === Share.sharedAction) {
        console.log("Content shared!");
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error while sharing:", error);
    }
  };

  return (
    <View style={styles.welcomeScreenContainer}>
      <TopBar showBack={false} backButtonPress={() => console.log("fff")} />

      <Swiper
        loop={false}
        dot={<View style={styles.inactiveDot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={{ bottom: "35%" }}
      >
        {imageArray.map((img, index) => (
          <ImageBackground
            key={index}
            source={img}
            style={styles.welcomeFirstBackground}
          >
            <View style={styles.textContainer}>
              <Text style={styles.firstWelcomeText}>{titles[index]}</Text>
              <Text style={styles.firstWelcomePara}>{descriptions[index]}</Text>
            </View>
          </ImageBackground>
        ))}
      </Swiper>
      <View style={styles.fixedButtonsContainer}>
        <View style={{ marginTop: 15, width: "100%" }}>
          <CustomButton
            text={welcomeStrings.multiButtonText}
            buttonPress={() => navigation.navigate("SignUpStack")}
          />
        </View>
        <View style={{ marginTop: 15, width: "100%" }}>
          <CustomTransparentButton
            text={welcomeStrings.transparentButtonText}
            buttonPress={() => navigation.navigate("Login")}
          />
        </View>
        <View style={{ marginTop: 15, width: "100%" }}>
          <CustomWhiteButton
            text={welcomeStrings.whiteButtonText}
            onButtonPress={onShare}
          />
        </View>
      </View>

      <View style={styles.notReadyTextContainer}>
        <Text style={styles.notReadyText}>{welcomeStrings.notReadyText} </Text>
        <TouchableOpacity onPress={() => navigation.navigate("BottomTab")}>
          <Text style={styles.continueGuestText}>
            {welcomeStrings.continueGuestText}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
