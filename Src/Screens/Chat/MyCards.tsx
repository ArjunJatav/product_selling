import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { postRequestWithToken } from "../../Components/CustomApi/PostApi";
import { userDetails } from "../../Constants/ApiUrls";
import { useDispatch, useSelector } from "react-redux";
import { loginStrings } from "../Login/strings";
import { BottomTabImages } from "../../Route/Images";
import { images } from "../../Components/ReuseComponents/Images";
import { orangeColor, whiteButtonTextColor } from "../../Components/Colors";
import { Entypo, Feather } from "../../Components/ReactIcons";
import SocketService from "../../Components/Socket/SocketService";

type chatScreenProps = NativeStackScreenProps<any, "myCards">;
export default function MyCards({ navigation,route }: chatScreenProps) {
  const [isLoading, setLoading] = useState(false);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  interface CardItem {
    id: number;
    strainName: string;
    cost: number;
    cost_unit: string;
    user_name: string;
    user_profile: string;
    state_code: string;
    rating: number;
    weight: number;
    weight_unit: string;
    energy: string;
    weedType: string;
  }
  const [cardData, setCardData] = useState<CardItem[]>([]);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const user = useSelector((state: any) => state.user.user);
  const [cardSelectedObj, setCardSelectedObj] = useState<CardItem | null>(null);

  useEffect(() => {
    userDetailApiCaling(1, true);
  }, []);
  const userDetailApiCaling = useCallback(
    async (pageNumber: number, fullLoader: boolean) => {
      if ((fullLoader && isLoading) || isLoadingMore || !hasMore) return;

      if (fullLoader) setLoading(true);
      else setLoadingMore(true);

      try {
        if (pageNumber === 1) {
          setCardData([]);
          setHasMore(true);
        }

        const apiData = {
          weed_type: "",
          page: pageNumber,
          per_page: 15,
          strain_name: "",
          order_by: null,
          order_type: null,
          energy: null,
          mental_feeling: null,
          user_id: user.id,
        };
        // const response = await postRequest(dashBoard, apiData);
        const response = await postRequestWithToken(
          userDetails,
          apiData,
          dispatch
        );
        console.log("api response>>", response.data);

        if (response.status !== "success") {
          setHasMore(false);
          throw new Error(response.message || "No Records Found");
        }

        const newData = response.data.cards.data || [];

        if (newData.length === 0) {
          setHasMore(false);
          if (pageNumber === 1) setCardData([]);
        } else {
          setHasMore(false);
          setCardData((prev) => {
            const updated =
              pageNumber === 1
                ? newData
                : [...prev, ...newData].filter(
                    (v, i, s) => i === s.findIndex((t) => t.id === v.id)
                  );
            return JSON.stringify(prev) === JSON.stringify(updated)
              ? prev
              : updated;
          });

          setPage(pageNumber);
        }
      } catch (error) {
        handleError(error);
        setHasMore(false);
        if (pageNumber === 1) setCardData([]);
      } finally {
        if (fullLoader) setLoading(false);
        else setLoadingMore(false); // <-- ✅ This is essential
      }
    },
    [isLoading, isLoadingMore, hasMore]
  );

  const handleError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    Alert.alert(loginStrings.error, errorMessage);
  };

  const moonSunIcons = (item: { energy: string }) => {
    if (item.energy == "e1" || item.energy == "e2") {
      return (
        <>
          {/*  @ts-expect-error: Feather type definition is missing */}
          <Feather
            name="sun"
            size={15}
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
            size={15}
            color={"#000"}
            style={{ marginLeft: 5 }}
          />
        </>
      );
    } else {
      return <Image source={images.sunMoonIcon} style={styles.sunMoonIcon} />;
    }
  };

function sendCard() {
    try {
        let obj = {
            room_id: route?.params?.roomId,
            sender_id: user.id,
            receiver_id : route?.params?.friendId,
            message: "",
            type: "CARD",
            meta: cardSelectedObj
          };
    console.log("obj to send in emit ::",obj)
          SocketService.sendFileMessage(obj);
          navigation.pop()
    } catch (error) {
        console.log("error ::",error)
    }
  
}
  return (
    <View style={styles.chatContainer}>
      <TopBar showBack={true} backButtonPress={() => navigation.pop()} />
      <FlatList
        nestedScrollEnabled={true}
        ListHeaderComponent={() => (
          <View style={styles.cardHeaderContainer}>
            <Text style={styles.title}>My Cards</Text>
          </View>
        )}
        data={cardData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <TouchableOpacity
              style={[styles.mainContainer, { position: "relative" }]}
              onPress={() => setCardSelectedObj(item)}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: item.user_profile }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.contentContainer}>
                <View style={styles.borderContentContainer}>
                  <Text style={styles.borderContent}>Hybrid</Text>
                </View>
                <View style={{ flexDirection: "row", marginRight: 25 }}>
                  <Text style={styles.Title} numberOfLines={1}>
                    {item.strainName}{" "}
                  </Text>
                  <Text style={styles.price}>
                    {item.cost_unit}
                    {item.cost}
                  </Text>
                </View>

                <Text style={styles.description}>{item.user_name}</Text>

                <View style={styles.iconsContainer}>
                  <Image
                    source={
                      item.weedType == "flower"
                        ? BottomTabImages.homePage
                        : item.weedType == "concentrate"
                        ? images.concentrateIcon
                        : item.weedType == "edible"
                        ? images.edibleIcon
                        : item.weedType == "cBD"
                        ? images.cbdIcon
                        : item.weedType == "vape"
                        ? images.vapeIcon
                        : images.preRollIcon
                    }
                    style={styles.weedIcon}
                    resizeMode="contain"
                  />
                  <Text style={styles.caText}>{item.state_code}</Text>
                  <Text style={styles.ozText}>
                    {item.weight}
                    {item.weight_unit}
                  </Text>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  {/*  @ts-expect-error: Entypo type definition is missing */}
                  <Entypo
                    name="star"
                    size={15}
                    color={orangeColor}
                    style={{ marginLeft: 0 }}
                  />

                  {moonSunIcons(item)}
                </View>
              </View>

              <View style={styles.correctSignContainer}>
                {cardSelectedObj?.id == item.id ? (
                  <Text>✅</Text>
                ) : (
                  <View style={styles.tickBoxContainer} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        )}
        onEndReached={() => {
          if (!isLoading && !isLoadingMore && hasMore) {
            userDetailApiCaling(page + 1, false);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          hasMore && (
            <ActivityIndicator size="large" color={whiteButtonTextColor} />
          )
        }
      />
      <TouchableOpacity
        style={styles.sendbuttonContainer}
        onPress={()=>sendCard()}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}
