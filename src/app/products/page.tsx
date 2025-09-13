"use client";

import { useCreateProductMutation, useGetProductsQuery, useDeleteProductMutation, useUpdateProductMutation } from "@/state/api";
import { PlusCircleIcon, SearchIcon, Trash2, Edit3, Package, Banknote, Hash, Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Rating from "@/app/(components)/Rating";
import CreateProductModal from "./CreateProductModal";
import UpdateProductModal from "./UpdateProductModal";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const {
    data: products,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const handleCreateProduct = async (productData: ProductFormData) => {
    try {
      await createProduct(productData);
      toast.success("Product created successfully!", {
        description: `${productData.name} has been added to your inventory.`,
      });
    } catch (error) {
      toast.error("Failed to create product", {
        description: "Please try again later.",
      });
    }
  };

  const handleUpdateProduct = async (productId: string, productData: ProductFormData) => {
    try {
      await updateProduct({ id: productId, updates: productData });
      toast.success("Product updated successfully!", {
        description: `${productData.name} has been updated in your inventory.`,
      });
    } catch (error) {
      toast.error("Failed to update product", {
        description: "Please try again later.",
      });
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully!", {
        description: `${productName} has been removed from your inventory.`,
      });
    } catch (error) {
      toast.error("Failed to delete product", {
        description: "Please try again later.",
      });
    }
  };

  const handleEditClick = (product: any) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError || !products) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="p-4 bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Package className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load products</h3>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Products</h1>
              <p className="text-gray-600 mt-1">Manage your inventory products</p>
            </div>
            <button
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={() => setIsModalOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              Create Product
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? "Try adjusting your search terms." : "Get started by creating your first product."}
            </p>
            {!searchTerm && (
              <button
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                onClick={() => setIsModalOpen(true)}
              >
                <PlusCircleIcon className="w-4 h-4 mr-2" />
                Create Product
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.productId}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
              >
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Edit product"
                        onClick={() => handleEditClick(product)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Delete product"
                        onClick={() => handleDeleteProduct(product.productId, product.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                </div>

                <div className="px-6 pb-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <Banknote className="w-4 h-4 text-green-600" />
                    <span className="text-2xl font-bold text-gray-900">
                      {product.price.toFixed(2)} RWF
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {product.stockQuantity} in stock
                    </span>
                  </div>

                  {product.rating && product.rating > 0 && (
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <div className="flex items-center">
                        <Rating rating={product.rating} />
                        <span className="ml-2 text-sm text-gray-600">
                          ({product.rating.toFixed(1)})
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-6 pb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        product.stockQuantity > 10
                          ? "bg-green-500"
                          : product.stockQuantity > 5
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min((product.stockQuantity / 20) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {product.stockQuantity > 10
                      ? "In Stock"
                      : product.stockQuantity > 5
                      ? "Low Stock"
                      : "Out of Stock"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        <CreateProductModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProduct}
        />
        <UpdateProductModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedProduct(null);
          }}
          onUpdate={handleUpdateProduct}
          product={selectedProduct}
        />
      </div>
    </div>
  );
};

export default Products;
