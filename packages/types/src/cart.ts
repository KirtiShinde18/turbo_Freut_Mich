// ====================================== CART TYPES ======================================

// \ud83d\udce6 A single product inside a cart item
export type CartProduct = {
  id: number
  name: string
  price: string
  productImage: string
  description: string
  categories: string
}

// \ud83d\uded2 Cart Item (DB row joined with product)
export type CART_ITEM = {
  id: number
  userId: number
  productId: number
  quantity: number
  createdAt: string | null
  updatedAt: string | null
  product: CartProduct
}

// \ud83d\udce5 Request body for adding to cart
export interface ADD_TO_CART_REQUEST {
  userId: number
  productId: number
  quantity: number
}

// \ud83d\udce4 Response for GET /api/cart/:userId
export interface GET_CART_RESPONSE {
  result: CART_ITEM[]
}

// \u270f\ufe0f Request for PATCH /api/cart/:id
export interface UPDATE_CART_REQUEST {
  id: number
  quantity: number
}
