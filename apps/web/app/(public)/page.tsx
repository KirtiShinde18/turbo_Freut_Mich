"use client"

import { Button } from "@/components/ui/button";
import { useGetProductsQuery } from "@/redux/api/product.api";
import { useGetMeQuery } from "@/redux/api/auth.api";
import { useAddToCartMutation } from "@/redux/api/cart.api";
import { ArrowRight, Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();
  const { data: meData } = useGetMeQuery();
  const { data } = useGetProductsQuery();
  const [addToCart] = useAddToCartMutation();

  const [showAll, setShowAll] = useState(false);

  const user = meData?.data;
  const userId = user?.id;

  const displayedProducts = showAll
    ? data?.result
    : data?.result?.slice(0, 4);

  const category = [
    { name: "Women", img: "https://i.pinimg.com/736x/c9/16/75/c91675bce20f20f7534e0a6c502ffa90.jpg", link: "/women" },
    { name: "Men", img: "https://i.pinimg.com/736x/8b/55/6b/8b556b1b84aed3435c5154a11fbb8609.jpg", link: "/men" },
    { name: "Kids", img: "https://i.pinimg.com/736x/d8/25/dd/d825dd1c3a106f5b78528ca7764ed0f4.jpg", link: "/kids" },
    { name: "Accessories", img: "https://i.pinimg.com/1200x/66/1b/ea/661bea6d02071550e14e6da5506c0b1c.jpg", link: "/accessories" },
    { name: "Footwear", img: "https://i.pinimg.com/736x/d4/4b/19/d44b19c330747742e0cc778504c419a6.jpg", link: "/shoe" },
  ];

  const handleAddToCart = async (productId: number) => {
    if (!userId) {
      alert("Please log in to add items to your cart.");
      router.push("/login");
      return;
    }

    try {
      await addToCart({
        userId: userId!,
        productId,
        quantity: 1,
      }).unwrap();
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  return (
    <>
      <section className="bg-neutral-50 dark:bg-zinc-950 transition-colors">
        <div className="container mx-auto px-6 py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Content */}
            <div>
              <span className="rounded-full bg-black dark:bg-white px-4 py-2 text-sm text-white dark:text-black font-semibold">
                ✨ New Collection 2026
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
                Discover Your
                <span className="block text-pink-500 dark:text-pink-300">
                  Perfect Style
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-lg text-gray-600 dark:text-neutral-400">
                Elevate your wardrobe with our latest
                collection of premium fashion essentials.
              </p>

              <div className="mt-8 flex gap-4">
                <Link
                  href="/shop"
                  className="rounded-lg bg-black dark:bg-white px-8 py-3 text-white dark:text-black font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
                >
                  Shop Now
                </Link>

                <Link
                  href="/collections"
                  className="rounded-lg border border-neutral-300 dark:border-neutral-700 px-8 py-3 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
                >
                  Explore
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <Image
                src="/hero.jpg"
                alt="Fashion Model"
                width={700}
                height={800}
                className="rounded-3xl object-cover"
              />

              <div className="absolute left-4 top-10 rounded-xl bg-white dark:bg-zinc-900 dark:text-white p-4 shadow-lg border border-neutral-150 dark:border-neutral-850">
                🔥 Up to 50% OFF
              </div>

              <div className="absolute bottom-10 right-4 rounded-xl bg-white dark:bg-zinc-900 dark:text-white p-4 shadow-lg border border-neutral-150 dark:border-neutral-850">
                🚚 Free Shipping
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <div className="container mx-auto px-4 py-10">
        <h2 className="mb-8 text-center text-3xl font-bold dark:text-white">
          Shop By Category
        </h2>

        <div className="flex flex-wrap justify-center gap-8">
          {category.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group flex flex-col items-center cursor-pointer"
            >
              <div className="overflow-hidden rounded-full border-2 border-gray-300 dark:border-neutral-700">
                <img
                  src={item.img}
                  alt={item.name}
                  className="h-40 w-40 md:h-48 md:w-48 object-cover rounded-full transition duration-500 group-hover:scale-110"
                />
              </div>

              <h3 className="mt-4 text-lg font-semibold dark:text-neutral-200 group-hover:text-primary transition-colors">
                {item.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="mt-10 flex justify-start ms-5">
        <Link href="/women">
          <Button className="rounded-full px-8 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-850 dark:hover:bg-neutral-200">
            View More Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {displayedProducts?.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-3xl border border-gray-200 dark:border-neutral-850 bg-white dark:bg-zinc-950 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={item.productImage}
                alt={item.name}
                className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
              />

              {/* Wishlist */}
              <button className="absolute right-4 top-4 rounded-full bg-white dark:bg-zinc-900 p-2 shadow-md hover:scale-105 transition-transform cursor-pointer">
                <Heart className="h-5 w-5 dark:text-white" />
              </button>

              {/* Sale Badge */}
              <span className="absolute left-4 top-4 rounded-full bg-black dark:bg-white px-3 py-1 text-xs text-white dark:text-black font-bold">
                NEW
              </span>
            </div>

            {/* Content */}
            <div className="p-5">
              <h2 className="line-clamp-1 text-lg font-semibold dark:text-white">
                {item.name}
              </h2>

              <p className="mt-2 line-clamp-2 text-sm text-gray-500 dark:text-neutral-400">
                {item.description}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <p className="text-xl font-bold dark:text-white">
                  ₹ {item.price}
                </p>

                <div className="flex items-center gap-2 dark:text-neutral-300">
                  ⭐ 4.8
                </div>
              </div>

              <Button
                onClick={() => handleAddToCart(item.id as number)}
                className="mt-5 w-full rounded-xl bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-850 dark:hover:bg-neutral-200"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}