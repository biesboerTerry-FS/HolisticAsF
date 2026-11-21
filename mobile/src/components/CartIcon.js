import React from "react";
import { View, StyleSheet } from "react-native";

// Simple vector shopping-cart icon drawn with Views so it works on web and
// native without an icon-font dependency. `color` comes from the theme.
export default function CartIcon({ color = "#172033", size = 22 }) {
  const line = Math.max(2, Math.round(size * 0.1));
  return (
    <View style={[styles.root, { width: size, height: size }]}>
      {/* handle */}
      <View
        style={[
          styles.handle,
          {
            width: line,
            height: size * 0.32,
            backgroundColor: color,
            left: size * 0.04,
            top: size * 0.06,
          },
        ]}
      />
      {/* top bar */}
      <View
        style={[
          styles.bar,
          {
            height: line,
            backgroundColor: color,
            top: size * 0.1,
            left: size * 0.06,
            width: size * 0.88,
          },
        ]}
      />
      {/* basket */}
      <View
        style={[
          styles.basket,
          {
            borderColor: color,
            borderWidth: line,
            top: size * 0.3,
            left: size * 0.12,
            width: size * 0.76,
            height: size * 0.42,
          },
        ]}
      />
      {/* wheels */}
      <View
        style={[
          styles.wheel,
          {
            width: size * 0.14,
            height: size * 0.14,
            borderRadius: size * 0.07,
            backgroundColor: color,
            left: size * 0.22,
            bottom: size * 0.04,
          },
        ]}
      />
      <View
        style={[
          styles.wheel,
          {
            width: size * 0.14,
            height: size * 0.14,
            borderRadius: size * 0.07,
            backgroundColor: color,
            right: size * 0.22,
            bottom: size * 0.04,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: "relative" },
  handle: { position: "absolute", transform: [{ rotate: "-38deg" }], borderRadius: 2 },
  bar: { position: "absolute", borderRadius: 2 },
  basket: { position: "absolute", borderRadius: 3 },
  wheel: { position: "absolute" },
});
