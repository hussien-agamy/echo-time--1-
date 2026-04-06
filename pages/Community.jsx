
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { api } from '../services/api';
import { getStoredRequests, saveRequests } from '../store';
import {
  Search,
  Filter,
  Clock,
  MapPin,
  Globe,
  Plus,

  ChevronRight,
  TrendingUp,
  Layers,
  ArrowRight } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';








const Community = ({ user, setUser, chatThreads, setChatThreads }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(null);

  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get('/tasks/open');
        // Map backend fields to frontend expected fields
        const mappedTasks = response.data.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description,
          skillNeeded: Array.isArray(t.required_skills) ? t.required_skills[0] : t.required_skills,
          timeRequired: t.estimated_hours,
          location: 'online', // Defaulting for now
          requesterId: t.creator_id,
          status: t.status
        }));
        setRequests(mappedTasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const handleHelp = (req) => {
    setIsProcessing(req.id);

    // Simulate matching delay
    setTimeout(() => {
      // Create a new chat thread for the matched task
      const threadId = 'chat_' + req.requesterId;
      const existingThread = chatThreads.find((t) => t.id === threadId);

      const newMessage = {
        id: 'initial_' + Date.now(),
        senderId: 'system',
        text: `Success! You are now matched for: ${req.title}. Use this chat to plan your meeting.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      if (existingThread) {
        setChatThreads((prev) => prev.map((t) =>
        t.id === threadId ?
        {
          ...t,
          messages: [...t.messages, newMessage],
          lastMessage: `New Match: ${req.title}`
        } :
        t
        ));
      } else {
        const newThread = {
          id: threadId,
          participantId: req.requesterId,
          participantName: 'Expert ' + req.requesterId.slice(-4),
          participantAvatar: `https://picsum.photos/100/100?random=${req.id}`,
          messages: [newMessage],
          lastMessage: 'You matched!'
        };
        setChatThreads((prev) => [newThread, ...prev]);
      }

      // Remove the request from the public market as it is now matched
      const updatedRequests = requests.filter((r) => r.id !== req.id);
      setRequests(updatedRequests);
      saveRequests(updatedRequests);

      // Increase user's balance because they are helping
      setUser({
        ...user,
        timeBalance: user.timeBalance + req.timeRequired,
        reviewsCount: user.reviewsCount + 1
      });

      setIsProcessing(null);
      // Go to chat page immediately to organize
      navigate('/chat');
    }, 1200);
  };

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'all' ? true : req.location.toLowerCase() === filter;
    const matchesSearch = (req.skillNeeded || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-12 py-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block bg-blue-100 text-blue-700 px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">
            
            Public Market
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tighter">Find Tasks & Help People</h1>
          <p className="text-blue-50 text-xl max-w-xl font-medium opacity-90">Look for things you can do. Every task you finish earns you hours to spend on yourself.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-300" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills (e.g. Logo, Coding)..."
              className="w-full bg-white rounded-2xl pl-12 pr-6 py-5 shadow-2xl border-none outline-none text-blue-900 font-black focus:ring-4 focus:ring-blue-400 transition-all placeholder:text-blue-200" />
            
          </div>
          <button className="bg-white px-8 py-5 rounded-2xl shadow-2xl text-blue-900 font-black flex items-center justify-center gap-3 hover:bg-blue-50 transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-blue-900/10 backdrop-blur-md p-2 rounded-2xl inline-flex gap-2 border border-white/10">
            {['All', 'Online', 'Physical'].map((f) =>
            <button
              key={f}
              onClick={() => setFilter(f.toLowerCase())}
              className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              filter === f.toLowerCase() ? 'bg-white text-blue-600 shadow-xl scale-105' : 'text-white hover:bg-white/10'}`
              }>
              
                {f}
              </button>
            )}
          </div>

          <div className="grid gap-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4 text-blue-200">
                <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-black uppercase tracking-widest text-xs">Loading market...</span>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredRequests.length === 0 ? (
                  <div className="bg-white/5 border border-white/10 rounded-[3rem] p-20 text-center space-y-4">
                    <h3 className="text-2xl font-black text-white opacity-50">No tasks found.</h3>
                    <p className="text-blue-200">Try adjusting your filters or search query!</p>
                  </div>
                ) : (
                  filteredRequests.map((req) =>
                  <motion.div
                    key={req.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ scale: 1.01 }}
                    className="group bg-white shadow-2xl rounded-[3rem] p-10 border border-blue-50 hover:border-blue-200 transition-all duration-300 relative overflow-hidden">
                    
                      {isProcessing === req.id &&
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-black text-blue-600 uppercase tracking-widest text-xs">Matching now...</span>
                        </div>
                    }
                      
                      <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="space-y-5 flex-1">
                          <div className="flex items-center gap-4">
                            <span className="bg-blue-600 text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100">
                              {req.skillNeeded}
                            </span>
                            <span className="flex items-center gap-2 text-blue-300 text-xs font-black uppercase tracking-widest">
                              {req.location === 'online' ? <Globe size={14} /> : <MapPin size={14} />}
                              {req.location}
                            </span>
                            {req.requesterId === user.id && (
                              <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                                Your Task
                              </span>
                            )}
                          </div>
                          <h3 className="text-3xl font-black text-blue-900 group-hover:text-blue-600 transition-colors tracking-tight leading-none">{req.title}</h3>
                          <p className="text-blue-800/60 font-medium leading-relaxed text-lg">{req.description}</p>
                          
                          <div className="flex items-center gap-8 pt-4 border-t border-blue-50">
                            <div className="flex items-center gap-3 text-blue-700 font-black text-xl tracking-tighter">
                              <Clock size={20} className="text-blue-600" />
                              <span>{req.timeRequired} Hours</span>
                            </div>
                            <div className="flex -space-x-3">
                              {[1, 2, 3].map((i) =>
                            <img key={i} src={`https://picsum.photos/40/40?random=${req.id + i}`} className="w-10 h-10 rounded-2xl border-4 border-white shadow-xl" alt="" />
                            )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-row md:flex-col justify-end gap-4 min-w-[180px]">
                          {req.requesterId === user.id ? (
                            <button
                              disabled
                              className="flex-1 md:flex-none border-2 border-emerald-200 bg-emerald-50 text-emerald-600 px-8 py-5 rounded-[2rem] font-black text-lg shadow-sm flex items-center justify-center gap-3 cursor-not-allowed">
                              Your Task
                            </button>
                          ) : (
                            <button
                              onClick={() => handleHelp(req)}
                              className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-3 group active:scale-95">
                              Help Now
                              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="space-y-10">
          <div className="bg-white rounded-[3rem] p-10 border border-blue-100 shadow-2xl space-y-8">
            <h3 className="text-2xl font-black text-blue-900 tracking-tight">Your Activity</h3>
            <div className="space-y-5">
              <Link to="/request-help" className="flex items-center justify-between p-7 bg-blue-50 rounded-[2rem] group hover:bg-blue-600 transition-all shadow-inner border border-blue-100">
                <div className="flex items-center gap-5">
                  <div className="bg-white p-4 rounded-2xl text-blue-600 shadow-xl group-hover:scale-110 transition-transform"><Plus size={24} /></div>
                  <span className="font-black text-blue-900 group-hover:text-white text-lg tracking-tight">Ask for Help</span>
                </div>
                <ChevronRight className="text-blue-200 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/offer-help" className="flex items-center justify-between p-7 bg-blue-600 rounded-[2rem] group hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200">
                <div className="flex items-center gap-5">
                  <div className="bg-white/20 p-4 rounded-2xl text-white group-hover:scale-110 transition-transform"><TrendingUp size={24} /></div>
                  <span className="font-black text-white text-lg tracking-tight">Post Your Skill</span>
                </div>
                <ChevronRight className="text-blue-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-blue-700 to-blue-950 rounded-[3rem] p-10 text-white space-y-8 shadow-[0_40px_80px_-15px_rgba(30,64,175,0.4)] relative overflow-hidden group">
            
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
            <h3 className="text-2xl font-black flex items-center gap-3 relative z-10 tracking-tight">
              <Layers size={28} className="text-blue-300" />
              Market View
            </h3>
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest border-b border-white/10 pb-4">
                <span className="opacity-70">Active Tasks</span>
                <span className="text-blue-200">{requests.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black uppercase tracking-widest">
                <span className="opacity-70">Hours Collected</span>
                <span className="text-blue-200">+{user.reviewsCount * 2}h</span>
              </div>
            </div>
            <Link to="/profile" className="w-full block bg-white text-blue-900 py-5 rounded-[2rem] font-black text-center text-lg shadow-2xl hover:bg-blue-50 transition-all active:scale-95 relative z-10">
              Go to Profile
            </Link>
          </motion.div>
        </div>
      </div>
    </div>);

};

export default Community;