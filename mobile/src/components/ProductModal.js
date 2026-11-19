import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProductModal({ product, visible, onClose, onAddToCart, theme, dark }) {
  if (!product) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View
        style={[
          styles.backdrop,
          { backgroundColor: dark ? "rgba(0,0,0,0.8)" : "rgba(16,26,44,0.6)" },
        ]}
      >
        <View style={[styles.card, { backgroundColor: theme.primaryWarmWhite }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
            <View style={styles.body}>
              <Text
                style={[
                  styles.category,
                  { color: theme.primaryForestGreen },
                ]}
              >
                {product.category}
              </Text>
              <Text style={[styles.name, { color: theme.primaryForestGreen }]}>
                {product.name}
              </Text>
              <Text style={[styles.price, { color: theme.secondaryGoldenHoney }]}>
                {product.price}
              </Text>
              <Text style={[styles.description, { color: theme.neutralMediumGray }]}>
                A thoughtfully selected {product.category.toLowerCase()} essential from the
                holisticAF collection. Clean, intentional, and made to support your
                everyday wellness routine.
              </Text>

              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: theme.secondaryGoldenHoney }]}
                onPress={() => onAddToCart(product)}
              >
                <Text style={[styles.addText, { color: dark ? "#111827" : "#FFFFFF" }]}>
                  add to cart
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={[styles.closeText, { color: theme.neutralMediumGray }]}>
                  close
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxHeight: "85%",
    borderRadius: 20,
    overflow: "hidden",
  },
  image: { width: "100%", height: 220 },
  body: { padding: 20 },
  category: { fontSize: 11, fontWeight: "700", letterSpacing: 1.5, textTransform: "uppercase" },
  name: { fontSize: 22, fontWeight: "700", marginTop: 6 },
  price: { fontSize: 18, fontWeight: "700", marginTop: 10 },
  description: { fontSize: 14, lineHeight: 21, marginTop: 12 },
  addButton: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  addText: { fontWeight: "700", fontSize: 15 },
  closeButton: { marginTop: 14, paddingVertical: 8, alignItems: "center" },
  closeText: { fontSize: 14 },
});
