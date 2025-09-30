'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProjectChart } from '@/components/dashboard/ProjectChart';
import {
  ChartBarIcon,
  LightBulbIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TrendingUpIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const performanceData = [
  { month: 'Jan', efficiency: 78, budget: 85, timeline: 82 },
  { month: 'Feb', efficiency: 82, budget: 78, timeline: 85 },
  { month: 'Mar', efficiency: 85, budget: 88, timeline: 87 },
  { month: 'Apr', efficiency: 88, budget: 82, timeline: 90 },
  { month: 'May', efficiency: 92, budget: 90, timeline: 88 },
  { month: 'Jun', efficiency: 89, budget: 92, timeline: 91 },
];

const costSavingsData = [
  { month: 'Jan', savings: 2500 },
  { month: 'Feb', savings: 3200 },
  { month: 'Mar', savings: 4100 },
  { month: 'Apr', savings: 3800 },
  { month: 'May', savings: 5200 },
  { month: 'Jun', savings: 6100 },
];

const aiInsights = [
  {
    id: 1,
    type: 'cost_saving',
    title: 'Material Procurement Optimization',
    description: 'Switching to bulk purchasing for concrete could save $12,500 over the next quarter.',
    confidence: 92,
    priority: 'high',
    savings: 12500,
  },
  {
    id: 2,
    type: 'efficiency',
    title: 'Task Scheduling Improvement',
    description: 'Reordering electrical and plumbing tasks could reduce project timeline by 8 days.',
    confidence: 87,
    priority: 'medium',
    savings: 8000,
  },
  {
    id: 3,
    type: 'risk',
    title: 'Weather Impact Alert',
    description: 'Upcoming weather patterns may delay outdoor work. Consider rescheduling concrete pour.',
    confidence: 78,
    priority: 'high',
  },
  {
    id: 4,
    type: 'recommendation',
    title: 'Resource Allocation',
    description: 'Current team distribution shows Site B is underutilized. Consider redistributing workers.',
    confidence: 85,
    priority: 'low',
  },
];

const priorityColors = {
  high: 'border-red-200 bg-red-50',
  medium: 'border-yellow-200 bg-yellow-50',
  low: 'border-green-200 bg-green-50',
};

const typeIcons = {
  cost_saving: CurrencyDollarIcon,
  efficiency: TrendingUpIcon,
  risk: ExclamationTriangleIcon,
  recommendation: LightBulbIcon,
};

export default function AnalyticsPage() {
  const stats = [
    {
      title: 'Project Efficiency',
      value: '89%',
      icon: ChartBarIcon,
      color: 'blue' as const,
      trend: { value: 5, label: 'from last month', isPositive: true },
    },
    {
      title: 'Cost Savings',
      value: '$24,800',
      icon: CurrencyDollarIcon,
      color: 'green' as const,
      trend: { value: 12, label: 'this quarter', isPositive: true },
    },
    {
      title: 'On-Time Delivery',
      value: '91%',
      icon: CheckCircleIcon,
      color: 'yellow' as const,
      trend: { value: 3, label: 'improvement', isPositive: true },
    },
    {
      title: 'AI Insights',
      value: aiInsights.length,
      icon: LightBulbIcon,
      color: 'red' as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics & AI Insights</h1>
          <p className="mt-2 text-gray-600">
            Data-driven insights to optimize your project performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Trends */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="efficiency" stroke="#3B82F6" name="Efficiency %" />
                    <Line type="monotone" dataKey="budget" stroke="#10B981" name="Budget %" />
                    <Line type="monotone" dataKey="timeline" stroke="#F59E0B" name="Timeline %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Cost Savings */}
          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cost Savings</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={costSavingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, 'Savings']} />
                    <Area type="monotone" dataKey="savings" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Project Overview Chart */}
        <div className="mb-8">
          <ProjectChart />
        </div>

        {/* AI Insights */}
        <div className="card">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h3>
              <div className="text-sm text-gray-500">
                Based on project data and industry benchmarks
              </div>
            </div>

            <div className="space-y-4">
              {aiInsights.map((insight) => {
                const Icon = typeIcons[insight.type as keyof typeof typeIcons];
                
                return (
                  <div
                    key={insight.id}
                    className={`border rounded-lg p-4 ${priorityColors[insight.priority as keyof typeof priorityColors]}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-gray-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-gray-900">
                            {insight.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {insight.savings && (
                              <span className="text-sm font-medium text-green-600">
                                ${insight.savings.toLocaleString()} savings
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {insight.confidence}% confidence
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">
                          {insight.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                              insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {insight.priority} priority
                            </span>
                            
                            <span className="text-xs text-gray-500 capitalize">
                              {insight.type.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}




