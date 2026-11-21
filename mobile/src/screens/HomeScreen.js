import { useEffect, useState } from "react";
import {
  Alert,
  Image,
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
import CartIcon from "../components/CartIcon";
import { categories, products } from "../data/catalog";
import { useCart } from "../context/CartContext";
import { fetchActiveAnnouncements } from "../api/admin";
import { getCachedEmployee } from "../api/employee";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80";

const ANNOUNCEMENT_COLORS = {
  info: "#3B82F6",
  warning: "#F59E0B",
};

// Dismissing is session-only: the banner stays hidden while the app is running.
let announcementDismissed = false;

// Safe default shown when the API is unreachable or has no active bulletin.
const DEFAULT_ANNOUNCEMENT = {
  title: "Welcome to holisticAF",
  body: "Explore fresh, holistic groceries and everyday wellness essentials — new arrivals are added every week.",
  type: "info",
};

export default function HomeScreen({ navigation }) {
  const { dark, theme } = useTheme();
  const { count: cartCount } = useCart();
  const themed = styles(theme, dark);
  const [email, setEmail] = useState("");
  const [announcement, setAnnouncement] = useState(null);

  useEffect(() => {
    let active = true;
    if (announcementDismissed) return undefined;

    fetchActiveAnnouncements()
      .then((list) => {
        if (active) setAnnouncement(list[0] || DEFAULT_ANNOUNCEMENT);
      })
      .catch(() => {
        // Silent by design — a missing bulletin must not break the home screen.
        if (active) setAnnouncement(DEFAULT_ANNOUNCEMENT);
      });

    return () => {
      active = false;
    };
  }, []);

  const subscribe = () => {
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    Alert.alert("Subscribed!", "Thanks for joining the holisticAF newsletter.");
    setEmail("");
  };

  return (
    <SafeAreaView style={themed.container}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={theme.secondarySoftBeige}
      />
      <View style={themed.nav}>
        <Text style={themed.logo}>holisticAF</Text>
        <View style={themed.navActions}>
          <ThemeToggle />
          <TouchableOpacity
            style={themed.cartBtn}
            accessibilityLabel={`Cart, ${cartCount} items`}
            onPress={() => navigation.navigate("Cart")}
          >
            <CartIcon color={theme.primaryForestGreen} size={22} />
            {cartCount > 0 && (
              <View style={themed.cartCount}>
                <Text style={themed.cartCountText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={themed.loginBtn}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={themed.loginText}>login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={themed.scroll}>
        <View style={themed.hero}>
          <Image source={{ uri: HERO_IMAGE }} style={themed.heroImage} resizeMode="cover" />
          <View style={themed.heroOverlay}>
            <Text style={themed.heroTitle}>nourish with purpose</Text>
            <Text style={themed.heroSubtitle}>your food is your medicine</Text>
            <TouchableOpacity
              style={themed.ctaBtn}
              onPress={() => navigation.navigate("Products")}
            >
              <Text style={themed.ctaText}>shop now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {announcement ? (
          <View
            style={[
              themed.announcementBanner,
              {
                borderLeftColor:
                  ANNOUNCEMENT_COLORS[announcement.type] ||
                  theme.secondaryGoldenHoney,
              },
            ]}
          >
            <View style={themed.announcementHeader}>
              <Text
                style={[
                  themed.announcementType,
                  {
                    color:
                      ANNOUNCEMENT_COLORS[announcement.type] ||
                      theme.secondaryGoldenHoney,
                  },
                ]}
              >
                {(announcement.type || "info").toUpperCase()}
              </Text>
              <TouchableOpacity
                accessibilityLabel="Dismiss announcement"
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                onPress={() => {
                  announcementDismissed = true;
                  setAnnouncement(null);
                }}
              >
                <Text style={themed.announcementClose}>×</Text>
              </TouchableOpacity>
            </View>
            <Text style={themed.announcementTitle} numberOfLines={2}>
              {announcement.title}
            </Text>
            {announcement.body ? (
              <Text style={themed.announcementBody} numberOfLines={3}>
                {announcement.body}
              </Text>
            ) : null}
          </View>
        ) : null}

        <Text style={themed.sectionLabel}>EXPLORE</Text>
        <Text style={themed.sectionTitle}>
          shop by <Text style={themed.accentText}>category</Text>
        </Text>

        <View style={themed.categoryGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.name}
              style={themed.categoryCard}
              onPress={() =>
                navigation.navigate("Category", { category: category.name })
              }
            >
              <Image
                source={{ uri: category.image }}
                style={themed.categoryImage}
                resizeMode="cover"
              />
              <Text style={themed.categoryTitle}>{category.name}</Text>
              <Text style={themed.categoryHint}>browse →</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={themed.sectionLabel}>POPULAR</Text>
        <Text style={themed.sectionTitle}>top sellers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {products.slice(0, 4).map((product) => (
            <TouchableOpacity
              key={product.id}
              style={themed.productCard}
              onPress={() => navigation.navigate("Products")}
            >
              <Image
                source={{ uri: product.image }}
                style={themed.productImage}
                resizeMode="cover"
              />
              <Text style={themed.productName} numberOfLines={2}>
                {product.name}
              </Text>
              <Text style={themed.productPrice}>{product.price}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={themed.newsletter}>
          <Text style={themed.newsletterTitle}>stay in the know</Text>
          <Text style={themed.newsletterSubtitle}>
            subscribe for new arrivals, offers, and wellness tips
          </Text>
          <View style={themed.inputRow}>
            <TextInput
              style={themed.input}
              placeholder="Enter your email"
              placeholderTextColor={theme.neutralMediumGray}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity style={themed.subscribeBtn} onPress={subscribe}>
              <Text style={themed.subscribeText}>subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={themed.contactLink}
          onPress={() => navigation.navigate("Contact")}
        >
          <Text style={themed.contactLinkText}>Need help? Contact us →</Text>
        </TouchableOpacity>

        {getCachedEmployee() ? (
          <TouchableOpacity
            style={themed.contactLink}
            onPress={() => navigation.navigate("Employee")}
          >
            <Text style={themed.contactLinkText}>Employee portal →</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (theme, dark) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: "transparent" },
    scroll: { padding: 16, paddingBottom: 40 },
    nav: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.primaryForestGreen,
    },
    logo: { fontSize: 22, fontWeight: "700", color: theme.secondaryGoldenHoney },
    navActions: { flexDirection: "row", alignItems: "center", gap: 10 },
    cartBtn: {
      paddingHorizontal: 8,
      paddingVertical: 6,
      position: "relative",
    },
    cartIcon: { color: theme.primaryForestGreen, fontWeight: "700", fontSize: 13 },
    cartCount: {
      position: "absolute",
      right: 0,
      top: 0,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.primaryForestGreen,
      alignItems: "center",
      justifyContent: "center",
    },
    cartCountText: { color: theme.primaryWarmWhite, fontSize: 9, fontWeight: "700" },
    loginBtn: {
      backgroundColor: theme.secondaryGoldenHoney,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    loginText: { color: dark ? "#111827" : "#FFFFFF", fontWeight: "600", fontSize: 13 },
    hero: {
      height: 230,
      borderRadius: 20,
      overflow: "hidden",
      marginBottom: 28,
      backgroundColor: theme.primaryForestGreen,
    },
    heroImage: { ...StyleSheet.absoluteFillObject, width: "100%", height: "100%" },
    heroOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      padding: 20,
      backgroundColor: "rgba(16,26,44,0.45)",
    },
    heroTitle: {
      fontSize: 26,
      fontWeight: "700",
      color: "#F5F7FB",
      fontStyle: "italic",
      maxWidth: 250,
    },
    heroSubtitle: { fontSize: 14, color: "#B9E4DC", marginTop: 4, marginBottom: 16 },
    ctaBtn: {
      alignSelf: "flex-start",
      backgroundColor: theme.secondaryGoldenHoney,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 6,
    },
    ctaText: { color: dark ? "#111827" : "#FFFFFF", fontWeight: "600" },
    announcementBanner: {
      backgroundColor: theme.primaryWarmWhite,
      borderWidth: 1,
      borderLeftWidth: 4,
      borderColor: `${theme.primaryForestGreen}1a`,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 28,
    },
    announcementHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    announcementType: { fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
    announcementClose: {
      fontSize: 20,
      lineHeight: 20,
      color: theme.neutralMediumGray,
      paddingHorizontal: 4,
    },
    announcementTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.primaryForestGreen,
    },
    announcementBody: {
      fontSize: 13,
      lineHeight: 18,
      color: theme.neutralMediumGray,
      marginTop: 4,
    },
    sectionLabel: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 2,
      color: theme.primaryForestGreen,
      marginBottom: 4,
    },
    sectionTitle: {
      fontSize: 26,
      fontWeight: "700",
      color: theme.primaryForestGreen,
      marginBottom: 14,
    },
    accentText: { color: theme.secondaryGoldenHoney },
    categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 },
    categoryCard: {
      width: "47%",
      flexGrow: 1,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: theme.primaryWarmWhite,
      borderWidth: 1,
      borderColor: `${theme.primaryForestGreen}1a`,
    },
    categoryImage: { width: "100%", height: 96 },
    categoryTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.primaryForestGreen,
      paddingHorizontal: 12,
      paddingTop: 10,
    },
    categoryHint: {
      fontSize: 12,
      color: theme.neutralMediumGray,
      paddingHorizontal: 12,
      paddingBottom: 12,
      paddingTop: 4,
    },
    productCard: {
      width: 150,
      marginRight: 12,
      borderRadius: 14,
      overflow: "hidden",
      backgroundColor: theme.primaryWarmWhite,
      borderWidth: 1,
      borderColor: `${theme.primaryForestGreen}1a`,
      paddingBottom: 10,
    },
    productImage: { width: "100%", height: 120 },
    productName: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.primaryForestGreen,
      paddingHorizontal: 10,
      paddingTop: 8,
    },
    productPrice: {
      fontSize: 13,
      color: theme.secondaryEarthyBrown,
      paddingHorizontal: 10,
      paddingTop: 4,
    },
    newsletter: { alignItems: "center", marginTop: 24 },
    newsletterTitle: {
      fontSize: 22,
      fontWeight: "600",
      color: theme.primaryForestGreen,
      marginBottom: 6,
    },
    newsletterSubtitle: {
      fontSize: 13,
      color: theme.neutralMediumGray,
      textAlign: "center",
      marginBottom: 18,
    },
    inputRow: { flexDirection: "row", width: "100%", height: 44 },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.primaryForestGreen,
      borderRightWidth: 0,
      borderTopLeftRadius: 6,
      borderBottomLeftRadius: 6,
      paddingHorizontal: 12,
      backgroundColor: theme.primaryWarmWhite,
      color: theme.primaryForestGreen,
    },
    subscribeBtn: {
      backgroundColor: theme.primaryForestGreen,
      paddingHorizontal: 18,
      justifyContent: "center",
      borderTopRightRadius: 6,
      borderBottomRightRadius: 6,
    },
    subscribeText: { color: theme.primaryWarmWhite, fontWeight: "500" },
    contactLink: { marginTop: 24, alignItems: "center" },
    contactLinkText: {
      color: theme.primaryForestGreen,
      fontWeight: "600",
      fontSize: 14,
      textDecorationLine: "underline",
    },
  });
