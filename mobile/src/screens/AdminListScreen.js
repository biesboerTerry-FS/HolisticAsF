import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import { fetchAdminList } from "../api/admin";

const titleOf = (item) =>
  item.name || item.title || item.email || item.subject || item._id || "Item";

const detailOf = (item) => {
  const parts = [];
  if (item.category) parts.push(item.category);
  if (item.email) parts.push(item.email);
  if (item.status) parts.push(String(item.status));
  if (item.price !== undefined) parts.push(`$${Number(item.price).toFixed(2)}`);
  if (item.amount !== undefined) parts.push(`$${Number(item.amount).toFixed(2)}`);
  if (item.date || item.createdAt) parts.push(String(item.date || item.createdAt).slice(0, 10));
  return parts.join(" · ") || "No additional details";
};

export default function AdminListScreen({ navigation, route }) {
  const { title, endpoint } = route.params || {};
  const { dark, theme } = useTheme();
  const themed = styles(theme);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await fetchAdminList(endpoint));
    } catch (err) {
      setError(err.message || "Could not load data");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let active = true;
    fetchAdminList(endpoint)
      .then((data) => {
        if (!active) return;
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Could not load data");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [endpoint]);

  return (
    <SafeAreaView style={themed.container}>
      <StatusBar barStyle={dark ? "light-content" : "dark-content"} />
      <View style={themed.header}>
        <Text style={themed.title}>{title || "admin"}</Text>
        <ThemeToggle />
      </View>

      {error ? (
        <View style={themed.message}>
          <Text style={themed.error}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => String(item._id || item.id || index)}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.primaryForestGreen} />
          }
          contentContainerStyle={themed.list}
          ListEmptyComponent={
            <Text style={themed.empty}>
              {loading ? "Loading…" : "Nothing here yet."}
            </Text>
          }
          renderItem={({ item }) => (
            <View style={themed.row}>
              <Text style={themed.name}>{titleOf(item)}</Text>
              <Text style={themed.detail}>{detailOf(item)}</Text>
            </View>
          )}
        />
      )}
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
    title: { fontSize: 18, fontWeight: "700", color: theme.primaryForestGreen },
    list: { padding: 16, gap: 10 },
    row: {
      backgroundColor: theme.primaryWarmWhite,
      borderRadius: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.primaryForestGreen,
    },
    name: { fontSize: 15, fontWeight: "700", color: theme.primaryForestGreen },
    detail: { fontSize: 12, color: theme.neutralMediumGray, marginTop: 4 },
    empty: { textAlign: "center", color: theme.neutralMediumGray, marginTop: 40 },
    message: { padding: 24 },
    error: { color: "#b91c1c", textAlign: "center" },
  });
