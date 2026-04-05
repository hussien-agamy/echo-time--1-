
import React from 'react';
import { Lock, Zap, Clock, Rocket, AlertTriangle, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const FreelanceMode = ({ user, setUser }) => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center relative overflow-hidden px-4 py-20">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.1)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 -z-20 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Main Content Container */}
      <div className="max-w-4xl w-full text-center space-y-12">
        
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-32 h-32 md:w-48 md:h-48 mx-auto bg-blue-600 rounded-[3.5rem] flex items-center justify-center shadow-[0_40px_100px_-15px_rgba(30,64,175,0.6)] relative group"
        >
          <div className="absolute inset-0 bg-blue-400 rounded-[3.5rem] animate-ping opacity-20 group-hover:opacity-40 transition-opacity" />
          <Zap size={64} className="text-white relative z-10 md:scale-150" />
        </motion.div>

        {/* Text Section */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-blue-900/50 border border-blue-500/30 px-6 py-2 rounded-full backdrop-blur-md"
          >
            <Clock size={16} className="text-blue-400 animate-pulse" />
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Phase 2: Commercial Launch</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-none"
          >
            COMING<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">SOON</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-blue-100/60 text-xl md:text-2xl max-w-2xl mx-auto font-bold leading-relaxed tracking-tight"
          >
            The future of <span className="text-blue-400">Professional Time-Exchange</span> is currently under construction. 
            We are fine-tuning the secure Stripe-integrated infrastructure for global freelance markets.
          </motion.p>
        </div>

        {/* Features Preview Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6 pt-12"
        >
          {[
            { icon: <Rocket size={24} />, title: "Paid Tasks", label: "Real Money Payments" },
            { icon: <Briefcase size={24} />, title: "Pro Badges", label: "Global Verification" },
            { icon: <AlertTriangle size={24} />, title: "Tax Ready", label: "Seamless Compliance" }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-xl group hover:bg-white/10 transition-all">
              <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="font-black text-white text-lg tracking-tight mb-1">{item.title}</div>
              <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{item.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Call to Action (Fake) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-12"
        >
          <button className="bg-white text-blue-900 px-12 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-blue-900/40 hover:scale-105 active:scale-95 transition-all opacity-50 cursor-not-allowed">
            Get Notified on Launch
          </button>
        </motion.div>

      </div>
    </div>
  );
};

export default FreelanceMode;