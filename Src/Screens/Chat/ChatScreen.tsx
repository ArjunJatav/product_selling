import React, { useState } from "react";
import {
  Alert,
  ImageBackground,
  View,
} from "react-native";
import TopBar from "../../Components/Topbar";
import { styles } from "./styles";
import { signUpImages } from "../SignUp/Images";
import CustomSearchBar from "../../Components/CustomSearchBar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import LoginFirst from "../../Components/CustomAlerts/LoginFirst";
import LoginFirstScreen from "../../Components/ReuseComponents/LoginFirstScreen";
import { useFocusEffect } from "@react-navigation/native";
import { postRequestWithToken } from "../../Components/CustomApi/PostApi";
import {
  acceptRejectCancelFriendRequestUrl,
  chatListData,
  sendFriendRequestUrl,
} from "../../Constants/ApiUrls";
import { useDispatch } from "react-redux";
import { loginStrings } from "../Login/strings";
import ParametersAlert from "../../Components/CustomAlerts/ParametersAlert";
import ImportAlert from "../../Components/CustomAlerts/importAlert";
import ChatHeader from "./ChatHeader";
import { renderChatItem, tabContentMap } from "./TabContent";
import ChatList from "./ChatList";



type chatScreenProps = NativeStackScreenProps<any, "ChatScreen">;
export default function ChatScreen({ navigation }: chatScreenProps) {
  const [showLoginFirstAlert, setShowLoginFirstAlert] = useState(false);
  const dispatch = useDispatch();
  interface ChatItem {
    imageLoc: string;
    full_name: string;
    listing_count: number;
    id: number;
    friend_request_status: string;
  }
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [showThreeDotAlert, setShowThreeDotAlert] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Friends");
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [showRequestAlert, setShowRequestAlert] = useState(false);
  const [sentRequestId, setSentRequestId] = useState(0);
  const [addButtonClickedObj, setAddButtonClickedObj] = useState({
    friend_request_status: "",
    id:0
  });
  const [requestAlertTitle, setRequestAlertTitle] = useState('');
  const [requestAlertFirstIconName, setRequestAlertFirstIconName] = useState('');
  const [requestAlertFirstIconFrom, setRequestAlertFirstIconFrom] = useState('');
  const [requestAlertSecondIconName, setRequestAlertSecondIconName] = useState('');
  const [requestAlertSecondIconFrom, setRequestAlertSecondIconFrom] = useState('');
  useFocusEffect(
    React.useCallback(() => {
      if (globalThis.token) {
        setSelectedTab("Friends")
        getChatList("friends", 1, searchValue);
      }
    }, [])
  );

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
        setChatList((prevChatList) =>
          prevChatList.map((item) =>
            item.id === addButtonClickedObj.id
              ? {
                  ...item,
                  friend_request_status:
                    action === "accecpt"
                      ? "FRIEND" // Assuming "FRIEND" is the status after accepting
                      : action === "reject" || action === "cancel"
                      ? "NOT_FRIEND"
                      : item.friend_request_status,
                }
              : item
          )
        );
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

  const getChatList = async (
    pageType: string,
    newPage: number,
    searchText: string
  ) => {
    if (loadingMore) return; // Prevent multiple calls
    setLoadingMore(true);

    const apiData = {
      full_name: searchText,
      page: newPage,
      per_page: 15,
      page_type: pageType,
    };
    try {
      const data = await postRequestWithToken(chatListData, apiData, dispatch);

      if (data.status === "success") {
        const newChatList = data.data.data || [];

        if (newPage === 1) {
          setChatList(newChatList);
        } else {
          setChatList((prevChatList) => [...prevChatList, ...newChatList]);
        }

        setHasMore(newChatList.length > 0);
        setPage(newPage);
      } else {
        Alert.alert(loginStrings.error, data.message);
      }
    } catch (error) {
      console.log("API Error:", error);
      Alert.alert(loginStrings.error, "An unexpected error occurred.");
    } finally {
      setLoadingMore(false);
    }
  };

  const iconData = [
    {
      iconFrom: "MaterialCommunityIcons",
      iconName: "account-multiple-outline",
      title: "Friends",
      onPress: () => {
        setSelectedTab("Friends");
        setShowThreeDotAlert(false);
        getChatList("friends", 1, searchValue);
      },
    },
    {
      iconFrom: "MaterialCommunityIcons",
      iconName: "home-city-outline",
      title: "Stores",
      onPress: () => {
        setSelectedTab("Stores");
        setShowThreeDotAlert(false);
        getChatList("stores", 1, searchValue);
      },
    },
    {
      iconFrom: "MaterialIcons",
      iconName: "person-add-alt-1",
      title: "People",
      onPress: () => {
        setSelectedTab("People");
        setShowThreeDotAlert(false);
        getChatList("individual", 1, searchValue);
      },
    },
    {
      iconFrom: "Entypo",
      iconName: "rocket",
      title: "Leaders",
      onPress: () => {
        setSelectedTab("Leaders");
        setShowThreeDotAlert(false);
        getChatList("leaderboard", 1, searchValue);
      },
    },
  ];

  const onChangeSearch = (text: string) => {
    if (text) {
      setSearchValue(text);
    } else {
      setSearchValue("");
      let itTab = "friends";
      if (selectedTab == "Stores") {
        itTab = "stores";
      } else if (selectedTab == "People") {
        itTab = "individual";
      } else if (selectedTab == "Leaders") {
        itTab = "leaderboard";
      } else {
        itTab = "friends";
      }
      getChatList(itTab, 1, "");
    }
  };

  async function sendFriendRequest() {
    const apiData = {
      friend_id: sentRequestId,
    };
    try {
      const data = await postRequestWithToken(
        sendFriendRequestUrl,
        apiData,
        dispatch
      );

      if (data.status === "success") {
        setChatList((prevChatList) =>
          prevChatList.map((item) =>
            item.id === sentRequestId
              ? { ...item, friend_request_status: "FRIEND_REQUEST_SENDED" }
              : item
          )
        );
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
  }
  return (
    <View style={styles.chatContainer}>
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
      {!globalThis.token && (
        <LoginFirstScreen
          buttonClick={() => navigation.navigate("LoginStack")}
        />
      )}
      {globalThis.token && (
        <ImageBackground
          source={signUpImages.signUpBackground}
          style={{ flex: 1, paddingHorizontal: 20 }}
        >
          <ChatHeader title={tabContentMap[selectedTab].title} content={tabContentMap[selectedTab].content}/>
        

          <View style={styles.chatListContainer}>
            <CustomSearchBar
              placeholder={"SEARCH"}
              showCross={true}
              crossFunction={()=>{
                setSearchValue("")
                let itTab = "friends";
                if (selectedTab == "Stores") {
                  itTab = "stores";
                } else if (selectedTab == "People") {
                  itTab = "individual";
                } else if (selectedTab == "Leaders") {
                  itTab = "leaderboard";
                } else {
                  itTab = "friends";
                }
                getChatList(itTab, 1, "");
              }}
              searchValue={searchValue}
              setSearchValue={(text) => onChangeSearch(text)}
              editable={chatList.length > 0 ? true : searchValue ? true : false}
              threeDotClick={() => setShowThreeDotAlert(!showThreeDotAlert)}
              showThreeDot={true}
              onSearch={() => {
                let itTab = "friends";
                if (selectedTab == "Stores") {
                  itTab = "stores";
                } else if (selectedTab == "People") {
                  itTab = "individual";
                } else if (selectedTab == "Leaders") {
                  itTab = "leaderboard";
                } else {
                  itTab = "friends";
                }
                getChatList(itTab, 1, searchValue);
              }}
            />
            {showThreeDotAlert && (
              <View style={styles.parameterAlertContainer}>
                <ParametersAlert
                  numberOfRow={4}
                  iconData={iconData}
                  selectedData={selectedTab}
                  showBackgroundImage={true}
                />
              </View>
            )}

<ChatList
              chatList={chatList}
              selectedTab={selectedTab}
              tabContentMap={tabContentMap}
              onEndReached={() => {
                if (hasMore) {
                  let itTab = 'friends';
                  if (selectedTab === 'Stores') {
                    itTab = 'stores';
                  } else if (selectedTab === 'People') {
                    itTab = 'individual';
                  } else if (selectedTab === 'Leaders') {
                    itTab = 'leaderboard';
                  }
                  getChatList(itTab, page + 1, searchValue);
                }
              }}
              loadingMore={loadingMore}
              renderItem={({ item }) =>
                renderChatItem({
                  item,
                  selectedTab,
                  tabContentMap,
                  navigation,
                  setAddButtonClickedObj,
                  setSentRequestId,
                  setShowRequestAlert,
                  setRequestAlertTitle,
                  setRequestAlertFirstIconName,
                  setRequestAlertFirstIconFrom,
                  setRequestAlertSecondIconName,
                  setRequestAlertSecondIconFrom,
                })
              }
            />
          </View>
        </ImageBackground>
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
            } else {
              sendFriendRequest();
            }
            // sendFriendRequest();
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
