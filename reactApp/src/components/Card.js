import React, { useRef } from "react";
import { View, Animated, PanResponder, StyleSheet } from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";



const Card = ({ color, onSwipe, index, stackPosition }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      pan.setValue({ x: gesture.dx, y: gesture.dy });
    },

    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 120) {
        onSwipe("right", index);
      } else if (gesture.dx < -120) {
        onSwipe("left", index);
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          speed: 10,
          bounciness,
        }).start();
      }
    },
  });

  const width = moderateScale(325) - index * 10;
  const height = moderateScale(500); // Adjust width based on index

  const animatedStyle = {
    transform: [
      { translateX: pan.x },
      { translateY: pan.y },
      {
        rotate: pan.x.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: ["-10deg", "0deg", "10deg"],
        }),
      },
    ],

    zIndex: stackPosition - index,
    top: index < 3 ? index * 10 : undefined, // Conditionally set top based on index
    height: index > 2 ? moderateScale(0) : moderateScale(500),
    width,
    alignSelf: "center",
    // Update the zIndex to reposition cards in the stack
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.card, animatedStyle, { backgroundColor: color }]}
    ></Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: moderateScale(325),
    height: moderateVerticalScale(500),
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});

export default Card;
