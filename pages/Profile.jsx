
import React, { useState } from 'react';

import {
  User as UserIcon,
  Settings,
  Clock,
  Award,
  History as HistoryIcon,
  Star,
  FileCheck,
  Plus,
  X,
  Save,
  LogOut,
  ChevronRight,
  Users,
  TrendingUp,
  CheckCircle,
  Info } from
'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';






const Profile = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('about');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(user.bio);
  const [newSkill, setNewSkill] = useState('');

  const tabs = [
  { id: 'about', label: 'About', icon: <UserIcon size={18} /> },
  { id: 'skills', label: 'Skills', icon: <Settings size={18} /> },
  { id: 'history', label: 'History', icon: <HistoryIcon size={18} /> },
  { id: 'badges', label: 'Badges', icon: <Award size={18} /> },
  { id: 'certs', label: 'Certs', icon: <FileCheck size={18} /> },
  { id: 'reviews', label: 'Reviews', icon: <Star size={18} /> }];


  const handleSaveBio = async () => {
    try {
      await api.post('/users/onboarding', { ...user.onboardingData, bio: tempBio, interests: user.skills });
      setUser({ ...user, bio: tempBio });
      setIsEditingBio(false);
    } catch (error) {
      alert("Failed to save bio: " + error.message);
    }
  };

  const addSkill = async () => {
    const skill = newSkill.trim();
    if (skill && !user.skills.includes(skill)) {
      const updatedSkills = [...user.skills, skill];
      try {
        await api.post('/users/onboarding', { ...user.onboardingData, interests: updatedSkills });
        setUser({ ...user, skills: updatedSkills });
        setNewSkill('');
      } catch (error) {
        alert("Failed to add skill: " + error.message);
      }
    }
  };

  const removeSkill = async (skillToRemove) => {
    const updatedSkills = user.skills.filter((s) => s !== skillToRemove);
    try {
      await api.post('/users/onboarding', { ...user.onboardingData, interests: updatedSkills });
      setUser({ ...user, skills: updatedSkills });
    } catch (error) {
      alert("Failed to remove skill: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      {/* Profile Header */}
      <div className="bg-white shadow-[0_50px_100px_-20px_rgba(30,64,175,0.1)] rounded-[4rem] p-10 md:p-12 flex flex-col lg:flex-row items-center gap-12 border border-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50/50 blur-3xl rounded-full"></div>
        <div className="relative group">
          <img src={user.avatar} alt={user.username} className="w-52 h-52 rounded-[3.5rem] object-cover border-8 border-white shadow-2xl group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute -bottom-3 -right-3 bg-blue-600 w-16 h-16 rounded-3xl border-8 border-white flex items-center justify-center shadow-xl">
             <Star size={24} className="text-white fill-current" />
          </div>
        </div>
        
        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="space-y-3">
            <h1 className="text-5xl font-black text-blue-900 tracking-tighter">{user.username}</h1>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5">
              <div className="flex items-center gap-2 text-blue-600 font-black bg-blue-50 px-6 py-2.5 rounded-2xl shadow-sm border border-blue-100">
                <Star size={20} fill="currentColor" />
                {user.ratingAvg} <span className="text-blue-400 font-bold text-xs uppercase ml-1">Rating</span>
              </div>
              <div className="flex items-center gap-2 text-blue-800 font-black bg-blue-50 px-6 py-2.5 rounded-2xl shadow-sm border border-blue-100">
                <Clock size={20} />
                {user.timeBalance}h <span className="text-blue-400 font-bold text-xs uppercase ml-1">Balance</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-[1.8rem] font-black text-lg shadow-xl shadow-blue-100 transition-all active:scale-95">Settings</button>
            <button className="bg-white border-2 border-blue-50 text-blue-400 px-8 py-4 rounded-[1.8rem] font-black text-lg transition-all flex items-center gap-3 hover:bg-blue-50 hover:text-blue-600 active:scale-95">
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-[2.5rem] p-3 border border-blue-50 shadow-xl overflow-x-auto flex justify-center sticky top-24 z-30">
        <div className="flex items-center gap-2 min-w-max">
          {tabs.map((tab) =>
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-5 rounded-[1.8rem] font-black transition-all duration-300 tracking-tight text-sm uppercase tracking-widest ${
            activeTab === tab.id ?
            'bg-blue-600 text-white shadow-xl scale-105' :
            'text-blue-400 hover:text-blue-600 hover:bg-blue-50'}`
            }>
            
              {tab.icon}
              {tab.label}
            </button>
          )}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow-2xl rounded-[4rem] p-10 md:p-16 min-h-[500px] border border-blue-50 relative overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'about' &&
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10">
            
              <div className="flex items-center justify-between">
                <h3 className="text-4xl font-black text-blue-900 tracking-tight">Biography</h3>
                {!isEditingBio &&
              <button onClick={() => setIsEditingBio(true)} className="bg-blue-50 text-blue-600 px-6 py-2 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100">Edit Bio</button>
              }
              </div>
              {isEditingBio ?
            <div className="space-y-6">
                  <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                className="w-full h-52 p-8 rounded-[2.5rem] bg-blue-50 border-4 border-blue-100 focus:border-blue-400 focus:bg-white outline-none text-blue-900 text-xl font-bold leading-relaxed resize-none transition-all shadow-inner"
                placeholder="Tell us about yourself..." />
              
                  <div className="flex justify-end gap-5">
                    <button onClick={() => setIsEditingBio(false)} className="px-8 py-4 rounded-2xl text-blue-400 font-black uppercase tracking-widest text-xs">Cancel</button>
                    <button onClick={handleSaveBio} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-blue-100">
                      <Save size={20} />
                      Save Changes
                    </button>
                  </div>
                </div> :

            <p className="text-2xl text-blue-800 leading-relaxed font-bold italic bg-blue-50/20 p-10 rounded-[3rem] border-l-[10px] border-blue-600 shadow-sm">
                  "{user.bio}"
                </p>
            }
              {user.onboardingData && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="bg-blue-50 p-5 rounded-[2rem] border border-blue-100 shadow-sm">
                    <div className="text-[10px] uppercase font-black text-blue-400 tracking-widest mb-1">Intent</div>
                    <div className="font-bold text-blue-900 capitalize">{user.onboardingData.intent}</div>
                  </div>
                  <div className="bg-purple-50 p-5 rounded-[2rem] border border-purple-100 shadow-sm">
                    <div className="text-[10px] uppercase font-black text-purple-400 tracking-widest mb-1">Focus</div>
                    <div className="font-bold text-purple-900 capitalize">{user.onboardingData.category === 'other' ? user.onboardingData.otherCategory : user.onboardingData.category}</div>
                  </div>
                  <div className="bg-emerald-50 p-5 rounded-[2rem] border border-emerald-100 shadow-sm">
                    <div className="text-[10px] uppercase font-black text-emerald-400 tracking-widest mb-1">Level</div>
                    <div className="font-bold text-emerald-900 capitalize">{user.onboardingData.level}</div>
                  </div>
                  <div className="bg-amber-50 p-5 rounded-[2rem] border border-amber-100 shadow-sm">
                    <div className="text-[10px] uppercase font-black text-amber-400 tracking-widest mb-1">Goal</div>
                    <div className="font-bold text-amber-900 capitalize">{user.onboardingData.goal?.replace('-', ' ')}</div>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-blue-50">
                {[
              { label: 'Helped', val: '15', icon: <Users size={20} /> },
              { label: 'Tasks', val: '8', icon: <TrendingUp size={20} /> },
              { label: 'Badges', val: '12', icon: <Award size={20} /> },
              { label: 'Certs', val: '4', icon: <FileCheck size={20} /> }].
              map((stat, i) =>
              <div key={i} className="text-center p-8 bg-blue-50 rounded-[2.5rem] space-y-2 border border-blue-100 hover:bg-white hover:shadow-xl transition-all duration-300">
                    <div className="text-blue-400 mb-2 flex justify-center">{stat.icon}</div>
                    <div className="text-4xl font-black text-blue-900 tracking-tighter">{stat.val}</div>
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">{stat.label}</div>
                  </div>
              )}
              </div>
            </motion.div>
          }

          {activeTab === 'skills' &&
          <motion.div
            key="skills"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10">
            
              <h3 className="text-4xl font-black text-blue-900 tracking-tight">My Skills</h3>
              <div className="flex flex-wrap gap-4">
                {user.skills.map((skill) =>
              <div key={skill} className="bg-blue-600 text-white px-8 py-4 rounded-[1.8rem] font-black text-lg flex items-center gap-4 group shadow-lg shadow-blue-200 hover:scale-105 transition-all">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="p-1 hover:bg-white/20 rounded-lg transition-all">
                      <X size={16} />
                    </button>
                  </div>
              )}
                <div className="flex items-center gap-4 bg-white border-4 border-dashed border-blue-100 px-8 py-4 rounded-[1.8rem] group hover:border-blue-400 transition-all">
                  <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add new..."
                  className="bg-transparent outline-none w-32 text-lg font-black text-blue-900 placeholder:text-blue-300"
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
                
                  <button onClick={addSkill} className="bg-blue-50 text-blue-600 p-2 rounded-xl shadow-sm hover:scale-110 transition-transform">
                    <Plus size={24} />
                  </button>
                </div>
              </div>
              <div className="bg-blue-50 p-8 rounded-3xl flex gap-4 items-start border border-blue-100 shadow-inner">
                <Info className="text-blue-600 shrink-0 mt-1" size={24} />
                <p className="text-blue-900 font-bold text-lg leading-relaxed">
                  List your skills clearly. This helps us find the best tasks for you!
                </p>
              </div>
            </motion.div>
          }

          {activeTab === 'badges' &&
          <motion.div
            key="badges"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-3 gap-8">
            
              {user.badges.map((badge) =>
            <div key={badge.id} className={`p-10 rounded-[3rem] border-4 transition-all duration-500 relative group overflow-hidden ${
            badge.unlocked ?
            'bg-blue-600 border-blue-600 shadow-2xl shadow-blue-200 text-white' :
            'bg-blue-50 border-blue-100 text-blue-200 opacity-60 grayscale'}`
            }>
                  <div className="text-7xl mb-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl">
                    {badge.icon}
                  </div>
                  <h4 className="text-2xl font-black mb-3 tracking-tight">{badge.title}</h4>
                  <p className={`${badge.unlocked ? 'text-blue-100 font-bold' : 'text-blue-300'} text-sm leading-relaxed`}>{badge.description}</p>
                  
                  <div className="absolute top-6 right-6 font-black uppercase tracking-widest text-[9px] bg-white/20 px-3 py-1 rounded-full">
                     {badge.unlocked ? 'Earned' : 'Locked'}
                  </div>
                </div>
            )}
            </motion.div>
          }

          {activeTab === 'history' &&
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8">
            
              <h3 className="text-4xl font-black text-blue-900 tracking-tight">Timeline</h3>
              <div className="space-y-6">
                {[
              { title: 'Excel Training Session', type: 'Helping', date: 'Yesterday', status: 'Done', time: '+2h', icon: <CheckCircle className="text-blue-600" /> },
              { title: 'Logo Design Request', type: 'Need Help', date: '3 days ago', status: 'Done', time: '-1.5h', icon: <Clock className="text-blue-600" /> },
              { title: 'React Hooks Class', type: 'Helping', date: 'Last Week', status: 'Done', time: '+4h', icon: <Award className="text-blue-600" /> }].
              map((item, idx) =>
              <div key={idx} className="flex flex-col sm:flex-row items-center justify-between p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 hover:bg-white hover:shadow-2xl transition-all duration-300 gap-8">
                    <div className="flex items-center gap-6 w-full">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg ${
                  item.type === 'Helping' ? 'bg-blue-600 text-white shadow-blue-100' : 'bg-white text-blue-600'}`
                  }>
                        {item.type[0]}
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-blue-900 tracking-tight">{item.title}</h4>
                        <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1">{item.date} • <span className="text-blue-600">{item.type}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="bg-white px-4 py-1.5 rounded-xl text-[9px] font-black text-blue-400 uppercase tracking-widest shadow-sm border border-blue-100">{item.status}</span>
                      <span className={`text-4xl font-black tracking-tighter ${item.time.startsWith('+') ? 'text-blue-600' : 'text-blue-400'}`}>
                        {item.time}
                      </span>
                    </div>
                  </div>
              )}
              </div>
            </motion.div>
          }

          {(activeTab === 'certs' || activeTab === 'reviews') &&
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center space-y-8">
            
              <div className="w-32 h-32 bg-blue-50 rounded-[3rem] flex items-center justify-center text-blue-200 shadow-inner">
                {activeTab === 'certs' ? <FileCheck size={64} /> : <Star size={64} />}
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-blue-900 tracking-tight">Nothing here yet</h3>
                <p className="text-blue-400 text-xl font-bold">Help someone today to start building your profile!</p>
              </div>
              <Link to="/community" className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-100 flex items-center gap-3 hover:-translate-y-1 transition-all">
                Go to Market
                <ChevronRight size={24} />
              </Link>
            </motion.div>
          }
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 bg-white shadow-2xl p-10 rounded-[3.5rem] border border-blue-50">
        <Link to="/" className="text-blue-900 font-black hover:text-blue-600 flex items-center gap-3 text-xl tracking-tight transition-colors">
           &larr; Back to Home
        </Link>
        <Link to="/pricing" className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-[2rem] font-black text-2xl shadow-2xl shadow-blue-200 transition-all hover:-translate-y-2">
          Add More Hours &rarr;
        </Link>
      </div>
    </div>);

};

export default Profile;