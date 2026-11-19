import { FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { categories, products } from "../data/catalog";

export default function CategoryScreen({ navigation, route }) {
  const { dark, theme } = useTheme();
  const themed = styles(theme);
  const categoryName = route.params?.category || "Category";
  const category = categories.find((item) => item.name === categoryName);
  const items = products.filter((product) => product.category === categoryName);

  return (
    <SafeAreaView style={themed.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <View style={themed.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={themed.backText}>← back</Text>
        </TouchableOpacity>
        <Text style={themed.title} numberOfLines={1}>
          {categoryName}
        </Text>
        <ThemeToggle />
      </View>

      <FlatList
        ListHeaderComponent={
          <View style={themed.hero}>
            {category?.image && (
              <Image source={{ uri: category.image }} style={themed.heroImage} resizeMode="cover" />
            )}
            <View style={themed.heroOverlay}>
              <Text style={themed.heroTitle}>{categoryName}</Text>
              <Text style={themed.heroSubtitle}>
                {items.length} curated holistic {items.length === 1 ? "item" : "items"}
              </Text>
            </View>
          </View>
        }
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={themed.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={themed.item}
            onPress={() => navigation.navigate("Products")}
          >
            <Image source={{ uri: item.image }} style={themed.image} resizeMode="cover" />
            <View>
              <Text style={themed.name}>{item.name}</Text>
              <Text style={themed.price}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={themed.empty}>
            <Text style={themed.body}>No items in this category yet.</Text>
            <Text style={themed.hint}>Browse all products to see more.</Text>
          </View>
        }
      />
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
    title: { fontSize: 16, fontWeight: "700", color: theme.primaryForestGreen, maxWidth: 180 },
    hero: {
      height: 180,
      borderRadius: 16,
      overflow: "hidden",
      margin: 16,
      backgroundColor: theme.primaryForestGreen,
    },
    heroImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
    heroOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      padding: 16,
      backgroundColor: "rgba(16,26,44,0.45)",
    },
    heroTitle: { fontSize: 22, fontWeight: "700", color: "#F5F7FB" },
    heroSubtitle: { fontSize: 13, color: "#B9E4DC", marginTop: 4 },
    list: { paddingHorizontal: 16, paddingBottom: 32 },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      backgroundColor: theme.primaryWarmWhite,
      borderRadius: 12,
      padding: 10,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: `${theme.primaryForestGreen}1a`,
    },
    image: { width: 70, height: 70, borderRadius: 8 },
    name: { fontSize: 15, fontWeight: "600", color: theme.primaryForestGreen, maxWidth: 200 },
    price: { fontSize: 14, color: theme.secondaryEarthyBrown, marginTop: 4 },
    empty: { alignItems: "center", justifyContent: "center", padding: 40 },
    body: { fontSize: 18, fontWeight: "600", color: theme.primaryForestGreen, marginBottom: 8 },
    hint: { fontSize: 14, color: theme.neutralMediumGray, textAlign: "center" },
  });
