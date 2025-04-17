import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList } from "react-native";
import UserHeader from "../../Components/ReuseComponents/UserHeader";
import { images } from "./Images";
import { homeStrings } from "../Home/strings";
import CustomSearchBar from "../../Components/CustomSearchBar";
import BrowseCategory from "../../Components/ReuseComponents/BrowseCategory";
import {
  whiteButtonTextColor,
} from "../../Components/Colors";
import {
  Ionicons,
} from "../../Components/ReactIcons";
import { postRequestWithToken } from "../../Components/CustomApi/PostApi";
import {
  acceptRejectCancelFriendRequestUrl,
  baseUrlV1,
  deleteCardApi,
  getCategories,
  sendFriendRequestUrl,
  userDetails,
} from "../../Constants/ApiUrls";
import { useDispatch, useSelector } from "react-redux";
import { loginStrings } from "../Login/strings";
import Loader from "../../Components/Loader";
import { getRequest } from "../../Components/CustomApi/getApi";
import CardList from "../../Components/ReuseComponents/CardList";
import FilterComponent from "../../Components/ReuseComponents/FilterComponent";
import ImportAlert from "../../Components/CustomAlerts/importAlert";
import { ProfileHeader } from "./ProfileHeader";
import { FilterContainer, PersonalInfo } from "./PersonalInfo";
import { getCardData } from "../Cards/services/ApiProvider";
import { useFocusEffect } from "@react-navigation/native";

type profileScreenProps = NativeStackScreenProps<any, "ProfileScreen">;
export default function UserProfile({ navigation, route }: profileScreenProps) {
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    [key: string]: any;
  }>({});
  const [searchValue, setSearchValue] = useState("");
  const [browseCategoryData, setBrowseCategoryData] = useState([]);
  const user = useSelector((state: any) => state.user.user);
  const [sortByClicked, setSortByClicked] = useState(false);
  const [clickedSortFilter, setClickedSortFilter] = useState("filter");
  const [selectedSorting, setSelectedSorting] = useState<{
    [key: string]: string;
  }>({});
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoadingMore, setLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showRequestAlert, setShowRequestAlert] = useState(false);
  const [requestAlertTitle, setRequestAlertTitle] = useState("");
  const [requestAlertFirstIconName, setRequestAlertFirstIconName] =
    useState("");
  const [requestAlertFirstIconFrom, setRequestAlertFirstIconFrom] =
    useState("");
  const [requestAlertSecondIconName, setRequestAlertSecondIconName] =
    useState("");
  const [requestAlertSecondIconFrom, setRequestAlertSecondIconFrom] =
    useState("");
  const [addButtonClickedObj, setAddButtonClickedObj] = useState({
    friend_request_status: "",
    id: 0,
  });
  const [buttonText, setButtonText] = useState("");
  const [userData, setUserData] = useState({
    user: {
      imageLoc: "",
      full_name: "",
      id: 0,
      friend_request_status: "",
      address: "",
      website: "",
      phoneNumber: "",
      email: "",
      profileType: "",
      userType: 0,
    },
    listing_count: 0,
    friends_count: 0,
  });

  const dispatch = useDispatch();

  const handleSearchSubmit = (text: string) => {
    setSearchValue(text);
    setIsSearching(true);
    setPage(1);
    userDetailApiCaling(
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

  const userSelectedSorting = (txt: { [key: string]: string }) => {
    setIsFirstLoad(true);
    setSelectedSorting(txt);
    setPage(1);
    if (clickedSortFilter === "filter") {
   
      const [obj1, obj2, obj3] = Object.values(txt).map(
        (obj: any) => obj.value || obj.name || obj.label
      );
      userDetailApiCaling(1, true, obj1, searchValue, null, null, obj2, obj3);
    } else {
      const selectedKey = Object.keys(txt)[0];
      const selectedValue = txt[selectedKey];
      userDetailApiCaling(
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

  const categoryChoosen = (chosen: any) => {
    setSelectedCategory(chosen.name);
    setPage(1);
    setHasMore(true);

    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      Type: chosen, // Replaces only 'Type' while preserving other keys
    }));

    userDetailApiCaling(1, true, chosen.name);
  };


  useFocusEffect(
    React.useCallback(() => {
  
      fetchCategoriesAndData();
    }, [])
  );

  // useEffect(() => {
  //   fetchCategoriesAndData();
  // }, []);

  const userDetailApiCaling = useCallback(
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
          user_id: route?.params?.userId,
        };
        // const response = await postRequest(dashBoard, apiData);
        const response = await postRequestWithToken(
          userDetails,
          apiData,
          dispatch
        );

        response.data.user.friend_request_status == "FRIEND"
          ? setButtonText(homeStrings.unfriend)
          : response.data.user.friend_request_status ==
            "FRIEND_REQUEST_RECEIVED"
          ? setButtonText("Pending")
          : response.data.user.friend_request_status == "FRIEND_REQUEST_SENDED"
          ? setButtonText("Cancel")
          : setButtonText(homeStrings.addFriend);
        if (response.status !== "success") {
          setHasMore(false);
          throw new Error(response.message || "No Records Found");
        }
        if (response.data.user) {
          setUserData(response.data);
        }

        const newData = response.data.cards.data || [];

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
    ]
  );

  const fetchCategoriesAndData = async () => {
   
    try {
      const categoryData = await getRequest(getCategories);
      if (!categoryData || categoryData.status !== "success") {
        throw new Error("Failed to fetch categories");
      }
      setBrowseCategoryData(categoryData.data);
      await userDetailApiCaling(1, true);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    Alert.alert(loginStrings.error, errorMessage);
  };

  const sortingAndFilterClicked = (text: string) => {
    setClickedSortFilter(text);
    setSortByClicked(!sortByClicked);
  };

  function ToShowPersonalInfo() {
    if (userData.user.userType == 1) {
      if (
        userData.user.friend_request_status == "FRIEND" &&
        userData.user.profileType == "public"
      ) {
        //show
        return true;
      } else if (userData.user.profileType == "public") {
        //show
        return true;
      } else if (userData.user.id == user.id) {
        return true;
      } else {
        //hide
        return false;
      }
    } else {
      //hide
      return false;
    }
  }

  const handleEndReached = () => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    if (!isLoadingMore && hasMore) {
      userDetailApiCaling(page + 1, false, selectedCategory, searchValue);
    }
  };

  async function sendFriendRequest() {
    const apiData = {
      friend_id: userData.user.id,
    };
    try {
      const data = await postRequestWithToken(
        sendFriendRequestUrl,
        apiData,
        dispatch
      );

      if (data.status === "success") {
        console.log("api success", data);
        userDetailApiCaling(1, true);
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

      if (errorMessage !== "Session expired") {
        Alert.alert(loginStrings.error, errorMessage);
      }
      console.log("API Call Failed:", error);
    }
  }

  const acceptRejectApiCalling = async (action: string) => {
    const apiData = {
      action: action,
      friend_id: addButtonClickedObj.id,
    };

    try {
      const data = await postRequestWithToken(
        acceptRejectCancelFriendRequestUrl,
        apiData,
        dispatch
      );

      if (data.status === "success") {
        console.log("api sucess", data);
        userDetailApiCaling(1, true);
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

      if (errorMessage !== "Session expired") {
        Alert.alert(loginStrings.error, errorMessage);
      }
      console.log("API Call Failed:", error);
    }
  };
  const confirmDeleteCard = (idForDeleteCard: any) => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this card?",
      [
        {
          text: "Cancel",
          style: "cancel",
          // onPress: () =>fetchCategoriesAndData(),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCardMethod(idForDeleteCard),
        },
      ],
      { cancelable: true }
    );
  };

  const deleteCardMethod = async (idFordeteteCard: any) => {
    const url = `${baseUrlV1}${deleteCardApi}`; // Replace with your API URL

    const response = await getCardData(url, idFordeteteCard);

    if (response.success) {
      console.log("response", response);
      // fetchCategoriesAndData();
      navigation.pop();
    } else {
      console.log("API Error:", response.error);
      // setShowLoader(false);
    }
  };
  return (
    <View style={styles.homeScreenContainer}>
      <TopBar
        showBack={true}
        backButtonPress={() =>
          sortByClicked ? setSortByClicked(false) : navigation.pop()
        }
        showTitle={true}
        title={sortByClicked ? "" : "Profile"}
      />
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
              userDetailApiCaling(1, true);
            } else {
              setSelectedFilters({});
              setSortByClicked(false);
              userDetailApiCaling(1, true);
            }
          
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
                headerIcon={
                  userData.user ? userData.user.imageLoc : images.weedIcon
                }
                title={userData.user.full_name}
              />

              {userData.user.id != user.id && (
                <TouchableOpacity
                  style={styles.addOrUnfriendButtonContainer}
                  onPress={() => {
                    setAddButtonClickedObj(userData.user);
                    if (userData.user.friend_request_status == "FRIEND") {
                      //unfriend
                      setRequestAlertTitle(
                        "Are you sure you want to remove this friend?"
                      );
                    } else if (
                      userData.user.friend_request_status ==
                      "FRIEND_REQUEST_SENDED"
                    ) {
                      //cancel
                      setRequestAlertTitle(
                        "Are you sure you want to cancel request?"
                      );
                    } else if (
                      userData.user.friend_request_status ==
                      "FRIEND_REQUEST_RECEIVED"
                    ) {
                      //accept and reject
                      if (userData.user.userType) {
                        setRequestAlertTitle(
                          "This Store has sent you request, What would you like to do?"
                        );
                      } else {
                        setRequestAlertTitle(
                          "This User has sent you request, What would you like to do?"
                        );
                      }
                    } else {
                      if (userData.user.userType) {
                        setRequestAlertTitle(
                          "Are you sure you want to add this store as a friend?"
                        );
                      }
                      setRequestAlertTitle(
                        "Are you sure you want to add this user as a friend?"
                      );
                    }

                    setRequestAlertFirstIconName("person-add-alt-1");
                    setRequestAlertFirstIconFrom("MaterialIcons");
                    setRequestAlertSecondIconFrom("MaterialIcons");
                    setRequestAlertSecondIconName("person-add-disabled");

                    setShowRequestAlert(true);
                  }}
                >
                  <Text style={styles.addOrUnfriendButtonText}>
                    {buttonText}
                  </Text>
                </TouchableOpacity>
              )}

              <ProfileHeader userData={userData} />
            
              {userData.user.userType == 1 && ToShowPersonalInfo() && (
                <PersonalInfo userData={userData} />
              )}

              {userData.user.profileType == "private" &&
                userData.user.id != user.id && (
                  <View style={styles.privateAccountContainer}>
                    <View style={styles.privateAccountIconContainer}>
                      {/* @ts-expect-error: Ionicons type definition is missing */}
                      <Ionicons name="eye-off-sharp" size={25} color={"#000"} />
                    </View>
                    <View style={styles.accountPrivateTextContainer}>
                      <Text style={styles.yourListText}>
                        {homeStrings.thisAccountPirvate}
                      </Text>
                      <Text
                        style={[
                          styles.keepTrackText,
                          {
                            marginTop: 5,
                            textAlign: "center",
                            marginHorizontal: 50,
                          },
                        ]}
                      >
                        {homeStrings.followAccountText}
                      </Text>
                    </View>
                  </View>
                )}

              {cardData.length > 0 && ToShowPersonalInfo() && (
                <>
                  <View style={styles.searchBarContainer}>
                    <CustomSearchBar
                      showDisabledImage
                      placeholder="Search strains..."
                      searchValue={searchValue}
                      onSearch={handleSearchSubmit}
                      setSearchValue={setSearchValue}
                      showCross={true}
                      crossFunction={()=>{
                        setSearchValue("")
                        userDetailApiCaling(
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
                    />
                  </View>
                  <BrowseCategory
                    data={browseCategoryData}
                    categoryChoosen={categoryChoosen}
                  />

                  <FilterContainer
                    sortingAndFilterClicked={sortingAndFilterClicked}
                  />
                </>
              )}
            </>
          }
          renderItem={({ item }) => (
            <CardList
              data={[item]}
              loginNav={() => navigation.navigate("LoginStack")}
              cardFavouriteClicked={() => console.log("favourite")}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              hiddenCardSuccess={() => userDetailApiCaling(1, true)}
              showDeleteEditCard={true}
              handleDeleteCard={(clickItemData: any) => {
               
                confirmDeleteCard(clickItemData?.id);
              }}
              shareCardClick= {(res: any)=>{
                navigation.navigate("MyFriends",{cardObj:res})
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
      <ImportAlert
        visible={showRequestAlert}
        close={() => setShowRequestAlert(false)}
        title={requestAlertTitle}
        showSubtitle={false}
        iconName={requestAlertFirstIconName}
        iconFrom={requestAlertFirstIconFrom}
        iconFromSecond={requestAlertSecondIconFrom}
        iconNameSecond={requestAlertSecondIconName}
        firstButtonText={
          addButtonClickedObj.friend_request_status == "FRIEND_REQUEST_RECEIVED"
            ? "Accept"
            : "Yes"
        }
        secondButtonText={
          addButtonClickedObj.friend_request_status == "FRIEND_REQUEST_RECEIVED"
            ? "Reject"
            : "No"
        }
        userChosen={(text: string) => {
          if (text == "yes") {
            setShowRequestAlert(false);
            if (
              addButtonClickedObj.friend_request_status ==
              "FRIEND_REQUEST_SENDED"
            ) {
              acceptRejectApiCalling("cancel");
            } else if (
              addButtonClickedObj.friend_request_status ==
              "FRIEND_REQUEST_RECEIVED"
            ) {
              acceptRejectApiCalling("accecpt");
            } else if (addButtonClickedObj.friend_request_status == "FRIEND") {
              acceptRejectApiCalling("cancel");
            } else {
              sendFriendRequest();
            }
          } else {
            if (
              addButtonClickedObj.friend_request_status ==
              "FRIEND_REQUEST_RECEIVED"
            ) {
              setShowRequestAlert(false);
              acceptRejectApiCalling("reject");
            } else {
              setShowRequestAlert(false);
            }
          }
        }}
      />
      <Loader visible={isLoading} />
    </View>
  );
}
