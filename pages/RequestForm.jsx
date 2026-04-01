
import React, { useState } from 'react';

import { saveRequests, getStoredRequests } from '../store';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Send,

  MapPin,
  Globe,
  Info,
  Layers,
  Loader2 } from
'lucide-react';
import { motion } from 'framer-motion';

const RequestForm = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillNeeded: '',
    timeRequired: 1,
    location: 'online',
    offlineDetails: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user.timeBalance < formData.timeRequired) {
      alert("Insufficient time balance! You need to help others or purchase more hours.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newRequest = {
        id: `req_${Date.now()}`,
        ...formData,
        status: 'open',
        requesterId: user.id,
        createdAt: new Date().toISOString()
      };

      const currentRequests = getStoredRequests();
      saveRequests([...currentRequests, newRequest]);

      // Deduct time
      setUser({ ...user, timeBalance: user.timeBalance - formData.timeRequired });

      setIsSubmitting(false);
      navigate('/community');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-10">
      <Link to="/get-started" className="inline-flex items-center text-white hover:text-blue-200 font-black gap-3 text-lg group transition-all">
        <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
        Return to Selection
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-[0_50px_100px_-20px_rgba(30,64,175,0.2)] rounded-[4rem] p-10 md:p-16 border border-blue-50 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/20 blur-3xl rounded-full"></div>
        <div className="flex items-center gap-6 mb-16">
          <div className="w-20 h-20 bg-blue-600 text-white rounded-[1.8rem] flex items-center justify-center shadow-2xl shadow-blue-200">
            <Layers size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black text-blue-900 tracking-tighter leading-none">Post Request</h1>
            <p className="text-blue-500 text-xl font-medium italic opacity-80 mt-2">What expertise do you require?</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] ml-2">Request Title</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Summarize your need..."
                  className="w-full bg-blue-50 border-4 border-blue-100 rounded-3xl px-8 py-5 outline-none focus:border-blue-400 focus:bg-white transition-all text-blue-900 font-black text-lg shadow-inner" />
                
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] ml-2">Target Skill</label>
                <input
                  required
                  type="text"
                  value={formData.skillNeeded}
                  onChange={(e) => setFormData({ ...formData, skillNeeded: e.target.value })}
                  placeholder="e.g. Design, Code, Audio..."
                  className="w-full bg-blue-50 border-4 border-blue-100 rounded-3xl px-8 py-5 outline-none focus:border-blue-400 focus:bg-white transition-all text-blue-900 font-black text-lg shadow-inner" />
                
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <label className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Time Investment</label>
                  <span className="text-blue-700 font-black text-xl tracking-tighter">{formData.timeRequired} Hours</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={formData.timeRequired}
                  onChange={(e) => setFormData({ ...formData, timeRequired: parseFloat(e.target.value) })}
                  className="w-full h-3 bg-blue-100 rounded-xl appearance-none cursor-pointer accent-blue-600" />
                
                <div className="flex justify-between text-xs text-blue-300 font-black px-1 uppercase tracking-widest">
                  <span>0.5h</span>
                  <span>5.0h</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] ml-2">Context & Goals</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What exactly should the helper accomplish?"
                  className="w-full h-52 bg-blue-50 border-4 border-blue-100 rounded-3xl px-8 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all text-blue-900 font-bold text-lg resize-none shadow-inner leading-relaxed" />
                
              </div>
              
              <div className="space-y-3">
                <label className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] ml-2">Interaction Mode</label>
                <div className="flex gap-5">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, location: 'online' })}
                    className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-3xl font-black text-lg transition-all border-4 ${
                    formData.location === 'online' ? 'bg-blue-600 text-white border-blue-600 shadow-2xl scale-105' : 'bg-blue-50 text-blue-400 border-blue-100 hover:border-blue-200 hover:bg-white'}`
                    }>
                    
                    <Globe size={20} />
                    Remote
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, location: 'offline' })}
                    className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-3xl font-black text-lg transition-all border-4 ${
                    formData.location === 'offline' ? 'bg-blue-600 text-white border-blue-600 shadow-2xl scale-105' : 'bg-blue-50 text-blue-400 border-blue-100 hover:border-blue-200 hover:bg-white'}`
                    }>
                    
                    <MapPin size={20} />
                    On-Site
                  </button>
                </div>
              </div>
            </div>
          </div>

          {formData.location === 'offline' &&
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-3 overflow-hidden">
            
              <label className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] ml-2">Venue / Coordination</label>
              <input
              type="text"
              value={formData.offlineDetails}
              onChange={(e) => setFormData({ ...formData, offlineDetails: e.target.value })}
              placeholder="Specific city or virtual coordinates..."
              className="w-full bg-blue-50 border-4 border-blue-100 rounded-3xl px-8 py-5 outline-none focus:border-blue-400 focus:bg-white transition-all text-blue-900 font-black text-lg shadow-inner" />
            
            </motion.div>
          }

          <div className="flex flex-col lg:flex-row items-center gap-10 pt-16 border-t border-blue-100">
            <div className="flex-1 bg-blue-50/80 p-10 rounded-[2.5rem] flex gap-6 items-start border border-blue-100 shadow-inner">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shrink-0">
                <Info size={24} />
              </div>
              <div className="space-y-2">
                <p className="text-lg text-blue-900 font-black tracking-tight">Financial Lock</p>
                <p className="text-sm text-blue-700 font-bold leading-relaxed opacity-80">Echo Time will reserve these credits from your balance until the session is verified as complete. You can cancel at any time for a full refund.</p>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full lg:w-auto bg-blue-600 hover:bg-blue-700 text-white px-20 py-7 rounded-[2.5rem] font-black text-2xl shadow-[0_30px_60px_-15px_rgba(37,99,235,0.4)] transition-all flex items-center justify-center gap-4 group active:scale-95 disabled:opacity-50">
              
              {isSubmitting ? <Loader2 size={32} className="animate-spin" /> :
              <>
                  Confirm Request
                  <Send size={32} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                </>
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>);

};

export default RequestForm;