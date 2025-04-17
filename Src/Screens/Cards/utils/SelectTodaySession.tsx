import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

const SelectTodaySession = ({ title, data, onSelect, slectedValue }: any) => {
  
  const [selectedValue, setSelectedValue] = useState(() =>
    data.find((item:any) => item?.name?.toLowerCase() === slectedValue.toLowerCase()) || null
  );
  const handleSelect = (item: any) => {
    setSelectedValue(item);
    if (onSelect) {
      onSelect(item); // Pass selected value to parent
    }
  };

  useEffect(() => {
    if (slectedValue && typeof slectedValue === "string") {
      const newSelected = data.find(
        (item:any) => item?.name?.toLowerCase() === slectedValue.toLowerCase()
      );
      if (newSelected) {
        setSelectedValue(newSelected);
      }
    }
  }, [slectedValue, data]);

  return (
    <View style={{ marginHorizontal: 10 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "500",
          marginTop: 15,
          color:"black",
          marginBottom: 10,
        }}
      >
        {title ?? "What's your choice for today's session?"}
      </Text>
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent:"space-around",
          // gap:10,
          // justifyContent:"center",
          paddingVertical: 8,
        }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "column", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => handleSelect(item)}
              style={{
                width: windowWidth / 3 - 50,
                height: windowWidth / 3 - 50,
                // backgroundColor:"red",
                borderRadius: 10,
                borderWidth: selectedValue === item ? 3 : 2,
                borderColor: selectedValue === item ? "#00A751" : "#717171",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: item.icon }}
                style={{
                  height: "50%",
                  width: "50%",
                  tintColor: selectedValue === item ? "#00A751" : "#717171",
                  // borderRadius: 10,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "400",
                marginTop: 5,
              }}
            >
              {item.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default SelectTodaySession;
