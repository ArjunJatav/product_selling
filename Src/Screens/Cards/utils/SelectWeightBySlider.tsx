import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

const SelectWeightBySlider = ({ title, onSelect,slectedValue }: any) => {
  const SLIDER_PADDING = 10;
  const SLIDER_WIDTH = windowWidth - SLIDER_PADDING * 4;
  const ADJUSTED_SLIDER_WIDTH = SLIDER_WIDTH - 80; // Reduce width by 100

  const data = Array.from({ length: 1001 }, (_, index) => index);
  const TOTAL_STEPS = data.length - 1;

 const [selectedIndex, setSelectedIndex] = useState(
    slectedValue !== undefined ? data.indexOf(slectedValue) : 0
  );
  const animatedValue = new Animated.Value(
    TOTAL_STEPS > 0 ? (ADJUSTED_SLIDER_WIDTH / TOTAL_STEPS) * selectedIndex : 0
  );

  // Dragging functionality
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      let newPosition = gestureState.moveX - SLIDER_PADDING * 2;
      newPosition = Math.max(0, Math.min(ADJUSTED_SLIDER_WIDTH, newPosition));
      const newIndex = Math.round(
        (newPosition / ADJUSTED_SLIDER_WIDTH) * TOTAL_STEPS
      );
      setSelectedIndex(newIndex);
      animatedValue.setValue(newPosition);
    },
    onPanResponderRelease: () => {
      Animated.timing(animatedValue, {
        toValue: (ADJUSTED_SLIDER_WIDTH / TOTAL_STEPS) * selectedIndex,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
  });

  useEffect(() => {
    onSelect(data[selectedIndex]);
  }, [selectedIndex]);

   useEffect(() => {
      if (slectedValue !== undefined) {
        const newIndex = data.indexOf(slectedValue);
        if (newIndex !== -1) {
          setSelectedIndex(newIndex);
          animatedValue.setValue(
            (ADJUSTED_SLIDER_WIDTH / TOTAL_STEPS) * newIndex
          );
        }
      }
    }, [slectedValue]);

  return (
    <View style={{ marginHorizontal: SLIDER_PADDING }}>
      <Text
        style={{
            fontSize: 18,
            fontWeight: "500",
            marginTop: 10,
            color:"black",
          marginBottom: 15,
        }}
      >
        {title}
      </Text>

      {/* Value Box Above Slider */}
      <View
        style={{
          position: "absolute",
          bottom: 38,
          minWidth:40,
          left:
            TOTAL_STEPS > 0
              ? (ADJUSTED_SLIDER_WIDTH / TOTAL_STEPS) * selectedIndex +
                SLIDER_PADDING
              : 0,

          backgroundColor: "#717171",
          paddingVertical: 8,
          paddingHorizontal: 8,
          borderRadius: 1,
          marginLeft:selectedIndex ==0 ? 10 : 0,
          zIndex: 20,
          transform: [{ translateX: -20 }],
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold", alignSelf:"center" }}>
          {title == "How much does it cost? (USD)" ?"$"+ data[selectedIndex]  : data[selectedIndex]}
        </Text>
      </View>
        <View
              style={{
                position: "absolute",
                bottom: 35,
                left:
                  TOTAL_STEPS > 0
                    ? (ADJUSTED_SLIDER_WIDTH / TOTAL_STEPS) * selectedIndex +
                      SLIDER_PADDING
                    : 0,
      
                backgroundColor: "#717171",
                paddingVertical: 10,
                paddingHorizontal: 10,
                borderRadius: 0,
                zIndex: 10,
                transform: [{ translateX:selectedIndex ==0 ? 0 : -5 }, { rotate: "45deg" }],
              }}
            ></View>

      {/* Slider Track */}
      <View
        style={{
          width: ADJUSTED_SLIDER_WIDTH,

          height: 4,
          left: 10,
          backgroundColor: "#717171",
          borderRadius: 5,
          alignSelf: "flex-start",
          marginTop: 50,
          position: "relative",
        }}
      >
        {/* Step Dots on Track */}
        {Array.from({ length: TOTAL_STEPS + 1 }).map((_, index) => (
          <View
            key={index}
            style={{
              position: "absolute",
              zIndex: 10,
              left:
                TOTAL_STEPS > 0
                  ? (ADJUSTED_SLIDER_WIDTH / TOTAL_STEPS) * index - 2
                  : 0,
                  top: 1,
                  // width: 2,
                  // height: 2,
                  // backgroundColor: "white",
                  borderRadius: 5,
                  opacity:0.6
            }}
          />
        ))}

        {/* Filled Slider */}
        <Animated.View
          style={{
            width: animatedValue,
            height: 5,
            backgroundColor: "#00A751",
            borderRadius: 5,
            position: "absolute",
            left: 0,
          }}
        />
      </View>

      {/* Draggable Circle */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          position: "absolute",
          bottom: -5,
          left: animatedValue,
          backgroundColor: "#A8E2C3",
          opacity: 0.9,
          padding: 10,
          borderRadius: 50,
          transform: [{ translateX: -0 }],
        }}
      >
        <View
          style={{
            width: 15,
            height: 15,
            backgroundColor: "#00A751",
            borderRadius: 10,
          }}
        />
      </Animated.View>

      {/* Selection Dots */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: ADJUSTED_SLIDER_WIDTH,
          alignSelf: "center",
          marginTop: 10,
        }}
      ></View>
      <View
        style={{
          position: "absolute",
          right: 10,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          padding: 3,
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "#00A751",
        }}
      >
        <Text style={{ fontSize: 15, color: "#00A751" }}>
          {title == "How much does it cost? (USD)" ?"$"+ data[selectedIndex]  : data[selectedIndex]}
        </Text>
      </View>
    </View>
  );
};

export default SelectWeightBySlider;
