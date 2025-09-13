import React, { ChangeEvent, FormEvent, useState } from "react";
import { X, ShoppingCart, Package, User, Hash, Banknote } from "lucide-react";
import { Product } from "@/state/api";

type SaleFormData = {
  productId: string;
  quantity: number;
  customerName: string;
};

type CreateSaleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSale: (formData: SaleFormData) => void;
  products: Product[];
};

const CreateSaleModal = ({
  isOpen,
  onClose,
  onSale,
  products,
}: CreateSaleModalProps) => {
  const [formData, setFormData] = useState<SaleFormData>({
    productId: "",
    quantity: 1,
    customerName: "",
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "productId") {
      const product = products.find(p => p.productId === value);
      setSelectedProduct(product || null);
    }
    
    setFormData({
      ...formData,
      [name]: name === "quantity" ? parseInt(value) || 1 : value,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      return;
    }

    if (selectedProduct.stockQuantity < formData.quantity) {
      return;
    }

    onSale(formData);
    setFormData({
      productId: "",
      quantity: 1,
      customerName: "",
    });
    setSelectedProduct(null);
    onClose();
  };

  const handleClose = () => {
    setFormData({
      productId: "",
      quantity: 1,
      customerName: "",
    });
    setSelectedProduct(null);
    onClose();
  };

  const totalAmount = selectedProduct ? selectedProduct.price * formData.quantity : 0;
  const isInsufficientStock = selectedProduct && selectedProduct.stockQuantity < formData.quantity;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Create New Sale</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label htmlFor="productId" className="block text-sm font-medium text-gray-700">
              Select Product
            </label>
            <div className="relative">
              <select
                name="productId"
                id="productId"
                value={formData.productId}
                onChange={handleChange}
                className="w-full px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              >
                <option value="">Choose a product...</option>
                {products.map((product) => (
                  <option key={product.productId} value={product.productId}>
                    {product.name} - {product.stockQuantity} in stock - {product.price.toFixed(2)} RWF
                  </option>
                ))}
              </select>
              <Package className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="customerName"
                id="customerName"
                placeholder="Enter customer name"
                onChange={handleChange}
                value={formData.customerName}
                className="w-full px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <div className="relative">
              <input
                type="number"
                name="quantity"
                id="quantity"
                placeholder="1"
                min="1"
                max={selectedProduct?.stockQuantity || 999}
                onChange={handleChange}
                value={formData.quantity}
                className="w-full px-4 py-3 pl-12 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                required
              />
              <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {selectedProduct && (
              <p className="text-sm text-gray-500">
                Available: {selectedProduct.stockQuantity} units
              </p>
            )}
          </div>

          {selectedProduct && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="font-medium text-gray-900">Sale Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="font-medium">{selectedProduct.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Price:</span>
                  <span className="font-medium">{selectedProduct.price.toFixed(2)} RWF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{formData.quantity}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <div className="flex items-center space-x-2">
                      <Banknote className="w-5 h-5 text-green-600" />
                      <span className="text-xl font-bold text-green-600">
                        {totalAmount.toFixed(2)} RWF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isInsufficientStock && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-800 font-medium">Insufficient Stock</span>
              </div>
              <p className="text-red-700 text-sm mt-1">
                Only {selectedProduct?.stockQuantity} units available. Please reduce quantity.
              </p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedProduct || isInsufficientStock || !formData.customerName}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Process Sale
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSaleModal;
