import { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { colors, darkColors } from "./colors";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const systemTheme = useColorScheme();
  const [dark, setDark] = useState(systemTheme === "dark");

  const value = useMemo(
    () => ({
      dark,
      theme: dark ? darkColors : colors,
      toggleTheme: () => setDark((prev) => !prev),
    }),
    [dark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
