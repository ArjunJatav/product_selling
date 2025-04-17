import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { Feather } from "../../../Components/ReactIcons";
import { whiteButtonColor } from "../../../Components/Colors";
import { windowHeight, windowWidth } from "../../../Constants/ReuseVariables";

interface DropdownSelectorProps {
  sName: string;
  options: { sCode: string; sId: string; sName: string }[];
  selectedValue: string | null;
  onSelect: (selectedItem: { sCode: string; sId: string; sName: string }) => void; // Updated callback
}

const SelectStateDropdown: React.FC<DropdownSelectorProps> = ({
  sName,
  options,
  selectedValue,
  onSelect,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <Text style={styles.label}>{sName}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: selectedValue ? "#000" : "#888" }}>
          {selectedValue || "Select state"}
        </Text>
        {/* @ts-expect-error: FontAwesome type definition is missing */}
        <Feather name="chevron-down" size={20} color="#000" />
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
              keyExtractor={(item) => item.sId}
              renderItem={({ item }) => {
                const isSelected = item.sName === selectedValue; 
                return (
                  <TouchableOpacity
                    style={[styles.option, isSelected && styles.selectedOption]}
                    onPress={() => {
                      onSelect(item);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.optionText}>{item.sName}</Text>
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
    padding: 10,
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

export default SelectStateDropdown;
