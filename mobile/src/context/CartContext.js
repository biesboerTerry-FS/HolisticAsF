import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const value = useMemo(
    () => ({
      items,
      count: items.length,
      addItem: (product) => setItems((current) => [...current, product]),
      removeItem: (id) =>
        setItems((current) => {
          const index = current.findIndex((item) => item.id === id);
          if (index === -1) return current;
          return current.filter((_, i) => i !== index);
        }),
      clear: () => setItems([]),
      total: items.reduce((sum, item) => {
        const price = Number(String(item.price || "").replace(/[^0-9.]/g, "")) || 0;
        return sum + price;
      }, 0),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
