import React from 'react';
import { Building } from 'lucide-react';

function Organizations() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Building className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Organizations</h1>
          <p className="text-secondary-600">Manage organizations</p>
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h3 className="card-title">Organizations Management</h3>
          <p className="card-description">Organizations management will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}

export default Organizations;