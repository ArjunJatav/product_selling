import React from "react";
import { Modal, View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign } from "./ReactIcons";
import { whiteButtonTextColor } from "./Colors";


interface ImagePreviewModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onSend: () => void;
  showSendButton: boolean
}

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({
  visible,
  imageUri,
  onClose,
  onSend,
  showSendButton
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
      <TouchableOpacity onPress={onClose} style={styles.backButton}>
            {/* @ts-expect-error: Feather type definition is missing */}
           <AntDesign name="arrowleft" size={25} color={"#fff"}/>
          </TouchableOpacity>
        {/* Image Preview */}
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />

        {/* Buttons */}
        <View style={styles.buttonContainer}>
     
{showSendButton && (
   <TouchableOpacity onPress={onSend} style={styles.sendButton}>
   <Text style={styles.buttonText}>Send</Text>
 </TouchableOpacity>

)}
         
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    paddingTop:50,
  //  justifyContent: "center",
  //  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.7)",
  },
  imagePreview: {
    width: "90%",
    height: 400,
    borderRadius: 10,
    alignSelf:"center",marginTop:100
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    marginTop: 40,
   alignSelf:"center"
  },
  backButton: {
    padding: 10,
    // backgroundColor: "red",
    borderRadius: 5,
  },
  sendButton: {
    padding: 10,
    backgroundColor: whiteButtonTextColor,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
})


export default ImagePreviewModal;
