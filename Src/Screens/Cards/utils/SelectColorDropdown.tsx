import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { Feather } from "../../../Components/ReactIcons";
import { BottomTabImages } from "../../../Route/Images";
import { windowHeight, windowWidth } from "../../../Constants/ReuseVariables";
import { whiteButtonColor } from "../../../Components/Colors";

interface DropdownSelectorProps {
  sName?: string;
  options?: { colorName: string }[];
  selectedValue?: string | null;
  onSelect: (value: string) => void;
}

const SelectColorDropdown: React.FC<DropdownSelectorProps> = ({
  sName,
  options,
  selectedValue,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={{ paddingHorizontal: 10, height: 45 }}>
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
              tintColor: selectedValue ? selectedValue.toLowerCase() : "green",
              marginLeft: 10,
            }}
          />
          <Text
            style={{ color: selectedValue ? "#000" : "#888", marginLeft: 10 }}
          >
            {selectedValue || "Main Color"}
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
              onPress={() => setModalVisible(false)}
            >
              {/* @ts-expect-error: FontAwesome type definition is missing */}
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>

            <FlatList
              data={options}
              keyExtractor={(item) => item.colorName}
              renderItem={({ item }) => {
                const isSelected = item.colorName === selectedValue;

                return (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={[styles.option, isSelected && styles.selectedOption]}
                    onPress={() => {
                      onSelect(
                        item.colorName === "No Color" ? "" : item.colorName
                      );
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.optionText}>
                      {item.colorName === "No Color" ? "" : item.colorName}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
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
    // padding: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#dfe4ed",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: windowWidth,
    height: windowHeight - 200,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    bottom: 0,
  },
  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#fff",
  },
  optionText: {
    fontSize: 16,
    textAlign: "center",
  },
  selectedOption: {
    backgroundColor: whiteButtonColor,
  },
  closeButton: {
    position: "absolute",
    backgroundColor: "#dfe4ed",
    borderRadius: 50,
    padding: 2,
    top: 10,
    right: 15,
    zIndex: 10,
  },
});

export default SelectColorDropdown;
