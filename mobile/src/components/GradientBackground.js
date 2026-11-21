import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

/**
 * Subtle themed background gradient matching the web admin/client portals.
 * Colors are derived from the active theme so contrast stays accessible:
 * - light mode: near-white cream → soft sage tint
 * - dark mode: deep navy → slightly lighter navy
 */
export default function GradientBackground({ children, dark, style }) {
  const colors = dark
    ? ["#0A1120", "#111B2E", "#0A1120"]
    : ["#FBFCFF", "#EFF4F6", "#FBFCFF"];

  return (
    <View style={[styles.root, style]}>
      <LinearGradient colors={colors} style={StyleSheet.absoluteFill} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1 },
});
