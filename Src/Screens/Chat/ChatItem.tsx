import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import {
  MaterialCommunityIcons,
  MaterialIcons,
} from "../../Components/ReactIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import { whiteButtonTextColor } from "../../Components/Colors";
import { formatTimeDifference } from "./ChatDateTime";

type ChatItemProps = {
  item: {
    imageLoc: string;
    full_name: string;
    listing_count: number;
    id: number;
    friend_request_status: string;
  };
  selectedTab: string;
  tabContentMap: Record<string, any>;
  onProfilePress: () => void;
  onChatPress: () => void;
  onAddButtonPress: () => void;
};

const ChatItem: React.FC<ChatItemProps> = ({
  item,
  selectedTab,
  tabContentMap,
  onProfilePress,
  onChatPress,
  onAddButtonPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chatListViewContainer,
        {
          borderBottomWidth: tabContentMap[selectedTab].showListingCount
            ? 0.5
            : 0,
          paddingBottom: tabContentMap[selectedTab].showListingCount ? 5 : 0,
          borderColor: "gray",
        },
      ]}
    >
      <TouchableOpacity
        style={styles.profileImageContainer}
        onPress={onProfilePress}
      >
        <Image
          source={{ uri: item.imageLoc }}
          resizeMode="cover"
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.userNameContainer} onPress={onChatPress}>
        <Text style={styles.userName}>{item.full_name}</Text>
      </TouchableOpacity>

      {tabContentMap[selectedTab].showAddFriendButton && (
        <>
          {selectedTab === "Stores" ? (
            <>
              {item.friend_request_status === "FRIEND_REQUEST_SENDED" ? (
                <TouchableOpacity
                  style={styles.addFriendContainer}
                  onPress={onAddButtonPress}
                >
                  <View style={styles.addFriendButtonView}>
                    {/* @ts-expect-error: Feather type definition is missing */}
                    <MaterialCommunityIcons
                      name="home-remove-outline"
                      size={15}
                      color={whiteButtonTextColor}
                    />
                    <Text
                      style={{
                        color: whiteButtonTextColor,
                        fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : item.friend_request_status === "FRIEND_REQUEST_RECEIVED" ? (
                <TouchableOpacity
                  style={styles.addFriendContainer}
                  onPress={onAddButtonPress}
                >
                  <View style={styles.addFriendButtonView}>
                    {/* @ts-expect-error: Feather type definition is missing */}
                    <MaterialCommunityIcons
                      name="store-clock"
                      size={15}
                      color={whiteButtonTextColor}
                    />
                    <Text
                      style={{
                        color: whiteButtonTextColor,
                        fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      Pending
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : item.friend_request_status === "NOT_FRIEND" ? (
                <TouchableOpacity
                  style={styles.addFriendContainer}
                  onPress={onAddButtonPress}
                >
                  <View style={styles.addFriendButtonView}>
                    {/* @ts-expect-error: Feather type definition is missing */}
                    <MaterialCommunityIcons
                      name="store-plus"
                      size={22}
                      color={whiteButtonTextColor}
                    />
                    <Text style={{ color: whiteButtonTextColor }}>Add</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </>
          ) : (
            <>
              {item.friend_request_status === "FRIEND_REQUEST_SENDED" ? (
                <TouchableOpacity
                  style={styles.addFriendContainer}
                  onPress={onAddButtonPress}
                >
                  <View style={styles.addFriendButtonView}>
                    {/* @ts-expect-error: Feather type definition is missing */}
                    <FontAwesome5
                      name="user-times"
                      size={15}
                      color={whiteButtonTextColor}
                    />
                    <Text
                      style={{
                        color: whiteButtonTextColor,
                        fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : item.friend_request_status === "FRIEND_REQUEST_RECEIVED" ? (
                <TouchableOpacity
                  style={styles.addFriendContainer}
                  onPress={onAddButtonPress}
                >
                  <View style={styles.addFriendButtonView}>
                    {/* @ts-expect-error: Feather type definition is missing */}
                    <FontAwesome6
                      name="user-clock"
                      size={15}
                      color={whiteButtonTextColor}
                    />
                    <Text
                      style={{
                        color: whiteButtonTextColor,
                        fontSize: 12,
                        marginLeft: 5,
                      }}
                    >
                      Pending
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : item.friend_request_status === "NOT_FRIEND" ? (
                <TouchableOpacity
                  style={styles.addFriendContainer}
                  onPress={onAddButtonPress}
                >
                  <View style={styles.addFriendButtonView}>
                    {/* @ts-expect-error: Feather type definition is missing */}
                    <MaterialIcons
                      name="person-add-alt-1"
                      size={22}
                      color={whiteButtonTextColor}
                    />
                    <Text style={{ color: whiteButtonTextColor }}>Add</Text>
                  </View>
                </TouchableOpacity>
              ) : null}
            </>
          )}
        </>
      )}
      {tabContentMap[selectedTab].showListingCount && (
        <View
          style={[
            styles.addFriendContainer,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text>{item.listing_count}</Text>
        </View>
      )}
      {!tabContentMap[selectedTab].showAddFriendButton && !tabContentMap[selectedTab].showListingCount && (
         <View
         style={[
           styles.addFriendContainer,
           { justifyContent: "center", alignItems: "center" },
         ]}
       >
        <Text>{formatTimeDifference(item.last_seen)}</Text>
       </View>
      )}
    </TouchableOpacity>
  );
};

export default ChatItem;
