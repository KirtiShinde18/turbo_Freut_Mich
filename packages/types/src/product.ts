// 📦 Product Type
export type Product = {
    id?: number
    name: string
    description: string
    categories: string
    productImage?: string
    price: string
}

// 🌸 Common Response
export type COMMON_RESPONSE = {
    message: string
}

// 🚀 Create Product Request
export interface CREATE_PRODUCT_REQUEST {
    name: string
    description: string
    categories: string
    productImage?: FileList
    price: string
}

// 📖 Read Product Response
export interface READ_PRODUCT_RESPONSE {
    result: Product[]
}

// ✏️ Update Product Request
export interface UPDATE_PRODUCT_REQUEST {
    id: number
    body: FormData
}

// 🗑️ Delete Product Request
export interface DELETE_PRODUCT_REQUEST {
    id: number
}