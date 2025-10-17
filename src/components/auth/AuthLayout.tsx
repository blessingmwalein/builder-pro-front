import React from 'react';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="flex flex-col justify-center px-12 py-24">
          <div className="flex items-center mb-8">
            <BuildingOfficeIcon className="h-12 w-12 mr-4" />
            <h1 className="text-3xl font-bold">Builder Pro</h1>
          </div>
          <h2 className="text-xl font-semibold mb-4">
            Streamline Your Construction Projects
          </h2>
          <p className="text-blue-100 text-lg leading-relaxed mb-8">
            Manage projects, track progress, control budgets, and collaborate with your team 
            all in one powerful platform designed for construction professionals.
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
              <span>Project Management & Task Tracking</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
              <span>Budget Control & Expense Management</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
              <span>Daily Logs & Inspection Tracking</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
              <span>Team Collaboration & Communication</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="mx-auto w-full  lg:w-96 mt-8">
          
          
          {/* <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
            {subtitle && (
              <p className="text-gray-600 mb-8">{subtitle}</p>
            )}
          </div> */}

          {children}
        </div>
      </div>
    </div>
  );
}


