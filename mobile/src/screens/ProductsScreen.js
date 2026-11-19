import { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
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
import { products } from "../data/catalog";

export default function ProductsScreen({ navigation }) {
  const { dark, theme } = useTheme();
  const themed = styles(theme, dark);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);

  const filtered = products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  const addToCart = (product) => {
    setCart((current) => [...current, product.id]);
    Alert.alert("Added to cart", `${product.name} was added to your cart.`);
  };

  return (
    <SafeAreaView style={themed.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <View style={themed.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={themed.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={themed.title}>products</Text>
        <ThemeToggle />
      </View>

      <View style={themed.searchRow}>
        <TextInput
          style={themed.search}
          placeholder="Search holistic products"
          placeholderTextColor={theme.neutralMediumGray}
          value={query}
          onChangeText={setQuery}
        />
        {cart.length > 0 && (
          <View style={themed.cartBadge}>
            <Text style={themed.cartText}>{cart.length}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={themed.list}
        renderItem={({ item }) => (
          <View style={themed.card}>
            <Image source={{ uri: item.image }} style={themed.image} resizeMode="cover" />
            <View style={themed.cardBody}>
              <Text style={themed.cardCategory}>{item.category}</Text>
              <Text style={themed.cardName}>{item.name}</Text>
              <View style={themed.cardFooter}>
                <Text style={themed.price}>{item.price}</Text>
                <TouchableOpacity style={themed.addBtn} onPress={() => addToCart(item)}>
                  <Text style={themed.addText}>add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={themed.empty}>
            <Text style={themed.body}>No products found.</Text>
            <Text style={themed.hint}>Try a different search term.</Text>
          </View>
        }
      />
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
    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    search: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.primaryForestGreen,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 9,
      backgroundColor: theme.primaryWarmWhite,
      color: theme.primaryForestGreen,
    },
    cartBadge: {
      backgroundColor: theme.secondaryGoldenHoney,
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
    },
    cartText: { color: dark ? "#111827" : "#FFFFFF", fontWeight: "700" },
    list: { paddingHorizontal: 16, paddingBottom: 32 },
    card: {
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: theme.primaryWarmWhite,
      borderWidth: 1,
      borderColor: `${theme.primaryForestGreen}1a`,
      marginBottom: 14,
    },
    image: { width: "100%", height: 160 },
    cardBody: { padding: 14 },
    cardCategory: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 1,
      color: theme.secondaryEarthyBrown,
      textTransform: "uppercase",
    },
    cardName: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.primaryForestGreen,
      marginTop: 4,
    },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 12,
    },
    price: { fontSize: 15, fontWeight: "600", color: theme.primaryForestGreen },
    addBtn: {
      backgroundColor: theme.primaryForestGreen,
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 6,
    },
    addText: { color: theme.primaryWarmWhite, fontWeight: "600" },
    empty: { alignItems: "center", justifyContent: "center", padding: 40 },
    body: { fontSize: 18, fontWeight: "600", color: theme.primaryForestGreen, marginBottom: 8 },
    hint: { fontSize: 14, color: theme.neutralMediumGray, textAlign: "center" },
  });
