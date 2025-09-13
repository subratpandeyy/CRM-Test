import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import api from '../services/api.js';

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [formData, setFormData] = useState({
    contactName: '',
    contactEmail: '',
    phone: '',
    accountId: null
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingContact) {
        await api.put(`/contacts/${editingContact.contactId}`, formData);
      } else {
        await api.post('/contacts', formData);
      }
      
      setShowModal(false);
      setEditingContact(null);
      setFormData({ contactName: '', contactEmail: '', phone: '', accountId: null });
      fetchContacts();
    } catch (error) {
      setError(error.response?.data || 'Failed to save contact');
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      contactName: contact.contactName,
      contactEmail: contact.contactEmail,
      phone: contact.phone || '',
      accountId: contact.accountId
    });
    setShowModal(true);
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await api.delete(`/contacts/${contactId}`);
        fetchContacts();
      } catch (error) {
        setError('Failed to delete contact');
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({ contactName: '', contactEmail: '', phone: '', accountId: null });
    setError('');
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
          <div className="p-2 bg-primary-100 rounded-lg">
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Contacts</h1>
            <p className="text-secondary-600">Manage your customer contacts</p>
          </div>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary btn-md flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Contacts Table */}
      <div className="card">
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr className="table-row">
                  <th className="table-head">Name</th>
                  <th className="table-head">Email</th>
                  <th className="table-head">Phone</th>
                  <th className="table-head">Account</th>
                  <th className="table-head">Member</th>
                  <th className="table-head">Created</th>
                  <th className="table-head">Actions</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {contacts.map((contact) => (
                  <tr key={contact.contactId} className="table-row">
                    <td className="table-cell font-medium">{contact.contactName}</td>
                    <td className="table-cell">{contact.contactEmail}</td>
                    <td className="table-cell">{contact.phone || '-'}</td>
                    <td className="table-cell">{contact.accountName || '-'}</td>
                    <td className="table-cell">{contact.memberName}</td>
                    <td className="table-cell text-secondary-600">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(contact)}
                          className="btn btn-outline btn-sm flex items-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(contact.contactId)}
                          className="btn btn-outline btn-sm flex items-center space-x-1 text-danger-600 hover:text-danger-700 hover:border-danger-300"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="card-header">
              <h3 className="card-title">{editingContact ? 'Edit Contact' : 'Add New Contact'}</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="card-content space-y-4">
                {error && (
                  <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                <div>
                  <label className="label">Contact Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    required
                    className="input mt-1"
                    placeholder="Enter contact name"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    required
                    className="input mt-1"
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input mt-1"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="card-footer">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-secondary btn-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-md"
                >
                  {editingContact ? 'Update Contact' : 'Create Contact'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Contacts;
