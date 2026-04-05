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
  Clock3
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_STATS = {
  totalTimeFlow: 14500, // Hours
  activeUsers: 3420,
  pendingVerifs: 145,
  escalatedDisputes: 12,
  timeEconomyBalance: 450000,
  monthlyRevenue: 12500
};


const TABS = [
  { id: 'overview', name: 'Overview', icon: <LayoutDashboard size={20} /> },
  { id: 'economy', name: 'Time Economy', icon: <Clock size={20} /> },
  { id: 'disputes', name: 'Quality & Disputes', icon: <ShieldAlert size={20} /> },
  { id: 'reputation', name: 'Reputation', icon: <BadgeCheck size={20} /> },
  { id: 'users', name: 'Users', icon: <Users size={20} /> },
  { id: 'monetization', name: 'Monetization', icon: <Wallet size={20} /> },
  { id: 'analytics', name: 'Analytics', icon: <BarChart2 size={20} /> },
];

const StatCard = ({ title, value, icon, trend, trendValue, color, suffix = '' }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl p-6 border border-blue-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden"
  >
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 bg-${color}-500 blur-2xl`}></div>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-50 text-${color}-600`}>
        {icon}
      </div>
      <div className={`flex items-center gap-1 text-sm font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trendValue}%
      </div>
    </div>
    <h3 className="text-slate-500 font-bold mb-1">{title}</h3>
    <div className="text-4xl font-black text-blue-950 tracking-tight">
      {value}{suffix}
    </div>
  </motion.div>
);

// --- TAB COMPONENTS ---

const OverviewTab = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-blue-950 tracking-tight">Dashboard Overview</h2>
        <p className="text-slate-500 font-medium mt-1">Real-time pulse of the Echo Time platform.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Time Flow (GDP)" value={MOCK_STATS.totalTimeFlow.toLocaleString()} suffix="h" icon={<Activity size={24} />} trend="up" trendValue={12.5} color="blue" />
      <StatCard title="Active Users" value={MOCK_STATS.activeUsers.toLocaleString()} icon={<Users size={24} />} trend="up" trendValue={8.2} color="indigo" />
      <StatCard title="Pending Verifications" value={MOCK_STATS.pendingVerifs} icon={<BadgeCheck size={24} />} trend="down" trendValue={3.1} color="amber" />
      <StatCard title="Active Disputes" value={MOCK_STATS.escalatedDisputes} icon={<AlertTriangle size={24} />} trend="up" trendValue={1.5} color="red" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-blue-50 shadow-sm min-h-[400px]">
        <h3 className="font-black text-xl text-blue-950 mb-6 flex items-center gap-2">
          <TrendingUp className="text-blue-500" /> Time Circulation Volume
        </h3>
        {/* Mock Chart Area */}
        <div className="h-64 flex items-end justify-between gap-2">
          {[40, 60, 45, 80, 55, 90, 75, 100, 85, 120, 95, 110].map((h, i) => (
            <motion.div 
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: i * 0.05, duration: 0.5, type: 'spring' }}
              className="w-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t-lg relative group cursor-pointer"
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-blue-900 text-white text-xs font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {h * 15}h
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs font-bold text-slate-400">
          <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm flex flex-col">
        <h3 className="font-black text-xl text-blue-950 mb-6">Recent Alerts</h3>
        <div className="flex-1 overflow-auto space-y-4 pr-2">
          {[
            { msg: 'Spike in disputes observed in Graphic Design category.', type: 'warning', time: '10m ago' },
            { msg: 'System time balance exceeds threshold level.', type: 'info', time: '1h ago' },
            { msg: 'Over 50+ users applied for Freelance Mode today.', type: 'success', time: '2h ago' },
            { msg: 'Server maintenance scheduled for tomorrow 2 AM.', type: 'info', time: '5h ago' }
          ].map((alert, i) => (
            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 items-start">
              <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${alert.type === 'warning' ? 'bg-amber-500' : alert.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'} shadow-[0_0_10px_rgba(0,0,0,0.1)]`} />
              <div>
                <p className="text-sm font-bold text-slate-700 leading-snug">{alert.msg}</p>
                <p className="text-xs font-bold text-slate-400 mt-1">{alert.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const TimeEconomyTab = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-blue-950 tracking-tight">Time Economy</h2>
        <p className="text-slate-500 font-medium mt-1">Manage platform liquidity and time inflation.</p>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center gap-2">
        <Clock3 size={18} /> Issue Free Hours
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="System Balance" value="450K" suffix="h" icon={<Clock size={24} />} trend="up" trendValue={5.2} color="indigo" />
      <StatCard title="Deflation Rate" value="2.4" suffix="%" icon={<TrendingUp size={24} />} trend="down" trendValue={0.5} color="emerald" />
      <StatCard title="Avg Transaction" value="2.5" suffix="h" icon={<Activity size={24} />} trend="up" trendValue={12.0} color="blue" />
    </div>

    <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm">
      <h3 className="font-black text-xl text-blue-950 mb-6 flex items-center gap-2">
        <Activity className="text-blue-500" /> Recent Transaction Logs
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-blue-50">
              <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest w-24">Txn ID</th>
              <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Sender</th>
              <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Receiver</th>
              <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
              <th className="py-4 text-xs font-black text-slate-400 uppercase tracking-widest pl-8">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-50/50">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                <td className="py-4 font-mono text-xs text-slate-400">#TX-{9320 + i}</td>
                <td className="py-4 font-bold text-blue-900">User_{Math.floor(Math.random() * 1000)}</td>
                <td className="py-4 font-bold text-blue-900">User_{Math.floor(Math.random() * 1000)}</td>
                <td className="py-4 font-black text-blue-600 text-right">-{Math.floor(Math.random() * 5 + 1)}.0h</td>
                <td className="py-4 pl-8">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-max">
                    <CheckCircle2 size={14} /> Cleared
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const DisputesTab = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-blue-950 tracking-tight">Quality & Disputes</h2>
        <p className="text-slate-500 font-medium mt-1">Review escalated tickets and process refunds.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {[
          { id: 'TKT-1029', userA: 'Sarah M.', userB: 'Ahmed K.', reason: 'Service not delivered on time', amount: 3, status: 'Active' },
          { id: 'TKT-1030', userA: 'John D.', userB: 'Lila P.', reason: 'Quality of work below portfolio', amount: 5, status: 'Active' }
        ].map(ticket => (
          <div key={ticket.id} className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-slate-400">{ticket.id}</span>
                  <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">{ticket.status}</span>
                </div>
                <h4 className="font-bold text-blue-950 text-lg">{ticket.reason}</h4>
                <p className="text-sm font-medium text-slate-500">
                  <span className="text-blue-600 font-bold">{ticket.userA}</span> reported <span className="text-blue-600 font-bold">{ticket.userB}</span> over a {ticket.amount}h service.
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none border border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-4 py-2 rounded-xl transition-all">Review Evidence</button>
              <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-200">Resolve</button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm h-max">
        <h3 className="font-black text-xl text-blue-950 mb-4">Refund Tools</h3>
        <p className="text-sm text-slate-500 font-medium mb-6">Manually reverse transactions or penalize accounts.</p>
        <div className="space-y-4">
          <input type="text" placeholder="Transaction ID or Username" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
          <input type="number" placeholder="Hours to Refund/Deduct" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
          <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-200">Execute Action</button>
        </div>
      </div>
    </div>
  </div>
);

const ReputationTab = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-blue-950 tracking-tight">Reputation & Approvals</h2>
        <p className="text-slate-500 font-medium mt-1">Review Freelance Mode applications and assign badges.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm">
        <h3 className="font-black text-xl text-blue-950 mb-6 flex items-center gap-2">
          <BadgeCheck className="text-blue-500" /> Freelance Mode Queue
        </h3>
        <div className="space-y-4">
          {[
            { id: 'usr_982', name: 'Omar H.', skill: 'Fullstack Dev', hours: 45, rating: 4.9 },
            { id: 'usr_812', name: 'Nadia F.', skill: 'UX Design', hours: 32, rating: 4.7 }
          ].map((app, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                  {app.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-blue-950">{app.name}</h4>
                  <p className="text-xs font-bold text-slate-400">{app.skill} • {app.hours}h Helped • ⭐ {app.rating}</p>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none border border-blue-200 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">Portfolio</button>
                <button className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-md shadow-emerald-200 block">Approve</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm">
        <h3 className="font-black text-xl text-blue-950 mb-6 flex items-center gap-2">
          <ShieldAlert className="text-blue-500" /> Manual Badge Issuance
        </h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <input type="text" placeholder="Username or User ID" className="flex-1 border border-slate-200 rounded-xl px-4 py-2 font-medium focus:ring-2 focus:ring-blue-100 outline-none" />
            <select className="border border-slate-200 rounded-xl px-4 py-2 font-bold text-slate-600 outline-none">
              <option>Super Helper</option>
              <option>Fast Responder</option>
              <option>Community MVP</option>
            </select>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200">
            Grant Badge
          </button>
        </div>
      </div>
    </div>
  </div>
);

const UserManagementTab = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-blue-950 tracking-tight">User Management</h2>
        <p className="text-slate-500 font-medium mt-1">Monitor user activity, verify IDs, and manage accounts.</p>
      </div>
      <div className="flex gap-2">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search users..." className="bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 font-medium focus:ring-2 focus:ring-blue-100 outline-none shadow-sm" />
        </div>
        <button className="bg-white border border-slate-200 text-slate-600 p-2 rounded-xl hover:bg-slate-50"><Filter size={20} /></button>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-blue-50 shadow-sm overflow-hidden">
        <h3 className="font-black text-xl text-blue-950 mb-6">User Database</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-blue-50">
                <th className="py-3 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Balance</th>
                <th className="py-3 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="py-3 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-50">
              {[
                { name: 'Alex Rivera', role: 'Freelancer', bal: '12.5h', status: 'Active' },
                { name: 'Sam Chen', role: 'Member', bal: '4.0h', status: 'Warning' },
                { name: 'Jordan Dee', role: 'Member', bal: '0.0h', status: 'Banned' }
              ].map((u, i) => (
                <tr key={i} className="hover:bg-blue-50/30">
                  <td className="py-3">
                    <p className="font-bold text-blue-950">{u.name}</p>
                    <p className="text-xs font-bold text-slate-400">{u.role}</p>
                  </td>
                  <td className="py-3 font-black text-blue-600">{u.bal}</td>
                  <td className="py-3">
                    <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-md ${
                      u.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                      u.status === 'Warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-slate-400 hover:text-blue-600"><MoreVertical size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm">
        <h3 className="font-black text-xl text-blue-950 mb-6">Activity Heatmap</h3>
        <p className="text-sm font-medium text-slate-500 mb-4">Most demanded skills this week.</p>
        <div className="space-y-3">
          {[
            { skill: 'Graphic Design', pct: 85, color: 'bg-blue-500' },
            { skill: 'Programming', pct: 65, color: 'bg-indigo-500' },
            { skill: 'Language Tutoring', pct: 45, color: 'bg-purple-500' },
            { skill: 'Marketing', pct: 30, color: 'bg-pink-500' }
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">{item.skill}</span>
                <span className="text-slate-400">{item.pct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 1 }} className={`h-full ${item.color} rounded-full`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MonetizationTab = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-blue-950 tracking-tight">Monetization & Finances</h2>
        <p className="text-slate-500 font-medium mt-1">Manage subscriptions, platform commissions, and user payouts.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard title="Monthly Revenue" value="$12.5" suffix="k" icon={<Wallet size={24} />} trend="up" trendValue={15.3} color="emerald" />
      <StatCard title="Pro Subscriptions" value="1,240" icon={<BadgeCheck size={24} />} trend="up" trendValue={4.1} color="purple" />
      <StatCard title="Pending Payouts" value="$3,420" icon={<Activity size={24} />} trend="down" trendValue={1.2} color="amber" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm">
        <h3 className="font-black text-xl text-blue-950 mb-6">Freelancer Payout Requests</h3>
        <div className="space-y-4">
          {[
            { id: 'PAY-892', user: 'Alex Rivera', amount: '$450.00', method: 'PayPal', status: 'Pending' },
            { id: 'PAY-891', user: 'Sarah M.', amount: '$120.00', method: 'Bank Transfer', status: 'Processing' }
          ].map((pay, i) => (
            <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-slate-100 rounded-2xl bg-slate-50">
              <div>
                <p className="font-bold text-blue-950">{pay.user}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono font-bold text-slate-400">{pay.id}</span>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-blue-100 text-blue-700">{pay.method}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <span className="font-black text-emerald-600 text-lg">{pay.amount}</span>
                <button className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-200">Process</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm">
        <h3 className="font-black text-xl text-blue-950 mb-6">Revenue Breakdown</h3>
        <div className="h-48 flex items-end justify-center gap-6 pb-4">
          <div className="flex flex-col items-center gap-2">
            <motion.div initial={{ height: 0 }} animate={{ height: '140px' }} transition={{ duration: 0.8 }} className="w-16 bg-linear-to-t from-purple-600 to-purple-400 rounded-lg shadow-lg relative group">
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100">$8k</span>
            </motion.div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Subscriptions</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <motion.div initial={{ height: 0 }} animate={{ height: '80px' }} transition={{ duration: 0.8 }} className="w-16 bg-linear-to-t from-emerald-600 to-emerald-400 rounded-lg shadow-lg relative group">
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100">$4.5k</span>
            </motion.div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Commissions</span>
          </div>
        </div>
        <p className="text-sm font-medium text-slate-500 text-center mt-4">Commissions collected from Paid Freelance Mode tasks vs Pro Subscriptions.</p>
      </div>
    </div>
  </div>
);

const AnalyticsTab = () => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-black text-blue-950 tracking-tight">Reports & Analytics</h2>
        <p className="text-slate-500 font-medium mt-1">Deep dive into platform trends, supply & demand, and user growth.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm h-full flex flex-col">
        <h3 className="font-black text-xl text-blue-950 mb-6">Supply vs Demand Gap</h3>
        <p className="text-sm font-medium text-slate-500 mb-6">Comparison of offered skills (Supply) vs requested skills (Demand).</p>
        <div className="flex-1 space-y-6">
          {[
            { tag: 'Web Development', supply: 80, demand: 95 },
            { tag: 'Graphic Design', supply: 90, demand: 60 },
            { tag: 'Digital Marketing', supply: 40, demand: 75 },
            { tag: 'Language Tutoring', supply: 85, demand: 50 }
          ].map((stat, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-700">{stat.tag}</span>
                <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${stat.demand > stat.supply ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {stat.demand > stat.supply ? 'Deficit' : 'Surplus'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-16 text-[10px] font-bold text-slate-400 text-right uppercase tracking-widest">Supply</div>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${stat.supply}%` }} transition={{ duration: 1 }} className="h-full bg-blue-400 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 text-[10px] font-bold text-slate-400 text-right uppercase tracking-widest">Demand</div>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${stat.demand}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-indigo-600 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm">
        <h3 className="font-black text-xl text-blue-950 mb-6">Top Performers Leaderboard</h3>
        <div className="space-y-4">
          {[
            { rank: 1, name: 'Alex Rivera', hours: 450, rating: 4.9, avatar: 'A' },
            { rank: 2, name: 'Elena G.', hours: 412, rating: 4.8, avatar: 'E' },
            { rank: 3, name: 'Marcus T.', hours: 380, rating: 4.9, avatar: 'M' },
            { rank: 4, name: 'Sophia W.', hours: 345, rating: 4.7, avatar: 'S' }
          ].map((user) => (
            <div key={user.rank} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
              <div className={`w-8 font-black text-lg text-center ${user.rank === 1 ? 'text-amber-500' : user.rank === 2 ? 'text-slate-400' : user.rank === 3 ? 'text-amber-700' : 'text-slate-300'}`}>
                #{user.rank}
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md ${user.rank === 1 ? 'bg-amber-500' : 'bg-blue-600'}`}>
                {user.avatar}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-950">{user.name}</h4>
                <p className="text-xs font-bold text-slate-400">Total Output: {user.hours}h</p>
              </div>
              <div className="font-black text-blue-600 flex items-center gap-1">
                ⭐ {user.rating}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const UnderConstructionTab = ({ title, icon }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-in zoom-in-95 duration-500">
    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-6">
      {icon}
    </div>
    <h2 className="text-3xl font-black text-blue-950 tracking-tight mb-2">{title}</h2>
    <p className="text-slate-500 font-medium max-w-md mx-auto">
      This module is currently being built as part of the Phase 2 Admin Tools rollout.
    </p>
  </div>
);

export default function AdminDashboard({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'economy': return <TimeEconomyTab />;
      case 'disputes': return <DisputesTab />;
      case 'reputation': return <ReputationTab />;
      case 'users': return <UserManagementTab />;
      case 'monetization': return <MonetizationTab />;
      case 'analytics': return <AnalyticsTab />;
      default: return <UnderConstructionTab title={TABS.find(t => t.id === activeTab)?.name} icon={TABS.find(t => t.id === activeTab)?.icon} />;
    }
  };

  return (
    <div className="bg-slate-50/50 min-h-[calc(100vh-80px)] -mx-4 md:-mx-8 px-4 md:px-8 py-8 flex gap-8 flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="lg:w-72 shrink-0 space-y-2">
        <div className="mb-8 px-4">
          <h1 className="text-xs font-black text-blue-400 tracking-widest uppercase mb-1">Control Center</h1>
          <p className="text-2xl font-black text-blue-950 tracking-tight">Admin Ops</p>
        </div>
        
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.5)]' 
                : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-sm'
            }`}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
