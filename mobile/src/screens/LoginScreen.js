import { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { DEMO_EMPLOYEE, setCachedEmployee } from "../api/employee";

export default function LoginScreen({ navigation }) {
  const { dark, theme } = useTheme();
  const themed = styles(theme, dark);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    if (!email.includes("@") || password.length < 4) {
      Alert.alert(
        "Invalid credentials",
        "Enter a valid email and a password of at least 4 characters.",
      );
      return;
    }
    Alert.alert("Welcome back", "You are signed in to your holisticAF account.");
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView style={themed.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <View style={themed.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={themed.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={themed.title}>sign in</Text>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={themed.content}>
        <Text style={themed.heading}>Welcome back</Text>
        <Text style={themed.hint}>
          Sign in to save favourites and check out faster. This is a demo sign-in — no
          account is created.
        </Text>

        <TextInput
          style={themed.input}
          placeholder="Email"
          placeholderTextColor={theme.neutralMediumGray}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={themed.input}
          placeholder="Password"
          placeholderTextColor={theme.neutralMediumGray}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={themed.button} onPress={signIn}>
          <Text style={[themed.buttonText, { color: dark ? "#111827" : "#FFFFFF" }]}>
            sign in
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={themed.guest}>Continue as guest</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Admin")}>
          <Text style={themed.guest}>Admin portal →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCachedEmployee(DEMO_EMPLOYEE);
            navigation.navigate("Employee");
          }}
        >
          <Text style={themed.guest}>Try demo employee →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme, dark) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "transparent" },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryForestGreen,
    },
    backText: { color: theme.primaryForestGreen, fontSize: 14, fontWeight: "600" },
    title: { fontSize: 18, fontWeight: "700", color: theme.primaryForestGreen },
    content: { padding: 24, gap: 14 },
    heading: { fontSize: 26, fontWeight: "700", color: theme.primaryForestGreen, marginTop: 12 },
    hint: { fontSize: 14, color: theme.neutralMediumGray, lineHeight: 20, marginBottom: 12 },
    input: {
      borderWidth: 1,
      borderColor: theme.primaryForestGreen,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: theme.primaryForestGreen,
      backgroundColor: theme.primaryWarmWhite,
    },
    button: {
      backgroundColor: theme.secondaryGoldenHoney,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
      marginTop: 6,
    },
    buttonText: { fontWeight: "700", fontSize: 15 },
    guest: {
      textAlign: "center",
      color: theme.primaryForestGreen,
      fontWeight: "600",
      marginTop: 8,
    },
  });
