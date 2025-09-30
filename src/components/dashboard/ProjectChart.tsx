'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', completed: 4, inProgress: 8, planned: 3 },
  { name: 'Feb', completed: 6, inProgress: 6, planned: 5 },
  { name: 'Mar', completed: 8, inProgress: 4, planned: 7 },
  { name: 'Apr', completed: 5, inProgress: 9, planned: 4 },
  { name: 'May', completed: 7, inProgress: 7, planned: 6 },
  { name: 'Jun', completed: 9, inProgress: 5, planned: 8 },
];

export function ProjectChart() {
  return (
    <div className="card">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Overview</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10B981" name="Completed" />
              <Bar dataKey="inProgress" fill="#3B82F6" name="In Progress" />
              <Bar dataKey="planned" fill="#F59E0B" name="Planned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}




