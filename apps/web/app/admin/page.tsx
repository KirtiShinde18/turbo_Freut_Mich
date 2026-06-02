"use client"

import React, { useEffect, useRef, useState } from "react"

import { z } from "zod"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "@/redux/api/product.api"

import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Field,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"
import { CREATE_PRODUCT_REQUEST, DELETE_PRODUCT_REQUEST } from "@repo/types"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"



const optionalFileList = z.any().refine(
  (files) => !files || files.length === 0 || files[0] instanceof File,
  "Invalid file"
)


// ======================================================
// PAGE
// ======================================================

const Page = () => {

  const [edit, setEdit] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [showEditImage, setShowEditImage] = useState(false)

  const fileRef = useRef<HTMLInputElement | null>(null)

  const {data } = useGetProductsQuery()
  const products = data?.result ?? [];

  const [ addProduct, { isLoading }, ] = useCreateProductMutation();
  const [ updateProduct] = useUpdateProductMutation()
  const [ deleteProduct ] = useDeleteProductMutation()

// -------------------
// ✅ SCHEMA
// -------------------
    const productSchema = z.object({
      name: z.string().min(1, "Name required"),
      description: z.string().min(1, "Description required"),
      categories: z.string().min(1, "Category required"),
      price: z.string().min(1, "Price required"),
      productImage: optionalFileList.optional(),
    })satisfies z.ZodType<CREATE_PRODUCT_REQUEST>
    
    const { handleSubmit, register, reset, setValue, formState: { errors, touchedFields } } = useForm<CREATE_PRODUCT_REQUEST>({
      defaultValues: {
        name: "",
        description: "",
        categories: "",
        productImage: undefined,
        price: "",
      },
      resolver: zodResolver(productSchema)
    })

  // -------------------
  // SUBMIT
  // -------------------

    const handleProduct = async (data: CREATE_PRODUCT_REQUEST) => {
      try {
        const fd = new FormData()
  
        fd.append("name", data.name)
        fd.append("description", data.description)
        fd.append("categories", data.categories)
        fd.append("price", data.price)
  
  
        const file = data.productImage?.[0]
        if (file) {
          fd.append("productImage", file)
        }
  
        if (edit) {
  
          await updateProduct({
            ...data,
            id: Number(edit),
            body: fd,   // 🔥 USE FormData
          }).unwrap()
  
          reset({
            name: "",
            description: "",
            categories: "",
            productImage: undefined,
            price: "",
          })
  
          setIsOpen(false)
          setEdit(null)
  
          setPreview(null)
          setShowEditImage(false)
  
          if (fileRef.current) {
            fileRef.current.value = ""
          }
  
          toast.success("Project updated successfully 🎉")
          reset()
  
        } else {
          await addProduct(fd).unwrap()
          toast.success("Project created successfully 🎉")
          reset()
        }
  
        setIsOpen(false)
  
  
      } catch (error) {
        console.log(error)
        toast.error("Unable to process request")
      }
    }

// -------------------
// edit 
// -------------------
    const handleEditClick = (data: any) => {
      setEdit(String(data.id))
      setIsOpen(true)
    
      setPreview(data.productImage)
      setShowEditImage(false)
    
      reset({
        name: data.name,
        description: data.description,
        categories: data.categories,
        productImage: undefined,
        price: data.price,
      })
    }

// -------------------
// delete 
// -------------------
    const handleDelete = async ( data: DELETE_PRODUCT_REQUEST ) => {
      try {
        await deleteProduct(data).unwrap()
    
        toast.success("Product deleted successfully 🎉")
      } catch (error) {
        console.log(error)
        toast.error("Unable to delete product")
      }
    }

// -------------------
// useEffect 
// -------------------
    useEffect(() => {
      console.log("FULL RESPONSE =>", data)
    }, [data])


// -------------------
// pagination 
// -------------------
    const [currentPage, setCurrentPage] = useState(1)
    
    const itemsPerPage = 5
    
    const totalPages = Math.ceil(products.length / itemsPerPage)
    
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    
    const paginatedProducts = products.slice(
      startIndex,
      endIndex
    )

  return (
    <>

      {/* ====================================================== */}
      {/* ADD PRODUCT */}
      {/* ====================================================== */}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>

        <DialogTrigger asChild>

          <div className="flex justify-end">

            <Button variant="outline">
              Add Products 👚
            </Button>

          </div>

        </DialogTrigger>


        <DialogContent className="sm:max-w-md">

          {/* <form onSubmit={handleSubmit(handleProduct)} className="space-y-4" > */}
          <form
            onSubmit={handleSubmit(handleProduct)}
          >
            <DialogHeader>

              <DialogTitle>
                 {edit ? "✏️ Update Product" : "🛍️ Add Product"}
              </DialogTitle>

              <DialogDescription>
                Add stylish products to your store with pricing, details, and customer actions.
              </DialogDescription>

            </DialogHeader>


            {/* Product Name */}
            <Field className="mt-5">

              <Label htmlFor="name">
                Product Name
              </Label>

              <Input
                id="name"
                placeholder="Oversized Hoodie"

                {...register("name")}
              />

              <p className="text-sm text-red-500">
                {errors.name?.message}
              </p>

            </Field>


            {/* Price */}
            <Field className="mt-5">

              <Label htmlFor="price">
                Price
              </Label>

              <Input
                id="price"
                type="number"
                placeholder="₹ 1999"

                {...register("price")}
              />

              <p className="text-sm text-red-500">
                {errors.price?.message}
              </p>

            </Field>

            {/* Category */}
            <Field className="mt-5">
              <Label htmlFor="categories">
                Category
              </Label>
            
              <Select
                onValueChange={(value) => {
                  setValue("categories", value, {
                    shouldValidate: true,
                  })
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
            
                <SelectContent>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                  <SelectItem value="kids">Kids</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            
              <p className="text-sm text-red-500">
                {errors.categories?.message}
              </p>
            </Field>


            {/* Description */}
            <Field className="mt-5">

              <Label htmlFor="description">
                Description
              </Label>

              <textarea
                id="description"

                placeholder="Write product description..."

                className="min-h-24 w-full rounded-md border p-3 text-sm outline-none"

                {...register(
                  "description"
                )}
              />

              <p className="text-sm text-red-500">
                {
                  errors.description
                    ?.message
                }
              </p>

            </Field>


            {/* Product Image */}
            <Field className="mt-5">

              <Label htmlFor="productImage">
                Product Image
              </Label>

              <Input
                id="productImage"

                type="file"

                // accept="image/*"

                {...register(
                  "productImage"
                )}
              />

            </Field>


<DialogFooter className="my-5">
  <DialogClose asChild>
    <Button
      type="button"
      variant="outline"
    >
      Cancel
    </Button>
  </DialogClose>

  <Button
    type="submit"
    disabled={isLoading}
  >
    {isLoading
      ? edit
        ? "Updating..."
        : "Adding..."
      : edit
      ? "Update Product ✏️"
      : "Add Product 👚"}
  </Button>
</DialogFooter>

          </form>

        </DialogContent>

      </Dialog>


      {/* ====================================================== */}
      {/* PRODUCTS */}
      {/* ====================================================== */}

      {/* <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

        {
          data?.result?.map(
            (item) => (

              <div
                key={item.id}
                className="overflow-hidden rounded-xl border bg-white shadow-sm"
              >

                <img
                  src={item.productImage}
                  alt={item.name}
                  className="h-60 w-full object-cover"
                />

                <div className="space-y-2 p-4">

                  <h2 className="text-lg font-semibold">
                    {item.name}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>

                  <p className="font-bold">
                    ₹ {item.price}
                  </p>

                  <Button className="w-full">
                    Buy Now
                  </Button>

                </div>

              </div>
            )
          )
        }

      </div> */}


      {/* ====================================================== */}
      {/* PRODUCTS */}
      {/* ====================================================== */}

      <div className="mt-8 overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
  
          <TableBody>
            {products.length > 0 ? (
              // products.map((item: any) => (
              paginatedProducts.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <img
                      src={item.productImage}
                      alt={item.name}
                      className="h-16 w-16 rounded-md object-cover"
                    />
                  </TableCell>
          
                  <TableCell className="font-medium">
                    {item.name}
                  </TableCell>
          
                  <TableCell className="max-w-xs truncate">
                    {item.description}
                  </TableCell>
          
                  <TableCell>
                    ₹ {item.price}
                  </TableCell>
          
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </Button>
          
                      <Button
                        size="sm"
                        variant="destructive"
                         onClick={() => handleDelete({id: item.id})}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
          <TableRow>
            <TableCell
              colSpan={5}
              className="py-10"
            >
              <div className="flex flex-col items-center justify-center gap-3">
                <img
                  src="/aww.png"
                  alt="No Products"
                  width={200}
                />
          
                <p className="text-lg font-medium text-muted-foreground">
                  ❌ No Products Found. Please Add One
                </p>
              </div>
            </TableCell>
          </TableRow>
            )}
          </TableBody>
        </Table>
  
  
      </div>


      {/* ====================================================== */}
      {/* Pagination */}
      {/* ====================================================== */}

      {products.length > 0 && (
        <div className="flex items-center justify-between p-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage((prev) => prev - 1)
            }
          >
            Previous
          </Button>
      
          <div className="flex items-center gap-2">
            {Array.from(
              { length: totalPages },
              (_, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={
                    currentPage === index + 1
                      ? "default"
                      : "outline"
                  }
                  onClick={() =>
                    setCurrentPage(index + 1)
                  }
                >
                  {index + 1}
                </Button>
              )
            )}
          </div>
      
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => prev + 1)
            }
          >
            Next
          </Button>
        </div>
      )}      


    </>
  )
}

export default Page