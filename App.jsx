
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  Home as HomeIcon,
  Users,
  CreditCard,
  User as UserIcon,
  Flame,
  Clock,
  Menu,
  X,
  MessageSquare,
  LogOut,
  Shield,
  Lock
} from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getStoredUser, saveUser, getToken, removeToken } from './store';
import { api } from './services/api';

// Pages
import Home from './pages/Home';
import GetStarted from './pages/GetStarted';
import Profile from './pages/Profile';
import Community from './pages/Community';
import RequestForm from './pages/RequestForm';
import OfferForm from './pages/OfferForm';
import Pricing from './pages/Pricing';
import FreelanceMode from './pages/FreelanceMode';
import Auth from './pages/Auth';
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';
import Onboarding from './pages/Onboarding';
import Streaks from './pages/Streaks';
import { StreakBadge, loadStreaks } from './components/StreakSystem';
import EchoTimeLogo from './components/EchoTimeLogo';
import { path } from 'framer-motion/client';

// Components
// import { AIAssistant } from './components/AIAssistant';

const Navbar = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
  { name: 'Home', path: '/', icon: <HomeIcon size={18} /> },
  { name: 'Market', path: '/community', icon: <Users size={18} /> },
  { name: 'Freelance', path: '/freelance', icon: <Lock size={18} /> },
  { name: 'Streaks', path: '/streaks', icon: <Flame size={18} /> },
  { name: 'Messages', path: '/chat', icon: <MessageSquare size={18} /> },
  { name: 'Pricing', path: '/pricing', icon: <CreditCard size={18} /> },
  { name: 'Profile', path: '/profile', icon: <UserIcon size={18} /> },
  ...(user.role === 'admin' ? [{ name: 'Admin', path: '/admin', icon: <Shield size={18} /> }] : [])];


  if (!user.isAuthenticated) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-blue-100 px-4 md:px-8 py-3">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <EchoTimeLogo size={40} />
          <span className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-blue-700 to-blue-500 tracking-tight">Echo Time</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-1.5 font-bold transition-all duration-300 relative py-2 ${
            location.pathname === link.path ? 'text-blue-600' : 'text-slate-500 hover:text-blue-500'}`
            }>
            
              {link.icon}
              {link.name}
              {location.pathname === link.path &&
            <motion.div layoutId="nav-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
            }
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100 shadow-sm">
              <Clock size={16} className="text-blue-600" />
              <span className="font-black text-blue-700">{user.timeBalance}h</span>
            </div>
            <StreakBadge streaks={loadStreaks()} onClick={() => window.location.hash = '#/streaks'} />
          </div>
          
          <button className="hidden md:flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors" onClick={onLogout}>
            <LogOut size={20} />
          </button>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-blue-100 py-6 px-6 flex flex-col gap-4 shadow-2xl">
          
            {navLinks.map((link) =>
          <Link
            key={link.path}
            to={link.path}
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 text-slate-700 font-bold">
            
                {link.icon}
                {link.name}
              </Link>
          )}
            <button onClick={onLogout} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 text-red-600 font-bold">
              <LogOut size={18} /> Logout
            </button>
          </motion.div>
        }
      </AnimatePresence>
    </nav>);

};

const App = () => {
  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    saveUser(user);
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (token && !user.isAuthenticated) {
        try {
          const response = await api.get('/users/me');
          setUser({ ...response.data, isAuthenticated: true, hasCompletedOnboarding: response.data.is_onboarded });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          removeToken();
          setUser({ ...INITIAL_USER, isAuthenticated: false });
        }
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    removeToken();
    setUser({ isAuthenticated: false, hasCompletedOnboarding: false });
  };

  const PageWrapper = ({ children }) => {
    return (
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}>
        
        {children}
      </motion.div>);

  };

  const ProtectedRoute = ({ children }) => {
    if (!user.isAuthenticated) return <Navigate to="/auth" />;
    return <PageWrapper>{children}</PageWrapper>;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col animated-gradient pb-20 md:pb-0 selection:bg-blue-200">
        <Navbar user={user} onLogout={handleLogout} />
        
        <main className={`flex-1 ${user.isAuthenticated ? 'mt-20' : ''} px-4 md:px-8 max-w-7xl mx-auto w-full py-8`}>
          <Routes>
            <Route path="/auth" element={!user.isAuthenticated ? <Auth onLogin={setUser} /> : <Navigate to="/" />} />
            
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/get-started" element={<ProtectedRoute><GetStarted /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile user={user} setUser={setUser} /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community user={user} setUser={setUser} /></ProtectedRoute>} />
            <Route path="/request-help" element={<ProtectedRoute><RequestForm user={user} setUser={setUser} /></ProtectedRoute>} />
            <Route path="/offer-help" element={<ProtectedRoute><OfferForm user={user} setUser={setUser} /></ProtectedRoute>} />
            <Route path="/pricing" element={<ProtectedRoute><Pricing user={user} setUser={setUser} /></ProtectedRoute>} />
            <Route path="/freelance" element={<ProtectedRoute><FreelanceMode user={user} setUser={setUser} /></ProtectedRoute>} />
            <Route path="/chat" element={user.isAuthenticated ? <Chat user={user} /> : <Navigate to="/auth" />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard user={user} /></ProtectedRoute>} />
            <Route path="/streaks" element={<ProtectedRoute><Streaks user={user} setUser={setUser} /></ProtectedRoute>} />
          </Routes>
        </main>

        {user.isAuthenticated &&
        <footer className="bg-white/10 backdrop-blur-xl py-12 border-t border-white/20 mt-20 hidden md:block">
            <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-blue-100">
              <div className="flex flex-col gap-2">
                <span className="text-white font-black text-2xl tracking-tight">Echo Time</span>
                <p className="text-sm opacity-80">Building futures, one hour at a time.</p>
              </div>
              <p className="text-xs">© {new Date().getFullYear()} Echo Time. All rights reserved.</p>
            </div>
          </footer>
        }
      </div>
    </Router>);

};

export default App;