
import React from 'react';
import { Lock, Unlock, CheckCircle, Award, Star, Briefcase, Zap } from 'lucide-react';
import { motion } from 'framer-motion';


const ConditionItem = ({ label, progress, target, done }) =>
<motion.div
  whileHover={{ x: 10 }}
  className="bg-blue-50 p-8 rounded-[2.5rem] flex items-center justify-between gap-8 border border-white transition-all hover:bg-white hover:shadow-2xl duration-500">
  
    <div className="flex items-center gap-6">
      <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg transition-all duration-1000 ${done ? 'bg-blue-600 text-white shadow-blue-200 rotate-12' : 'bg-blue-100 text-blue-300'}`}>
        {done ? <CheckCircle size={28} /> : <Lock size={28} />}
      </div>
      <div>
        <div className="font-black text-2xl text-blue-900 tracking-tight leading-none">{label}</div>
        <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mt-2">{progress} / {target} finished</div>
      </div>
    </div>
    <div className="w-48 h-4 bg-blue-100/50 rounded-full overflow-hidden shadow-inner hidden sm:block">
      <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(progress / target * 100, 100)}%` }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className={`h-full ${done ? 'bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-blue-400'}`} />
    
    </div>
  </motion.div>;







const FreelanceMode = ({ user, setUser }) => {
  const isUnlocked = user.freelanceUnlocked;

  const handleSimulateUnlock = () => {
    const updatedBadges = user.badges.map((b) => ({ ...b, unlocked: true }));
    setUser({
      ...user,
      freelanceUnlocked: true,
      badges: updatedBadges,
      ratingAvg: 5.0,
      reviewsCount: 25
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-20">
      <div className="text-center space-y-8 animate-in fade-in slide-in-from-top-10 duration-1000">
        <motion.div
          animate={{ rotate: isUnlocked ? [0, 10, -10, 0] : 0 }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className={`w-36 h-36 mx-auto rounded-[3.5rem] flex items-center justify-center shadow-[0_40px_80px_-15px_rgba(30,64,175,0.4)] transition-all duration-1000 ${
          isUnlocked ? 'bg-blue-600 text-white scale-110' : 'bg-white text-blue-600 border border-blue-50'}`
          }>
          
          {isUnlocked ? <Unlock size={72} /> : <Lock size={72} />}
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter">Freelance Mode</h1>
          <p className="text-blue-100 text-2xl max-w-3xl mx-auto leading-relaxed font-bold opacity-90">
            {isUnlocked ?
            "The global market is open! You can now accept high-paying jobs from real companies." :
            "Help more people to grow your reputation. Once you are an expert, you can earn real money."}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white shadow-[0_50px_100px_-20px_rgba(30,64,175,0.2)] rounded-[4rem] p-12 border border-blue-50 space-y-12 h-full flex flex-col">
          <div className="flex items-center justify-between">
            <h3 className="text-4xl font-black text-blue-900 tracking-tight">Your Progress</h3>
            <div className="bg-blue-600 text-white px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100">
              {isUnlocked ? 'Expert Level' : 'Student Level'}
            </div>
          </div>
          
          <div className="space-y-6 flex-1">
            <ConditionItem label="Help Count" progress={isUnlocked ? 15 : 8} target={10} done={isUnlocked} />
            <ConditionItem label="Rating Score" progress={user.ratingAvg || 0} target={4.5} done={user.ratingAvg >= 4.5} />
            <ConditionItem label="Special Badges" progress={(user.badges || []).filter((b) => b.unlocked).length} target={3} done={(user.badges || []).filter((b) => b.unlocked).length >= 3} />
          </div>

          {!isUnlocked ?
          <div className="pt-10 border-t border-blue-50 flex flex-col items-center gap-8">
              <div className="text-center space-y-2">
                <div className="text-7xl font-black text-blue-600 tracking-tighter">{((user.badges || []).filter((b) => b.unlocked).length / 3 * 100).toFixed(0)}%</div>
                <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest">To Professional Unlock</div>
              </div>
              <button
              onClick={handleSimulateUnlock}
              className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl shadow-2xl shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 w-full justify-center group">
              
                <Zap size={28} className="group-hover:scale-125 transition-transform" />
                Finish All & Unlock
              </button>
            </div> :

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="pt-10 border-t border-blue-50 text-center">
            
              <div className="bg-blue-50 text-blue-600 p-8 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 shadow-inner">
                <CheckCircle size={32} />
                Expert Verified
              </div>
            </motion.div>
          }
        </div>

        <div className="bg-linear-to-br from-blue-700 to-blue-950 shadow-[0_50px_100px_-20px_rgba(30,64,175,0.4)] rounded-[4rem] p-12 border border-white/20 text-white space-y-12 h-full flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <h3 className="text-4xl font-black tracking-tight relative z-10">Pro Privileges</h3>
          
          <div className="space-y-12 flex-1 relative z-10">
            {[
            { icon: <Briefcase />, title: 'Paid Markets', desc: 'Accept big jobs and get paid in real money through Stripe.' },
            { icon: <Award />, title: 'Verified Badge', desc: 'Get the Blue Expert Badge so clients trust you immediately.' },
            { icon: <Star />, title: 'Zero Fees', desc: 'Pay $0 platform fees for your first six months as a Pro.' }].
            map((benefit, i) =>
            <div key={i} className="flex gap-8 group/item">
                <div className="w-16 h-16 bg-white/10 rounded-3xl flex items-center justify-center shrink-0 group-hover/item:bg-white group-hover/item:text-blue-900 transition-all duration-500 shadow-xl border border-white/10">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="font-black text-2xl mb-2 tracking-tight">{benefit.title}</h4>
                  <p className="text-blue-100 text-lg font-bold opacity-80 leading-snug">{benefit.desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        className="bg-white p-16 rounded-[4rem] border border-blue-100 flex flex-col lg:flex-row items-center justify-between text-center lg:text-left gap-10 shadow-2xl transition-all duration-500">
        
        <div className="space-y-4">
          <h3 className="text-4xl font-black text-blue-900 tracking-tight leading-none">Already a Professional?</h3>
          <p className="text-blue-400 text-xl font-bold opacity-80 max-w-2xl">
            If you have a profile on LinkedIn or Upwork, you can sync your account to unlock Freelance Mode instantly.
          </p>
        </div>
        <button className="bg-blue-600 text-white px-12 py-6 rounded-[2.5rem] font-black text-2xl hover:bg-blue-700 hover:scale-105 transition-all shadow-2xl active:scale-95 shrink-0">
          Sync Now
        </button>
      </motion.div>
    </div>);

};

export default FreelanceMode;