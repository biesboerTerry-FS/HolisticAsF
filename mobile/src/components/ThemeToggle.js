import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel={dark ? "Switch to light mode" : "Switch to dark mode"}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={styles.text}>{dark ? "☀" : "☾"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0A7C6D",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },
});
