export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

// Get cart
export const getCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

// Save cart
export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));

  // 🔥 notify UI update (important for navbar)
  window.dispatchEvent(new Event("storage"));
};

// Add to cart
export const addToCart = (product: Omit<CartItem, "quantity">) => {
  const cart = getCart();

  const existing = cart.find((item) => item.id === product.id);

  let updatedCart;

  if (existing) {
    updatedCart = cart.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  } else {
    updatedCart = [...cart, { ...product, quantity: 1 }];
  }

  saveCart(updatedCart);
};

// Remove item
export const removeFromCart = (id: string | number) => {
  const updatedCart = getCart().filter((item) => item.id !== id);
  saveCart(updatedCart);
};

// Increase qty
export const increaseQty = (id: string | number) => {
  const updatedCart = getCart().map((item) =>
    item.id === id
      ? { ...item, quantity: item.quantity + 1 }
      : item
  );

  saveCart(updatedCart);
};

// Decrease qty
export const decreaseQty = (id: string | number) => {
  const updatedCart = getCart()
    .map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity - 1 }
        : item
    )
    .filter((item) => item.quantity > 0);

  saveCart(updatedCart);
};

// Cart count
export const getCartCount = (): number => {
  return getCart().reduce(
    (total, item) => total + item.quantity,
    0
  );
};

// Total price
export const getTotalPrice = (): number => {
  return getCart().reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
};