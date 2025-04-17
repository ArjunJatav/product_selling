import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { Entypo, Feather, Ionicons } from "../../Components/ReactIcons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { chatGetRequest } from "../../Components/CustomApi/ChatGetApi";
import SocketService from "../../Components/Socket/SocketService";
import { useSelector } from "react-redux";
import { blockChat, getRoomChat, imageUpload } from "../../Constants/ApiUrls";
import CameraGallery from "../../Components/CustomAlerts/CameraGallery";
import requestMediaPermissions from "../../Components/requestMediaPermissions";
import pickImage from "../../Components/PickImage";
import ImagePreviewModal from "../../Components/ImagePreviewModal";
import {
  chatMultipartPostRequest,
  chatPostRequest,
} from "../../Components/CustomApi/ChatPostApi";
import { windowWidth } from "../../Constants/ReuseVariables";
import ParametersAlert from "../../Components/CustomAlerts/ParametersAlert";
import ReportAlert from "../../Components/CustomAlerts/ReportAlert";
import {
  orangeColor,
  placeholderColor,
  redColor,
  textColor,
  whiteButtonTextColor,
} from "../../Components/Colors";
import { BottomTabImages } from "../../Route/Images";
import { images } from "../../Components/ReuseComponents/Images";
import { ChatDetailHeader } from "./ChatHeader";
import { formatMessageTimestamp } from "./ChatDateTime";

type chatDetailScreenProps = NativeStackScreenProps<any, "ChatDetail">;
const ChatDetail = ({ route, navigation }: chatDetailScreenProps) => {
  type Message = {
    isPending: boolean;
    id: number;
    message: string; // Change 'text' to 'message'
    sender: { id: number }; // Change 'user' to 'sender'
    files: [];
    meta: {};
    type: string;
    cardData: {
      user_profile: string;
      strainName: string;
      cost_unit: string;
      weedType: string;
      user_name: string;
      cost: string;
      state_code: string;
      weight: string;
      rating: string;
      weight_unit: string;
      id: number;
    };
  };
  type PendingMessage = Message & { isPending: boolean };
  const [messages, setMessages] = useState<Message[]>([]);
  const [friendData, setFriendData] = useState(route?.params?.friendData);
  const [inputText, setInputText] = useState("");
  const user = useSelector((state: any) => state.user.user);
  const [roomid, setRoomId] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    path: string;
    filename: string;
    type: string;
  } | null>(null);
  const [showThreeDotAlert, setShowThreeDotAlert] = useState(false);
  const [isChatBlock, setIsChatBlock] = useState(0);
  const [showReportAlert, setShowReportAlert] = useState(false);
  const [cardClickedItem, setCardClickedItem] = useState({});
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const iconData = [
    {
      iconFrom: "MaterialCommunityIcons",
      iconName: "cannabis",
      title: "Share Card",
      onPress: () => {
        setShowThreeDotAlert(false);
        navigation.navigate("MyCards", {
          roomId: roomid,
          friendId: friendData.id,
        });
      },
    },
    {
      iconFrom: "MaterialIcons",
      iconName: "person-add-disabled",
      title: isChatBlock ? "Unblock" : "Block",
      onPress: () => {
        BlockChatApiCalling();
        setShowThreeDotAlert(false);
      },
    },
    {
      iconFrom: "MaterialCommunityIcons",
      iconName: "home-city-outline",
      title: "Report",
      onPress: () => {
        setShowThreeDotAlert(false);
        setShowReportAlert(true);
      },
    },
  ];
  async function BlockChatApiCalling() {
    const apiData = {
      is_block: !isChatBlock,
    };
    const extraHeaders = {
      userId: user.id, // Example extra header
      roomId: roomid,
    };
    try {
      const data = await chatPostRequest(blockChat, apiData, extraHeaders);
      if (data.success) {
        setIsChatBlock(isChatBlock == 1 ? 0 : 1);
        console.log("api succes::", data);
      } else {
        console.log("api eroor", data);
      }
    } catch (error) {
      console.log("api failed", error);
    }
  }

  const sendMessage = () => {
    if (inputText.trim() !== "") {
      const tempMessage: PendingMessage = {
        id: Date.now(),
        message: inputText,
        sender: { id: user.id },
        isPending: true,
        files: [],
        meta: {},
        type: "TEXT",
      };

      setMessages((prevMessages) => [tempMessage, ...prevMessages]);
      setTimeout(() => {
        flatListRef.current?.scrollToIndex({ index: 0, animated: true });
      }, 100);

      let obj = {
        room_id: roomid,
        sender_id: user.id,
        receiver_id: friendData.id,
        message: inputText,
        type: "TEXT",
      };

      SocketService.sendTextMessage(obj);
      setInputText("");
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;
    return (
      <View style={{ padding: 10 }}>
        <Text>Loading more messages...</Text>
      </View>
    );
  };


  useEffect(() => {
    if (user && friendData) {
      SocketService.joinRoom(user.id, friendData.id);

      SocketService.getSocket()?.on("joinedRoom", (data) => {
        setRoomId(data.roomId);
        fetchChat(data.roomId, 1);
      });

      SocketService.getSocket()?.on("message", (msg) => {
     
        const formattedMessage = {
          id: msg.id,
          message: msg.message || "",
          sender: msg.sender ? msg.sender : { id: msg.sender_id || 0 },
          files: msg.files || [],
          type: msg.type || "TEXT",
          cardData: msg.type === "CARD" && msg.meta ? JSON.parse(msg.meta) : {},
          msgDateTime:msg.createdAt
        };

        setMessages((prevMessages:any) => {
          const newMessages = [
            formattedMessage,
            ...prevMessages.filter(
              (m:any) => !(m.isPending && m.message === msg.message)
            ),
          ];
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: 0, animated: false });
          }, 100);
          return newMessages;
        });
      });

      return () => {
        SocketService.getSocket()?.off("message");
      };
    }
  }, [user, friendData]);

  const loadMoreMessages = () => {
    if (!isLoading && hasMore) {
      fetchChat(roomid, page + 1);
    }
  };

  const fetchChat = async (id: any, pageNum: number = 1) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const extraHeaders = {
        userId1: user.id,
        userId2: friendData.id,
      };

      let url = `${getRoomChat}?page=${pageNum}&limit=20`;
      const data = await chatGetRequest(url, extraHeaders);

      if (pageNum === 1) {
        setIsChatBlock(data.is_block ? 1 : 0);
      }

      if (data.success) {
        const formattedMessages = data.data.map((msg: any) => ({
          id: msg.id,
          message: msg.message,
          sender: { id: msg.sender_id || 0 },
          files: msg.files ? JSON.parse(msg.files) : [],
          type: msg.type || "TEXT",
          cardData: msg.type === "CARD" && msg.meta ? JSON.parse(msg.meta) : {},
          msgDateTime:msg.createdAt
        }));
        console.log("api response::",data.data)
        const lastObject = data.data[0];
        console.log("data.data::",data)
        if (pageNum === 1) {
          setMessages(formattedMessages);
        } else {
          // Append older messages to the end since list is inverted
          setMessages((prev) => [...prev, ...formattedMessages]);
        }

        // Check if there are more messages to load
        setHasMore(data.data.length === 20); // Assuming 20 is your limit
        setPage(pageNum);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    } finally {
      setIsLoading(false);
    }
  };



  const handleSendImage = () => {
    const obj = {
      uri: selectedImage?.path,
      name: selectedImage?.filename,
      type: "image/jpeg",
    };
    imageToUploadOnServer(obj);
    setShowPreview(false);
    // Here you can call your API to send the image
  };
  const handleImagePicked = (image: any) => {
    setSelectedImage({
      path: image.path, // Use `uri` instead of `path`
      filename: image.fileName || "image.jpg",
      type: image.type || "image/jpeg",
    });
    // setSelectedImage(image);
    setShowPreview(true);
  };
  const userChoseForProfile = async (choose: string) => {
    setShowPopup(false);
    const hasPermission = await requestMediaPermissions();

    if (hasPermission) {
      pickImage(choose, false, handleImagePicked);
    }
  };

  const imageToUploadOnServer = async (image: object | null) => {
    console.log("in image to upload server", image);
    try {
      const form = new FormData();
      form.append("file", image);
      let url = imageUpload;
      const data = await chatMultipartPostRequest(url, form);
      console.log("api response::", data);
      if (data.status == "success") {
        let obj = {
          room_id: roomid,
          sender_id: user.id,
          receiver_id: friendData.id,
          message: "",
          type: "FILE",
          urls: [data.data.url],
        };

        SocketService.sendFileMessage(obj);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
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

  const handlePressCard  = (item:any) => {
    setCardClickedItem(item);
    navigation.navigate("CardDetails", {
      item: item,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ChatDetailHeader
        title={friendData.full_name}
        userImage={friendData.imageLoc}
        backBUttonPress={() => navigation.pop()}
      />

      <FlatList
        data={messages}
        inverted
        ref={flatListRef}
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender?.id === user.id
                ? styles.myMessage
                : styles.otherMessage,
            ]}
          >
            {/* If the message contains text, display it */}
            {item.message ? (
              <Text style={styles.messageText}>{item.message}</Text>
            ) : null}

            {/* If the message contains an image, display it */}
            {item.files && item.files.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedImage({
                    path: item.files[0],
                    filename: "",
                    type: "image/jpeg",
                  });
                  setShowPreview(true);
                }}
              >
                <Image
                  source={{ uri: item.files[0] }} // Load the first image URL
                  style={styles.chatImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}

            {item.type == "CARD" && (
              <>
                <TouchableOpacity
                  style={[styles.cardContainer]}
                  onPress={() => {handlePressCard(item.cardData);
                    
                    }
                  }
                  // onPress={() => setCardSelectedObj(item)}
                >
                  <View style={styles.cardImgContainer}>
                    <Image
                      source={{ uri: item.cardData.user_profile }}
                      style={styles.cardimage}
                      resizeMode="contain"
                    />
                  </View>
                  <View style={styles.contentContainer}>
                    <View style={styles.rowContainer}>
                      <Text style={styles.Title} numberOfLines={1}>
                        {item.cardData.strainName}
                      </Text>
                      <Text style={styles.price} numberOfLines={1}>
                        {item.cardData.cost_unit}
                        {item.cardData.cost}
                      </Text>
                    </View>
                    <View style={styles.iconsContainer}>
                      <Image
                        source={
                          item.cardData.weedType == "flower"
                            ? BottomTabImages.homePage
                            : item.cardData.weedType == "concentrate"
                            ? images.concentrateIcon
                            : item.cardData.weedType == "edible"
                            ? images.edibleIcon
                            : item.cardData.weedType == "cBD"
                            ? images.cbdIcon
                            : item.cardData.weedType == "vape"
                            ? images.vapeIcon
                            : images.preRollIcon
                        }
                        style={styles.weedIcon}
                        resizeMode="contain"
                      />
                      <Text style={styles.caText}>
                        {item.cardData.state_code}
                      </Text>
                      <Text style={styles.ozText}>
                        {item.cardData.weight}
                        {item.cardData.weight_unit}
                      </Text>
                      <Text style={styles.ratingText}>
                        {item.cardData.rating}
                      </Text>
                      {/*  @ts-expect-error: Entypo type definition is missing */}
                      <Entypo
                        name="star"
                        size={15}
                        color={orangeColor}
                        style={{ marginLeft: 0 }}
                      />

                      {moonSunIcons(item.cardData)}
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            )}
        <Text style={{alignSelf:"flex-end",color:placeholderColor}}>{formatMessageTimestamp(item.msgDateTime)}</Text>
          </View>
        )}
        style={styles.messageList}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inputContainer}>
          <View
            style={[
              styles.input,
              { backgroundColor: isChatBlock ? "gray" : "#fff" },
            ]}
          >
            <TouchableOpacity
              style={styles.cameraContainer}
              onPress={() => {
                if (!isChatBlock) {
                  setShowPopup(true);
                }
              }}
            >
              {/* @ts-expect-error: Ionicons type definition is missing */}
              <Entypo name="camera" size={25} />
            </TouchableOpacity>
            <TextInput
              style={{ flex: 1, paddingLeft: 10 }}
              value={inputText}
              onChangeText={setInputText}
              placeholder={
                isChatBlock ? "You can't message." : "Type a message..."
              }
              placeholderTextColor={"#000"}
              editable={isChatBlock ? false : true}
            />
            {showThreeDotAlert && (
              <View style={styles.parameterAlertContainer}>
                <ParametersAlert
                  numberOfRow={3}
                  iconData={iconData}
                  showBackgroundImage={false}
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.threeDotContainer}
              onPress={() => setShowThreeDotAlert(!showThreeDotAlert)}
            >
              {/* @ts-expect-error: Ionicons type definition is missing */}
              <Feather name="more-vertical" size={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            {/* @ts-expect-error: Ionicons type definition is missing */}
            <Ionicons name="send" size={25} color={"#fff"} />
          </TouchableOpacity>

          <CameraGallery
            visible={showPopup}
            close={() => setShowPopup(false)}
            userChosen={(choose: string) => userChoseForProfile(choose)}
          />

          <ImagePreviewModal
            visible={showPreview}
            imageUri={selectedImage?.path || ""}
            onClose={() => setShowPreview(false)}
            onSend={handleSendImage}
            showSendButton={
              selectedImage?.path?.includes("http") ? false : true
            }
          />

          <ReportAlert
            visible={showReportAlert}
            close={() => setShowReportAlert(false)}
            reportedType="USER"
            reportedId={friendData.id}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messageList: {
    flex: 1, // This ensures the message list takes up available space and pushes the input to the bottom.
    paddingHorizontal: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "75%",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#E8EEFF",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFEAC5",
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    paddingBottom: Platform.OS === "ios" ? 20 : 10, // Adjust padding for iOS and Android
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 25,
    paddingHorizontal: 10,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    borderRadius: 23,
    height: 45,
    width: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cameraContainer: {
    justifyContent: "center",
  },
  threeDotContainer: {
    justifyContent: "center",
  },
  chatImage: {
    height: 150,
    width: windowWidth / 2,
  },
  parameterAlertContainer: {
    position: "absolute",
    right: 25, // Adjust this based on where exactly you want it
    bottom: 40,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingRight: 10,
  },
  Title: {
    fontSize: 20,
    color: "#000",
    fontWeight: "600",
    marginTop: 5,
    flexShrink: 1,
    marginRight: 10,
  },
  price: {
    color: whiteButtonTextColor,
    fontSize: 20,
    fontWeight: "600",
    marginTop: 5,
    maxWidth: 80, // You can tweak this value or use 'flexShrink' instead
  },
  cardContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    paddingVertical: 20,
    borderWidth: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderColor: "transparent",
    // backgroundColor:"blue"
  },
  cardImgContainer: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor:"green"
  },
  cardimage: {
    height: 50,
    width: 50,
  },
  contentContainer: {
    //  flex: 1,
    // backgroundColor:"red",
    marginHorizontal: 10,
    width: "80%",
  },
  borderContentContainer: {
    borderWidth: 1,
    borderColor: placeholderColor,
    alignSelf: "flex-start",
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  borderContent: {
    color: "#000",
    fontWeight: "600",
  },
  description: {
    color: textColor,
    marginTop: 5,
    fontSize: 15,
  },
  iconsContainer: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  weedIcon: {
    height: 20,
    width: 20,
    tintColor: whiteButtonTextColor,
  },
  caText: {
    color: redColor,
    marginLeft: 5,
  },
  ozText: {
    color: "#000",
    marginLeft: 5,
  },
  ratingText: {
    color: redColor,
    marginLeft: 5,
  },
  sunMoonIcon: {
    height: 25,
    width: 25,
    marginLeft: 5,
    marginTop: -7,
  },
});

export default ChatDetail;
