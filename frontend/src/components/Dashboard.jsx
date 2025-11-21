import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
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
  IndianRupee,
  Hand,
  Settings
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
import toast from 'react-hot-toast';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role;

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
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  // Track role-based access check against backend RBAC endpoints
  const [roleAccess, setRoleAccess] = useState({ status: null, message: '', authorities: [] });

  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  const [leadForm, setLeadForm] = useState({ leadName: '', leadEmail: '', phone: '' });
  const [dealForm, setDealForm] = useState({ dealName: '', description: '', dealValue: '', dealStage: '' });
  const [activityForm, setActivityForm] = useState({ activityType: '', subject: '', description: '', activityDate: '' });

  useEffect(() => {
    // Only fetch CRM stats for internal roles; customer Users get a lightweight dashboard
    if (!user || role === 'User') {
      setLoading(false);
      return;
    }
    fetchStats();
  }, [user, role]);

  // On load (and when user changes), verify role-based access using backend endpoints
  useEffect(() => {
    const checkRoleAccess = async () => {
      if (!user || !user.role) return;

      let endpoint = null;
      if (user.role === 'Manager') {
        endpoint = '/access/manager';
      } else if (user.role === 'Sales Rep') {
        endpoint = '/access/sales-rep';
      } else {
        // For Admin/User we don't have dedicated endpoints; skip check
        setRoleAccess({ status: null, message: '', authorities: [] });
        return;
      }

      try {
        const response = await api.get(endpoint);
        setRoleAccess({
          status: 'ok',
          message: response.data?.message || 'Access check succeeded',
          authorities: response.data?.authorities || []
        });
      } catch (error) {
        const status = error.response?.status;
        const msg = status === 403
          ? 'You are not allowed to access this endpoint (403 Forbidden).'
          : (error.userMessage || 'Failed to verify role access');
        setRoleAccess({ status: 'error', message: msg, authorities: [] });
      }
    };

    checkRoleAccess();
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const isManagerOrAdmin = role === 'Admin' || role === 'Manager';
      const [leadsRes, contactsRes, accountsRes, dealsRes, activitiesRes, dealSummaryRes, leadSummaryRes, dealStagesRes] = await Promise.all([
        api.get('/leads').catch(() => ({ data: [] })),
        api.get('/contacts').catch(() => ({ data: [] })),
        api.get('/accounts').catch(() => ({ data: [] })),
        api.get('/deals').catch(() => ({ data: [] })),
        api.get('/activities').catch(() => ({ data: [] })),
        isManagerOrAdmin ? api.get('/deals/summary').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        isManagerOrAdmin ? api.get('/leads/summary').catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        isManagerOrAdmin ? api.get('/deals/stages').catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
      ]);

      const leads = leadsRes.data || [];
      const deals = dealsRes.data || [];
      const activities = activitiesRes.data || [];

      setStats({
        totalLeads: leads.length,
        totalContacts: contactsRes.data?.length || 0,
        totalAccounts: accountsRes.data?.length || 0,
        totalDeals: deals.length,
        totalActivities: activities.length,
        verifiedLeads: leads.filter(lead => lead.isVerified).length,
        activeDeals: deals.filter(deal => deal.stage !== 'Closed').length,
        totalValue: deals.reduce((sum, deal) => sum + (deal.value || deal.dealValue || 0), 0)
      });

      const sortedActivities = [...activities]
        .sort((a, b) => new Date(b.createdAt || b.activityDate || 0) - new Date(a.createdAt || a.activityDate || 0))
        .slice(0, 10)
        .map(a => ({
          id: a.activityId,
          action: a.subject || a.activityType || 'Activity',
          name: a.description || '',
          time: new Date(a.createdAt || a.activityDate).toLocaleString()
        }));
      setRecentActivities(sortedActivities);

      // Use backend summaries if available
      // Ensure arrays
const dealSummary = Array.isArray(dealSummaryRes.data) ? dealSummaryRes.data : [];
const leadSummary = Array.isArray(leadSummaryRes.data) ? leadSummaryRes.data : [];

// If API returned monthly summary → merge Deal + Lead summaries
if (dealSummary.length > 0 || leadSummary.length > 0) {

  const monthMap = new Map();

  // 1. Insert deal data
  dealSummary.forEach(d => {
    const key = `${d.year}-${String(d.month).padStart(2, '0')}`;
    if (!monthMap.has(key)) {
      monthMap.set(key, { name: key, deals: 0, leads: 0, revenue: 0 });
    }
    monthMap.get(key).deals = d.dealCount;
  });

  // 2. Insert lead data
  leadSummary.forEach(l => {
    const key = `${l.year}-${String(l.month).padStart(2, '0')}`;
    if (!monthMap.has(key)) {
      monthMap.set(key, { name: key, deals: 0, leads: 0, revenue: 0 });
    }
    monthMap.get(key).leads = l.leadCount;
  });

  // Convert + sort
  const summaryChart = Array.from(monthMap.values())
    .sort((a, b) => a.name.localeCompare(b.name));

  setChartData(summaryChart);
} 
else {
  // ---------- FALLBACK LOCAL MONTHLY AGGREGATION ----------
  const byMonth = (items, dateKey, valueKey) => {
    const map = new Map();

    for (const item of items) {
      const d = item[dateKey] ? new Date(item[dateKey]) : null;
      if (!d) continue;

      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

      if (!map.has(key)) {
        map.set(key, { name: key, leads: 0, deals: 0, revenue: 0 });
      }

      const entry = map.get(key);

      if (valueKey === 'leads') entry.leads += 1;
      if (valueKey === 'deals') entry.deals += 1;
      if (valueKey === 'revenue') entry.revenue += item.value || item.dealValue || 0;

      map.set(key, entry);
    }

    return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
  };

  // Generate fallback chart
  const leadsByMonth = byMonth(leads, "createdAt", "leads");
  const dealsByMonth = byMonth(deals, "createdAt", "deals");

  // Merge fallback data
  const monthMap = new Map();

  leadsByMonth.forEach(m => monthMap.set(m.name, m));
  dealsByMonth.forEach(m => {
    if (!monthMap.has(m.name)) monthMap.set(m.name, m);
    else {
      const obj = monthMap.get(m.name);
      obj.deals = m.deals;
      monthMap.set(m.name, obj);
    }
  });

  setChartData(Array.from(monthMap.values()));
}


const stages = Array.isArray(dealStagesRes.data) ? dealStagesRes.data : [];

const colors = [
  '#2563EB', // Bright Blue
  '#16A34A', // Bright Green
  '#F97316', // Vivid Orange
  '#DC2626', // Bright Red
  '#9333EA', // Vivid Purple
  '#0891B2', // Bright Cyan
];

if (stages.length > 0) {
  setPieData(
    stages.map((s, idx) => ({
      name: s.stage || 'Unknown',
      value: s.count,
      color: colors[idx % colors.length],
    }))
  );
} else {
  const stageCounts = deals.reduce((acc, d) => {
    const stage = d.stage || d.dealStage || 'Unknown';
    acc[stage] = (acc[stage] || 0) + 1;
    return acc;
  }, {});

  const pie = Object.entries(stageCounts).map(([name, value], idx) => ({
    name,
    value,
    color: colors[idx % colors.length],
  }));

  setPieData(pie);
}

    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const payload = { leadName: leadForm.leadName, leadEmail: leadForm.leadEmail, phone: leadForm.phone };
      await api.post('/leads', payload);
      toast.success('Lead created successfully');
      setShowLeadModal(false);
      setLeadForm({ leadName: '', leadEmail: '', phone: '' });
      await fetchStats();
    } catch (error) {
      console.error('Failed to create lead:', error);
      toast.error('Failed to create lead');
    }
  };

  const handleCreateDeal = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        dealName: dealForm.dealName,
        description: dealForm.description,
        dealValue: dealForm.dealValue ? Number(dealForm.dealValue) : 0,
        dealStage: dealForm.dealStage
      };
      await api.post('/deals', payload);
      toast.success('Deal created successfully');
      setShowDealModal(false);
      setDealForm({ dealName: '', description: '', dealValue: '', dealStage: '' });
      await fetchStats();
    } catch (error) {
      console.error('Failed to create deal:', error);
      toast.error('Failed to create deal');
    }
  };

  const formatLocalDateTime = (value) => {
    if (!value) return '';
    const hasSeconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(value);
    if (hasSeconds) return value;
    return `${value}:00`;
  };

  const handleCreateActivity = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        activityType: activityForm.activityType,
        subject: activityForm.subject,
        description: activityForm.description,
        activityDate: activityForm.activityDate ? formatLocalDateTime(activityForm.activityDate) : null
      };
      await api.post('/activities', payload);
      toast.success('Activity created successfully');
      setShowActivityModal(false);
      setActivityForm({ activityType: '', subject: '', description: '', activityDate: '' });
      await fetchStats();
    } catch (error) {
      console.error('Failed to create activity:', error);
      toast.error('Failed to create activity');
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
      value: `₹${stats.totalValue.toLocaleString()}`,
      change: '+15%',
      changeType: 'positive',
      icon: IndianRupee,
      color: 'success'
    }
  ];

  // Customer (User) dashboard: simple, self-service view
  if (role === 'User') {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200"
        >
          <h1 className="text-3xl font-bold text-text mb-2">
            Welcome, {user?.name || 'Customer'}
          </h1>
          <p className="text-gray-600">
            Here you can manage your profile and track your requests.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-content">
              <h2 className="text-xl font-semibold text-text mb-2">My Profile</h2>
              <p className="text-gray-600 mb-4">
                View and update your personal information.
              </p>
              <button className="btn btn-primary btn-sm" disabled>
                Manage Profile (coming soon)
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-content">
              <h2 className="text-xl font-semibold text-text mb-2">Support Requests</h2>
              <p className="text-gray-600 mb-4">
                Check the status of your tickets or submit a new request.
              </p>
              <button className="btn btn-primary btn-sm" disabled>
                View Requests (coming soon)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  // Manager/Admin and Sales Rep dashboards share the same data fetch,
  // but we can tweak messaging and emphasis by role
  const isManagerOrAdmin = role === 'Admin' || role === 'Manager';
  const isSalesRep = role === 'Sales Rep';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#fff] rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-[#000]">
              {role === 'Admin'
                ? `Admin control center, ${user?.name || ''}`
                : role === 'Manager'
                ? `Team performance, ${user?.name || ''}`
                : `Your sales cockpit, ${user?.name || ''}`}
            </h1>
            <p className="text-primary-600 text-lg">
              {role === 'Admin'
                ? "Monitor your entire organization, users, and settings at a glance"
                : role === 'Manager'
                ? "See how your team is performing across leads and deals"
                : "Track your personal pipeline and activities in one place"}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-primary-500 backdrop-blur-sm rounded-xl p-6 border border-primary-300">
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
              className="card hover:shadow-xl transition-all duration-300 hover:scale-105 pt-3"
            >
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-text mt-2">{stat.value}</p>
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
                      <span className="text-sm text-gray-500 ml-1">from last month</span>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-200 shadow-lg`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Role Access Status (Manager / Sales Rep) */}
      {(user?.role === 'Manager' || user?.role === 'Sales Rep') && roleAccess.status && (
        <div className="card border border-gray-200 bg-white">
          <div className="card-content flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-600">
                {user.role} backend access check
              </p>
              <p
                className={`text-sm mt-1 ${
                  roleAccess.status === 'ok' ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {roleAccess.message}
              </p>
            </div>
            {roleAccess.authorities?.length > 0 && (
              <div className="text-xs text-gray-500">
                Authorities: {roleAccess.authorities.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Charts Row - only for Admin and Manager */}
      {isManagerOrAdmin && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leads & Deals Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card hover:shadow-xl transition-all duration-300"
        >
          <div className="card-header">
            <h3 className="card-title">Deals Overview</h3>
            <p className="card-description">Monthly performance metrics</p>
          </div>
          <div className="card-content">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar dataKey="leads" fill="url(#leadsGradient)" name="Leads" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="deals" fill="url(#dealsGradient)" name="Deals" radius={[4, 4, 0, 0]} />
                  <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4DA3FF" />  {/* bright sky blue */}
                    <stop offset="100%" stopColor="#004E92" /> {/* deep indigo */}
                  </linearGradient>

                  <linearGradient id="dealsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4FE0C1" />  {/* bright teal */}
                    <stop offset="100%" stopColor="#0A7F42" /> {/* deep success green */}
                  </linearGradient>

                  </defs>
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
          className="card hover:shadow-xl transition-all duration-300"
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
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2 shadow-sm" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 card hover:shadow-xl transition-all duration-300"
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
                  className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 hover:scale-105"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center shadow-sm">
                      <Activity className="h-5 w-5 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600">{activity.name}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="text-xs text-gray-500">{activity.time}</p>
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
          className="card hover:shadow-xl transition-all duration-300"
        >
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <p className="card-description">Common tasks</p>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {/* Admin + Sales Rep: engage directly with customers (create) */}
              {(isSalesRep || role === 'Admin') && (
                <>
                  <button
                    className="w-full btn btn-primary btn-sm justify-start hover:scale-105 transition-all duration-200"
                    onClick={() => setShowLeadModal(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Lead
                  </button>
                  <button
                    className="w-full btn btn-outline btn-sm justify-start hover:scale-105 transition-all duration-200"
                    onClick={() => setShowDealModal(true)}
                  >
                    <HandHeart className="h-4 w-4 mr-2" />
                    Add Deal
                  </button>
                  <button
                    className="w-full btn btn-outline btn-sm justify-start hover:scale-105 transition-all duration-200"
                    onClick={() => setShowActivityModal(true)}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Activity
                  </button>
                </>
              )}

              {/* Manager: monitor sales reps / team */}
              {role === 'Manager' && (
                <>
                  <button
                    className="w-full btn btn-outline btn-sm justify-start hover:scale-105 transition-all duration-200"
                    onClick={() => navigate('/leads')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Team Leads
                  </button>
                  <button
                    className="w-full btn btn-outline btn-sm justify-start hover:scale-105 transition-all duration-200"
                    onClick={() => navigate('/deals')}
                  >
                    <HandHeart className="h-4 w-4 mr-2" />
                    Review Pipeline
                  </button>
                  <button
                    className="w-full btn btn-outline btn-sm justify-start hover:scale-105 transition-all duration-200"
                    onClick={() => navigate('/activities')}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Monitor Activities
                  </button>
                </>
              )}

              {/* Admin: keep options focused on org and member management */}
              {role === 'Admin' && (
                <>
                  <button
                    className="w-full btn btn-outline btn-sm justify-start hover:scale-105 transition-all duration-200"
                    onClick={() => navigate('/members')}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Members
                  </button>
                  <button
                    className="w-full btn btn-outline btn-sm justify-start hover:scale-105 transition-all duration-200"
                    onClick={() => navigate('/organizations')}
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Manage Organizations
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lead Modal */}
      {showLeadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text">Add New Lead</h2>
              <button className="text-gray-500 hover:text-gray-700 transition-colors" onClick={() => setShowLeadModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <input className="input w-full" placeholder="Lead Name" value={leadForm.leadName} onChange={e => setLeadForm({ ...leadForm, leadName: e.target.value })} required />
              <input className="input w-full" placeholder="Lead Email" type="email" value={leadForm.leadEmail} onChange={e => setLeadForm({ ...leadForm, leadEmail: e.target.value })} required />
              <input className="input w-full" placeholder="Phone" value={leadForm.phone} onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })} />
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLeadModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Lead</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Deal Modal */}
      {showDealModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text">Add Deal</h2>
              <button className="text-gray-500 hover:text-gray-700 transition-colors" onClick={() => setShowDealModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateDeal} className="space-y-4">
              <input className="input w-full" placeholder="Deal Name" value={dealForm.dealName} onChange={e => setDealForm({ ...dealForm, dealName: e.target.value })} required />
              <input className="input w-full" placeholder="Description" value={dealForm.description} onChange={e => setDealForm({ ...dealForm, description: e.target.value })} />
              <input className="input w-full" placeholder="Value" type="number" value={dealForm.dealValue} onChange={e => setDealForm({ ...dealForm, dealValue: e.target.value })} />
              <input className="input w-full" placeholder="Stage" value={dealForm.dealStage} onChange={e => setDealForm({ ...dealForm, dealStage: e.target.value })} />
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowDealModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Deal</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-text">Schedule Activity</h2>
              <button className="text-gray-500 hover:text-gray-700 transition-colors" onClick={() => setShowActivityModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateActivity} className="space-y-4">
              <input className="input w-full" placeholder="Activity Type" value={activityForm.activityType} onChange={e => setActivityForm({ ...activityForm, activityType: e.target.value })} required />
              <input className="input w-full" placeholder="Subject" value={activityForm.subject} onChange={e => setActivityForm({ ...activityForm, subject: e.target.value })} required />
              <input className="input w-full" type="datetime-local" value={activityForm.activityDate} onChange={e => setActivityForm({ ...activityForm, activityDate: e.target.value })} required />
              <textarea className="input w-full" placeholder="Description" value={activityForm.description} onChange={e => setActivityForm({ ...activityForm, description: e.target.value })} />
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" className="btn btn-secondary" onClick={() => setShowActivityModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Activity</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
