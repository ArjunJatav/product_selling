import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { orangeColor, redColor, whiteButtonTextColor } from "../Colors";
import { BottomTabImages } from "../../Route/Images";
import {
  Entypo,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "../ReactIcons";
import { images } from "./Images";
import { windowWidth } from "../../Constants/ReuseVariables";
import { logo } from "../Images";
import { postRequestWithToken } from "../CustomApi/PostApi";
import {
  addRemoveHideCard,
  addToFavouriteCard,
  importCard,
  likeDislikeCard,
} from "../../Constants/ApiUrls";
import { loginStrings } from "../../Screens/Login/strings";
import LoginFirst from "../CustomAlerts/LoginFirst";
import { useDispatch, useSelector } from "react-redux";
import ImportAlert from "../CustomAlerts/importAlert";
import ParametersAlert from "../CustomAlerts/ParametersAlert";
import ReportAlert from "../CustomAlerts/ReportAlert";
import { styles } from "./styles";
import { useNavigation } from "@react-navigation/native";

export default function CardList({
  data,
  loadMoreData,
  hasMore,
  loginNav,
  cardFavouriteClicked,
  activeDropdown,
  setActiveDropdown,
  showDeleteEditCard,
  handleDeleteCard,
  shareCardClick,
  hiddenCardSuccess,
}: any) {
  const [onCardClick, setOnCardClick] = useState(false);

  const dispatch = useDispatch();
  interface CardItem {
    comment: string;
    imagelinks: [];
    id: number;
    strainName: string;
    cost_unit: string;
    cost: number;
    user_name: string;
    state_code: string;
    weight: number;
    weight_unit: string;
    rating: number;
    energy: string;
    weedType: string;
    user_profile: string;
  }

  const [cardClickedItem, setCardClickedItem] = useState<CardItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<ScrollView>(null);
  const [cardFavourite, setCardFavourite] = useState(false);
  const [cardLiked, setCardLiked] = useState(false);
  const [cardDisliked, setCardDisliked] = useState(false);
  const [likes, setLikes] = useState<{ [key: string]: number }>({});
  const [likedItems, setLikedItems] = useState<{ [key: string]: boolean }>({});
  const [disLikes, setDislikes] = useState<{ [key: string]: number }>({});
  const [dislikedItems, setDislikedItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [showLoginFirstAlert, setShowLoginFirstAlert] = useState(false);
  const [showImportAlert, setShowImportAlert] = useState(false);
  const [importCardId, setImportCardId] = useState(0);
  const [showReportAlert, setShowReportAlert] = useState(false);
  const [isCardHide, setIsCardHide] = useState(false);
  const [threeDotClickedCardObj, setThreeDotClickedCardObj] = useState({});
  const user = useSelector((state: any) => state.user.user);

  const toggleDropdown = (itemId: string, isHide: boolean, item: object) => {
    setThreeDotClickedCardObj(item);
    setActiveDropdown((prev: string) => (prev === itemId ? null : itemId));
    const hidevalue = isHide ? true : false;
    setIsCardHide(hidevalue);
  };
  const navigation = useNavigation();

  const handleEditCard = (clickItemData: any) => {
  // @ts-expect-error
    navigation.navigate("AddNewCardScreen", {
      fromScreen: "EditCard",
      clickItemData: clickItemData,
    });
  };

  useEffect(() => {
    //dislike
    // Initialize likes from the data
    const initialLikes: Record<string | number, number> = {};
    const initialLikedItems: Record<string | number, boolean> = {};
    const initialDisLikes: Record<string | number, number> = {};
    const initialDisLikedItems: Record<string | number, boolean> = {};
    data.forEach((item: { id: string | number; likes: any; dislike: any }) => {
      initialLikes[item.id] = item.likes;
      initialDisLikes[item.id] = item.dislike;
      initialLikedItems[item.id] = false;
      initialDisLikedItems[item.id] = false;
    });
    setLikes(initialLikes);
    setLikedItems(initialLikedItems);
    setDislikes(initialDisLikes);
    setDislikedItems(initialDisLikedItems);
  }, [data]);

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

  const cardClicked = (item: any) => {
    setCardClickedItem(item);
    if (item.is_favorite) {
      setCardFavourite(true);
    }
    setOnCardClick(!onCardClick);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / windowWidth);
    setCurrentIndex(index);
  };

  const flavoursTab = (item: {
    flavor_colour_1: any;
    flavor_colour_2: any;
    flavor_colour_3: any;
  }) => {
    const getFlavorData = (flavor: {
      includes: (arg0: string) => any;
      split: (arg0: string) => [any, any];
    }) => {
      if (!flavor || !flavor.includes("/"))
        return { text: flavor, bgColor: "transparent" };

      const [bgColor, text] = flavor.split("/");

      return {
        text: text.trim(),
        bgColor:
          bgColor.trim() === "No Color"
            ? "transparent"
            : bgColor.toLowerCase().trim(),
      };
    };

    return (
      <View style={styles.flavoursListContainer}>
        {[item.flavor_colour_1, item.flavor_colour_2, item.flavor_colour_3].map(
          (flavor, index) => {
            const { text, bgColor } = getFlavorData(flavor);

            return (
              <View key={index} style={[styles.flavoursContainer]}>
                <Text
                  style={{
                    color:
                      bgColor == "transparent" || bgColor == "white"
                        ? "#000"
                        : bgColor,
                    fontSize: 15,
                  }}
                >
                  {text}
                </Text>
              </View>
            );
          }
        )}
      </View>
    );
  };

  const favouriteClicked = async (id: number) => {
    if (globalThis.token) {
      setCardFavourite(!cardFavourite);
      const apiData = { card_id: id, action: cardFavourite ? "remove" : "add" };
      await apiCall(
        addToFavouriteCard,
        apiData,
        "Favorite API call successful"
      );
      cardFavouriteClicked(true);
    } else {
      setShowLoginFirstAlert(true);
    }
  };

  // const handleDeleteCard = (clickItemData: any) => {

  //   console.log("clickItemData",clickItemData?.id);

  //   deleteCardMethod(clickItemData?.id);
  // };

  //

  const likeClicked = async (id: string | number) => {
    if (globalThis.token) {
      setLikes((prevLikes) => ({
        ...prevLikes,
        [id]: likedItems[id] ? prevLikes[id] - 1 : prevLikes[id] + 1,
      }));

      setLikedItems((prevLikedItems) => ({
        ...prevLikedItems,
        [id]: !prevLikedItems[id],
      }));

      if (dislikedItems[id]) {
        setDislikes((prevDislikes) => ({
          ...prevDislikes,
          [id]: prevDislikes[id] - 1,
        }));

        setDislikedItems((prevDislikedItems) => ({
          ...prevDislikedItems,
          [id]: false,
        }));
      }

      setCardLiked(!cardLiked);
      setCardDisliked(false);
      const apiData = {
        id: id,
        status: "LIKE",
      };
      await apiCall(
        likeDislikeCard,
        apiData,
        "Like/Dislike API call successful"
      );
    } else {
      setShowLoginFirstAlert(true);
    }
  };

  const DislikeClicked = async (id: string | number) => {
    if (globalThis.token) {
      setDislikes((prevDislikes) => ({
        ...prevDislikes,
        [id]: dislikedItems[id] ? prevDislikes[id] - 1 : prevDislikes[id] + 1,
      }));

      setDislikedItems((prevDislikedItems) => ({
        ...prevDislikedItems,
        [id]: !prevDislikedItems[id],
      }));

      if (likedItems[id]) {
        setLikes((prevLikes) => ({
          ...prevLikes,
          [id]: prevLikes[id] - 1,
        }));

        setLikedItems((prevLikedItems) => ({
          ...prevLikedItems,
          [id]: false,
        }));
      }

      setCardDisliked(!cardDisliked);
      setCardLiked(false);
      const apiData = {
        id: id,
        status: "DISLIKE",
      };
      await apiCall(
        likeDislikeCard,
        apiData,
        "Like/Dislike API call successful"
      );
    } else {
      setShowLoginFirstAlert(true);
    }
  };
  const apiCall = async (
    endpoint: string,
    apiData: object,
    successMessage: string
  ) => {
    try {
      const data = await postRequestWithToken(endpoint, apiData, dispatch);

      if (data.status === "success") {
        console.log(successMessage);
      } else {
        Alert.alert(loginStrings.error, data.message);
      }
    } catch (error) {
      console.log("API Error:", error);
      let errorMessage = "An unexpected error occurred.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      }

      Alert.alert(loginStrings.error, errorMessage);
      console.log("API Call Failed:", error);
    }
  };

  const importCardApiCalling = async () => {
    const apiData = {
      card_id: importCardId,
    };
    await apiCall(importCard, apiData, "import card api success");
  };

  const hideCardApiCalling = async () => {
    if (globalThis.token) {
      const apiData = {
        card_id: activeDropdown,
        action: isCardHide ? "remove" : "add",
      };

      console.log("api dat?", apiData);

      await apiCall(addRemoveHideCard, apiData, "hide card api success");
      hiddenCardSuccess();
    } else {
      setShowLoginFirstAlert(true);
    }
  };
  const iconData = [
    {
      iconFrom: "MaterialCommunityIcons",
      iconName: "cannabis",
      title: "Share Card",
      onPress: () => {
        shareCardClick(threeDotClickedCardObj);
      },
    },
    {
      iconFrom: "Octicons",
      iconName: "circle-slash",
      title: isCardHide ? "Unhide" : "Hide",
      onPress: () => {
        hideCardApiCalling();
      },
    },
    {
      iconFrom: "MaterialCommunityIcons",
      iconName: "home-city-outline",
      title: "Report",
      onPress: () => {
        setShowReportAlert(true);
      },
    },
  ];
  return (
    <View>
      <FlatList
        nestedScrollEnabled={true}
        data={data}
        onScrollBeginDrag={() => setActiveDropdown(null)}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              showDeleteEditCard && styles.mainContainer,
              {
                paddingVertical: showDeleteEditCard ? 0 : 0,
                marginTop: showDeleteEditCard ? 10 : 0,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                !showDeleteEditCard && styles.mainContainer,
                {
                  position: "relative",
                  paddingVertical: showDeleteEditCard ? 0 : 20,
                  flexDirection: "row",
                  marginTop: showDeleteEditCard ? 20 : 0,
                  paddingBottom: item.userId != user?.id ? 30 : 0,
                },
              ]}
              onPress={() => cardClicked(item)}
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

                  {!showDeleteEditCard && (
                    <Text style={styles.price}>
                      {item.cost_unit}
                      {item.cost}
                    </Text>
                  )}
                </View>

                {!showDeleteEditCard && (
                  <Text style={styles.description}>{item.user_name}</Text>
                )}

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
                    {item.weight} {item.weight_unit}
                  </Text>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  {/*  @ts-expect-error: Entypo type definition is missing */}
                  <Entypo
                    name="star"
                    size={15}
                    color={orangeColor}
                    style={{ marginLeft: 2, marginRight: 5 }}
                  />

                  {moonSunIcons(item)}
                </View>
              </View>

              <View style={styles.threedotContainer}>
                {!showDeleteEditCard ? (
                  <TouchableOpacity
                    onPress={() => {
                      if (globalThis.token) {
                        toggleDropdown(item.id, item.is_hide, item);
                      } else {
                        setShowLoginFirstAlert(true);
                      }
                    }}
                  >
                    {/*  @ts-expect-error: Entypo type definition is missing */}
                    <Feather name="more-vertical" size={20} color={"#000"} />
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.price}>
                    {item.cost_unit}
                    {item.cost}
                  </Text>
                )}

                {activeDropdown === item.id && (
                  <View
                    style={[
                      styles.alertContainer,
                      { top: showDeleteEditCard ? 0 : 0 },
                    ]}
                  >
                    <ParametersAlert numberOfRow={3} iconData={iconData} />
                  </View>
                )}
              </View>
            </TouchableOpacity>
            {item.userId == user?.id && (
              <>
                {showDeleteEditCard && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        bottom: 0,
                        padding: 10,
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                        borderTopWidth: 0.5,
                        borderTopColor: "grey",
                        marginTop: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => shareCardClick(item)}
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {/*  @ts-expect-error: Entypo type definition is missing */}
                        <Feather name="share" size={18} color={"#000"} />
                        <Text
                          style={{ fontSize: 18, marginLeft: 5 }}
                          numberOfLines={1}
                        >
                          {"Share"}
                        </Text>
                      </TouchableOpacity>

                      {item.userId == user?.id && (
                        <TouchableOpacity
                          onPress={() => handleEditCard(item)}
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          {/*  @ts-expect-error: Entypo type definition is missing */}
                          <Feather name="edit" size={18} color={"#000"} />
                          <Text
                            style={{ fontSize: 18, marginLeft: 5 }}
                            numberOfLines={1}
                          >
                            {"Edit"}
                          </Text>
                        </TouchableOpacity>
                      )}

                      <TouchableOpacity
                        onPress={() => handleDeleteCard(item)}
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {/*  @ts-expect-error: Entypo type definition is missing */}
                        <Feather name="trash-2" size={18} color={"red"} />
                        <Text
                          style={{ fontSize: 18, marginLeft: 5, color: "red" }}
                          numberOfLines={1}
                        >
                          {"Delete"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}

            {onCardClick && cardClickedItem && (
              <View style={styles.belowViewContainer}>
                <View style={styles.imageContentView}>
                  <View style={styles.userImgContainer}>
                    {/* ✅ Horizontal Image Slider */}
                    {cardClickedItem?.imagelinks &&
                    cardClickedItem?.imagelinks.length > 0 ? (
                      <ScrollView
                        horizontal
                        scrollEventThrottle={15}
                        ref={flatListRef}
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                      >
                        {cardClickedItem.imagelinks.map((imageItem, index) => (
                          <View
                            key={index}
                            style={{
                              position: "relative",
                              width: windowWidth - 20,
                            }}
                          >
                            <Image
                              source={{ uri: imageItem }}
                              style={styles.sliderImage}
                              resizeMode="cover"
                            />

                            <TouchableOpacity
                              style={{
                                position: "absolute",
                                right: 50,
                                top: 20,
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                              }}
                              onPress={() => {
                                if (globalThis.token) {
                                  setImportCardId(item.id);
                                  setShowImportAlert(!showImportAlert);
                                } else {
                                  setShowLoginFirstAlert(true);
                                }
                              }}
                            >
                              {/* @ts-expect-error: Ionicons type definition is missing */}
                              <MaterialCommunityIcons
                                name="import"
                                size={25}
                                color={"#fff"}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={{
                                position: "absolute",
                                right: 20,
                                top: 20,
                                backgroundColor: "rgba(0, 0, 0, 0.8)",
                              }}
                              onPress={() => favouriteClicked(item.id)}
                            >
                              {cardFavourite ? (
                                <>
                                  {/* @ts-expect-error: Ionicons type definition is missing */}
                                  <Entypo
                                    name="heart"
                                    size={25}
                                    color={"#fff"}
                                  />
                                </>
                              ) : (
                                <>
                                  {/* @ts-expect-error: Ionicons type definition is missing */}
                                  <Feather
                                    name="heart"
                                    size={25}
                                    color={"#fff"}
                                  />
                                </>
                              )}
                            </TouchableOpacity>

                            <View
                              style={[
                                styles.sideImgContainer,
                                {
                                  backgroundColor:
                                    cardClickedItem.energy === "e1" ||
                                    cardClickedItem.energy === "e2"
                                      ? "#fff"
                                      : cardClickedItem.energy === "n1" ||
                                        cardClickedItem.energy === "n2"
                                      ? "#000"
                                      : "darkgray",
                                },
                              ]}
                            >
                              <Image
                                source={images.seedImage}
                                style={styles.image}
                                resizeMode="contain"
                              />
                            </View>
                          </View>
                        ))}
                      </ScrollView>
                    ) : (
                      <>
                        <Image
                          source={logo}
                          style={styles.userImg}
                          resizeMode="cover"
                        />
                        <TouchableOpacity
                          style={{
                            position: "absolute",
                            right: 50,
                            top: 20,
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                          }}
                          onPress={() => {
                            if (globalThis.token) {
                              setImportCardId(item.id);
                              setShowImportAlert(!showImportAlert);
                            } else {
                              setShowLoginFirstAlert(true);
                            }
                          }}
                        >
                          {/* @ts-expect-error: Ionicons type definition is missing */}
                          <MaterialCommunityIcons
                            name="import"
                            size={25}
                            color={"#fff"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{
                            position: "absolute",
                            right: 20,
                            top: 20,
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                          }}
                          onPress={() => favouriteClicked(item.id)}
                        >
                          {cardFavourite ? (
                            <>
                              {/* @ts-expect-error: Ionicons type definition is missing */}
                              <Entypo name="heart" size={25} color={"#fff"} />
                            </>
                          ) : (
                            <>
                              {/* @ts-expect-error: Ionicons type definition is missing */}
                              <Feather name="heart" size={25} color={"#fff"} />
                            </>
                          )}
                        </TouchableOpacity>

                        <View
                          style={[
                            styles.sideImgContainer,
                            {
                              backgroundColor:
                                cardClickedItem.energy === "e1" ||
                                cardClickedItem.energy === "e2"
                                  ? "#fff"
                                  : cardClickedItem.energy === "n1" ||
                                    cardClickedItem.energy === "n2"
                                  ? "#000"
                                  : "darkgray",
                            },
                          ]}
                        >
                          <Image
                            source={images.seedImage}
                            style={styles.image}
                            resizeMode="contain"
                          />
                        </View>
                      </>
                    )}

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        marginTop: 10,
                      }}
                    >
                      {cardClickedItem.imagelinks.map((_, index) => (
                        <View
                          key={index}
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor:
                              currentIndex === index ? "#333" : "#bbb",
                            marginHorizontal: 5,
                          }}
                        />
                      ))}
                    </View>
                  </View>

                  {/* Expandable Content */}
                  <View style={styles.expandableContentContainer}>
                    <Text style={styles.Title}>
                      {cardClickedItem.strainName}{" "}
                      <Text style={styles.price}>
                        {cardClickedItem.cost_unit}
                        {cardClickedItem.cost}
                      </Text>
                    </Text>
                  </View>

                  <View
                    style={[styles.iconsContainer, { marginHorizontal: 25 }]}
                  >
                    <Text style={[styles.description, { fontSize: 18 }]}>
                      {item.user_name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        height: 25,
                        alignItems: "center",
                        marginLeft: 10,
                      }}
                    >
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
                        color={redColor}
                        style={{ marginLeft: 3 }}
                      />

                      {moonSunIcons(item)}
                    </View>
                  </View>
                  {flavoursTab(item)}
                  <Text style={styles.commentText}>
                    {cardClickedItem?.comment}
                  </Text>
                </View>

                <View style={styles.likesAndShareContainer}>
                  <View style={styles.likesAndUnlikeContainer}>
                    <View style={styles.likeContainer}>
                      <Text style={styles.numberOfLikes}>
                        {likes[item.id] || 0}
                      </Text>
                      <TouchableOpacity onPress={() => likeClicked(item.id)}>
                        {/* @ts-expect-error: Feather type definition is missing */}
                        <FontAwesome
                          name={cardLiked ? "thumbs-up" : "thumbs-o-up"}
                          size={25}
                          color={"#fff"}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.likeContainer}>
                      <Text style={styles.numberOfLikes}>
                        {disLikes[item.id] || 0}
                      </Text>
                      <TouchableOpacity onPress={() => DislikeClicked(item.id)}>
                        {/* @ts-expect-error: Feather type definition is missing */}
                        <FontAwesome
                          name={!cardDisliked ? "thumbs-o-down" : "thumbs-down"}
                          size={25}
                          color={"#fff"}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.likeContainer]}
                    onPress={() => shareCardClick(item)}
                  >
                    <Text style={styles.numberOfLikes}>Share</Text>
                    {/* @ts-expect-error: Ionicons type definition is missing */}
                    <Ionicons
                      name="arrow-redo-outline"
                      size={25}
                      color={"#fff"}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
        onEndReached={hasMore ? loadMoreData : null}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          hasMore && (
            <ActivityIndicator size="large" color={whiteButtonTextColor} />
          )
        }
      />
      <LoginFirst
        visible={showLoginFirstAlert}
        close={() => setShowLoginFirstAlert(false)}
        userChosen={() => {
          setShowLoginFirstAlert(false);
          loginNav();
        }}
      />
      <ImportAlert
        visible={showImportAlert}
        title="Add card to your profile?"
        showSubtitle={true}
        subTitle="(You can edit it there)"
        close={() => setShowImportAlert(false)}
        iconName="credit-card-edit"
        iconFrom="MaterialCommunityIcons"
        iconFromSecond="MaterialCommunityIcons"
        iconNameSecond="credit-card-off"
        userChosen={(text: string) => {
          if (text == "yes") {
            setShowImportAlert(false);
            importCardApiCalling();
          } else {
            setShowImportAlert(false);
          }
        }}
      />

      <ReportAlert
        visible={showReportAlert}
        close={() => {
          setActiveDropdown(null);
          setShowReportAlert(false);
        }}
        reportedType="CARD"
        reportedId={activeDropdown}
      />
    </View>
  );
}
