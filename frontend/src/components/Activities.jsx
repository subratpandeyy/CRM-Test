import React from 'react';
import { Activity } from 'lucide-react';

function Activities() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Activity className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Activities</h1>
          <p className="text-secondary-600">Track your business activities</p>
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h3 className="card-title">Activities Management</h3>
          <p className="card-description">Activities management will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}

export default Activities;