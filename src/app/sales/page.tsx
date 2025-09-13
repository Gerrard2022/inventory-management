"use client";

import { useGetProductsQuery, useGetSalesQuery, useCreateSaleMutation, Product, Sale } from "@/state/api";
import { PlusCircleIcon, ShoppingCart, Package, Clock, User, Banknote, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CreateSaleModal from "./CreateSaleModal";
import ReceiptModal from "./ReceiptModal";

const Sales = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
  } = useGetProductsQuery();

  const {
    data: sales,
    isLoading: salesLoading,
    isError: salesError,
  } = useGetSalesQuery();

  const [createSale] = useCreateSaleMutation();

  const handleCreateSale = async (saleData: { productId: string; quantity: number; customerName: string }) => {
    try {
      const result = await createSale(saleData);
      if ('data' in result) {
        setSelectedSale(result.data || null);
        setIsReceiptModalOpen(true);
        toast.success("Sale completed successfully!", {
          description: `Transaction processed for ${saleData.customerName}`,
        });
      }
    } catch (error: any) {
      if (error?.data?.message === "Insufficient stock") {
        toast.error("Insufficient Stock", {
          description: `Only ${error.data.availableStock} units available. Please reduce quantity.`,
        });
      } else {
        toast.error("Failed to process sale", {
          description: "Please try again later.",
        });
      }
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalSales = sales?.reduce((sum, sale) => sum + sale.totalAmount, 0) || 0;
  const totalTransactions = sales?.length || 0;

  if (productsLoading || salesLoading) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading sales data...</p>
          </div>
        </div>
    );
  }

  if (productsError || salesError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="p-4 bg-red-50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load data</h3>
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
              <h1 className="text-3xl font-bold text-gray-900">Sales</h1>
              <p className="text-gray-600 mt-1">Manage your sales transactions</p>
            </div>
            <button
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <PlusCircleIcon className="w-5 h-5 mr-2" />
              New Sale
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalSales.toFixed(2)} RWF
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Banknote className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalTransactions}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Available Products</p>
                <p className="text-2xl font-bold text-gray-900">{products?.length || 0}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
            <p className="text-gray-600 mt-1">Latest sales transactions</p>
          </div>

          {sales && sales.length === 0 ? (
            <div className="text-center py-12">
              <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No sales yet</h3>
              <p className="text-gray-600 mb-6">Start by creating your first sale.</p>
              <button
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <PlusCircleIcon className="w-4 h-4 mr-2" />
                Create Sale
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sales?.map((sale) => (
                <div key={sale.saleId} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <ShoppingCart className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{sale.productName || 'Unknown Product'}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <User className="w-4 h-4" />
                            <span>{sale.customerName || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(sale.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {sale.totalAmount.toFixed(2)} RWF
                      </p>
                      <p className="text-sm text-gray-500">
                        {sale.quantity} × {sale.unitPrice.toFixed(2)} RWF
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <CreateSaleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSale={handleCreateSale}
          products={products || []}
        />
        <ReceiptModal
          isOpen={isReceiptModalOpen}
          onClose={() => {
            setIsReceiptModalOpen(false);
            setSelectedSale(null);
          }}
          sale={selectedSale}
        />
      </div>
    </div>
  );
};

export default Sales;
