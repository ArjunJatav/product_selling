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

const SelectFlavoraterSlider = ({ title, onSelect, slectedValue , }: any) => {
  const SLIDER_PADDING = 10;
  const SLIDER_WIDTH = windowWidth - SLIDER_PADDING * 4;
  const ADJUSTED_SLIDER_WIDTH = SLIDER_WIDTH - 0; // Reduce width by 100

  // Updated data array with image links
  const data = [
    { image: "https://weed.betademo.net/static/ratings/abysmal.png", name: "Abysmal", value: 0 },
    { image: "https://weed.betademo.net/static/ratings/awful.png", name: "Awful", value: 1 },
    { image: "https://weed.betademo.net/static/ratings/bad.png", name: "Bad", value: 2 },
    { image: "https://weed.betademo.net/static/ratings/poor.png", name: "Poor", value: 3 },
    { image: "https://weed.betademo.net/static/ratings/mediocre.png", name: "Mediocre", value: 4 },
    { image: "https://weed.betademo.net/static/ratings/fair.png", name: "Fair", value: 5 },
    { image: "https://weed.betademo.net/static/ratings/good.png", name: "Good", value: 6 },
    { image: "https://weed.betademo.net/static/ratings/great.png", name: "Great", value: 7 },
    { image: "https://weed.betademo.net/static/ratings/excellent.png", name: "Excellent", value: 8 },
    { image: "https://weed.betademo.net/static/ratings/amazing.png", name: "Amazing", value: 9 },
    { image: "https://weed.betademo.net/static/ratings/phenominal.png", name: "Phenominal", value: 10 }
  ];
  const TOTAL_STEPS = data.length - 1;

  const [selectedIndex, setSelectedIndex] = useState(
    slectedValue !== undefined ? data.findIndex(item => item.value === slectedValue) : 0
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
    if (slectedValue !== undefined) {
      const newIndex = data.findIndex(item => item.value === slectedValue);
      if (newIndex !== -1) {
        setSelectedIndex(newIndex);
        animatedValue.setValue(
          (ADJUSTED_SLIDER_WIDTH / TOTAL_STEPS) * newIndex
        );
      }
    }
  }, [slectedValue]);

  useEffect(() => {
    onSelect(data[selectedIndex]);
  }, [selectedIndex]);

  return (
    <>
    <View style={{ marginHorizontal: SLIDER_PADDING }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "500",
          marginTop: 10,
          color: "black",
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
          width: 38,
          left:
            TOTAL_STEPS > 0
              ? (ADJUSTED_SLIDER_WIDTH / TOTAL_STEPS) * selectedIndex +
                SLIDER_PADDING
              : 0,
          backgroundColor: "#717171",
          paddingVertical: 8,
          borderRadius: 1,
          marginLeft: selectedIndex == 0 ? 10 : 0,
          zIndex: 20,
          transform: [{ translateX: -20 }],
        }}
      >
        <Text
          style={{ color: "white", fontWeight: "bold", alignSelf: "center" }}
        >
          {title === "How much does it cost? (USD)"
            ? "$" + data[selectedIndex].value
            : data[selectedIndex].value}
        </Text>
      </View>

     

      {/* Slider Track */}
      <View
        style={{
          width: ADJUSTED_SLIDER_WIDTH,
          height: 5,
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
              width: 2,
              height: 2,
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
          transform: [{ translateX: -10 }],
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
      
      
    </View>
    <View
    style={{
    // position:"absolute",
      alignItems: "center",
      marginTop:20,
      zIndex: 15,
    }}
  >
    <Image
      source={{ uri: data[selectedIndex].image }}
      style={{ width: 30, height: 30, alignSelf: "center" }}
    />
       <Text
        style={{
          fontSize: 16,
          fontWeight: "500",
          marginTop: 10,
          color: "black",
          marginBottom: 15,
        }}
      >
        {data[selectedIndex].name}
      </Text>
      
  </View>
  </>
  );
};

export default SelectFlavoraterSlider;
