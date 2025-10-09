import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Edit, Trash2, Clock, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import api from '../services/api.js';
import toast from 'react-hot-toast';

function Activities() {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [formData, setFormData] = useState({
    activityType: '',
    subject: '',
    description: '',
    activityDate: '',
    status: '',
    priority: '',
    accountId: '',
    contactId: '',
    dealId: '',
    leadId: ''
  });

  const activityTypes = [
    'Call',
    'Email',
    'Meeting',
    'Task',
    'Note',
    'Follow-up'
  ];

  const statusOptions = [
    'Not Started',
    'In Progress',
    'Completed',
    'Cancelled'
  ];

  const priorityOptions = [
    'Low',
    'Medium',
    'High',
    'Urgent'
  ];

  useEffect(() => {
    fetchActivities();
    fetchAccounts();
    fetchContacts();
    fetchDeals();
    fetchLeads();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      console.log('Fetching activities...');
      const response = await api.get('/activities');
      setActivities(response.data);
      console.log('Activities fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to fetch activities');
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

  const fetchDeals = async () => {
    try {
      const response = await api.get('/deals');
      setDeals(response.data);
    } catch (error) {
      console.error('Error fetching deals:', error);
    }
  };

  const fetchLeads = async () => {
    try {
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const formatLocalDateTime = (value) => {
    if (!value) return '';
    // value is from <input type="datetime-local">, e.g. "2025-10-08T14:30"
    // Backend expects "yyyy-MM-dd'T'HH:mm:ss" without timezone.
    const hasSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value);
    if (hasSeconds) return value;
    return `${value}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Frontend validation for required fields
      if (!formData.activityType || !formData.subject || !formData.activityDate) {
        toast.error('Please fill Activity Type, Subject and Date');
        return;
      }

      const activityData = {
        // Canonical DTO fields
        activityType: formData.activityType,
        subject: formData.subject,
        description: formData.description || '',
        status: formData.status || '',
        priority: formData.priority || '',
        // Date without timezone
        activityDate: formData.activityDate ? formatLocalDateTime(formData.activityDate) : null,
        accountId: formData.accountId ? parseInt(formData.accountId) : null,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null,
        leadId: formData.leadId ? parseInt(formData.leadId) : null,
        // Aliases for alternate backend schemas (safe to include; DTO uses @JsonAlias)
        type: formData.activityType,
        name: formData.subject
      };

      console.log('Saving activity...', activityData);

      if (editingActivity) {
        await api.put(`/activities/${editingActivity.activityId}`, activityData);
        toast.success('Activity updated successfully');
        console.log('Activity updated successfully!');
      } else {
        await api.post('/activities', activityData);
        toast.success('Activity created successfully');
        console.log('Activity created successfully!');
      }
      setShowModal(false);
      setEditingActivity(null);
      resetForm();
      await fetchActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
      toast.error('Failed to save activity');
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setFormData({
      activityType: activity.activityType || '',
      subject: activity.subject || '',
      description: activity.description || '',
      // Convert to input-friendly "yyyy-MM-ddTHH:mm" (no seconds)
      activityDate: activity.activityDate ? new Date(activity.activityDate).toISOString().slice(0,16) : '',
      status: activity.status || '',
      priority: activity.priority || '',
      accountId: activity.accountId?.toString() || '',
      contactId: activity.contactId?.toString() || '',
      dealId: activity.dealId?.toString() || '',
      leadId: activity.leadId?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (activityId) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await api.delete(`/activities/${activityId}`);
        toast.success('Activity deleted successfully');
        fetchActivities();
      } catch (error) {
        console.error('Error deleting activity:', error);
        toast.error('Failed to delete activity');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      activityType: '',
      subject: '',
      description: '',
      activityDate: '',
      status: '',
      priority: '',
      accountId: '',
      contactId: '',
      dealId: '',
      leadId: ''
    });
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || activity.activityType === typeFilter;
    const matchesStatus = !statusFilter || activity.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Cancelled':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-gray-100 text-gray-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'High': 'bg-orange-100 text-orange-800',
      'Urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
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
            <Calendar className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text">Activities</h1>
            <p className="text-gray-600">Manage your tasks and activities</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary p-3 hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
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
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input"
            >
              <option value="">All Types</option>
              {activityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="">All Status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Activities List */}
      <div className="grid gap-4">
        {filteredActivities.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <Calendar className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No activities found</h3>
              <p className="text-secondary-600 mb-4">
                {searchTerm || typeFilter || statusFilter ? 'No activities match your search criteria.' : 'Get started by creating your first activity.'}
              </p>
              {!searchTerm && !typeFilter && !statusFilter && (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary p-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </button>
              )}
            </div>
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div key={activity.activityId} className="card hover:shadow-md transition-shadow">
              <div className="card-content">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {activity.subject}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                        {activity.activityType}
                      </span>
                      {activity.priority && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(activity.priority)}`}>
                          {activity.priority}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(activity.status)}
                        <span>{activity.status || 'Not Started'}</span>
                      </div>
                      
                      {activity.activityDate && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatDateTime(activity.activityDate)}</span>
                        </div>
                      )}
                    </div>
                    
                    {activity.description && (
                      <p className="text-sm text-secondary-600 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(activity)}
                      className="btn btn-sm btn-secondary"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(activity.activityId)}
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
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingActivity(null);
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
                    Activity Type *
                  </label>
                  <select
                    required
                    value={formData.activityType}
                    onChange={(e) => setFormData({...formData, activityType: e.target.value})}
                    className="input"
                  >
                    <option value="">Select type</option>
                    {activityTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="input"
                    placeholder="Enter activity subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Activity Date *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.activityDate}
                    onChange={(e) => setFormData({...formData, activityDate: e.target.value})}
                    className="input"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="input"
                  >
                    <option value="">Select status</option>
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="input"
                  >
                    <option value="">Select priority</option>
                    {priorityOptions.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </select>
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
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Deal
                  </label>
                  <select
                    value={formData.dealId}
                    onChange={(e) => setFormData({...formData, dealId: e.target.value})}
                    className="input"
                  >
                    <option value="">Select deal</option>
                    {deals.map(deal => (
                      <option key={deal.dealId} value={deal.dealId}>
                        {deal.dealName}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Lead
                  </label>
                  <select
                    value={formData.leadId}
                    onChange={(e) => setFormData({...formData, leadId: e.target.value})}
                    className="input"
                  >
                    <option value="">Select lead</option>
                    {leads.map(lead => (
                      <option key={lead.leadId} value={lead.leadId}>
                        {lead.leadName}
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
                  placeholder="Enter activity description"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingActivity(null);
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
                  {editingActivity ? 'Update Activity' : 'Create Activity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activities;