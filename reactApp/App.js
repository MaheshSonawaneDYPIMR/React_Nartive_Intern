import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import Card from "./src/components/Card";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

const colors = ["#8ecae6" , "#6fffe9" , "#e9c46a" , "#dda15e" , "#bc6c25"]; // Dummy color data

export default function App() {
  const [stack, setStack] = useState(
    colors.map((color, index) => ({
      color,
      index,
      stackPosition: colors.length,
    }))
  );

  const handleSwipe = (direction, index) => {
    setStack((prevStack) => {
      const updatedStack = prevStack.filter((_, i) => i !== index);
      return updatedStack.map((card, i) => ({
        ...card,
        stackPosition: updatedStack.length - i,
      }));
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        {stack.map((card, index) => (
          <Card
            key={card.color}
            color={card.color}
            index={index}
            onSwipe={handleSwipe}
            stackPosition={card.stackPosition}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  cardsContainer: {
    width: moderateScale(325),
    height: moderateVerticalScale(500),
  },
});
