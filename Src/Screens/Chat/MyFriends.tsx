import { Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { postRequestWithToken } from "../../Components/CustomApi/PostApi";
import { chatListData } from "../../Constants/ApiUrls";
import { useDispatch, useSelector } from "react-redux";
import { loginStrings } from "../Login/strings";
import CustomSearchBar from "../../Components/CustomSearchBar";
import SocketService from "../../Components/Socket/SocketService";

type chatScreenProps = NativeStackScreenProps<any, "myFriends">;
export default function MyFriends({ navigation,route }: chatScreenProps) {
  const [loadingMore, setLoadingMore] = useState(false);
  const dispatch = useDispatch();
  interface ChatItem {
    imageLoc: string;
    full_name: string;
    listing_count: number;
    id: number;
    friend_request_status: string;
  }
  const [chatList, setChatList] = useState<ChatItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
const [friendSelectedobj,setFriendSelectedObj]=useState<ChatItem | null>(null);
const user = useSelector((state: any) => state.user.user);

  useEffect(() => {
    getChatList("friends", 1, searchValue);
  }, []);
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

  const onChangeSearch = (text: string) => {
    if (text) {
      setSearchValue(text);
    } else {
      setSearchValue("");

      getChatList("friends", 1, "");
    }
  };


  function sendCard() {
    try {
        let obj = {
            sender_id: user.id,
            receiver_id : friendSelectedobj?.id,
            message: "",
            type: "CARD",
            meta: route?.params?.cardObj
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
      <View style={[styles.chatListContainer, { marginHorizontal: 15 }]}>
        <CustomSearchBar
          placeholder={"SEARCH"}
          showCross={true}
          crossFunction={()=>{
            setSearchValue("");
            getChatList("friends", 1, "");
          }}
          searchValue={searchValue}
          setSearchValue={(text) => onChangeSearch(text)}
          editable={chatList.length > 0 ? true : searchValue ? true : false}
          showThreeDot={false}
          onSearch={() => {
            getChatList("friends", 1, searchValue);
          }}
        />

        <FlatList
          data={chatList}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.myFriendsContainer} onPress={()=>setFriendSelectedObj(item)}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.imageLoc }} style={styles.image} />
              </View>

              <View style={styles.userNameContainer}>
                <Text style={styles.userName}>{item.full_name}</Text>
              </View>

              <View style={styles.correctSignContainer}>
              {friendSelectedobj?.id == item.id ? (
                  <Text>✅</Text>
                ) : (
                  <View style={styles.tickBoxContainer} />
                )}
              </View>
            </TouchableOpacity>
          )}
        />
         <TouchableOpacity
        style={styles.sendbuttonContainer}
    onPress={()=>sendCard()}
      >
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
      </View>
 
    </View>
  );
}
