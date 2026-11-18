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

export default function ContactScreen({ navigation }) {
  const { dark, theme } = useTheme();
  const themed = styles(theme);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = () => {
    if (!form.name.trim() || !form.email.includes("@") || !form.message.trim()) {
      Alert.alert("Missing information", "Please complete all fields with a valid email.");
      return;
    }
    Alert.alert("Message sent!", "Thanks for reaching out. We'll respond soon.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <SafeAreaView style={themed.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <View style={themed.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={themed.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={themed.title}>contact</Text>
        <ThemeToggle />
      </View>
      <ScrollView contentContainerStyle={themed.scroll}>
        <Text style={themed.heading}>get in touch</Text>
        <Text style={themed.hint}>
          Questions about products or your order? Send us a message.
        </Text>
        <TextInput
          style={themed.input}
          placeholder="Name"
          placeholderTextColor={theme.neutralMediumGray}
          value={form.name}
          onChangeText={(value) => update("name", value)}
        />
        <TextInput
          style={themed.input}
          placeholder="Email"
          placeholderTextColor={theme.neutralMediumGray}
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(value) => update("email", value)}
        />
        <TextInput
          style={[themed.input, themed.message]}
          placeholder="Message"
          placeholderTextColor={theme.neutralMediumGray}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={form.message}
          onChangeText={(value) => update("message", value)}
        />
        <TouchableOpacity style={themed.button} onPress={submit}>
          <Text style={themed.buttonText}>send message</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme) =>
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
    scroll: { padding: 16, paddingBottom: 40 },
    heading: { fontSize: 24, fontWeight: "700", color: theme.primaryForestGreen, marginBottom: 6 },
    hint: { fontSize: 14, color: theme.neutralMediumGray, marginBottom: 20 },
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
    message: { height: 120, paddingTop: 10 },
    button: {
      backgroundColor: theme.primaryForestGreen,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 8,
    },
    buttonText: { color: theme.primaryWarmWhite, fontWeight: "600", fontSize: 15 },
  });
