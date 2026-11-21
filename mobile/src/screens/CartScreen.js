import {
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { useCart } from "../context/CartContext";

export default function CartScreen({ navigation }) {
  const { dark, theme } = useTheme();
  const themed = styles(theme, dark);
  const { items, count, total, removeItem, clear } = useCart();

  return (
    <SafeAreaView style={themed.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <View style={themed.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={themed.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={themed.title}>cart ({count})</Text>
        <ThemeToggle />
      </View>

      {items.length === 0 ? (
        <View style={themed.empty}>
          <Text style={themed.emptyTitle}>Your cart is empty</Text>
          <Text style={themed.hint}>Add a few holistic essentials to get started.</Text>
          <TouchableOpacity style={themed.button} onPress={() => navigation.navigate("Products")}>
            <Text style={[themed.buttonText, { color: dark ? "#111827" : "#FFFFFF" }]}>
              browse products
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={themed.list}
            renderItem={({ item, index }) => (
              <View style={themed.row}>
                <Image source={{ uri: item.image }} style={themed.image} resizeMode="cover" />
                <View style={themed.info}>
                  <Text style={themed.name}>{item.name}</Text>
                  <Text style={themed.price}>{item.price}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Text style={themed.remove}>remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={themed.footer}>
            <Text style={themed.total}>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity style={themed.button} onPress={() => navigation.navigate("Checkout")}>
              <Text style={[themed.buttonText, { color: dark ? "#111827" : "#FFFFFF" }]}>
                checkout
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={themed.secondaryButton} onPress={clear}>
              <Text style={themed.secondaryButtonText}>clear cart</Text>
            </TouchableOpacity>
            <Text style={themed.hint}>
              Demo checkout uses Stripe test mode — no real payment is taken.
            </Text>
          </View>
        </>
      )}
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
    list: { padding: 16, gap: 12 },
    row: { flexDirection: "row", gap: 12, backgroundColor: theme.primaryWarmWhite, borderRadius: 12, padding: 10 },
    image: { width: 64, height: 64, borderRadius: 8 },
    info: { flex: 1 },
    name: { fontSize: 14, fontWeight: "700", color: theme.primaryForestGreen },
    price: { fontSize: 13, color: theme.secondaryGoldenHoney, marginTop: 4 },
    remove: { fontSize: 12, color: theme.neutralMediumGray, marginTop: 6, textDecorationLine: "underline" },
    footer: { padding: 16, borderTopWidth: 1, borderTopColor: theme.primaryForestGreen, gap: 10 },
    total: { fontSize: 18, fontWeight: "700", color: theme.primaryForestGreen },
    button: { backgroundColor: theme.secondaryGoldenHoney, borderRadius: 8, paddingVertical: 12, alignItems: "center" },
    buttonText: { fontWeight: "700", fontSize: 15 },
    secondaryButton: { borderWidth: 1, borderColor: theme.primaryForestGreen, borderRadius: 8, paddingVertical: 12, alignItems: "center" },
    secondaryButtonText: { fontWeight: "700", fontSize: 15, color: theme.primaryForestGreen },
    empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 12 },
    emptyTitle: { fontSize: 20, fontWeight: "700", color: theme.primaryForestGreen },
    hint: { fontSize: 13, color: theme.neutralMediumGray, textAlign: "center", lineHeight: 19 },
  });
