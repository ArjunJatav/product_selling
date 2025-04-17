import {
  Alert,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import TopBar from "../../../Components/Topbar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { windowWidth } from "../../../Constants/ReuseVariables";
import ImageUploadBox from "../utils/ImageUploadBox";
import SelectStateDropdown from "../utils/SelectStateDropdown";
import {
  baseUrlV1,
  createCardApi,
  getCategories,
  getEditCardData,
  getFlavors,
  getMainColors,
  getPhysicalMentalFeeling,
  getState,
  updateCardApi,
} from "../../../Constants/ApiUrls";
import SelectFlavorColorDropdown from "../utils/SelectFlavorColorDropdown";
import SelectTodaySession from "../utils/SelectTodaySession";
import SelectionBySlider from "../utils/SelectBySlider";
import SelectWeightBySlider from "../utils/SelectWeightBySlider";
import SelectFlavoraterSlider from "../utils/SelectFlavorater";
import CustomButton from "../../../Components/CustomButton/CustomButton";
import {
  createCardApiCalling,
  getCardData,
  getStateNames,
} from "../services/ApiProvider";
import SelectColorDropdown from "../utils/SelectColorDropdown";
import Loader from "../../../Components/Loader";
import { signUpImages } from "../../SignUp/Images";
import LoginFirstScreen from "../../../Components/ReuseComponents/LoginFirstScreen";

type updateAddNewCardScreenProps = NativeStackScreenProps<
  any,
  "AddNewCardScreen"
>;

export default function AddNewCardScreen({
  navigation,
  route,
}: updateAddNewCardScreenProps) {
  const fromScreen = route?.params?.fromScreen ?? "";
  const idForEditCard = route?.params?.clickItemData?.id ?? "";

  const [selectedImages, setSelectedImages] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [flavorColor, setFlavorColor] = useState<string | null>(null);
  const [statesList, setStatesList] = useState<
    { sCode: string; sId: string; sName: string }[]
  >([]);
  const [colorsList, setColorsList] = useState<{ colorName: string }[]>([]);
  const [flavorListData, setFlavorListData] = useState<{ colorName: string }[]>(
    []
  );
  const [categoriesData, setCategoriesData] = useState<[]>([]);
  const [physicalMentalData, setPhysicalMentalData] = useState<[]>([]);
  const [description, setDescription] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [strainName, setstrainName] = useState("");
  const [selectedSession, setSelectedSession] = useState(null);
  const [physicalFeelingData, setPhysicalFeelingData] = useState(null);
  const [mentalFeelingData, setMentalFeelingData] = useState(null);
  const [selectWeightData, setSelectWeightData] = useState(null);
  const [selectCostData, setSelectCostData] = useState(null);
  const [flavorater, setFlavorater] = useState(null);
  const [selectFlavorList, setSelectFlavorList] = useState(null);
  const [editApiData, setEditApiData] = useState(null);

  const [selectFlavorListFromApi, setSelectFlavorListFromApi] = useState(null);
  const [showLoader, setShowLoader] = useState(false);
  ///  ****** Funcation to handle image select ******  ///
  const handleImageSelect = (index: number, imagePath: string) => {
    const updatedImages = [...selectedImages];
    updatedImages[index] = imagePath;
    setSelectedImages(updatedImages);
  };

  ///  ****** Funcation to handle StateData select ******  ///
  const handleStateSelection = (selectedItem: any) => {
    setSelectedState(selectedItem);
  };

  ///  ****** Funcation to render view for slect image ********  ///
  const renderViewForSelectImage = () => {
    return (
      <View style={{ height: 190, width: windowWidth }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "400",
            marginTop: 20,
            paddingHorizontal: 10,
          }}
        >
          {"Images"}
        </Text>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "400",
            marginTop: 5,
            paddingHorizontal: 10,
          }}
        >
          {"Select up to 3 images"}
        </Text>
        <View style={{ flex: 1, flexDirection: "row", marginTop: 10 }}>
          {selectedImages.map((image, index) => (
            <ImageUploadBox
              key={index}
              index={index}
              onImageSelect={handleImageSelect}
              selectedImage={image}
            />
          ))}
        </View>
      </View>
    );
  };

  // ****** Fetch state useEffect ****** //
  useEffect(() => {
    fetchData(getState, setStatesList);
  }, []);

  useEffect(() => {
    fetchData(getMainColors, setColorsList);
  }, []);

  useEffect(() => {
    fetchData(getFlavors, setFlavorListData);
  }, []);

  useEffect(() => {
    fetchData(getCategories, setCategoriesData);
  }, []);
  useEffect(() => {
    fetchData(getPhysicalMentalFeeling, setPhysicalMentalData);
  }, []);

  ///  ****** Funcation to fetch satate names data ****** ///
  const fetchData = async (endpoint: string, setData: (data: any) => void) => {
    try {
      const result = await getStateNames(baseUrlV1 + endpoint);
      if (result.success) {
        setData(result.data);
      } else {
        console.log(`Error fetching data from ${endpoint}:`, result.error);
      }
    } catch (error) {
      console.log(`Unexpected error fetching data from ${endpoint}:`, error);
    }
  };

  // @ts-expect-error: third-party lib has no types
  const formattedColors = colorsList.map((color: string) => ({
    colorName: color,
  }));

  const handleSubmit = (isPublish: any, fromScreen: any) => {
    setShowLoader(true);
    if (selectedImages.filter((image) => image !== null).length < 3) {
      Alert.alert("Validation Error!", "Please select at least three images.");
      setShowLoader(false); // Reset loader
      return;
    }
    if (!selectedState) {
      Alert.alert("Validation Error!", "Please select a state name.");
      setShowLoader(false);
      return;
    }
    if (!strainName.trim()) {
      Alert.alert("Validation Error!", "Please enter a strain name.");
      setShowLoader(false);
      return;
    }
    if (!selectedColor) {
      Alert.alert("Validation Error!", "Please select a color.");
      setShowLoader(false);
      return;
    }
    // @ts-expect-error: third-party lib has no types
    if (!flavorColor && flavorColor.length < 3) {
      Alert.alert(
        "Validation Error!",
        "Please select at least three flavor colors."
      );
      setShowLoader(false);
      return;
    }
    if (!selectedSession) {
      Alert.alert("Validation Error!", "Please select a session.");
      setShowLoader(false);
      return;
    }
    if (!physicalFeelingData) {
      Alert.alert("Validation Error!", "Please select physical feeling data.");
      setShowLoader(false);
      return;
    }
    if (!mentalFeelingData) {
      Alert.alert("Validation Error!", "Please select mental feeling data.");
      setShowLoader(false);
      return;
    }
    if (!selectWeightData) {
      Alert.alert("Validation Error!", "Please select weight data.");
      setShowLoader(false);
      return;
    }
    if (!selectCostData) {
      Alert.alert("Validation Error!", "Please select cost data.");
      setShowLoader(false);
      return;
    }
    if (!flavorater) {
      Alert.alert("Validation Error!", "Please select a flavor rating.");
      setShowLoader(false);
      return;
    }

    const uploadData = new FormData();
    if (fromScreen === "EditCard") uploadData.append("id", idForEditCard);
    uploadData.append("strain_name", strainName);
    uploadData.append("source", sourceName ? sourceName : "app");
    uploadData.append("card_visibality", "1");
    if (fromScreen === "EditCard") {
      // @ts-expect-error: third-party lib has no types
      selectFlavorListFromApi?.forEach((item: any, index: any) => {
        const flavorKey = `flavor${index + 1}`;
        uploadData.append(flavorKey, item?.selectedFlavor?.cId);
      });
    } else {
      // @ts-expect-error: third-party lib has no types
      selectFlavorList.forEach((item: any, index: any) => {
        const flavorKey = `flavor${index + 1}`;
        uploadData.append(flavorKey, item?.selectedFlavor?.cId);
      });
    }


    uploadData.append(
      "weed_type", // @ts-expect-error: third-party lib has no types
      fromScreen === "EditCard" ? editApiData?.weedType : selectedSession?.name
    );
    uploadData.append(
      "energy",
      fromScreen === "EditCard" // @ts-expect-error: third-party lib has no types
        ? editApiData?.energy // @ts-expect-error: third-party lib has no types
        : physicalFeelingData.value
    );
    uploadData.append("weight", selectWeightData);
    uploadData.append("main_color", selectedColor);
    uploadData.append("weight_unit", "gm");
    uploadData.append("cost", selectCostData);
    uploadData.append("cost_unit", "$"); // @ts-expect-error: third-party lib has no types
    uploadData.append("rating", flavorater.value ?? flavorater);
    uploadData.append("comment", description); // @ts-expect-error: third-party lib has no types
    uploadData.append("state_id", selectedState.sId ?? editApiData?.stateId);
    uploadData.append("publish", isPublish);
    uploadData.append(
      "mental_feeling",
      fromScreen === "EditCard" // @ts-expect-error: third-party lib has no types
        ? editApiData?.mental_feeling // @ts-expect-error: third-party lib has no types
        : mentalFeelingData.value
    );
    selectedImages.slice(0, 3).forEach((image, index) => {
      uploadData.append(`image_${index + 1}`, {
        uri: image, // Use image.path directly
        type: "image/jpeg",
        name: `image_${index + 1}.jpg`,
      });
    });

    console.log("uploadDatauploadData", uploadData);

    createCardApiCalling(
      `${baseUrlV1}${
        fromScreen === "EditCard" ? updateCardApi : createCardApi
      }`,
      uploadData
    )
      .then((result) => {
        setShowLoader(false);

        if (result.success) {
          Alert.alert(
            "Success",
            fromScreen === "EditCard"
              ? "Card Updated successfully."
              : "Card created successfully.",
            [{ text: "OK", onPress: () => navigation.goBack() }]
          );
        } else {
          console.error("Error creating card:", result.error);
        }
      })
      .catch((error) => {
        setShowLoader(false);
        console.error("Unexpected error:", error);
      });
  };

  useEffect(() => {
    if (fromScreen === "EditCard") {
      getCardDataMethod();
      setShowLoader(true);
    }
  }, [idForEditCard]);

  const getCardDataMethod = async () => {
    const id = idForEditCard; // Example ID
    const url = `${baseUrlV1}${getEditCardData}`; // Replace with your API URL

    const response = await getCardData(url, id);

    if (response.success) {
      setEditApiData(response.data.data);
      setFlavorater(response?.data?.data?.rating);
      setSelectCostData(response?.data?.data?.cost);
      setSelectWeightData(response?.data?.data?.weight);
      setMentalFeelingData(response?.data?.data?.mental_feeling ?? "");
      setPhysicalFeelingData(response?.data?.data?.energy ?? "");
      setSelectedSession(response?.data?.data?.weedType ?? "");
      setSourceName(response?.data?.data?.source ?? "");
      setstrainName(response?.data?.data?.strainName ?? "");
      setDescription(response?.data?.data?.comment ?? "");
      setSelectedState(response?.data?.data?.state_name ?? "");
      const imageLinks = response?.data?.data?.imagelinks ?? [];

      const filledImages = [...imageLinks];
      while (filledImages.length < 3) {
        filledImages.push(null);
      }
      setSelectedImages(filledImages.slice(0, 3)); // Ensure exactly 3 slots

      setFlavorColor(response?.data?.data?.flavor_colour_1 ?? "");
      setSelectedColor(response?.data?.data?.main_color ?? "");

      const flavorMapping = [
        {
          key: "flavor_colour_1",
          flavorKey: "flavor1",
          flavorLabel: "Flavor 1",
        },
        {
          key: "flavor_colour_2",
          flavorKey: "flavor2",
          flavorLabel: "Flavor 2",
        },
        {
          key: "flavor_colour_3",
          flavorKey: "flavor3",
          flavorLabel: "Flavor 3",
        },
      ];

      const cGroupMapping = {
        "Orange/Hay": {
          cGroup: "Brown",
          cId: 26,
          cName: "Musky",
          display_order: 9,
        },
        "Yellow/Lemon": {
          cGroup: "Red",
          cId: 10,
          cName: "Fruity",
          display_order: 3,
        },
        "Blue/Berries": {
          cGroup: "Yellow",
          cId: 14,
          cName: "Lemon",
          display_order: 5,
        },
      };

      const selectFlavorList = flavorMapping.map(
        ({ key, flavorKey, flavorLabel }) => {
          const color = response?.data?.data?.[key] || "";

          // @ts-expect-error: third-party lib has no types
          const selectedFlavor = cGroupMapping[color] || {
            cGroup: color || "Unknown",
            cId: response?.data?.data?.[flavorKey] || null,
            cName: "",
            display_order: 0,
          };

          return {
            color,
            flavor: flavorLabel,
            selectedFlavor,
          };
        }
      );

      // @ts-expect-error: third-party lib has no types
      setSelectFlavorListFromApi(selectFlavorList);
      setShowLoader(false);
    } else {
      console.log("API Error:", response.error);
      setShowLoader(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <TopBar
        showBack={true}
        showTitle={true}
        title={
          route?.params?.fromScreen == "EditCard" ? "Edit Card" : "Add new card"
        }
        backButtonPress={() => navigation.pop()}
      />
      <Loader visible={showLoader} />
      {globalThis.token ? (
        <ImageBackground
          source={signUpImages.signUpBackground}
          style={{ height: "100%", width: "100%" }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 200 }}
            showsVerticalScrollIndicator={false}
          >
            {renderViewForSelectImage()}
            <SelectStateDropdown
              sName="Select State"
              options={statesList} // @ts-expect-error: third-party lib has no types
              selectedValue={selectedState?.sName || selectedState}
              onSelect={handleStateSelection}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "400",
                marginTop: 10,
                marginHorizontal: 10,
                marginBottom: 10,
              }}
            >
              Description
            </Text>
            <View
              style={{
                paddingHorizontal: 10,
                marginHorizontal: 10,
                paddingVertical: 8,
                backgroundColor: "#dfe4ed",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <TextInput
                style={{
                  fontSize: 14,
                  color: "#000",
                  minHeight: 100,
                  maxHeight: 100, // Adjusts based on content
                  textAlignVertical: "top",
                }}
                placeholder="What do you think? Share key details here (required)"
                placeholderTextColor="#888"
                value={description}
                // maxLength={500}
                onChangeText={setDescription}
                multiline
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "400",
                marginTop: 10,
                marginHorizontal: 10,
                marginBottom: 10,
              }}
            >
              Add new weed card
            </Text>
            <View
              style={{
                paddingHorizontal: 10,
                marginHorizontal: 10,
                backgroundColor: "#dfe4ed",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <TextInput
                style={{
                  fontSize: 14,
                  color: "#000",
                  minHeight: 45,
                  maxHeight: 45, // Adjusts based on content
                  textAlignVertical: "center",
                }}
                placeholder="Enter Strain Name*"
                placeholderTextColor="#888"
                value={strainName}
                onChangeText={setstrainName}
                numberOfLines={1}
              />
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                marginTop: 10,
                marginHorizontal: 10,
                backgroundColor: "#dfe4ed",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#ccc",
              }}
            >
              <TextInput
                style={{
                  fontSize: 14,
                  color: "#000",
                  minHeight: 45,
                  maxHeight: 45, // Adjusts based on content
                  textAlignVertical: "center",
                }}
                placeholder="Enter Source"
                placeholderTextColor="#888"
                value={sourceName}
                onChangeText={setSourceName}
                numberOfLines={1}
              />
            </View>
            <SelectColorDropdown
              sName="Main Color"
              options={formattedColors ?? []}
              selectedValue={selectedColor}
              onSelect={setSelectedColor}
            />
            <SelectFlavorColorDropdown
              sName="Color/Flavor"
              options={flavorListData ?? []}
              selectedValue={flavorColor}
              onSelect={setFlavorColor}
              selectFlavorListFromApi={selectFlavorListFromApi}
              selectedFlavorList={(selectedFlavorData: any[]) => {
                // @ts-expect-error: third-party lib has no types
                setSelectFlavorList(selectedFlavorData);
              }}
            />
            <SelectTodaySession
              title="What's your choice for today's session?"
              data={categoriesData}
              slectedValue={selectedSession ?? ""}
              onSelect={(selectedItem: any) => setSelectedSession(selectedItem)}
            />
            <SelectionBySlider
              title="Physical Feeling?" // @ts-expect-error: third-party lib has no types
              data={physicalMentalData?.physical_feelings ?? []}
              slectedValue={physicalFeelingData ?? ""}
              onSelect={(selected: any) => setPhysicalFeelingData(selected)}
            />
            <SelectionBySlider
              title="Mental Feeling?" // @ts-expect-error: third-party lib has no types
              data={physicalMentalData?.mental_feelings ?? []}
              slectedValue={mentalFeelingData ?? ""}
              onSelect={(seleItem: any) => setMentalFeelingData(seleItem)}
            />
            <SelectWeightBySlider
              title="How much does it weight? (Grams)"
              slectedValue={selectWeightData ?? 0}
              onSelect={(weightItem: any) => setSelectWeightData(weightItem)}
            />
            <SelectWeightBySlider
              title="How much does it cost? (USD)"
              slectedValue={selectCostData ?? 0}
              onSelect={(costItem: any) => setSelectCostData(costItem)}
            />
            <SelectFlavoraterSlider
              title="Flavorater"
              // data={physicalMentalData.rating}
              slectedValue={flavorater ?? 0}
              onSelect={(flavoraterItem: any) => {
                setFlavorater(flavoraterItem);
              }}
            />
            <View
              style={{
                marginTop: 20,
                width: windowWidth - 20,
                justifyContent: "center",
                alignSelf: "center",
              }}
            >
              <CustomButton
                text={"Submit"}
                buttonPress={() => {
                  handleSubmit("1", fromScreen);
                }}
              />

              <TouchableOpacity
                style={{
                  width: windowWidth - 30,
                  marginHorizontal: 5,
                  borderRadius: 10,
                  borderWidth: 1,
                  height: 45,
                  borderColor: "#717171",
                  alignItems: "center",
                  marginTop: 10,
                  justifyContent: "center",
                }}
                onPress={() => {
                  handleSubmit("0", fromScreen);
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "500",
                    color: "#00A751",
                  }}
                >
                  Submit only to profile page
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ImageBackground>
      ) : (
        <LoginFirstScreen
          buttonClick={() => navigation.navigate("LoginStack")}
        />
      )}
    </View>
  );
}
