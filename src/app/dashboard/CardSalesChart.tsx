import React, { useMemo } from "react";
import { useGetSalesQuery } from "@/state/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CardSalesChart = () => {
  const { data: sales, isLoading, isError } = useGetSalesQuery();

  const salesData = useMemo(() => {
    if (!sales || sales.length === 0) return [];

    // Group sales by date
    const salesByDate = sales.reduce((acc: any, sale) => {
      const date = new Date(sale.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      if (!acc[date]) {
        acc[date] = {
          date,
          totalAmount: 0,
          transactions: 0
        };
      }
      
      acc[date].totalAmount += sale.totalAmount;
      acc[date].transactions += 1;
      
      return acc;
    }, {});

    // Convert to array and sort by date
    return Object.values(salesByDate)
      .sort((a: any, b: any) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(-7); // Show last 7 days
  }, [sales]);

  const totalValue = sales?.reduce((sum, sale) => sum + sale.totalAmount, 0) || 0;
  const averageDaily = salesData.length > 0 
    ? salesData.reduce((sum: number, day: any) => sum + day.totalAmount, 0) / salesData.length 
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !sales) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Failed to load sales data</p>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mb-4 flex items-center justify-center">
          <BarChart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No sales data</h3>
        <p className="text-gray-600">Start making sales to see your performance</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-medium text-gray-900">
            {totalValue.toFixed(2)} RWF
          </p>
          <p className="text-sm text-gray-500">Total Sales</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-medium text-gray-900">
            {averageDaily.toFixed(2)} RWF
          </p>
          <p className="text-sm text-gray-500">Daily Average</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={salesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${value.toFixed(0)}`}
            />
            <Tooltip 
              formatter={(value: any, name: string) => [
                `${value.toFixed(2)} RWF`, 
                name === 'totalAmount' ? 'Sales' : 'Transactions'
              ]}
              labelStyle={{ color: '#374151' }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="totalAmount" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CardSalesChart;
