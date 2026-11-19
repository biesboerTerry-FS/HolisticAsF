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

const SECTIONS = [
  { title: "Inventory", endpoint: "/api/inventory/inventory", hint: "Products and stock" },
  { title: "Orders", endpoint: "/api/order/admin", hint: "Customer orders" },
  { title: "Schedule", endpoint: "/api/employees", hint: "Team and shifts" },
  { title: "Messages", endpoint: "/api/contact/admin", hint: "Contact inbox" },
];

export default function AdminScreen({ navigation }) {
  const { dark, theme } = useTheme();
  const themed = styles(theme, dark);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    if (!email.includes("@") || password.length < 4) {
      Alert.alert(
        "Invalid credentials",
        "Enter a valid email and a password of at least 4 characters.",
      );
      return;
    }
    setLoggedIn(true);
  };

  return (
    <SafeAreaView style={themed.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <View style={themed.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={themed.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={themed.title}>admin</Text>
        <ThemeToggle />
      </View>
      <ScrollView contentContainerStyle={themed.content}>
        {loggedIn ? (
          <>
            <Text style={themed.heading}>admin dashboard</Text>
            <Text style={themed.hint}>Demo sign-in — manage the holisticAF back office.</Text>

            {SECTIONS.map((section) => (
              <TouchableOpacity
                key={section.title}
                style={themed.card}
                onPress={() =>
                  navigation.navigate("AdminList", {
                    title: section.title,
                    endpoint: section.endpoint,
                  })
                }
              >
                <Text style={themed.cardTitle}>{section.title}</Text>
                <Text style={themed.cardHint}>{section.hint}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={themed.button}
              onPress={() => {
                setLoggedIn(false);
                setEmail("");
                setPassword("");
              }}
            >
              <Text style={[themed.buttonText, { color: dark ? "#111827" : "#FFFFFF" }]}>
                sign out
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={themed.heading}>admin portal</Text>
            <Text style={themed.hint}>Sign in to manage the holisticAF catalog.</Text>
            <TextInput
              style={themed.input}
              placeholder="Email"
              placeholderTextColor={theme.neutralMediumGray}
              keyboardType="email-address"
              autoCapitalize="none"
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
            <TouchableOpacity style={themed.button} onPress={login}>
              <Text style={[themed.buttonText, { color: dark ? "#111827" : "#FFFFFF" }]}>
                login
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme, dark) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.secondarySoftBeige },
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
    content: { padding: 24 },
    heading: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.primaryForestGreen,
      marginBottom: 8,
      textAlign: "center",
    },
    hint: {
      fontSize: 14,
      color: theme.neutralMediumGray,
      textAlign: "center",
      marginBottom: 24,
    },
    card: {
      backgroundColor: theme.primaryWarmWhite,
      borderWidth: 1,
      borderColor: theme.primaryForestGreen,
      borderRadius: 10,
      padding: 16,
      marginBottom: 12,
    },
    cardTitle: { fontSize: 16, fontWeight: "700", color: theme.primaryForestGreen },
    cardHint: { fontSize: 12, color: theme.neutralMediumGray, marginTop: 4 },
    input: {
      borderWidth: 1,
      borderColor: theme.primaryForestGreen,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      marginBottom: 12,
      backgroundColor: theme.primaryWarmWhite,
      color: theme.primaryForestGreen,
    },
    button: {
      backgroundColor: theme.secondaryGoldenHoney,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: { fontWeight: "700", fontSize: 15 },
  });
