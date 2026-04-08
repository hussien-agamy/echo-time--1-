import React, { useState, useEffect } from 'react';
import { Check, Clock, ShieldCheck, Zap, Star, Loader2, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { useToast } from '../components/ToastContext';


const PricingCard = ({ title, price, hours, features, isPopular, onSelect, isLoading, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay, type: "spring" }}
    whileHover={{ y: -10 }}
    className={`relative bg-white/80 backdrop-blur-3xl shadow-2xl rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 flex flex-col border border-white/60 transition-all duration-500 overflow-hidden ${isPopular ? 'ring-4 md:ring-8 ring-blue-600/20 md:scale-105 z-10 shadow-blue-500/20' : ''}`}>
  
    {isPopular &&
      <div className="absolute top-0 left-0 right-0 bg-linear-to-r from-blue-600 to-indigo-600 text-white py-2 text-center font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-md">
        Most Popular Choice
      </div>
    }
    
    {isPopular && (
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
    )}
    
    <div className={`space-y-4 mb-10 text-center ${isPopular ? 'mt-6' : ''}`}>
      <h3 className="text-2xl md:text-3xl font-black text-blue-950 tracking-tight">{title}</h3>
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
    className={`w-full py-6 rounded-4xl font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
    isPopular ?
    'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200' :
    'bg-blue-50 text-blue-600 hover:bg-blue-100'}`
    }>
    
      {isLoading ? <Loader2 className="animate-spin" /> : 'Join Plan'}
    </button>
  </motion.div>
);


const Pricing = ({ user, setUser }) => {
  const toast = useToast();
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateBalance = async (hours, label) => {
    setLoadingPlan(label);
    setPaymentStatus('processing');
    
    try {
      // Simulate network wait for "payment processing"
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await api.patch('/users/balance/add', { amount: hours });
      
      if (response.data.success) {
        setUser({
          ...user,
          time_balance: response.data.data.time_balance
        });
        setPaymentStatus('success');
        setTimeout(() => {
          setPaymentStatus(null);
          setLoadingPlan(null);
        }, 2000);
      }
    } catch (error) {
      toast.error("Failed to process payment");
      setPaymentStatus(null);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatePresence>
        {isInitialLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-blue-900 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,64,175,0.2),transparent)]" />
            
            <div className="relative space-y-8 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-24 h-24 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 flex items-center justify-center shadow-2xl shadow-blue-500/20"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                    className="absolute -inset-4 border-2 border-dashed border-blue-400/30 rounded-full"
                  />
                  <CreditCard className="text-white w-10 h-10" />
                </div>
              </motion.div>
              
              <div className="flex flex-col items-center space-y-2">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-black text-white tracking-widest uppercase"
                >
                  Analyzing Market
                </motion.h2>
                <motion.div 
                   className="h-1 bg-blue-500/20 w-48 rounded-full overflow-hidden"
                >
                   <motion.div 
                     initial={{ x: "-100%" }}
                     animate={{ x: "0%" }}
                     transition={{ duration: 3, ease: "easeInOut" }}
                     className="h-full bg-blue-400"
                   />
                </motion.div>
                <p className="text-blue-300 font-bold text-xs uppercase tracking-[0.3em]">Preparing Fleet Pricing</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`space-y-24 py-12 transition-all duration-1000 ${isInitialLoading ? 'blur-2xl scale-95 opacity-0' : 'blur-0 scale-100 opacity-100'}`}>
      <div className="text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex bg-blue-600/10 text-blue-600 px-6 py-2 rounded-full font-black text-xs uppercase tracking-[0.2em] border border-blue-100">
          
          Scale Your Success
        </motion.div>
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[1.1]">Choose Your <br className="hidden sm:block" />Plan.</h1>
        <p className="text-blue-100/90 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto font-medium px-4 leading-relaxed">Get more hours, better reviews, and early access to high-paying client work.</p>
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
          delay={0.1}
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
          delay={0.2}
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
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.01 }}
        className="bg-white/90 backdrop-blur-2xl shadow-[0_40px_100px_-20px_rgba(30,64,175,0.25)] rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 border border-white/50 overflow-hidden relative">
        
        <div className="absolute top-0 right-0 w-125 h-125 bg-blue-400/20 blur-[100px] rounded-full -z-10 transition-transform duration-1000"></div>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <div className="space-y-6 md:space-y-8 max-w-xl text-center lg:text-left flex-1">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-tr from-blue-600 to-indigo-500 text-white rounded-3xl md:rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 mx-auto lg:mx-0">
              <Clock size={40} className="md:w-12 md:h-12" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-blue-950 tracking-tight">Need Hours Now?</h2>
            <p className="text-blue-900/60 text-lg md:text-xl leading-relaxed font-bold">
              Are you low on balance? Buy hours instantly to complete your project or hire a specialist for your team.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-8 justify-center lg:justify-end flex-1">
            {[
            { h: 2, p: '$5', icon: <Zap size={24} />, label: 'Boost' },
            { h: 5, p: '$12', icon: <Star size={24} />, label: 'Power' },
            { h: 10, p: '$20', icon: <ShieldCheck size={24} />, label: 'Elite' }].
            map((pkg, i) =>
            <button
              key={i}
              onClick={() => handleUpdateBalance(pkg.h, pkg.label)}
              disabled={loadingPlan === pkg.label}
              className="group relative bg-white md:bg-blue-50 hover:bg-linear-to-b hover:from-blue-600 hover:to-indigo-600 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] border border-blue-100 hover:border-transparent transition-all duration-300 flex flex-col items-center gap-4 md:gap-8 w-40 md:w-52 shadow-lg md:shadow-xl hover:shadow-blue-500/30 active:scale-95">
              
                {loadingPlan === pkg.label ?
              <Loader2 size={32} className="animate-spin text-blue-600 group-hover:text-white" /> :

              <div className="text-blue-600 group-hover:text-white transition-all duration-500 scale-150">
                    {pkg.icon}
                  </div>
              }
                <div className="text-center z-10 transition-colors">
                  <div className="text-4xl md:text-5xl font-black text-blue-950 group-hover:text-white transition-all tracking-tighter">{pkg.h}h</div>
                  <div className="text-xl md:text-2xl font-black text-blue-500 group-hover:text-blue-200 transition-all tracking-tight">{pkg.p}</div>
                </div>
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {paymentStatus && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-[3rem] p-12 flex flex-col items-center max-w-sm w-full mx-4 shadow-2xl"
            >
              {paymentStatus === 'processing' ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full mb-6"
                  />
                  <h3 className="text-2xl font-black text-blue-900 mb-2">Processing...</h3>
                  <p className="text-blue-500 font-bold text-center">Securely processing your plan purchase.</p>
                </>
              ) : (
                <>
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                    className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6"
                  >
                    <Check size={40} strokeWidth={3} />
                  </motion.div>
                  <h3 className="text-2xl font-black text-emerald-600 mb-2">Payment Successful!</h3>
                  <p className="text-blue-500 font-bold text-center">Your time balance has been updated.</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>);

};

export default Pricing;