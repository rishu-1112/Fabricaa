import { createContext, useContext, useEffect, useState } from "react";
import { availableQuantity, itemPrice } from "../services/catalog";

const CartContext = createContext();

function useStoredList(key) {
  const [list, setList] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      return Array.isArray(stored) ? stored.filter((item) => item?._id) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch {
      // The selection remains available for the current session.
    }
  }, [key, list]);
  return [list, setList];
}

export function CartProvider({ children }) {
  const [cart, setCart] = useStoredList("cart");
  const [saved, setSaved] = useStoredList("fabricaa-saved");

  function addToCart(product, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity < 1 || !availableQuantity(product)) return;
    setCart((items) => {
      const existing = items.find((item) => item._id === product._id);
      const updated = {
        ...product,
        quantity: Math.min((existing?.quantity || 0) + quantity, availableQuantity(product)),
      };
      return existing ? items.map((item) => item._id === product._id ? updated : item) : [...items, updated];
    });
  }

  function updateQuantity(id, quantity, stockCount) {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    setCart((items) => items.map((item) => {
      if (item._id !== id) return item;
      const updated = stockCount === undefined ? item : { ...item, stockCount, inStock: true };
      return quantity <= availableQuantity(updated) ? { ...updated, quantity } : item;
    }));
  }

  function toggleSaved(product) {
    setSaved((items) => items.some((item) => item._id === product._id)
      ? items.filter((item) => item._id !== product._id)
      : [...items, product]);
  }

  return (
    <CartContext.Provider value={{
      cart, saved, addToCart, updateQuantity, toggleSaved,
      removeFromCart: (id) => setCart((items) => items.filter((item) => item._id !== id)),
      clearCart: () => setCart([]),
      totalItems: cart.reduce((total, item) => total + item.quantity, 0),
      totalPrice: cart.reduce((total, item) => total + itemPrice(item) * item.quantity, 0),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
