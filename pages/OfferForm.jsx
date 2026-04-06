
import React, { useState } from 'react';

import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Globe,
  Plus,
  Sparkles,
  Handshake,
  Loader2 } from
'lucide-react';
import { motion } from 'framer-motion';

const OfferForm = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    skillsOffered: user.skills.length > 0 ? [user.skills[0]] : [],
    availableTime: 'Weekends',
    location: 'online'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user.is_verified) {
      alert("Verification Pending: Your identity documents are being reviewed. You can explore the community, but you'll be able to post skills once your account is verified by an admin.");
      return;
    }

    if (formData.skillsOffered.length === 0) {
      alert("Please select at least one skill to offer!");
      return;
    }
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Great! Your skill is now in the market. People can now find you and ask for help.");
      navigate('/community');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 space-y-10">
      <Link to="/get-started" className="inline-flex items-center text-white hover:text-blue-200 font-black gap-3 text-lg group transition-all">
        <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
        Back to Choice
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-[0_50px_100px_-20px_rgba(30,64,175,0.2)] rounded-[4rem] p-10 md:p-16 border border-blue-50 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 blur-[100px] rounded-full -z-10"></div>
        <div className="flex items-center gap-8 mb-16">
          <div className="w-24 h-24 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-[0_20px_40px_-10px_rgba(37,99,235,0.5)]">
            <Handshake size={48} />
          </div>
          <div className="space-y-1">
            <h1 className="text-5xl font-black text-blue-900 tracking-tighter">Share a Skill</h1>
            <p className="text-blue-400 text-xl font-bold italic opacity-80 leading-none">Help people and earn time hours.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          <div className="space-y-8">
            <label className="text-3xl font-black text-blue-900 flex items-center gap-4 tracking-tight">
              <Sparkles size={28} className="text-blue-600" />
              What can you do?
            </label>
            <div className="flex flex-wrap gap-5">
              {user.skills.map((skill) =>
              <button
                key={skill}
                type="button"
                onClick={() => {
                  const current = formData.skillsOffered;
                  if (current.includes(skill)) {
                    setFormData({ ...formData, skillsOffered: current.filter((s) => s !== skill) });
                  } else {
                    setFormData({ ...formData, skillsOffered: [...current, skill] });
                  }
                }}
                className={`px-10 py-5 rounded-[2rem] font-black text-xl transition-all border-4 duration-300 ${
                formData.skillsOffered.includes(skill) ?
                'bg-blue-600 text-white border-blue-600 shadow-2xl scale-105' :
                'bg-white text-blue-200 border-blue-50 hover:border-blue-300'}`
                }>
                
                  {skill}
                </button>
              )}
              <Link to="/profile" className="flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black bg-blue-50 text-blue-400 border-4 border-dashed border-blue-100 hover:bg-white hover:border-blue-600 transition-all text-xl">
                <Plus size={24} />
                Add Skills
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <label className="text-3xl font-black text-blue-900 flex items-center gap-4 tracking-tight">
                <Clock size={28} className="text-blue-600" />
                Your Time
              </label>
              <select
                value={formData.availableTime}
                onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
                className="w-full bg-blue-50 border-4 border-transparent rounded-[2.5rem] px-10 py-6 outline-none focus:border-blue-400 focus:bg-white transition-all text-blue-900 font-black text-xl appearance-none shadow-inner">
                
                <option>Anytime (Open)</option>
                <option>Only Weekends</option>
                <option>Only After Work</option>
                <option>Early Mornings</option>
              </select>
            </div>

            <div className="space-y-8">
              <label className="text-3xl font-black text-blue-900 flex items-center gap-4 tracking-tight">
                <MapPin size={28} className="text-blue-600" />
                Where?
              </label>
              <div className="flex gap-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, location: 'online' })}
                  className={`flex-1 flex items-center justify-center gap-4 py-6 rounded-[2.5rem] font-black text-xl transition-all border-4 ${
                  formData.location === 'online' ? 'bg-blue-600 text-white border-blue-600 shadow-2xl scale-105' : 'bg-blue-50 text-blue-300 border-transparent hover:border-blue-400 hover:bg-white'}`
                  }>
                  
                  <Globe size={24} />
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, location: 'offline' })}
                  className={`flex-1 flex items-center justify-center gap-4 py-6 rounded-[2.5rem] font-black text-xl transition-all border-4 ${
                  formData.location === 'offline' ? 'bg-blue-600 text-white border-blue-600 shadow-2xl scale-105' : 'bg-blue-50 text-blue-300 border-transparent hover:border-blue-400 hover:bg-white'}`
                  }>
                  
                  <MapPin size={24} />
                  Meeting
                </button>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-blue-50 flex flex-col items-center text-center space-y-10">
            <p className="text-blue-300 text-xl font-bold max-w-2xl leading-relaxed italic">
              "When you publish this skill, people will see it and ask you for help. Help them well to grow your rating."
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-24 py-8 rounded-[3rem] font-black text-3xl shadow-2xl shadow-blue-900/20 transition-all flex items-center justify-center gap-5 group active:scale-95 disabled:opacity-50">
              
              {isSubmitting ? <Loader2 size={40} className="animate-spin" /> :
              <>
                  Post My Skill
                  <CheckCircle2 size={40} className="group-hover:scale-125 transition-transform" />
                </>
              }
            </button>
          </div>
        </form>
      </motion.div>
    </div>);

};

export default OfferForm;