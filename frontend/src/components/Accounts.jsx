import React, { useState, useEffect } from 'react';
import { Building2, Plus, Search, Edit, Trash2, Eye, Mail, Phone, Globe, MapPin, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';

function Accounts() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    industry: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAccount) {
        await api.put(`/accounts/${editingAccount.accountId}`, formData);
        toast.success('Account updated successfully');
      } else {
        await api.post('/accounts', formData);
        toast.success('Account created successfully');
      }
      setShowModal(false);
      setEditingAccount(null);
      resetForm();
      fetchAccounts();
    } catch (error) {
      console.error('Error saving account:', error);
      toast.error('Failed to save account');
    }
  };

  const handleEdit = (account) => {
    setEditingAccount(account);
    setFormData({
      accountName: account.accountName || '',
      email: account.email || '',
      phone: account.phone || '',
      website: account.website || '',
      description: account.description || '',
      industry: account.industry || '',
      address: account.address || '',
      city: account.city || '',
      state: account.state || '',
      postalCode: account.postalCode || '',
      country: account.country || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (accountId) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await api.delete(`/accounts/${accountId}`);
        toast.success('Account deleted successfully');
        fetchAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      accountName: '',
      email: '',
      phone: '',
      website: '',
      description: '',
      industry: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    });
  };

  const filteredAccounts = accounts.filter(account =>
    account.accountName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold text-text">Accounts</h1>
            <p className="text-gray-600">Manage your customer accounts</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card hover:shadow-xl transition-all duration-300">
        <div className="card-content">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Accounts List */}
      <div className="grid gap-4">
        {filteredAccounts.length === 0 ? (
          <div className="card hover:shadow-xl transition-all duration-300">
            <div className="card-content text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text mb-2">No accounts found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'No accounts match your search criteria.' : 'Get started by creating your first account.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary hover:scale-105 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Account
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredAccounts.map((account) => (
            <div key={account.accountId} className="card hover:shadow-xl transition-all duration-300 hover:scale-102">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-text">
                        {account.accountName}
                      </h3>
                      {account.industry && (
                        <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 rounded-full shadow-sm">
                          {account.industry}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      {account.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4" />
                          <span>{account.email}</span>
                        </div>
                      )}
                      {account.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4" />
                          <span>{account.phone}</span>
                        </div>
                      )}
                      {account.website && (
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4" />
                          <a 
                            href={account.website.startsWith('http') ? account.website : `https://${account.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {account.website}
                          </a>
                        </div>
                      )}
                      {(account.address || account.city || account.state) && (
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span>
                            {[account.address, account.city, account.state, account.postalCode]
                              .filter(Boolean)
                              .join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {account.description && (
                      <p className="text-sm text-secondary-600 mt-2 line-clamp-2">
                        {account.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(account)}
                      className="btn btn-sm btn-secondary"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(account.accountId)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-secondary-900">
                {editingAccount ? 'Edit Account' : 'Add New Account'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingAccount(null);
                  resetForm();
                }}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Account Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountName}
                    onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                    className="input"
                    placeholder="Enter account name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="input"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="input"
                    placeholder="Enter website URL"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => setFormData({...formData, industry: e.target.value})}
                    className="input"
                    placeholder="Enter industry"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="input"
                    placeholder="Enter street address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="input"
                    placeholder="Enter city"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="input"
                    placeholder="Enter state"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    className="input"
                    placeholder="Enter postal code"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="input"
                    placeholder="Enter country"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="input"
                  rows={3}
                  placeholder="Enter account description"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingAccount(null);
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
                  {editingAccount ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Accounts;