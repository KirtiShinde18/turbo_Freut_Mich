"use client"

import { Button } from '@/components/ui/button'
import { useGetProductsQuery } from '@/redux/api/product.api'
import { useGetMeQuery } from '@/redux/api/auth.api'
import { useAddToCartMutation } from '@/redux/api/cart.api'
import { Heart, ShoppingCart } from 'lucide-react'
import React from 'react'
import { useRouter } from 'next/navigation'

const kids = () => {
    const router = useRouter();
    const { data: meData } = useGetMeQuery();
    const [addToCart] = useAddToCartMutation();
    const {data} = useGetProductsQuery()

    const user = meData?.data;
    const userId = user?.id;

    // filter 
    // ---------
    const filteredProducts =
        data?.result?.filter(
          (item) => item.categories === "kids"
    ) || [];

    const handleAddToCart = async (productId: number) => {
        if (!userId) {
            alert("Please log in to add items to your cart.");
            router.push("/login");
            return;
        }

        try {
            await addToCart({
                userId: userId,
                productId,
                quantity: 1,
            }).unwrap();
        } catch (err) {
            console.error("Failed to add to cart:", err);
        }
    };
    
  return <>
  
    {/* ====================================================== */}
    {/* PRODUCTS */}
    {/* ====================================================== */}

      <div className="mt-8 grid grid-cols-1 gap-6 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-3xl border bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={item.productImage}
                alt={item.name}
                className="h-80 w-full object-cover transition duration-500 group-hover:scale-110"
              />
      
              {/* Wishlist */}
              <button className="absolute right-4 top-4 rounded-full bg-white p-2 shadow-md">
                <Heart className="h-5 w-5" />
              </button>
      
              {/* Sale Badge */}
              <span className="absolute left-4 top-4 rounded-full bg-black px-3 py-1 text-xs text-white">
                NEW
              </span>
            </div>
      
            {/* Content */}
            <div className="p-5">
              <h2 className="line-clamp-1 text-lg font-semibold">
                {item.name}
              </h2>
      
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                {item.description}
              </p>
      
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xl font-bold">
                  ₹ {item.price}
                </p>
      
                <div className="flex items-center gap-2">
                  ⭐ 4.8
                </div>
              </div>
      
              <Button 
                onClick={() => handleAddToCart(item.id as number)}
                className="mt-5 w-full rounded-xl hover:bg-neutral-800"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>

  </>
}

export default kids