import React from 'react';
import { Users } from 'lucide-react';

function Members() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-primary-100 rounded-lg">
          <Users className="h-6 w-6 text-primary-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Members</h1>
          <p className="text-secondary-600">Manage team members</p>
        </div>
      </div>
      <div className="card">
        <div className="card-content">
          <h3 className="card-title">Members Management</h3>
          <p className="card-description">Members management will be implemented here.</p>
        </div>
      </div>
    </div>
  );
}

export default Members;