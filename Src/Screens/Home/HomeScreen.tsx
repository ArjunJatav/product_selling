import React, {  useState, useCallback } from "react";
import {
  Alert,
  FlatList,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from "react-native";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { images } from "./Images";
import { MaterialIcons } from "../../Components/ReactIcons";
import UserHeader from "../../Components/ReuseComponents/UserHeader";
import { homeStrings } from "./strings";
import CustomSearchBar from "../../Components/CustomSearchBar";
import BrowseCategory from "../../Components/ReuseComponents/BrowseCategory";
import { getRequest } from "../../Components/CustomApi/getApi";
import { dashBoard, getCategories } from "../../Constants/ApiUrls";
import Loader from "../../Components/Loader";
import { purpleColor, whiteButtonTextColor } from "../../Components/Colors";
import CardList from "../../Components/ReuseComponents/CardList";
import {
  postRequest,
  postRequestWithToken,
} from "../../Components/CustomApi/PostApi";
import { loginStrings } from "../Login/strings";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useFocusEffect } from "@react-navigation/native";
import FilterComponent from "../../Components/ReuseComponents/FilterComponent";
import NoDataView from "../../Components/ReuseComponents/NoDataView";
import LoginFirst from "../../Components/CustomAlerts/LoginFirst";
import { useNetworkStatus } from "../../Constants/NetworkStatusProvider";
import { useDispatch, useSelector } from "react-redux";

let totalListing = 0;

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

type HomeScreenProps = NativeStackScreenProps<any, "HomeScreen">;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [browseCategoryData, setBrowseCategoryData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [cardData, setCardData] = useState<CardItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [sortByClicked, setSortByClicked] = useState(false);
  const [clickedSortFilter, setClickedSortFilter] = useState("filter");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  // const [selectedSorting, setSelectedSorting] = useState<{
  //   [key: string]: string;
  // }>({});
  const [selectedSorting, setSelectedSorting] = useState<{
    [key: string]: string;
  }>({});
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: any;
  }>({});
  const [showLoginFirstAlert, setShowLoginFirstAlert] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const authToken = useSelector((state: any) => state.user.authToken);
  const fadeAnim = useState(new Animated.Value(0))[0]; // For fade animation
  const dispatch = useDispatch();
  const myUser = useSelector((state: any) => state.user.user);

  useFocusEffect(
    useCallback(() => {
      setSearchValue("");
      fetchCategoriesAndData();
    }, [])
  );

  const fetchCategoriesAndData = async () => {
    try {
      setLoading(true);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      const categoryData = await getRequest(getCategories);
      if (!categoryData || categoryData.status !== "success") {
        throw new Error("Failed to fetch categories");
      }
      setBrowseCategoryData(categoryData.data);
      await fetchDashboardData(1, true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEndReached = () => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    if (!isLoadingMore && hasMore) {
      fetchDashboardData(page + 1, false, selectedCategory, searchValue);
    }
  };

  const fetchDashboardData = useCallback(
    async (
      pageNumber: number,
      fullLoader: boolean,
      weedType: string | null = selectedCategory,
      strainName: string | null = searchValue,
      order_by: string | null = selectedSorting.key,
      order_type: string | null = selectedSorting.value,
      energy: string | null = selectedSorting.value,
      mental_feeling: string | null = selectedSorting.value,
      searchingOn: boolean = isSearching
    ) => {
      if (
        (fullLoader && isLoading) ||
        (isLoadingMore && !searchingOn) ||
        !hasMore
      )
        return;

      const typeToOrder =
        order_type === "Highest"
          ? "desc"
          : order_type === "Lowest"
          ? "asc"
          : null;

      if (fullLoader) setLoading(true);
      else if (searchingOn) setIsSearching(true);
      else setLoadingMore(true);

      try {
        if (pageNumber === 1) {
          setCardData([]);
          setHasMore(true);
        }

        const apiData = {
          weed_type: weedType,
          page: pageNumber,
          per_page: 15,
          strain_name: strainName,
          order_by: order_by?.toLowerCase() || null,
          order_type: typeToOrder,
          energy: energy || null,
          mental_feeling: mental_feeling || null,
        };
        const response = authToken
          ? await postRequestWithToken(dashBoard, apiData, dispatch)
          : await postRequest(dashBoard, apiData);

        if (response.status !== "success") {
          setHasMore(false);
          throw new Error(response.message || "No Records Found");
        }

        const newData = response.data.cards.data || [];
        totalListing = response.data.total_listing;
        if (newData.length === 0) {
          setHasMore(false);
          if (pageNumber === 1) setCardData([]);
        } else {
          setCardData((prev) => {
            const updated =
              searchingOn || pageNumber === 1
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

        console.log("cardddta:::", cardData);
      } catch (error) {
        handleError(error);
        setHasMore(false);
        if (pageNumber === 1) setCardData([]);
      } finally {
        if (fullLoader) setLoading(false);
        else if (searchingOn) setIsSearching(false);
        else setLoadingMore(false);
      }
    },
    [
      isLoading,
      isLoadingMore,
      hasMore,
      selectedCategory,
      searchValue,
      selectedSorting,
      authToken,
    ]
  );

  const handleError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    Alert.alert(loginStrings.error, errorMessage);
  };

  const categoryChoosen = (chosen: any) => {
    console.log("Selected filters:::", selectedFilters);
    console.log("chosen:::", chosen);

    setSelectedCategory(chosen.name);
    setPage(1);
    setHasMore(true);

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      Type: chosen, // Replaces only 'Type' while preserving other keys
    }));

    fetchDashboardData(1, true, chosen.name);
  };

  const handleSearchSubmit = (text: string) => {
    setSearchValue(text);
    setIsSearching(true);
    setPage(1);
    fetchDashboardData(
      1,
      false,
      selectedCategory,
      text,
      null,
      null,
      null,
      null,
      true
    );
  };

  const sortingAndFilterClicked = (text: string) => {
    setClickedSortFilter(text);
    setSortByClicked(!sortByClicked);
  };

  const userSelectedSorting = (txt: { [key: string]: string }) => {
    setIsFirstLoad(true);
    setSelectedSorting(txt);
    setPage(1);
    if (clickedSortFilter === "filter") {
   
      const [obj1, obj2, obj3] = Object.values(txt).map(
        (obj: any) => obj.value || obj.name || obj.label
      );
      fetchDashboardData(1, true, obj1, searchValue, null, null, obj2, obj3);
    } else {
      const selectedKey = Object.keys(txt)[0];
      const selectedValue = txt[selectedKey];
      fetchDashboardData(
        1,
        true,
        null,
        searchValue,
        selectedKey,
        selectedValue
      );
    }
    setSortByClicked(false);
  };

  return (
    <View style={styles.homeScreenContainer}>
      <TopBar
        showBack={sortByClicked}
        showNotification
        notificationPress={() =>
          authToken
            ? navigation.navigate("NotificationScreen")
            : setShowLoginFirstAlert(true)
        }
        backButtonPress={() => setSortByClicked(false)}
        showUserIcon={true}
        userIconClick={() =>
          navigation.navigate("UserProfile", { userId: myUser.id })
        }
      />
      {isLoading ? (
        <Loader visible />
      ) : (
        <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
          {sortByClicked ? (
            <FilterComponent
              title={clickedSortFilter}
              onSelectSort={(selected) => {
                if (clickedSortFilter === "sort") {
                  setSelectedSorting(selected);
                  userSelectedSorting(selected);
                } else {
                  setSelectedFilters(selected);
                  userSelectedSorting(selected);
                }
              }}
              previousSorting={selectedSorting}
              previousFilters={selectedFilters}
              clearFilterCalled={() => {
                if (clickedSortFilter === "sort") {
                  setSelectedCategory(null);
                  setSortByClicked(false);
                  fetchDashboardData(1, true);
                } else {
                  setSelectedFilters({});
                  setSortByClicked(false);
                  fetchDashboardData(1, true);
                }
                console.log(
                  "clickedSortFilter",
                  clickedSortFilter,
                  selectedFilters,
                  selectedCategory
                );
              }}
              //  onSelectSort={userSelectedSorting}
            />
          ) : (
            <FlatList
              data={cardData}
              keyExtractor={(item) => item.id.toString()}
              ListHeaderComponent={
                <>
                  <UserHeader
                    headerIcon={images.weedIcon}
                    title={homeStrings.weedColors}
                  />
                  <View style={styles.borderLineView} />
                  <Text style={[styles.listingText, { marginTop: 12 }]}>
                    {totalListing}
                  </Text>
                  <Text style={styles.listingText}>{homeStrings.listings}</Text>
                  <View style={styles.searchBarContainer}>
                    <CustomSearchBar
                    showCross={true}
                    crossFunction={()=>{
                      setSearchValue("")
                      fetchDashboardData(
                        1,
                        false,
                        selectedCategory,
                        "",
                        null,
                        null,
                        null,
                        null,
                        true
                      );
                    }}
                      showDisabledImage
                      placeholder="Search strains..."
                      searchValue={searchValue}
                      onSearch={handleSearchSubmit}
                      setSearchValue={setSearchValue}
                    />
                  </View>
                  <BrowseCategory
                    data={browseCategoryData}
                    categoryChoosen={categoryChoosen}
                   alreadyChosen= {selectedFilters}
                  />

                  <View style={styles.filterContainer}>
                    <TouchableOpacity
                      style={styles.sortTextContainer}
                      onPress={() => sortingAndFilterClicked("sort")}
                    >
                      <Text style={styles.sortByText}>
                        {homeStrings.sortBy}
                      </Text>
                      {/* @ts-expect-error: Ionicons type definition is missing */}
                      <MaterialIcons
                        name="keyboard-arrow-down"
                        size={25}
                        color="#000"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => sortingAndFilterClicked("filter")}
                    >
                      <Text
                        style={[
                          styles.sortByText,
                          { color: purpleColor, fontWeight: "600" },
                        ]}
                      >
                        {homeStrings.filter}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              }
              ListEmptyComponent={() => <NoDataView />}
              renderItem={({ item }) => (
                <CardList
                  data={[item]}
                  loginNav={() => navigation.navigate("LoginStack")}
                  cardFavouriteClicked={() => console.log("favourite")}
                  activeDropdown={activeDropdown}
                  setActiveDropdown={setActiveDropdown}
                  hiddenCardSuccess={() => fetchDashboardData(1, true)}
                  shareCardClick={(res: any) => {
                    navigation.navigate("MyFriends", { cardObj: res });
                  }}
                />
              )}
              onEndReached={handleEndReached}
              onEndReachedThreshold={0.8}
              ListFooterComponent={() =>
                (isSearching || isLoadingMore) && (
                  <View style={{ padding: 15, alignItems: "center" }}>
                    <ActivityIndicator
                      size={isSearching ? 25 : "small"}
                      color={isSearching ? "#ccc" : whiteButtonTextColor}
                    />
                    {isSearching && (
                      <Text style={{ color: "#666", marginTop: 5 }}>
                        Searching...
                      </Text>
                    )}
                  </View>
                )
              }
            />
          )}
        </Animated.View>
      )}
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
