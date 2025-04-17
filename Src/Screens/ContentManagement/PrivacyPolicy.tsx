import { Alert, ImageBackground, ScrollView, Text, View } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signUpImages } from "../SignUp/Images";
import { getRequest } from "../../Components/CustomApi/getApi";
import { cmsPage } from "../../Constants/ApiUrls";
import { loginStrings } from "../Login/strings";
import RenderHTML from "react-native-render-html";
import Loader from "../../Components/Loader";
import { windowWidth } from "../../Constants/ReuseVariables";

type contentProps = NativeStackScreenProps<any, "PrivacyPolicy">;
export default function PrivacyPolicy({ navigation, route }: contentProps) {
  const [isLoading, setLoading] = useState(false);
  const [apiData, setApiData] = useState("");

  useEffect(() => {
    apiCalling();
  }, []);

  const apiCalling = async () => {
    let slug = "";
    if (route?.params?.type == "privacy") {
      slug = "?slug=privacy-policy";
    } else {
      slug = "?slug=terms-and-conditions";
    }
    try {
      setLoading(true);
      const exactUrl = cmsPage + slug;
      const data = await getRequest(exactUrl);
      if (!data || data.status !== "success") {
        throw new Error("Failed to fetch cms");
      } else {
        setApiData(data.data.content);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) errorMessage = error.message;
    Alert.alert(loginStrings.error, errorMessage);
    console.log("API Error:", errorMessage);
  };

  const memoizedSource = useMemo(() => ({ html: apiData || "" }), [apiData]);

  const renderHtmlComponent = useMemo(() => {
    return (
      <RenderHTML
        key={apiData} // ✅ Ensures it resets only when content actually changes
        contentWidth={windowWidth}
        source={memoizedSource}
        baseStyle={{ marginHorizontal: 20,textAlign:"justify"}}
      />
    );
  }, [memoizedSource]);

  return (
    <View style={styles.container}>
      <TopBar showBack={true} backButtonPress={() => navigation.pop()} />
      <ImageBackground
        source={signUpImages.signUpBackground}
        style={{ flex: 1, alignItems: "center" }}
      >
        <ScrollView>
          <Text style={{color:"#000",fontSize:25,alignSelf:"center",marginTop:20,fontWeight:"600"}}>{route?.params?.type == "privacy" ? "Privacy Policy" :"Terms & Conditions"}</Text>
         {renderHtmlComponent}
        </ScrollView>
        

        <Loader visible={isLoading} />
      </ImageBackground>
    </View>
  );
}
