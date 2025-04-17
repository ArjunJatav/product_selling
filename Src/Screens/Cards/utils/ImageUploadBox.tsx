import React, { useState } from "react";
import {  Text, TouchableOpacity, Image } from "react-native";
import { Feather } from "../../../Components/ReactIcons";
import CameraGallery from "../../../Components/CustomAlerts/CameraGallery";
import requestMediaPermissions from "../../../Components/requestMediaPermissions";
import pickImage from "../../../Components/PickImage";

type ImageUploadBoxProps = {
  index: number;
  onImageSelect: (index: number, imagePath: string) => void;
  selectedImage: string | null;
};

const ImageUploadBox: React.FC<ImageUploadBoxProps> = ({
  index,
  onImageSelect,
  selectedImage,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleImagePicked = (image: any) => {

    console.log("image", image);
    
    onImageSelect(index, image.sourceURL ?? image.path);
  };


  // const userChoseForProfile = async (choose: string) => {
  //   setShowPopup(false);
  //   const hasPermission = await requestMediaPermissions();
  //   if (hasPermission) {
  //     pickImage(choose, false, handleImagePicked);
  //   }
  // };

  const userChoseForProfile = async (choose: string) => {
    setShowPopup(false);
    const hasPermission = await requestMediaPermissions();
    if (hasPermission) {

       pickImage(choose,true, handleImagePicked);
 
    }
  };
  console.log("selectedImage", selectedImage);

  return (
    <>
      <TouchableOpacity
        style={{
          flex: 1,
          margin: 10,
          backgroundColor: "white",
          borderRadius: 5,
          borderWidth: selectedImage ? 0 : 1,
          borderColor: "green",
          borderStyle: "dashed",
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={() => setShowPopup(true)}
      >
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage }}
            style={{ width: "100%", height: "100%", borderRadius: 5 }}
            resizeMode="cover"
          />
        ) : (
          <>
            {/* @ts-expect-error: FontAwesome type definition is missing */}
            <Feather name="camera" size={25} color={"green"} />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "400",
                marginTop: 5,
                color: "green",
              }}
            >
              Upload
            </Text>
          </>
        )}
      </TouchableOpacity>

      <CameraGallery
        visible={showPopup}
        close={() => setShowPopup(false)}
        userChosen={(choose: string) => userChoseForProfile(choose)}
        // userChosen={userChoseForProfile}
      />
    </>
  );
};

export default ImageUploadBox;
