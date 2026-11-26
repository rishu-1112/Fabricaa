import { createContext, useContext, useEffect, useState } from "react";
import { sampleProducts } from "../data/sampleCatalog";
import { availableQuantity, itemPrice, minimumQuantity } from "../services/catalog";

const CartContext = createContext();

function useStoredList(key, restore = (item) => item) {
  const [list, setList] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key));
      return Array.isArray(stored) ? stored.filter((item) => item?._id).map(restore) : [];
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

function restoreFabric(item) {
  return { ...item, ...sampleProducts.find((product) => product._id === item._id) };
}

export function CartProvider({ children }) {
  const [cart, setCart] = useStoredList("cart", restoreFabric);
  const [saved, setSaved] = useStoredList("fabricaa-saved", restoreFabric);
  const [comparison, setComparison] = useStoredList("fabricaa-comparison", restoreFabric);

  function addToCart(product, quantity = 1) {
    const stock = availableQuantity(product);
    const minimum = minimumQuantity(product);
    if (!Number.isSafeInteger(quantity) || quantity < 1 || stock < minimum) return;
    setCart((items) => {
      const existing = items.find((item) => item._id === product._id);
      const updated = {
        ...product,
        quantity: Math.min(stock, Math.max(minimum, (existing?.quantity || 0) + quantity)),
      };
      return existing ? items.map((item) => item._id === product._id ? updated : item) : [...items, updated];
    });
  }

  function updateQuantity(id, quantity, limits) {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    setCart((items) => items.map((item) => {
      if (item._id !== id) return item;
      const updated = limits ? { ...item, ...limits, inStock: true } : item;
      return quantity >= minimumQuantity(updated) && quantity <= availableQuantity(updated) ? { ...updated, quantity } : item;
    }));
  }

  function toggleSaved(product) {
    setSaved((items) => items.some((item) => item._id === product._id)
      ? items.filter((item) => item._id !== product._id)
      : [...items, product]);
  }

  function saveFabrics(products) {
    setSaved((items) => [...new Map([...items, ...products].map((item) => [item._id, item])).values()]);
  }

  function toggleComparison(product) {
    setComparison((items) => items.some((item) => item._id === product._id)
      ? items.filter((item) => item._id !== product._id)
      : items.length < 3 ? [...items, product] : items);
  }

  return (
    <CartContext.Provider value={{
      cart, saved, comparison, addToCart, updateQuantity, toggleSaved, saveFabrics, toggleComparison,
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
