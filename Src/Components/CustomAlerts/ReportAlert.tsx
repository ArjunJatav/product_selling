import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { whiteButtonTextColor } from "../Colors";
import { postRequestWithToken } from "../CustomApi/PostApi";
import { reportApi } from "../../Constants/ApiUrls";
import { useDispatch } from "react-redux";
import { loginStrings } from "../../Screens/Login/strings";

export default function ReportAlert({ visible, close, reportedType,reportedId }: any) {
  const [reportReason, setReportReason] = useState("");
const dispatch = useDispatch();

  const handleReportSubmit = () => {
    if (reportReason.trim() === "") {
      Alert.alert("Please enter a reason.");
      return;
    }

    // Report logic here
    console.log("User reported for:", reportReason);
    reportApiCalling()
  };

  const handleCancel = () => {
    setReportReason("");
    close();
  };

  const reportApiCalling = async () => {
    const apiData = {
      reported_user_id: reportedId,
      report_type: reportedType,
      message_id: null,
      message_type: null,
      message: null,
      report_reason: reportReason,
    };
    try {
     const data = await postRequestWithToken(reportApi,apiData,dispatch);
     if (data.status === "success") {
        
        console.log("dat::",data)
        Alert.alert(
          "Success!",
          data.message,
          [
            {
              text: "Ok",
              onPress: () => {
                close();
                setReportReason("");
              },
            },
          ],
          { cancelable: false }
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
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseContainer}
            onPress={handleCancel}
          >
            <Text style={styles.modalClose}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.modalTitle}>{reportedType == "USER" ?  "Report User" : "Report Card"}</Text>

          <TextInput
            style={styles.textInput}
            placeholder="Enter reason for reporting"
            value={reportReason}
            placeholderTextColor={"#000"}
            onChangeText={setReportReason}
            multiline
          />

          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={handleCancel}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleReportSubmit}
              style={styles.submitButton}
            >
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalCloseContainer: {
    alignItems: "flex-end",
  },
  modalClose: {
    fontSize: 20,
    color: "#000",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  textInput: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 15,
    color:"#000"
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: "#555",
  },
  submitButton: {
    backgroundColor: whiteButtonTextColor,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
