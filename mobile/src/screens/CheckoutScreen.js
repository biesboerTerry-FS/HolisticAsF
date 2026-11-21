import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
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
import { useCart } from "../context/CartContext";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "https://holisticasf-server.vercel.app";

export default function CheckoutScreen({ navigation }) {
  const { dark, theme } = useTheme();
  const themed = styles(theme, dark);
  const { items, count, total, clear } = useCart();
  const [placing, setPlacing] = useState(false);
  const [form, setForm] = useState({
    firstName: "Demo",
    lastName: "Trainer",
    streetLine1: "123 Holistic Way",
    city: "San Diego",
    state: "CA",
    zipCode: "92101",
    phone: "555-0100",
    email: "demo@holisticaf.com",
  });

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleCheckout = async () => {
    if (!items.length) return;
    setPlacing(true);
    try {
      const payload = {
        items: items.map((item) => ({
          productId: String(item.id || item._id || item.name),
          productSource: item.productSource || "local",
          name: item.name,
          price: Number(String(item.price || "").replace(/[^0-9.]/g, "")) || 0,
          quantity: 1,
        })),
        ...form,
      };
      const response = await fetch(`${API_URL}/api/order/demo-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!data.success || !data.url) {
        throw new Error(data.message || "Could not start checkout");
      }
      // Open the Stripe test-mode Checkout session (web + native via Linking).
      await Linking.openURL(data.url);
    } catch (error) {
      Alert.alert("Checkout failed", error.message || "Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <SafeAreaView style={themed.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <View style={themed.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={themed.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={themed.title}>checkout</Text>
        <ThemeToggle />
      </View>

      <ScrollView contentContainerStyle={themed.scroll}>
        <View style={themed.card}>
          <Text style={themed.section}>Order summary</Text>
          <Text style={themed.sub}>{count} item(s)</Text>
          <Text style={themed.total}>Total: ${total.toFixed(2)}</Text>
        </View>

        <View style={themed.card}>
          <Text style={themed.section}>Shipping details (demo)</Text>
          {[
            ["firstName", "First name"],
            ["lastName", "Last name"],
            ["streetLine1", "Street address"],
            ["city", "City"],
            ["state", "State"],
            ["zipCode", "ZIP code"],
            ["phone", "Phone"],
            ["email", "Email"],
          ].map(([key, label]) => (
            <View key={key} style={themed.field}>
              <Text style={themed.label}>{label}</Text>
              <TextInput
                style={themed.input}
                value={form[key]}
                onChangeText={(value) => setField(key, value)}
                placeholderTextColor={theme.neutralMediumGray}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={themed.button}
          onPress={handleCheckout}
          disabled={placing || !items.length}
        >
          {placing ? (
            <ActivityIndicator color={dark ? "#111827" : "#FFFFFF"} />
          ) : (
            <Text style={[themed.buttonText, { color: dark ? "#111827" : "#FFFFFF" }]}>
              Continue to secure checkout (Stripe test)
            </Text>
          )}
        </TouchableOpacity>
        <Text style={themed.hint}>
          Demo checkout — no real payment is taken. You'll be sent to Stripe's
          test-mode Checkout page.
        </Text>
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
    scroll: { padding: 16, gap: 14 },
    card: {
      backgroundColor: theme.primaryWarmWhite,
      borderRadius: 12,
      padding: 14,
      gap: 6,
    },
    section: { fontSize: 17, fontWeight: "700", color: theme.primaryForestGreen },
    sub: { fontSize: 13, color: theme.neutralMediumGray },
    total: { fontSize: 20, fontWeight: "700", color: theme.secondaryGoldenHoney, marginTop: 4 },
    field: { gap: 4, marginTop: 8 },
    label: { fontSize: 12, fontWeight: "700", color: theme.primaryForestGreen },
    input: {
      borderWidth: 1,
      borderColor: theme.primaryForestGreen,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 12,
      color: theme.primaryForestGreen,
      fontSize: 14,
      backgroundColor: theme.primaryWarmWhite,
    },
    button: {
      backgroundColor: theme.secondaryGoldenHoney,
      borderRadius: 8,
      paddingVertical: 14,
      alignItems: "center",
    },
    buttonText: { fontWeight: "700", fontSize: 15 },
    hint: { fontSize: 12, color: theme.neutralMediumGray, textAlign: "center", lineHeight: 18 },
  });
