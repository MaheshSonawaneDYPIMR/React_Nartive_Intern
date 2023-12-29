import React, { useRef, useState } from "react";
import { View, Animated, PanResponder, StyleSheet, Image } from "react-native";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

const Card = ({ color, onSwipe, index, stackPosition }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const [logo, setLogo] = useState(null);
  const [logoStyle, setLogoStyle] = useState(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      pan.setValue({ x: gesture.dx, y: gesture.dy });

      if (gesture.dx > 2) {
        setLogo(require("../asset/Right.png"));
        setLogoStyle(styles.rightLogo);
      } else if (gesture.dx < -2) {
        setLogo(require("../asset/Wrong.png"));
        setLogoStyle(styles.leftLogo);
      }

      const opacityValue = Math.min(Math.abs(gesture.dx / 200), 1);
      Animated.timing(logoOpacity, {
        toValue: opacityValue,
        duration: 0,
        useNativeDriver: false,
      }).start();
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
          bounciness: 8,
        }).start();
      }
      setLogo(null);
      Animated.timing(logoOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start();
    },
  });

  const width = moderateScale(325) - index * 10;
  const height = moderateScale(500);

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
    top: index < 3 ? index * 10 : undefined,
    height: index > 2 ? moderateScale(0) : moderateScale(500),
    width,
    alignSelf: "center",
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.card, animatedStyle, { backgroundColor: color }]}
    >
      {logo && (
        <Animated.Image
          source={logo}
          style={[styles.logo, logoStyle, { opacity: logoOpacity }]}
          resizeMode="contain"
        />
      )}
    </Animated.View>
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
  logo: {
    position: "absolute",
  },
  rightLogo: {
    top: 20,
    left: 20,
    width: moderateScale(100),
    height: moderateScale(100),
  },
  leftLogo: {
    top: 20,
    right: 20,
    width: moderateScale(100),
    height: moderateScale(100),
  },
});

export default Card;
