
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Star, Briefcase, Zap, Shield, Heart, ArrowRight, Sparkles } from 'lucide-react';

const FeatureCard = ({ icon, title, desc }) =>
<motion.div
  whileHover={{ y: -10, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300 }}
  className="bg-white shadow-2xl p-10 rounded-[2.5rem] border border-blue-100 group flex flex-col items-start">
  
    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-blue-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-blue-700 leading-relaxed font-medium opacity-80">{desc}</p>
  </motion.div>;


const Home = () => {
  return (
    <div className="space-y-32 py-10">
      <section className="flex flex-col lg:flex-row items-center justify-between gap-16 min-h-[75vh]">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 space-y-10 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 bg-blue-500/20 px-5 py-2.5 rounded-full border border-white/20 text-blue-100 font-black text-xs uppercase tracking-[0.2em]">
            <Sparkles size={14} /> The Best Way to Trade Skills
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
            Share Time. <br />
            <span className="text-blue-200">Grow Fast.</span>
          </h1>
          <p className="text-xl text-blue-50 leading-relaxed max-w-lg mx-auto lg:mx-0 font-medium opacity-90">
            Echo Time is a group where people help each other. You don't need money. Just use your skills to help others and get help back.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
            <Link to="/get-started" className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1">
              Start Now
              <ArrowRight size={20} />
            </Link>
            <Link to="/community" className="bg-blue-700/40 text-white backdrop-blur border border-white/20 px-10 py-5 rounded-[2rem] font-black text-xl transition-all flex items-center justify-center hover:bg-blue-700/60 transform hover:-translate-y-1">
              Find Help
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1 }}
          className="lg:w-1/2 relative">
          
          <div className="bg-white p-10 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(30,64,175,0.4)] border border-white/40 transform hover:scale-[1.02] transition-transform duration-700">
            <div className="grid grid-cols-2 gap-8">
              {[
              { icon: <Clock />, val: '12k+', label: 'Hours Traded' },
              { icon: <Star />, val: '4.9', label: 'User Rating' },
              { icon: <Briefcase />, val: '800', label: 'Active Pros' },
              { icon: <Heart />, val: '2k+', label: 'Happy Users' }].
              map((item, i) =>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i }}
                className="bg-blue-50 p-8 rounded-[2.5rem] space-y-3 border border-blue-100 shadow-inner">
                
                  <div className="text-blue-600 mb-2">{item.icon}</div>
                  <div className="text-4xl font-black text-blue-900 tracking-tighter">{item.val}</div>
                  <div className="text-blue-400 font-black text-[10px] uppercase tracking-widest">{item.label}</div>
                </motion.div>
              )}
            </div>
          </div>
          {/* Decorative floating dots */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -right-10 w-20 h-20 bg-blue-400/20 blur-xl rounded-full" />
          
        </motion.div>
      </section>

      <section className="space-y-20 pb-20">
        <div className="text-center space-y-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-5xl font-black text-white tracking-tight">
            
            How it Works
          </motion.h2>
          <p className="text-blue-100 text-xl font-medium opacity-80">Three simple steps to build your future.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10 px-4">
          <FeatureCard
            icon={<Clock size={32} />}
            title="Trade Your Time"
            desc="Instead of paying money, help someone for an hour. Then, use that hour to get help with your own work." />
          
          <FeatureCard
            icon={<Zap size={32} />}
            title="Build Your Profile"
            desc="Every time you help someone, you get good reviews and badges. This shows everyone that you are an expert." />
          
          <FeatureCard
            icon={<Shield size={32} />}
            title="Earn Real Money"
            desc="After you have many good reviews, you can open Freelance Mode. This lets you work for real money with big clients." />
          
        </div>
      </section>
    </div>);

};

export default Home;