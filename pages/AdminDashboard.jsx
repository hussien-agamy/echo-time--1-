import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Clock, 
  ShieldAlert, 
  BadgeCheck, 
  Users, 
  Wallet, 
  BarChart2,
  TrendingUp,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Clock3,
  Loader2,
  Ban,
  ShieldCheck,
  UserPlus,
  RefreshCcw,
  X,
  Mail,
  User as UserIcon,
  MapPin,
  Calendar,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  ShieldHalf
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/ToastContext';

const TABS = [
  { id: 'overview', name: 'Overview', icon: <LayoutDashboard size={18} /> },
  { id: 'users', name: 'User Management', icon: <Users size={18} /> },
  { id: 'economy', name: 'Time Economy', icon: <Clock size={18} /> },
  { id: 'disputes', name: 'Disputes', icon: <ShieldAlert size={18} /> },
  { id: 'analytics', name: 'Analytics', icon: <BarChart2 size={18} /> },
];

const StatCard = ({ title, value, icon, trend, trendValue, color, suffix = '', isLoading }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-white/80 backdrop-blur-xl rounded-4xl p-6 border border-white/50 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden group transition-all"
  >
    <div className={`absolute -right-6 -top-6 w-32 h-32 rounded-full opacity-5 bg-${color}-500 blur-3xl group-hover:opacity-10 transition-opacity`}></div>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl bg-${color}-50 text-${color}-600 shadow-sm shadow-${color}-100/50`}>
        {icon}
      </div>
      {!isLoading && (
        <div className={`flex items-center gap-1.5 text-sm font-black px-2.5 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {trendValue}%
        </div>
      )}
    </div>
    <h3 className="text-slate-400 font-bold text-sm mb-1 uppercase tracking-widest">{title}</h3>
    <div className="text-4xl font-black text-blue-950 tracking-tighter">
      {isLoading ? <Loader2 className="animate-spin text-blue-200" size={32} /> : <>{value}{suffix}</>}
    </div>
  </motion.div>
);

const StatusBadge = ({ status }) => {
  const configs = {
    verified: { 
      bg: 'bg-emerald-100', 
      text: 'text-emerald-700', 
      border: 'border-emerald-200', 
      icon: <BadgeCheck size={12} />, 
      label: 'Verified' 
    },
    pending: { 
      bg: 'bg-amber-100', 
      text: 'text-amber-700', 
      border: 'border-amber-200', 
      icon: <Clock size={12} />, 
      label: 'Pending' 
    },
    banned: { 
      bg: 'bg-red-100', 
      text: 'text-red-700', 
      border: 'border-red-200', 
      icon: <Ban size={12} />, 
      label: 'Banned' 
    }
  };

  const config = configs[status] || configs.pending;

  return (
    <span className={`${config.bg} ${config.text} ${config.border} text-[10px] font-black px-3 py-1 rounded-lg flex items-center gap-1 uppercase tracking-widest border shadow-sm`}>
      {config.icon} {config.label}
    </span>
  );
};

const UserRow = ({ user, onUpdateStatus, onViewDetails }) => {
  return (
    <tr 
      onClick={() => onViewDetails(user)}
      className="group hover:bg-blue-50/50 transition-colors border-b border-blue-50/50 last:border-0 cursor-pointer"
    >
      <td className="py-5 pl-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center font-black text-blue-600 overflow-hidden shadow-inner border-2 border-white">
            {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
            ) : (
                user.full_name?.charAt(0) || 'U'
            )}
          </div>
          <div>
            <p className="font-black text-blue-950 leading-tight">{user.full_name}</p>
            <p className="text-xs font-bold text-slate-400">@{user.username}</p>
          </div>
        </div>
      </td>
      <td className="py-5 font-black text-blue-600">{user.time_balance}h</td>
      <td className="py-5">
        <div className="flex flex-wrap gap-2">
            <StatusBadge status={user.status} />
            {user.role === 'admin' && (
                <span className="bg-indigo-100 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-lg flex items-center gap-1 uppercase tracking-widest border border-indigo-200 shadow-sm">
                    <ShieldCheck size={12} /> Admin
                </span>
            )}
        </div>
      </td>
      <td className="py-5 text-right pr-4">
        <div className="flex items-center justify-end gap-2">
          <button className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-sm">
            <ChevronRight size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

const UserDetailModal = ({ user, onClose, onUpdateStatus }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleAction = async (updates) => {
        setIsUpdating(true);
        await onUpdateStatus(user.id, updates);
        setIsUpdating(false);
        onClose();
    };

    if (!user) return null;

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-110 flex items-center justify-center p-4 lg:p-8"
        >
          <div
            onClick={onClose}
            className="absolute inset-0 bg-blue-950/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-5xl bg-white/90 backdrop-blur-2xl rounded-4xl shadow-3xl border border-white overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-blue-950 tracking-tight">
                    Citizen Profile
                  </h2>
                  <p className="text-sm font-bold text-slate-400">
                    Registry ID: {user.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 rounded-2xl hover:bg-slate-100 transition-all text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Left Column: Info Card */}
                <div className="lg:col-span-1 space-y-8">
                  <div className="text-center space-y-4">
                    <div className="relative inline-block mx-auto">
                      <img
                        src={
                          user.avatar_url ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=" +
                            user.username
                        }
                        alt={user.full_name}
                        className="w-32 h-32 rounded-4xl object-cover border-4 border-white shadow-xl mx-auto"
                      />
                      <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 rounded-2xl border-4 border-white text-white">
                        <ShieldHalf size={20} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-blue-950 tracking-tighter">
                        {user.full_name}
                      </h3>
                      <p className="text-blue-500 font-black">
                        @{user.username}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <StatusBadge status={user.status} />
                    </div>
                  </div>

                  <div className="space-y-4 pt-8 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-slate-600">
                      <Mail className="text-blue-400" size={20} />
                      <span className="font-bold truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600">
                      <Calendar className="text-blue-400" size={20} />
                      <span className="font-bold">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-600">
                      <TrendingUp className="text-blue-400" size={20} />
                      <span className="font-bold">
                        {user.time_balance} Hours Transacted
                      </span>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                    <p className="text-[10px] font-black text-blue-400 uppercase mb-2 tracking-widest">
                      Self Description
                    </p>
                    <p className="text-sm font-bold text-blue-900 leading-relaxed italic">
                      "{user.bio || "No biography provided."}"
                    </p>
                  </div>
                </div>

                {/* Right Column: Identity & Skills */}
                <div className="lg:col-span-2 space-y-10">
                  <div>
                    <h4 className="text-lg font-black text-blue-950 mb-6 flex items-center gap-2">
                      <ShieldCheck className="text-emerald-500" /> National
                      Identity Document
                    </h4>
                    <div className="group relative rounded-4xl overflow-hidden border-4 border-white shadow-2xl bg-slate-100 aspect-video flex items-center justify-center">
                      {user.id_card_url ? (
                        <>
                          <img
                            src={user.id_card_url}
                            alt="National ID"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a
                              href={user.id_card_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-4 bg-white rounded-2xl text-blue-600 shadow-xl flex items-center gap-2 font-black transform translate-y-4 group-hover:translate-y-0 transition-transform"
                            >
                              <ExternalLink size={20} /> View Full Size
                            </a>
                          </div>
                        </>
                      ) : (
                        <div className="text-center p-12 space-y-4">
                          <AlertTriangle
                            size={48}
                            className="text-slate-300 mx-auto"
                          />
                          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                            Document Not Uploaded
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-blue-950 mb-4">
                      Skill Inventory
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-5 py-2.5 bg-white border border-blue-100 text-blue-600 font-black rounded-2xl text-xs shadow-sm capitalize"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-slate-400 font-bold italic">
                          No skills listed.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-slate-100 flex flex-col md:flex-row justify-end gap-4 bg-white/50 backdrop-blur-xl">
              {user.status === "pending" && (
                <button
                  onClick={() =>
                    handleAction({ status: "verified", is_verified: true })
                  }
                  disabled={isUpdating}
                  className="px-10 py-5 bg-emerald-600 text-white rounded-3xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <CheckCircle size={20} />
                  )}
                  Approved Citizen
                </button>
              )}
              {user.status !== "banned" ? (
                <button
                  onClick={() =>
                    handleAction({ status: "banned", is_banned: true })
                  }
                  disabled={isUpdating}
                  className="px-10 py-5 bg-red-600 text-white rounded-3xl font-black shadow-xl shadow-red-200 hover:bg-red-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Ban size={20} />
                  )}
                  Revoke Credentials
                </button>
              ) : (
                <button
                  onClick={() =>
                    handleAction({ status: "pending", is_banned: false })
                  }
                  disabled={isUpdating}
                  className="px-10 py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                  {isUpdating ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <RefreshCcw size={20} />
                  )}
                  Restore to Pending
                </button>
              )}
              <button
                onClick={onClose}
                className="px-10 py-5 bg-slate-100 text-slate-500 rounded-3xl font-black hover:bg-slate-200 transition-all text-center"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
};

export default function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchStats();
      fetchUsers();
    }
  }, [user, navigate]);

  const fetchStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to load dashboard metrics');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to load user database');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const updateStatus = async (userId, updates) => {
    try {
      await api.patch(`/admin/users/${userId}/status`, updates);
      toast.success('User status updated successfully');
      fetchUsers(); // Refresh list
    } catch (error) {
      toast.error(error.message || 'Action failed');
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <h2 className="text-5xl font-black text-blue-950 tracking-tighter">System Pulse</h2>
                    <p className="text-lg text-slate-500 font-bold">Comprehensive platform health monitoring.</p>
                </div>
                <button 
                    onClick={fetchStats}
                    className="p-4 bg-white border border-blue-100 rounded-2xl text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                >
                    <RefreshCcw size={20} className={isLoadingStats ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Platform GDP" value={stats?.totalHours || 0} suffix="h" icon={<Activity size={24} />} trend="up" trendValue={12.4} color="blue" isLoading={isLoadingStats} />
              <StatCard title="Citizen Population" value={stats?.totalUsers || 0} icon={<Users size={24} />} trend="up" trendValue={8.9} color="indigo" isLoading={isLoadingStats} />
              <StatCard title="Task Circulation" value={stats?.totalTasks || 0} icon={<TrendingUp size={24} />} trend="up" trendValue={5.2} color="emerald" isLoading={isLoadingStats} />
              <StatCard title="Pending Verifs" value={stats?.pendingVerifs || 0} icon={<ShieldAlert size={24} />} trend="down" trendValue={2.1} color="amber" isLoading={isLoadingStats} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/60 backdrop-blur-xl rounded-4xl p-8 border border-white/50 shadow-xl overflow-hidden min-h-[400px] group transition-all">
                    <h3 className="text-2xl font-black text-blue-950 mb-8 flex items-center gap-3">
                        <TrendingUp className="text-blue-500" /> Platform Velocity
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-3">
                        {[45, 65, 55, 85, 60, 95, 70, 100, 90, 85, 75, 95].map((h, i) => (
                        <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05, type: 'spring', damping: 20 }}
                            className="flex-1 bg-linear-to-t from-blue-600 to-blue-300 rounded-2xl relative group/bar hover:to-blue-200 transition-all"
                        >
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-blue-950 text-white text-[10px] font-black py-1.5 px-2.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all shadow-xl pointer-events-none whitespace-nowrap border border-white/20">
                                {Math.floor(h * 12.5)}h
                            </div>
                        </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-8 text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                        <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-xl rounded-4xl p-8 border border-white/50 shadow-xl flex flex-col group transition-all">
                    <h3 className="text-2xl font-black text-blue-950 mb-8">System Intelligence</h3>
                    <div className="space-y-6">
                        {[
                            { skill: 'Development', pct: 88, color: 'bg-blue-600' },
                            { skill: 'Design', pct: 72, color: 'bg-indigo-500' },
                            { skill: 'Marketing', pct: 45, color: 'bg-emerald-500' },
                            { skill: 'Consulting', pct: 30, color: 'bg-amber-500' }
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center pr-1">
                                    <span className="font-black text-blue-900 text-sm tracking-tight">{item.skill}</span>
                                    <span className="text-[10px] font-black text-slate-400">{item.pct}%</span>
                                </div>
                                <div className="h-2.5 w-full bg-slate-100/50 rounded-full overflow-hidden border border-white">
                                    <motion.div 
                                        initial={{ width: 0 }} 
                                        animate={{ width: `${item.pct}%` }} 
                                        transition={{ duration: 1.5, delay: i * 0.1, ease: 'circOut' }} 
                                        className={`h-full ${item.color} rounded-full shadow-[0_0_10px_rgba(37,99,235,0.2)]`} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 p-6 bg-blue-900 rounded-3xl text-white relative overflow-hidden group/cta">
                        <div className="relative z-10">
                            <p className="text-xs font-black text-blue-300 uppercase tracking-widest mb-1">Weekly Growth</p>
                            <p className="text-2xl font-black">+14.2%</p>
                        </div>
                        <ArrowUpRight className="absolute bottom-4 right-4 text-white/10 group-hover/cta:scale-110 group-hover/cta:rotate-12 transition-all" size={80} />
                    </div>
                </div>
            </div>
          </motion.div>
        );
      case 'users':
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h2 className="text-5xl font-black text-blue-950 tracking-tighter">Citizen Registry</h2>
                    <p className="text-lg text-slate-500 font-bold">Manage credentials and trust levels.</p>
                </div>
                <div className="flex w-full lg:w-auto gap-4">
                    <div className="relative flex-1 lg:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by name, email or @handle..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/80 backdrop-blur-xl border border-white/50 rounded-2xl pl-14 pr-6 py-4 font-bold text-blue-950 focus:ring-4 focus:ring-blue-100 outline-none shadow-sm transition-all"
                        />
                    </div>
                    <button className="p-4 bg-white border border-blue-100 rounded-2xl text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95">
                        <Filter size={20} />
                    </button>
                    <button 
                        onClick={fetchUsers}
                        className="p-4 bg-white border border-blue-100 rounded-2xl text-blue-600 hover:bg-blue-50 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCcw size={20} className={isLoadingUsers ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-4xl border border-white/50 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-blue-900/5 border-b border-blue-50">
                                <th className="py-6 pl-8 text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] w-1/3">Citizen Information</th>
                                <th className="py-6 text-[11px] font-black text-blue-400 uppercase tracking-[0.2em]">Balance</th>
                                <th className="py-6 text-[11px] font-black text-blue-400 uppercase tracking-[0.2em]">Trust Matrix</th>
                                <th className="py-6 pr-8 text-[11px] font-black text-blue-400 uppercase tracking-[0.2em] text-right">Moderation Ops</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoadingUsers ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse border-b border-blue-50">
                                        <td colSpan="4" className="py-10">
                                            <div className="h-8 bg-slate-100 rounded-xl mx-8" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map(u => (
                                    <UserRow 
                                        key={u.id} 
                                        user={u} 
                                        onUpdateStatus={updateStatus} 
                                        onViewDetails={setSelectedUser}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <div className="max-w-xs mx-auto space-y-4">
                                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-200 mx-auto">
                                                <Users size={40} />
                                            </div>
                                            <p className="font-black text-blue-950 text-xl tracking-tight">No Citizens Found</p>
                                            <p className="text-slate-400 font-bold">No results match your search criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedUser && (
                <UserDetailModal 
                    user={selectedUser} 
                    onClose={() => setSelectedUser(null)} 
                    onUpdateStatus={updateStatus}
                />
            )}
          </motion.div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6">
            <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center text-blue-300 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-100 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full opacity-50" />
                <Settings size={64} className="relative z-10 animate-spin-slow" />
            </div>
            <div className="space-y-2">
                <h3 className="text-3xl font-black text-blue-950 tracking-tighter">Module Offline</h3>
                <p className="text-slate-500 font-bold max-w-sm mx-auto">
                    The {TABS.find(t => t.id === activeTab)?.name} system is currently undergoing Phase 3 optimization.
                </p>
            </div>
            <button 
                onClick={() => setActiveTab('overview')}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
                Return to Command
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen -mx-4 md:-mx-8 px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-12">
      {/* Dynamic Sidebar */}
      <div className="lg:w-80 shrink-0 flex flex-col gap-8">
        <div className="p-8 bg-blue-950 rounded-4xl text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="relative z-10">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] block mb-2">Central Authorization</span>
                <h1 className="text-3xl font-black tracking-tighter mb-1">Fleet Core</h1>
                <p className="text-blue-300 text-sm font-bold opacity-80">Welcome back, {user.full_name?.split(' ')[0]}</p>
            </div>
            <div className="absolute top-4 right-4 text-blue-800 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <LayoutDashboard size={80} />
            </div>
        </div>

        <nav className="flex flex-col gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl font-black text-sm transition-all relative group ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-[0_15px_35px_-12px_rgba(37,99,235,0.6)] scale-[1.02]' 
                  : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-xl hover:shadow-blue-900/5'
              }`}
            >
              {tab.icon}
              <span className="tracking-tight">{tab.name}</span>
              {activeTab === tab.id && (
                  <motion.div layoutId="active-pill" className="absolute right-4 w-1.5 h-1.5 bg-blue-200 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto p-6 bg-slate-100 rounded-3xl border border-slate-200/50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">System Status</p>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Core Network</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Supabase Sync</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                </div>
                <div className="flex items-center justify-between opacity-50">
                    <span className="text-xs font-bold text-slate-600">Phase 4 Build</span>
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                </div>
            </div>
        </div>
      </div>

      {/* Viewport Area */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// Sub-icons components
const Settings = ({ size, className }) => (
    <svg 
        width={size} 
        height={size} 
        className={className}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);
