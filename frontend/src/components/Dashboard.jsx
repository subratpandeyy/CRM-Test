import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  Building2, 
  HandHeart, 
  Calendar, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  DollarSign,
  Hand
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import api from '../services/api.js';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalContacts: 0,
    totalAccounts: 0,
    totalDeals: 0,
    totalActivities: 0,
    verifiedLeads: 0,
    activeDeals: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // In a real application, you would have a dedicated stats endpoint
      // For now, we'll fetch counts from individual endpoints
      const [leadsRes, contactsRes, accountsRes, dealsRes, activitiesRes] = await Promise.all([
        api.get('/leads').catch(() => ({ data: [] })),
        api.get('/contacts').catch(() => ({ data: [] })),
        api.get('/accounts').catch(() => ({ data: [] })),
        api.get('/deals').catch(() => ({ data: [] })),
        api.get('/activities').catch(() => ({ data: [] }))
      ]);

      const leads = leadsRes.data || [];
      const deals = dealsRes.data || [];

      setStats({
        totalLeads: leads.length,
        totalContacts: contactsRes.data?.length || 0,
        totalAccounts: accountsRes.data?.length || 0,
        totalDeals: deals.length,
        totalActivities: activitiesRes.data?.length || 0,
        verifiedLeads: leads.filter(lead => lead.isVerified).length,
        activeDeals: deals.filter(deal => deal.stage !== 'Closed').length,
        totalValue: deals.reduce((sum, deal) => sum + (deal.value || 0), 0)
      });

      // Mock recent activities
      setRecentActivities([
        { id: 1, type: 'Lead', action: 'New lead added', name: 'John Doe', time: '2 minutes ago' },
        { id: 2, type: 'Contact', action: 'Contact updated', name: 'Jane Smith', time: '15 minutes ago' },
        { id: 3, type: 'Deal', action: 'Deal stage changed', name: 'Enterprise Deal', time: '1 hour ago' },
        { id: 4, type: 'Activity', action: 'Call scheduled', name: 'Follow-up call', time: '2 hours ago' },
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
      color: 'primary'
    },
    {
      title: 'Verified Leads',
      value: stats.verifiedLeads,
      change: '+8%',
      changeType: 'positive',
      icon: UserCheck,
      color: 'success'
    },
    {
      title: 'Active Deals',
      value: stats.activeDeals,
      change: '+23%',
      changeType: 'positive',
      icon: Hand,
      color: 'warning'
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'success'
    }
  ];

  const chartData = [
    { name: 'Jan', leads: 65, deals: 28, revenue: 12000 },
    { name: 'Feb', leads: 59, deals: 48, revenue: 19000 },
    { name: 'Mar', leads: 80, deals: 40, revenue: 15000 },
    { name: 'Apr', leads: 81, deals: 19, revenue: 22000 },
    { name: 'May', leads: 56, deals: 96, revenue: 28000 },
    { name: 'Jun', leads: 55, deals: 27, revenue: 18000 },
  ];

  const pieData = [
    { name: 'New', value: 45, color: '#3b82f6' },
    { name: 'Qualified', value: 30, color: '#10b981' },
    { name: 'Proposal', value: 15, color: '#f59e0b' },
    { name: 'Closed', value: 10, color: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-primary-100 text-lg">
              Here's what's happening with your CRM today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{new Date().toLocaleDateString()}</div>
                <div className="text-primary-100 text-sm">Today</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
              className="card hover:shadow-lg transition-shadow duration-200"
            >
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-secondary-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.changeType === 'positive' ? (
                        <ArrowUpRight className="h-4 w-4 text-success-600 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-danger-600 mr-1" />
                      )}
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-success-600' : 'text-danger-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-secondary-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads & Deals Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Leads & Deals Overview</h3>
            <p className="card-description">Monthly performance metrics</p>
          </div>
          <div className="card-content">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                  <Bar dataKey="deals" fill="#10b981" name="Deals" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Deal Stages Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Deal Stages</h3>
            <p className="card-description">Current deal distribution</p>
          </div>
          <div className="card-content">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-secondary-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card"
        >
          <div className="card-header">
            <h3 className="card-title">Recent Activities</h3>
            <p className="card-description">Latest updates in your CRM</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <Activity className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900">
                      {activity.action}
                    </p>
                    <p className="text-sm text-secondary-600">{activity.name}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs text-secondary-500">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="card"
        >
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-description">Common tasks</p>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              <button className="w-full btn btn-primary btn-sm justify-start">
                <Plus className="h-4 w-4 mr-2" />
                Add New Lead
              </button>
              <button className="w-full btn btn-outline btn-sm justify-start">
                <UserCheck className="h-4 w-4 mr-2" />
                Add Contact
              </button>
              <button className="w-full btn btn-outline btn-sm justify-start">
                <Building2 className="h-4 w-4 mr-2" />
                Add Account
              </button>
              <button className="w-full btn btn-outline btn-sm justify-start">
                <HandHeart className="h-4 w-4 mr-2" />
                Add Deal
              </button>
              <button className="w-full btn btn-outline btn-sm justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Activity
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
