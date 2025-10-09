import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit, Trash2, Mail, Users, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';

function Organizations() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingOrganization, setEditingOrganization] = useState(null);
  const [formData, setFormData] = useState({
    orgName: '',
    orgEmail: ''
  });

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/organizations');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Failed to fetch organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrganization) {
        await api.put(`/organizations/${editingOrganization.orgId}`, formData);
        toast.success('Organization updated successfully');
      } else {
        await api.post('/organizations', formData);
        toast.success('Organization created successfully');
      }
      setShowModal(false);
      setEditingOrganization(null);
      resetForm();
      fetchOrganizations();
    } catch (error) {
      console.error('Error saving organization:', error);
      toast.error('Failed to save organization');
    }
  };

  const handleEdit = (organization) => {
    setEditingOrganization(organization);
    setFormData({
      orgName: organization.orgName || '',
      orgEmail: organization.orgEmail || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (orgId) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await api.delete(`/organizations/${orgId}`);
        toast.success('Organization deleted successfully');
        fetchOrganizations();
      } catch (error) {
        console.error('Error deleting organization:', error);
        toast.error('Failed to delete organization');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      orgName: '',
      orgEmail: ''
    });
  };

  const filteredOrganizations = organizations.filter(organization =>
    organization.orgName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    organization.orgEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl shadow-lg">
            <Building2 className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text">Organizations</h1>
            <p className="text-gray-600">Manage organizations and their settings</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn p-3 btn-primary hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Organization
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Organizations List */}
      <div className="grid gap-4">
        {filteredOrganizations.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <Building2 className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No organizations found</h3>
              <p className="text-secondary-600 mb-4">
                {searchTerm ? 'No organizations match your search criteria.' : 'Get started by creating your first organization.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Organization
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredOrganizations.map((organization) => (
            <div key={organization.orgId} className="card hover:shadow-md transition-shadow">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {organization.orgName}
                      </h3>
                    </div>
                    
                    <div className="space-y-1 text-sm text-secondary-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span>{organization.orgEmail}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-secondary-500 mt-2">
                      Created: {formatDate(organization.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(organization)}
                      className="btn btn-sm btn-secondary"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(organization.orgId)}
                      className="btn btn-sm btn-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-secondary-900">
                {editingOrganization ? 'Edit Organization' : 'Add New Organization'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingOrganization(null);
                  resetForm();
                }}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.orgName}
                  onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                  className="input"
                  placeholder="Enter organization name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Organization Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.orgEmail}
                  onChange={(e) => setFormData({...formData, orgEmail: e.target.value})}
                  className="input"
                  placeholder="Enter organization email"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingOrganization(null);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {editingOrganization ? 'Update Organization' : 'Create Organization'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Organizations;