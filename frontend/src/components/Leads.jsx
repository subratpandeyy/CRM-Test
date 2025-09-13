import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Users, 
  Mail, 
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api.js';

function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    leadName: '',
    leadEmail: '',
    phone: '',
    isVerified: false
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leads');
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingLead) {
        await api.put(`/leads/${editingLead.leadId}`, formData);
        toast.success('Lead updated successfully');
      } else {
        await api.post('/leads', formData);
        toast.success('Lead created successfully');
      }
      
      setShowModal(false);
      setEditingLead(null);
      setFormData({ leadName: '', leadEmail: '', phone: '', isVerified: false });
      fetchLeads();
    } catch (error) {
      toast.error(error.response?.data || 'Failed to save lead');
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setFormData({
      leadName: lead.leadName,
      leadEmail: lead.leadEmail,
      phone: lead.phone || '',
      isVerified: lead.isVerified
    });
    setShowModal(true);
  };

  const handleDelete = async (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${leadId}`);
        toast.success('Lead deleted successfully');
        fetchLeads();
      } catch (error) {
        toast.error('Failed to delete lead');
      }
    }
  };

  const handleStatusChange = async (leadId, isVerified) => {
    try {
      await api.put(`/leads/${leadId}/status?isVerified=${isVerified}`);
      toast.success(`Lead ${isVerified ? 'verified' : 'unverified'} successfully`);
      fetchLeads();
    } catch (error) {
      toast.error('Failed to update lead status');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingLead(null);
    setFormData({ leadName: '', leadEmail: '', phone: '', isVerified: false });
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.leadEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'verified' && lead.isVerified) ||
                         (filterStatus === 'unverified' && !lead.isVerified);
    return matchesSearch && matchesFilter;
  });

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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900">Leads</h1>
          <p className="text-secondary-600 mt-1">Manage your potential customers</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="btn btn-primary btn-lg mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Lead
        </motion.button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-primary-100">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Total Leads</p>
                <p className="text-2xl font-bold text-secondary-900">{leads.length}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-success-100">
                <CheckCircle className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Verified</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {leads.filter(lead => lead.isVerified).length}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-warning-100">
                <XCircle className="h-6 w-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-secondary-600">Unverified</p>
                <p className="text-2xl font-bold text-secondary-900">
                  {leads.filter(lead => !lead.isVerified).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card"
      >
        <div className="card-content">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
              <button className="btn btn-outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Leads Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card"
      >
        <div className="card-content p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-head">Lead</th>
                  <th className="table-head">Contact</th>
                  <th className="table-head">Status</th>
                  <th className="table-head">Member</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.leadId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="table-row"
                  >
                    <td className="table-cell">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                          <Users className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">{lead.leadName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-secondary-600">
                          <Mail className="h-4 w-4 mr-2" />
                          {lead.leadEmail}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center text-sm text-secondary-600">
                            <Phone className="h-4 w-4 mr-2" />
                            {lead.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => handleStatusChange(lead.leadId, !lead.isVerified)}
                        className={`badge ${
                          lead.isVerified ? 'badge-success' : 'badge-warning'
                        } cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        {lead.isVerified ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Unverified
                          </>
                        )}
                      </button>
                    </td>
                    <td className="table-cell">
                      <span className="text-sm text-secondary-600">{lead.memberName}</span>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center text-sm text-secondary-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(lead)}
                          className="btn btn-outline btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.leadId)}
                          className="btn btn-outline btn-sm text-danger-600 hover:text-danger-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                {editingLead ? 'Edit Lead' : 'Add New Lead'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Lead Name</label>
                  <input
                    type="text"
                    name="leadName"
                    value={formData.leadName}
                    onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                    className="input"
                    placeholder="Enter lead name"
                    required
                  />
                </div>
                
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="leadEmail"
                    value={formData.leadEmail}
                    onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                    className="input"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isVerified"
                    name="isVerified"
                    checked={formData.isVerified}
                    onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                  <label htmlFor="isVerified" className="ml-2 text-sm text-secondary-900">
                    Verified Lead
                  </label>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn btn-primary"
                  >
                    {editingLead ? 'Update Lead' : 'Create Lead'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Leads;
