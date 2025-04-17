import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Text, View } from "react-native";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import {
  authenticatedGetRequest,
} from "../../Components/CustomApi/getApi";
import { favouriteListing } from "../../Constants/ApiUrls";
import { loginStrings } from "../Login/strings";
import Loader from "../../Components/Loader";
import CardList from "../../Components/ReuseComponents/CardList";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import NoDataView from "../../Components/ReuseComponents/NoDataView";
import LoginFirstScreen from "../../Components/ReuseComponents/LoginFirstScreen";
import LoginFirst from "../../Components/CustomAlerts/LoginFirst";
import { whiteButtonTextColor } from "../../Components/Colors";

type homeScreenProps = NativeStackScreenProps<any, "HomeScreen">;
let PageNum = 1
export default function FavouriteScreen({ navigation }: homeScreenProps) {
  const [isLoading, setLoading] = useState(false);
  const [favouriteCardData, setFavouriteCardData] = useState([]);
  const [showLoginFirstAlert, setShowLoginFirstAlert] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (globalThis.token) {
  //       console.log("page >>>>>>>>", page);
  //       setFavouriteCardData([]);
  //       setPage(1);
  //       favouriteCardApiCalling(1, true);
  //     }
  //   }, [])
  // );

  useEffect(() => {
    const unsubscribe2 = navigation.addListener("focus", () => {
      console.log("token  >>>>>>>",globalThis.token)
      if (globalThis.token) {
        console.log("page >>>>>>>>", page);
        setFavouriteCardData([]);
        PageNum = 1;
     //   setPage(1);
        favouriteCardApiCalling(PageNum, true);
      }
    });
    return unsubscribe2;
  }, []);

  const favouriteCardApiCalling = async (
    nextPage = 1,
    isRefreshing = false
  ) => {
    if (isLoading || isLoadingMore || !hasMore) return; // Prevent multiple calls

    try {
      if (isRefreshing) {
        setLoading(true);
        setHasMore(true);
        setIsLoadingMore(false);
      } else {
        setIsLoadingMore(true);
      }

      const exactUrl = `${favouriteListing}?page=${nextPage}&per_page=10`;
      console.log("excat url::", exactUrl);
      const favouriteData = await authenticatedGetRequest(exactUrl);

      if (!favouriteData || favouriteData.status !== "success") {
        throw new Error("Failed to fetch categories");
      }
      if (Object.keys(favouriteData.data).length === 0 && nextPage == 1) {
        setFavouriteCardData([]);
      } else {
        const newCards = favouriteData.data.data || [];

        if (newCards.length === 0) {
          setHasMore(false); // No more data to fetch
        } else {
          setFavouriteCardData(
            (prev) => (isRefreshing ? newCards : [...prev, ...newCards]) // Append data
          );
          setPage(page + 1);
          PageNum = PageNum + 1
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleError = (error: unknown) => {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) errorMessage = error.message;
    Alert.alert(loginStrings.error, errorMessage);
    console.log("API Error:", errorMessage);
  };

  const handleEndReached = () => {
    if(PageNum !== 1){
      console.log("in handle end reached ", !isScrolled, isLoadingMore, !hasMore);
      if (!isScrolled || isLoadingMore || !hasMore)
        return; // Ignore if not scrolled
      else {
        console.log("setfavourite data ", favouriteCardData);
        favouriteCardApiCalling(PageNum, false);
      }

    }

    //
  };

  return (
    <View style={styles.fvrtScreenContainer} key={refreshKey}>
      <TopBar
        showBack={false}
        showNotification={true}
        notificationPress={() => {
          if (globalThis.token) {
            navigation.navigate("NotificationScreen");
          } else {
            setShowLoginFirstAlert(true);
          }
        }}
        backButtonPress={() => console.log("back button pressed")}
      />
      <>
        {globalThis.token ? (
          <>
            {favouriteCardData.length > 0 ? (
              <View style={styles.cardListContainer}>
                <FlatList
                  data={favouriteCardData}
                  onScroll={(event) => {
                    const offsetY = event.nativeEvent.contentOffset.y;
                    setIsScrolled(offsetY > 50); // Only allow end-reached after scrolling 50px
                  }}
                  //    keyExtractor={(item) => item.id.toString()}
                  ListHeaderComponent={() => (
                    <Text style={styles.title}>Favourites</Text>
                  )}
                  ListEmptyComponent={() => <NoDataView />}
                  renderItem={({ item }) => (
                    <CardList
                      data={[item]}
                      loginNav={() => navigation.navigate("LoginStack")}
                      cardFavouriteClicked={() => console.log("favourite")}
                      activeDropdown={activeDropdown}
                      setActiveDropdown={setActiveDropdown}
                      hiddenCardSuccess={() =>
                        favouriteCardApiCalling(1, true)
                      }
                      shareCardClick={(res: any) => {
                        navigation.navigate("MyFriends", { cardObj: res });
                      }}
                    />
                  )}
                  onEndReached={handleEndReached}
                  onEndReachedThreshold={0.1}
                  ListFooterComponent={() => (
                    <>
                      {isLoadingMore && (
                        <View style={{ padding: 15, alignItems: "center" }}>
                          <ActivityIndicator
                            size={"small"}
                            color={whiteButtonTextColor}
                          />
                        </View>
                      )}
                      <View style={{ height: 150 }}></View>
                    </>
                  )}
                />
                {/* <CardList
  data={favouriteCardData}
  loginNav={() => navigation.navigate("LoginStack")}
  cardFavouriteClicked={() => favouriteCardApiCalling(1, true)} // Refresh data
  loadMoreData={() => favouriteCardApiCalling(page + 1)} 
  hasMore={hasMore} // Prevent unnecessary calls
  activeDropdown={activeDropdown}
  setActiveDropdown={setActiveDropdown}
  hiddenCardSuccess={(res: any)=>favouriteCardApiCalling(1, true)}
  shareCardClick= {()=>console.log("sharecardclicked")}
/> */}
              </View>
            ) : (
              <NoDataView />
            )}
          </>
        ) : (
          <LoginFirstScreen
            buttonClick={() => navigation.navigate("LoginStack")}
          />
        )}
      </>

      <Loader visible={isLoading} />
      <LoginFirst
        visible={showLoginFirstAlert}
        close={() => setShowLoginFirstAlert(false)}
        userChosen={() => {
          setShowLoginFirstAlert(false);
          navigation.navigate("LoginStack");
        }}
      />
    </View>
  );
}
