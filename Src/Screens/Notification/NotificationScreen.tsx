import { Alert, FlatList, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./styles";
import TopBar from "../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { authenticatedGetRequest } from "../../Components/CustomApi/getApi";
import { clearNotifications, getNotifications } from "../../Constants/ApiUrls";
import { loginStrings } from "../Login/strings";
import Loader from "../../Components/Loader";
import NoDataView from "../../Components/ReuseComponents/NoDataView";

type notificationScreenProps = NativeStackScreenProps<
  any,
  "NotificationScreen"
>;
export default function NotificationScreen({
  navigation,
}: notificationScreenProps) {
  interface NotificationItem {
    title: string;
    body: string;
  }
  const [notificationData, setNotificationData] = useState<NotificationItem[]>(
    []
  );
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    NotificationApiCalling();
  }, []);

  const NotificationApiCalling = async () => {
    try {
      setLoading(true);

      const notificationData = await authenticatedGetRequest(getNotifications);

      if (!notificationData || notificationData.status !== "success") {
        throw new Error("Failed to fetch categories");
      }
      setNotificationData(notificationData.data.results);
      setLoading(false);
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

  const clearNotificationsApiCalling = async () => {
    try {
      setLoading(true);

      const notificationData = await authenticatedGetRequest(
        clearNotifications
      );

      if (!notificationData || notificationData.status !== "success") {
        throw new Error("Failed to fetch categories");
      }
      NotificationApiCalling();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  const deletePressed = () => {
    Alert.alert(
      "Alert!",
      "Are you sure you want to delete all notifications?",
      [
        {
          text: "Yes",
          onPress: () => clearNotificationsApiCalling(),
        },
        { text: "No", onPress: () => console.log("no") },
      ],
      { cancelable: false }
    );
  };
  return (
    <View style={styles.container}>
      <TopBar
        showBack={true}
        backButtonPress={() => navigation.pop()}
        showDelete={notificationData.length > 0 ? true : false}
        deletePress={() => deletePressed()}
        showTitle={true}
        title="Notifications"
      />
      <FlatList
        data={notificationData}
        ListEmptyComponent={() => <NoDataView />}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item, index }) => (
          <View
            style={[
              styles.notificationContainer,
              { marginTop: index == 0 ? 40 : 0 },
            ]}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.body}</Text>
          </View>
        )}
      />
      <Loader visible={isLoading} />
    </View>
  );
}
