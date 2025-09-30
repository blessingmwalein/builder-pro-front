'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppSelector } from '@/lib/hooks';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function BudgetOverview() {
  const { categories, items } = useAppSelector((state) => state.budget);

  // Calculate total budget by category
  const budgetData = categories.map((category, index) => {
    const categoryItems = items.filter(item => item.category_id === category.id);
    const total = categoryItems.reduce((sum, item) => sum + item.total_price, 0);
    
    return {
      name: category.name,
      value: total,
      color: COLORS[index % COLORS.length],
    };
  });

  const totalBudget = budgetData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Budget']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Total Budget</h4>
              <p className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
            </div>

            <div className="space-y-3">
              {budgetData.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {category.name}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    ${category.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




