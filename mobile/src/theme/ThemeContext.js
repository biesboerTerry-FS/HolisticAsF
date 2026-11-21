import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { colors, darkColors } from "./colors";

const ThemeContext = createContext(null);
const THEME_KEY = "holisticaf.mobile.theme";

// The mobile app ships to web, so localStorage is the persisted store there.
// Native keeps the in-memory setting if device storage is unavailable.
const readStoredTheme = () => {
  try {
    return globalThis.localStorage?.getItem(THEME_KEY) || null;
  } catch {
    return null;
  }
};

const writeStoredTheme = (value) => {
  try {
    globalThis.localStorage?.setItem(THEME_KEY, value);
  } catch {
    // ignore unavailable storage
  }
};

export function ThemeProvider({ children }) {
  const systemTheme = useColorScheme();
  const [dark, setDark] = useState(() => {
    const stored = readStoredTheme();
    if (stored === "dark") return true;
    if (stored === "light") return false;
    return systemTheme === "dark";
  });

  useEffect(() => {
    writeStoredTheme(dark ? "dark" : "light");
  }, [dark]);

  const toggleTheme = useCallback(() => setDark((prev) => !prev), []);

  const value = useMemo(
    () => ({
      dark,
      theme: dark ? darkColors : colors,
      toggleTheme,
    }),
    [dark, toggleTheme],
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
