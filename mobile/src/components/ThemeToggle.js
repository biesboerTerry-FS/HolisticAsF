import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function ThemeToggle() {
  const { dark, toggleTheme, theme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.button, { borderColor: theme.primaryForestGreen }]}
      accessibilityLabel={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Text style={[styles.text, { color: theme.primaryForestGreen }]}>
        {dark ? "☀" : "☾"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 15,
  },
});
