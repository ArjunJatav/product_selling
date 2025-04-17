import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  PanResponder,
} from "react-native";

const windowWidth = Dimensions.get("window").width;

const SelectionBySlider = ({ title, onSelect, data, slectedValue }: any) => {
  const SLIDER_PADDING = 10;
  const SLIDER_WIDTH = windowWidth - 10 - SLIDER_PADDING * 4;
  const TOTAL_STEPS = data?.length ? data.length - 1 : 0;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const animatedValue = new Animated.Value(
    TOTAL_STEPS > 0 ? (SLIDER_WIDTH / TOTAL_STEPS) * selectedIndex : 0
  );
  const [penResponderStart, setPenResponderStart] = useState(0);

  // Dragging functionality
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      setPenResponderStart(penResponderStart + 1);
      let newPosition = gestureState.moveX - SLIDER_PADDING * 2;
      newPosition = Math.max(0, Math.min(SLIDER_WIDTH, newPosition));
      const newIndex = Math.round((newPosition / SLIDER_WIDTH) * TOTAL_STEPS);
      setSelectedIndex(newIndex);
      animatedValue.setValue(newPosition);
    },
    onPanResponderRelease: () => {
      Animated.timing(animatedValue, {
        toValue: (SLIDER_WIDTH / TOTAL_STEPS) * selectedIndex,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
  });

  useEffect(() => {
    onSelect(data[selectedIndex]);
    // fetchData(getState, data[selectedIndex]); // Fetching state names
  }, [selectedIndex]);

  useEffect(() => {
    if (slectedValue !== undefined) {
      const newIndex = data.findIndex(
        (item: any) => item.value === slectedValue
      );

      if (newIndex !== -1) {
        setSelectedIndex(newIndex);
        animatedValue.setValue((SLIDER_WIDTH / TOTAL_STEPS) * newIndex);
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
          color: "black",
          marginBottom: 10,
        }}
      >
        {title}
      </Text>

      {/* Image Icon */}
      <View
        style={{
          width: windowWidth,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <View
          style={{
            width: windowWidth / 3 - 50,
            height: windowWidth / 3 - 50,
            borderRadius: 10,
            borderWidth:
              penResponderStart != 0 || slectedValue !== undefined ? 3 : 2,
            borderColor:
              penResponderStart != 0 || slectedValue !== undefined
                ? "#00A751"
                : "#717171",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri:
                TOTAL_STEPS > 0
                  ? data[selectedIndex]?.image
                  : "https://weed.betademo.net/static/feelings/weather-sunny.png",
            }}
            style={{
              height: "40%",
              width: "40%",
              tintColor: penResponderStart != 0 ? "#00A751" : "#717171",
              // padding:15,
              // backgroundColor:"red",
            }}
            resizeMode="contain"
          />
        </View>
      </View>
      <Text
        style={{
          width: windowWidth,
          fontSize: 15,
          fontWeight: "500",
          textAlign: "center",
          color: "black",
          marginTop: 5,
        }}
      >
        {TOTAL_STEPS > 0 ? data[selectedIndex]?.name : " df"}
      </Text>
      {/* Slider Track */}
      <View
        style={{
          width: SLIDER_WIDTH,

          height: 4,
          backgroundColor: "#717171",
          borderRadius: 5,
          alignSelf: "center",
          marginTop: 30,
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
                TOTAL_STEPS > 0 ? (SLIDER_WIDTH / TOTAL_STEPS) * index - 2 : 0,
              top: 0,
              width: 4,
              height: 4,
              backgroundColor: "white",
              borderRadius: 5,
              opacity: 0.6,
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
          transform: [{ translateX: 0 }],
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
          width: SLIDER_WIDTH,
          alignSelf: "center",
          marginTop: 10,
        }}
      ></View>
    </View>
  );
};

export default SelectionBySlider;
