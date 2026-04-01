
import React, { useState } from 'react';
import { Check, Clock, ShieldCheck, Zap, Star, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';


const PricingCard =







({ title, price, hours, features, isPopular, onSelect, isLoading }) =>
<motion.div
  whileHover={{ y: -10 }}
  className={`relative bg-white shadow-2xl rounded-[3.5rem] p-12 flex flex-col border border-blue-50 transition-all duration-500 ${isPopular ? 'ring-8 ring-blue-600/10 scale-105 z-10' : ''}`}>
  
    {isPopular &&
  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-8 py-2.5 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl">
        Most Popular
      </div>
  }
    
    <div className="space-y-4 mb-10 text-center">
      <h3 className="text-3xl font-black text-blue-900 tracking-tight">{title}</h3>
      <div className="text-6xl font-black text-blue-900 tracking-tighter">{price}</div>
      <div className="font-black uppercase tracking-widest text-[10px] px-5 py-2 rounded-full bg-blue-50 text-blue-600 inline-block">{hours}h Every Month</div>
    </div>

    <div className="space-y-5 mb-12 flex-1">
      {features.map((feature, i) =>
    <div key={i} className="flex items-center gap-4 text-blue-800/70 font-bold">
          <div className="text-blue-600 bg-blue-50 shadow-sm p-1.5 rounded-xl">
            <Check size={18} />
          </div>
          <span className="text-sm tracking-tight">{feature}</span>
        </div>
    )}
    </div>

    <button
    disabled={isLoading}
    onClick={() => onSelect(hours)}
    className={`w-full py-6 rounded-[2rem] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
    isPopular ?
    'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' :
    'bg-blue-50 text-blue-600 hover:bg-blue-100'}`
    }>
    
      {isLoading ? <Loader2 className="animate-spin" /> : 'Join Plan'}
    </button>
  </motion.div>;


const Pricing = ({ user, setUser }) => {
  const [loadingPlan, setLoadingPlan] = useState(null);

  const handleUpdateBalance = (hours, label) => {
    setLoadingPlan(label);
    setTimeout(() => {
      setUser({
        ...user,
        timeBalance: user.timeBalance + hours
      });
      setLoadingPlan(null);
      alert(`Great! We added ${hours} hours to your balance.`);
    }, 1200);
  };

  return (
    <div className="space-y-24 py-12">
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex bg-blue-600/10 text-blue-600 px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] border border-blue-100">
          
          Scale Your Success
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter">Choose Your <br />Plan.</h1>
        <p className="text-blue-100 text-2xl max-w-3xl mx-auto font-medium opacity-90 leading-relaxed">Get more hours, better reviews, and early access to high-paying client work.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 items-center">
        <PricingCard
          title="Personal"
          price="$9/mo"
          hours={5}
          isLoading={loadingPlan === 'Personal'}
          onSelect={(h) => handleUpdateBalance(h, 'Personal')}
          features={[
          'Unlock core features',
          'Community Member Badge',
          '5 hours extra credit',
          'Email Support']
          } />
        
        <PricingCard
          isPopular
          title="Pro"
          price="$29/mo"
          hours={15}
          isLoading={loadingPlan === 'Pro'}
          onSelect={(h) => handleUpdateBalance(h, 'Pro')}
          features={[
          'Faster task matching',
          'Pro Badge on Profile',
          '15 hours extra credit',
          'Unlock Freelance early',
          'Verified Certificates']
          } />
        
        <PricingCard
          title="Elite"
          price="$99/mo"
          hours={60}
          isLoading={loadingPlan === 'Elite'}
          onSelect={(h) => handleUpdateBalance(h, 'Elite')}
          features={[
          'VIP status everywhere',
          'Founding Member Badge',
          '60 hours extra credit',
          'Unlimited skill badges',
          'Dedicated helper']
          } />
        
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white shadow-[0_40px_100px_-20px_rgba(30,64,175,0.2)] rounded-[4rem] p-16 border border-blue-50 group overflow-hidden relative">
        
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 blur-[100px] rounded-full -z-10 transition-transform duration-1000 group-hover:scale-110"></div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="space-y-8 max-w-xl text-center lg:text-left">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-200 mx-auto lg:mx-0">
              <Clock size={48} />
            </div>
            <h2 className="text-5xl font-black text-blue-900 tracking-tight">Need Hours Now?</h2>
            <p className="text-blue-800/60 text-xl leading-relaxed font-bold">
              Are you low on balance? Buy hours instantly to complete your project or hire a specialist for your team.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 justify-center">
            {[
            { h: 2, p: '$5', icon: <Zap size={28} />, label: 'Boost' },
            { h: 5, p: '$12', icon: <Star size={28} />, label: 'Power' },
            { h: 10, p: '$20', icon: <ShieldCheck size={28} />, label: 'Elite' }].
            map((pkg, i) =>
            <button
              key={i}
              onClick={() => handleUpdateBalance(pkg.h, pkg.label)}
              disabled={loadingPlan === pkg.label}
              className="group relative bg-blue-50 hover:bg-blue-600 p-12 rounded-[3.5rem] border border-blue-100 hover:border-blue-600 transition-all duration-500 flex flex-col items-center gap-8 w-52 shadow-xl hover:shadow-blue-200 active:scale-95">
              
                {loadingPlan === pkg.label ?
              <Loader2 size={32} className="animate-spin text-blue-600 group-hover:text-white" /> :

              <div className="text-blue-600 group-hover:text-white transition-all duration-500 scale-150">
                    {pkg.icon}
                  </div>
              }
                <div className="text-center">
                  <div className="text-5xl font-black text-blue-900 group-hover:text-white transition-all duration-500 tracking-tighter">{pkg.h}h</div>
                  <div className="text-2xl font-black text-blue-400 group-hover:text-blue-100 transition-all duration-500 tracking-tight">{pkg.p}</div>
                </div>
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>);

};

export default Pricing;