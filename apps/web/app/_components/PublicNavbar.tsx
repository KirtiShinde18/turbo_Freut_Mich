"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Search, ShoppingCart, Heart, User, Loader2, Sun, Moon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetMeQuery, useSignoutMutation } from "../../redux/api/auth.api";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from "../../redux/api/cart.api";
import { useTheme } from "../../redux/ThemeProvider";

const PublicNavbar = () => {
  const [open, setOpen] = useState(false);
  const { data: meData, isLoading: isMeLoading } = useGetMeQuery();
  const [signout] = useSignoutMutation();
  const { theme, setTheme } = useTheme();

  const user = meData?.data;
  const userId = user?.id;

  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(userId!, {
    skip: !userId,
  });
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const cartItems = (cartData as any)?.result || [];
  const cartCount = cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);
  const cartTotal = cartItems.reduce((acc: number, item: any) => {
    const price = item.product?.price ? parseFloat(item.product.price) : 0;
    return acc + price * item.quantity;
  }, 0);

  const handleSignout = async () => {
    try {
      await signout(undefined).unwrap();
      setOpen(false);
    } catch (err) {
      console.error("Signout failed:", err);
    }
  };

  const handleUpdateQty = async (itemId: number, newQty: number) => {
    if (newQty < 1) return;
    try {
      await updateCartItem({ id: itemId, quantity: newQty }).unwrap();
    } catch (err) {
      console.error("Failed to update qty:", err);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart(itemId).unwrap();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-black text-black dark:text-white border-gray-200 dark:border-neutral-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">

        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold tracking-wide">
          Fruet Mich 👚
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary dark:hover:text-neutral-400">
            Home
          </Link>
          <Link href="/women" className="text-sm font-medium hover:text-primary dark:hover:text-neutral-400">
            Women
          </Link>
          <Link href="/men" className="text-sm font-medium hover:text-primary dark:hover:text-neutral-400">
            Men
          </Link>
          <Link href="/kids" className="text-sm font-medium hover:text-primary dark:hover:text-neutral-400">
            Kids
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">

          {/* THEME TOGGLE */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:text-primary dark:hover:text-neutral-400 cursor-pointer p-1 rounded-lg"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* SEARCH (optional) */}
          {/* <button className="hover:text-primary dark:hover:text-neutral-400">
            <Search size={20} />
          </button> */}

          {/* WISHLIST */}
          <button className="hover:text-primary dark:hover:text-neutral-400">
            <Heart size={20} />
          </button>

          {/* CART DRAWER */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="relative flex items-center text-black dark:text-white hover:text-gray-700 dark:hover:text-neutral-300 transition-colors p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900 cursor-pointer">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] text-white font-bold animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </SheetTrigger>

            {/* DRAWER */}
            <SheetContent side="right" className="w-full sm:w-[440px] p-0 flex flex-col bg-white dark:bg-zinc-950 border-l border-neutral-200 dark:border-neutral-800 text-black dark:text-white shadow-2xl">
              <SheetTitle className="sr-only">
                Shopping Cart
              </SheetTitle>

              {/* HEADER */}
              <div className="p-6 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-zinc-900/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Shopping Bag</h2>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {cartCount} {cartCount === 1 ? "item" : "items"} ready to checkout
                    </p>
                  </div>
                </div>
              </div>

              {/* ITEMS */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
                {!userId ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                    <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-400">
                      <User size={32} />
                    </div>
                    <p className="font-semibold text-neutral-700 dark:text-neutral-300">Log in required</p>
                    <p className="text-sm text-neutral-500 max-w-[240px]">Please log in to view and manage your shopping bag.</p>
                  </div>
                ) : isCartLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="animate-spin text-pink-500 h-8 w-8" />
                    <p className="text-xs text-neutral-500">Loading your bag...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-full text-neutral-400">
                      <ShoppingCart size={32} />
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-700 dark:text-neutral-300">Your bag is empty</p>
                      <p className="text-sm text-neutral-500 mt-1">Add items to get started!</p>
                    </div>
                  </div>
                ) : (
                  cartItems.map((item: any) => {
                    const price = item.product?.price ? parseFloat(item.product.price) : 0;
                    return (
                      <div key={item.id} className="flex gap-4 border border-neutral-100 dark:border-neutral-900 rounded-2xl p-4 bg-neutral-50/30 dark:bg-neutral-900/10 hover:border-neutral-200 dark:hover:border-neutral-800 transition-all duration-255 group">
                        <div className="h-24 w-24 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 flex-shrink-0 relative border border-neutral-100 dark:border-neutral-900">
                          <img
                            src={item.product?.productImage || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b"}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            alt={item.product?.name || "Product"}
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="font-semibold text-sm line-clamp-2 leading-snug">
                                {item.product?.name || "Unknown Product"}
                              </h3>
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="text-neutral-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900"
                                title="Remove item"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 capitalize">
                              {item.product?.categories || "Fashion"}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            {/* Qty Selector */}
                            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl">
                              <button
                                onClick={() => handleUpdateQty(item.id, item.quantity - 1)}
                                className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-neutral-700 dark:text-neutral-350 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer font-bold"
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-xs font-semibold">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQty(item.id, item.quantity + 1)}
                                className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-white dark:hover:bg-zinc-800 text-neutral-700 dark:text-neutral-350 transition-all cursor-pointer font-bold"
                              >
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-[11px] text-neutral-450 dark:text-neutral-500">
                                ₹ {price} each
                              </p>
                              <p className="font-bold text-sm text-neutral-900 dark:text-neutral-105">
                                ₹ {price * item.quantity}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* FOOTER */}
              {userId && cartItems.length > 0 && (
                <div className="border-t border-neutral-100 dark:border-neutral-900 p-6 space-y-4 bg-neutral-50/50 dark:bg-zinc-900/30">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
                      <span>Subtotal</span>
                      <span>₹ {cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
                      <span>Shipping</span>
                      <span className="text-green-500 font-medium">Free</span>
                    </div>
                    <div className="border-t border-neutral-100 dark:border-neutral-900 my-2 pt-2 flex justify-between font-bold text-base">
                      <span>Total Amount</span>
                      <span className="text-pink-500 dark:text-pink-400">₹ {cartTotal}</span>
                    </div>
                  </div>

                  <button className="w-full bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 text-white py-3.5 rounded-2xl font-semibold shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition-all duration-200 cursor-pointer">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* USER */}
          <button
            className="hover:text-primary dark:hover:text-neutral-400 flex items-center justify-center h-8 w-8 rounded-full border border-gray-200 dark:border-neutral-800"
            onClick={() => setOpen(true)}
          >
            {user ? (
              <span className="text-sm font-bold uppercase">{user.name.charAt(0)}</span>
            ) : (
              <User size={20} />
            )}
          </button>

          {open && (
            <div className="fixed inset-0 z-50 bg-black/50">
              <div className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-zinc-950 text-black dark:text-white flex flex-col border-l border-gray-200 dark:border-neutral-800">

                {/* HEADER */}
                <div className="p-5 border-b border-gray-200 dark:border-neutral-800 flex items-center justify-between">
                  <h2 className="text-lg font-bold">My Profile 👤</h2>
                  <button
                    onClick={() => setOpen(false)}
                    className="text-sm text-gray-500 hover:text-black dark:hover:text-white font-semibold"
                  >
                    ✕
                  </button>
                </div>

                {/* PROFILE SECTION */}
                <div className="p-5 flex flex-col items-center text-center border-b border-gray-200 dark:border-neutral-800">
                  <div className="h-16 w-16 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xl font-bold uppercase">
                    {user?.name?.charAt(0) || "G"}
                  </div>

                  <h3 className="mt-3 font-semibold text-lg">
                    {user?.name || "Guest User"}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    {user?.email || "Not logged in"}
                  </p>

                  <span className="mt-2 text-xs px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-full capitalize">
                    {user?.role || "guest"}
                  </span>
                </div>

                {/* MENU */}
                <div className="flex-1 p-5 space-y-3">
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                    My Orders 📦
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                    Wishlist ❤️
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors">
                    Settings ⚙️
                  </button>
                </div>

                {/* LOGOUT / LOGIN */}
                <div className="p-5 border-t border-gray-200 dark:border-neutral-800">
                  {user ? (
                    <button
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors cursor-pointer"
                      onClick={handleSignout}
                    >
                      Logout
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="block w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-neutral-200 text-white dark:text-black text-center py-2 rounded-lg transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      Log In
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default PublicNavbar;