import React from "react";
import { X, Receipt, Clock, Hash, User, Package, Banknote, CheckCircle } from "lucide-react";
import { Sale } from "@/state/api";

type ReceiptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
};

const ReceiptModal = ({ isOpen, onClose, sale }: ReceiptModalProps) => {
  if (!isOpen || !sale) return null;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const generateTransactionId = (saleId: string) => {
    return `TXN-${saleId.slice(-8).toUpperCase()}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Sale Receipt</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sale Successful!</h3>
            <p className="text-gray-600">Your transaction has been processed</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Transaction ID:</span>
                </div>
                <span className="font-mono text-sm font-medium">
                  {generateTransactionId(sale.saleId)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Date & Time:</span>
                </div>
                <span className="text-sm font-medium">
                  {formatDate(sale.timestamp)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Customer:</span>
                </div>
                <span className="text-sm font-medium">
                  {sale.customerName || 'N/A'}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Product Details</span>
              </h4>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Product Name:</span>
                  <span className="font-medium">{sale.productName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit Price:</span>
                  <span className="font-medium">{sale.unitPrice.toFixed(2)} RWF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-medium">{sale.quantity}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Banknote className="w-5 h-5 text-blue-600" />
                <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">
                {sale.totalAmount.toFixed(2)} RWF
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Thank you for your business!
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Keep this receipt for your records
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Close Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
