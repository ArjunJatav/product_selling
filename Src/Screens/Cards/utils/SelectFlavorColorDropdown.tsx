import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Feather } from "../../../Components/ReactIcons";
import { windowHeight, windowWidth } from "../../../Constants/ReuseVariables";
import { BottomTabImages } from "../../../Route/Images";
import CustomButton from "../../../Components/CustomButton/CustomButton";

interface DropdownSelectorProps {
  sName?: string;
  options?: { colorName: string }[];
  selectedValue?: string | null;
  selectFlavorListFromApi?: string | null;
  
  selectedFlavorList?: ([]: any) => void;
  onSelect: (value: string) => void;
}
type FlavorColor = {
  flavor: string;
  color: string;
  selectedFlavor: {
    cId: number;
    cName: string;
    cGroup: string;
  };
};

const SelectFlavorColorDropdown: React.FC<DropdownSelectorProps> = ({
  options,
  selectedValue,
  selectFlavorListFromApi,
  selectedFlavorList,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFlavor, setCurrentFlavor] = useState("Flavor 1");
  const [activeTab, setActiveTab] = useState("Flavor 1");
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([
    "Flavor 1",
  ]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedFlavorsWithColors, setSelectedFlavorsWithColors] = useState<
    FlavorColor[]
  >([]);


  useEffect(() => {
    if (selectFlavorListFromApi?.length) { // @ts-expect-error: third-party lib has no types
      const updatedList = selectFlavorListFromApi.map((item:any) => {
        const colorKey = item.color.split("/")[0]; // @ts-expect-error: third-party lib has no types
          const matchedOption = options.find((opt:any) => opt.color === colorKey);
        return {
          ...item,// @ts-expect-error: third-party lib has no types
          color: matchedOption?.color || item.color, 
        };
      });

     
  
      setSelectedFlavorsWithColors(updatedList);
    }
  }, [selectFlavorListFromApi, options]);

  const handleSelectFlavor = (flavor: string) => {
    setCurrentFlavor(flavor);
    setActiveTab(flavor);
    console.log("flavorflavorflavor",flavor);
    

    setSelectedFlavors((prev) =>
      prev.includes(flavor)
        ? prev.filter((item) => item !== flavor)
        : prev.length < 3
        ? [...prev, flavor] 
        : prev
    );
    setRefreshKey((prevKey) => prevKey + 1);
  };


  console.log("selectedFlavors",selectedFlavors);
  
  const updateFlavors = (
    flavor: string,
    color: string,
    selectedFlavor: { cId: number; cName: string; cGroup: string }
  ) => {
    setSelectedFlavorsWithColors((prevArray) => {
      const index = prevArray.findIndex((item) => item.flavor === flavor);

      if (index !== -1) {
        const updatedArray = [...prevArray];
        updatedArray[index] = { flavor, color, selectedFlavor };
        return updatedArray;
      } else {
        // Add new flavor entry
        return [...prevArray, { flavor, color, selectedFlavor }];
      }
    });
  };

  const handleImageSelect = (selectColorName: any, selectFalvor: any) => {
    onSelect(selectColorName ?? "defaultColor");
    updateFlavors(currentFlavor, selectColorName, selectFalvor);
  };

  const headerView = () => {
    return (
      <View
        style={{
          width: "100%",
          marginTop: 20,
          borderWidth: 1,
          borderColor: "#ccc",
          paddingHorizontal: 10,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 25, fontWeight: "600", color: "black" }}>
          {"Colors/Flavors"}
        </Text>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "400",
            marginTop: 5,
            color: "gray",
          }}
        >
          {"Select up to 3 colors to describe the flavor"}
        </Text>
      </View>
    );
  };

  const headerFalvorsView = () => {
    return (
      <View
        style={{
          height: 70,
          //   backgroundColor: "red",
          paddingHorizontal: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {["Flavor 1", "Flavor 2", "Flavor 3"].map((flavor, index) => {
           const isActive = activeTab === flavor;

          // const selectedFlavor = selectedFlavorsWithColors.find(
          //   (item) => item.flavor === flavor
          // );
          console.log("selectedFlavor",flavor,activeTab);
          
          return (
            <TouchableOpacity
              key={index}
              style={{ alignItems: "center" }}
              onPress={() => handleSelectFlavor(flavor)}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: isActive? "500" : "300",
                  color: isActive  ? "green" : "black",
                }}
              >
                {flavor}
              </Text>
              <View
                style={{
                  height: 1,
                  width: 80,
                  backgroundColor: isActive  ? "green" : "black",
                  marginTop: 5,
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const FlavorSelector = ({ item }: { item: any }) => {
    const [selectedIndex, setSelectedIndex] = useState(
      Math.floor(((item?.flavors?.length ?? 1) - 1) / 2)
    );
    const scrollRef = useRef<ScrollView>(null);
    const selectedFlavorItem = selectedFlavorsWithColors.find(
      (fl) => fl.color === item?.color
    );

    return (
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        snapToInterval={40}
        decelerationRate="fast"
        style={{ maxHeight: windowWidth / 4 }}
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      >
        {item?.flavors?.map((flavor: any, index: number) => {
          const isCenter = index === selectedIndex;
          const isSelected =
            (selectedFlavorItem?.selectedFlavor?.cId === flavor.cId);

          return (
            <TouchableOpacity
              key={flavor?.cId}
              onPress={() => {
                handleImageSelect(item?.color, flavor),
                  // onSelect(item?.color ?? "defaultColor"),
                  setSelectedIndex(index);
              }}
            >
              <Text
                key={flavor.cId}
                style={{
                  fontSize: isSelected && isCenter ? 24 : 20,
                  fontWeight: isSelected ? "bold" : "normal",
                  color: isSelected ? "white" : "lightgray",
                  marginVertical: 5,
                }}
              >
                {flavor.cName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  const headerFalvorsList = () => {
    return (
      <FlatList // @ts-expect-error: third-party lib has no types
        data={options.filter((item: any) => item.color !== "No Color")} // Filter items directly
        showsVerticalScrollIndicator={false}
        keyExtractor={(item: any) => item.color}
        nestedScrollEnabled={true}
        numColumns={2} // Display in 2 columns
        columnWrapperStyle={{ justifyContent: "space-between" }} // Add spacing between columns
        renderItem={({ item }: any) => {
          const isSelected = selectedFlavorsWithColors.some(
            (flavorItem) =>
              flavorItem.color === item.color &&
              flavorItem.flavor === currentFlavor
          );

          return (
            <View
              style={[
                styles.option,

                {
                  width: windowWidth / 2 - 35,
                  height: windowWidth / 2 - 35,
                  borderRadius: 10,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Image
                source={{ uri: item.flavor_image }}
                style={[
                  {
                    height: "100%",
                    width: "100%",
                    borderRadius: 10,
                    borderColor: selectedValue
                      ? "green"
                      : "white",
                  },
                  isSelected && styles.selectedOption,
                ]}
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",

                  paddingVertical: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FlavorSelector item={item} />
              </View>
            </View>
          );
        }}
      />
    );
  };

  return (
    <View style={{ paddingHorizontal: 10, height: 45, marginTop: 10 }}>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Image
            source={BottomTabImages.homePage}
            style={{
              height: 20,
              width: 20,
              tintColor: selectedValue
                ? selectedFlavorsWithColors?.length > 2
                  ? selectedValue.toLowerCase()
                  : "black"
                : "green",
              marginLeft: 10,
            }}
          />
          <Text
            style={{ color: selectedValue ? "#000" : "#888", marginLeft: 10 }}
            numberOfLines={1}
          >
            {selectedFlavorsWithColors?.length > 2
              ? selectedFlavorsWithColors
                  .map((item) => `${item.color}/${item.selectedFlavor.cName}`)
                  .join(", ")
              : "Color/Flavor"}
          </Text>
        </View>
        {/* @ts-expect-error: FontAwesome type definition is missing */}
        <Feather
          name="chevron-down"
          size={20}
          color="#000"
          style={{ height: 20, width: 20, marginRight: 10 }}
        />
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                // @ts-expect-error: third-party lib has no types
                setModalVisible(false), selectedFlavorList([]);
              }}
            >
              {/* @ts-expect-error: FontAwesome type definition is missing */}
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>

            {headerView()}
            {headerFalvorsView()}
            {headerFalvorsList()}
            {selectedFlavorsWithColors.length > 2 && (
              <CustomButton
                text={"Accept Colors/Flavors"}
                buttonPress={() => {
                  setModalVisible(false); // @ts-expect-error: third-party lib has no types
                  selectedFlavorList(selectedFlavorsWithColors ?? []);
                }}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "400",
    marginTop: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    height: 45,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#dfe4ed",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: windowWidth - 20,
    height: windowHeight - 70,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    bottom: 0,
  },
  option: {
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  selectedOption: {
    borderWidth: 5,
  },
  closeButton: {
    position: "absolute",
    backgroundColor: "#dfe4ed",
    borderRadius: 50,
    padding: 2,
    top: 5,
    right: 10,
    zIndex: 10,
  },
});

export default SelectFlavorColorDropdown;
