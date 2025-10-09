import React, { useState, useEffect } from 'react';
import { HandHeart, Plus, Search, Edit, Trash2, Eye, DollarSign, Calendar, Target, X, IndianRupee } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';

function Deals() {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({
    dealName: '',
    description: '',
    dealValue: '',
    dealStage: '',
    expectedCloseDate: '',
    actualCloseDate: '',
    probability: '',
    accountId: '',
    contactId: ''
  });

  const dealStages = [
    'Prospecting',
    'Qualification',
    'Proposal',
    'Negotiation',
    'Closed Won',
    'Closed Lost'
  ];

  const probabilityOptions = [
    '10%',
    '25%',
    '50%',
    '75%',
    '90%',
    '100%'
  ];

  useEffect(() => {
    fetchDeals();
    fetchAccounts();
    fetchContacts();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/deals');
      setDeals(response.data);
    } catch (error) {
      console.error('Error fetching deals:', error);
      toast.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await api.get('/accounts');
      setAccounts(response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dealData = {
        ...formData,
        title: formData.dealName,
        dealValue: formData.dealValue ? parseFloat(formData.dealValue) : 0,
        expectedCloseDate: formData.expectedCloseDate ? new Date(formData.expectedCloseDate).toISOString() : null,
        actualCloseDate: formData.actualCloseDate ? new Date(formData.actualCloseDate).toISOString() : null,
        accountId: formData.accountId ? parseInt(formData.accountId) : null,
        contactId: formData.contactId ? parseInt(formData.contactId) : null
      };

      if (editingDeal) {
        await api.put(`/deals/${editingDeal.dealId}`, dealData);
        toast.success('Deal updated successfully');
      } else {
        await api.post('/deals', dealData);
        toast.success('Deal created successfully');
      }
      setShowModal(false);
      setEditingDeal(null);
      resetForm();
      fetchDeals();
    } catch (error) {
      const backendMessage = typeof error.response?.data === 'string'
        ? error.response.data
        : (error.response?.data?.message || error.response?.data?.error || 'Invalid input, please check date format');
      console.error('Error saving deal:', backendMessage);
      toast.error(backendMessage);
    }
  };

  const handleEdit = (deal) => {
    setEditingDeal(deal);
    setFormData({
      dealName: deal.dealName || '',
      description: deal.description || '',
      dealValue: deal.dealValue?.toString() || '',
      dealStage: deal.dealStage || '',
      expectedCloseDate: deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toISOString().split('T')[0] : '',
      actualCloseDate: deal.actualCloseDate ? new Date(deal.actualCloseDate).toISOString().split('T')[0] : '',
      probability: deal.probability || '',
      accountId: deal.accountId?.toString() || '',
      contactId: deal.contactId?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await api.delete(`/deals/${dealId}`);
        toast.success('Deal deleted successfully');
        fetchDeals();
      } catch (error) {
        console.error('Error deleting deal:', error);
        toast.error('Failed to delete deal');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      dealName: '',
      description: '',
      dealValue: '',
      dealStage: '',
      expectedCloseDate: '',
      actualCloseDate: '',
      probability: '',
      accountId: '',
      contactId: ''
    });
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.dealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = !stageFilter || deal.dealStage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage) => {
    const colors = {
      'Prospecting': 'bg-blue-100 text-blue-800',
      'Qualification': 'bg-yellow-100 text-yellow-800',
      'Proposal': 'bg-orange-100 text-orange-800',
      'Negotiation': 'bg-purple-100 text-purple-800',
      'Closed Won': 'bg-green-100 text-green-800',
      'Closed Lost': 'bg-red-100 text-red-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

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
            <HandHeart className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text">Deals</h1>
            <p className="text-gray-600">Manage your sales opportunities</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary btn-lg hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Deal
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="input"
            >
              <option value="">All Stages</option>
              {dealStages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Deals List */}
      <div className="grid gap-4">
        {filteredDeals.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <HandHeart className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No deals found</h3>
              <p className="text-secondary-600 mb-4">
                {searchTerm || stageFilter ? 'No deals match your search criteria.' : 'Get started by creating your first deal.'}
              </p>
              {!searchTerm && !stageFilter && (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Deal
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredDeals.map((deal) => (
            <div key={deal.dealId} className="card hover:shadow-md transition-shadow">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {deal.dealName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStageColor(deal.dealStage)}`}>
                        {deal.dealStage}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-secondary-600">
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="h-4 w-4" />
                        <span className="font-medium">{formatCurrency(deal.dealValue)}</span>
                      </div>
                      
                      {deal.expectedCloseDate && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>Expected: {formatDate(deal.expectedCloseDate)}</span>
                        </div>
                      )}
                      
                      {deal.probability && (
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4" />
                          <span>{deal.probability} probability</span>
                        </div>
                      )}
                    </div>
                    
                    {deal.description && (
                      <p className="text-sm text-secondary-600 mt-2 line-clamp-2">
                        {deal.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(deal)}
                      className="btn btn-sm btn-secondary"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(deal.dealId)}
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
                {editingDeal ? 'Edit Deal' : 'Add New Deal'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingDeal(null);
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
                    Deal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dealName}
                    onChange={(e) => setFormData({...formData, dealName: e.target.value})}
                    className="input"
                    placeholder="Enter deal name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Deal Value *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.dealValue}
                    onChange={(e) => setFormData({...formData, dealValue: e.target.value})}
                    className="input"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Deal Stage *
                  </label>
                  <select
                    required
                    value={formData.dealStage}
                    onChange={(e) => setFormData({...formData, dealStage: e.target.value})}
                    className="input"
                  >
                    <option value="">Select stage</option>
                    {dealStages.map(stage => (
                      <option key={stage} value={stage}>{stage}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Probability
                  </label>
                  <select
                    value={formData.probability}
                    onChange={(e) => setFormData({...formData, probability: e.target.value})}
                    className="input"
                  >
                    <option value="">Select probability</option>
                    {probabilityOptions.map(prob => (
                      <option key={prob} value={prob}>{prob}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Expected Close Date
                  </label>
                  <input
                    type="date"
                    value={formData.expectedCloseDate}
                    onChange={(e) => setFormData({...formData, expectedCloseDate: e.target.value})}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Actual Close Date
                  </label>
                  <input
                    type="date"
                    value={formData.actualCloseDate}
                    onChange={(e) => setFormData({...formData, actualCloseDate: e.target.value})}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Account
                  </label>
                  <select
                    value={formData.accountId}
                    onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                    className="input"
                  >
                    <option value="">Select account</option>
                    {accounts.map(account => (
                      <option key={account.accountId} value={account.accountId}>
                        {account.accountName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Contact
                  </label>
                  <select
                    value={formData.contactId}
                    onChange={(e) => setFormData({...formData, contactId: e.target.value})}
                    className="input"
                  >
                    <option value="">Select contact</option>
                    {contacts.map(contact => (
                      <option key={contact.contactId} value={contact.contactId}>
                        {contact.contactName}
                      </option>
                    ))}
                  </select>
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
                  placeholder="Enter deal description"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingDeal(null);
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
                  {editingDeal ? 'Update Deal' : 'Create Deal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Deals;