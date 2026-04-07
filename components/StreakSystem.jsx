import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Flame, Snowflake, BookOpen, HeartHandshake, Activity, 
  Trophy, Award, Star, Zap, Gift, TrendingUp, ShieldCheck,
  X, ChevronRight, Lock, Unlock
} from 'lucide-react';

import { api } from '../services/api';

// ─── Streak Storage (mirrors what the backend would track) ───

const getDefaultStreaks = () => ({
  learning: { count: 0, lastDate: null, freezesLeft: 1, totalEarned: 0, dailyActions: 0 },
  helping: { count: 0, lastDate: null, freezesLeft: 1, totalEarned: 0, dailyActions: 0 },
  contribution: { count: 0, lastDate: null, freezesLeft: 1, totalEarned: 0, dailyActions: 0 },
  notifications: [],
  milestones: []
});

const loadStreaks = async () => {
  try {
    const res = await api.get('/users/streaks');
    return res.data || getDefaultStreaks();
  } catch(e) {
    return getDefaultStreaks();
  }
};

const persistStreaks = async (streaks) => {
  try {
    await api.put('/users/streaks', streaks);
  } catch(e) {
    console.error("Failed to persist streaks", e);
  }
};

// ─── Milestones ───
const MILESTONES = [
  { days: 3, title: 'Spark', icon: '✨', reward: 'Small Badge', rewardType: 'badge', credits: 0 },
  { days: 7, title: 'On Fire', icon: '🔥', reward: '+2h Time Credits', rewardType: 'credits', credits: 2 },
  { days: 14, title: 'Unstoppable', icon: '⚡', reward: 'Special Badge', rewardType: 'badge', credits: 0 },
  { days: 30, title: 'Legendary', icon: '👑', reward: 'Unlock Perks', rewardType: 'perk', credits: 5 },
  { days: 60, title: 'Mythic', icon: '💎', reward: 'Community Highlight', rewardType: 'highlight', credits: 10 }
];

// ─── Motivational Messages ───
const STREAK_MESSAGES = [
  "Keep the momentum going! 💪",
  "You're building something amazing! 🚀",
  "Every day counts. You're doing great! ⭐",
  "The community appreciates your consistency! 🙏",
  "You're on fire! Don't stop now! 🔥",
  "Leaders are made through daily effort! 👑",
  "Your streak is your superpower! ⚡"
];

const getMotivationalMessage = (count) => {
  if (count === 0) return "Start your streak today! Every journey begins with one step.";
  if (count < 3) return "Great start! Keep going to unlock your first badge.";
  if (count < 7) return "Amazing consistency! A reward is coming at 7 days.";
  if (count < 14) return "You're on fire! The special badge awaits at 14 days.";
  if (count < 30) return "Unstoppable! The legendary milestone is within reach.";
  return STREAK_MESSAGES[Math.floor(Math.random() * STREAK_MESSAGES.length)];
};

// ─── Flame Animation Component ───
const FlameIcon = ({ count, size = 'md' }) => {
  const sizes = { sm: 16, md: 24, lg: 36 };
  const s = sizes[size];
  
  return (
    <motion.div
      animate={count > 0 ? { 
        scale: [1, 1.1, 1],
        rotate: [0, -3, 3, 0]
      } : {}}
      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      className="relative"
    >
      <Flame 
        size={s} 
        className={count > 0 ? 'text-orange-500 fill-orange-400 drop-shadow-lg' : 'text-slate-300'} 
      />
      {count >= 7 && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-orange-400/20 blur-lg rounded-full"
        />
      )}
    </motion.div>
  );
};

// ─── Streak Badge (compact, for navbar/profile) ───
export const StreakBadge = ({ streaks, onClick }) => {
  const maxStreak = Math.max(
    streaks?.contribution?.count || 0,
    streaks?.learning?.count || 0,
    streaks?.helping?.count || 0
  );
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-sm transition-all ${
        maxStreak > 0 
          ? 'bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200 text-orange-700 shadow-sm' 
          : 'bg-slate-50 border border-slate-200 text-slate-400'
      }`}
    >
      <FlameIcon count={maxStreak} size="sm" />
      <span>{maxStreak}</span>
    </motion.button>
  );
};

// ─── Streak Card (for each streak type) ───
const StreakCard = ({ type, data, icon, color, onFreeze }) => {
  const nextMilestone = MILESTONES.find(m => m.days > data.count) || MILESTONES[MILESTONES.length - 1];
  const prevMilestone = [...MILESTONES].reverse().find(m => m.days <= data.count);
  const progressStart = prevMilestone?.days || 0;
  const progressEnd = nextMilestone.days;
  const progress = Math.min(((data.count - progressStart) / (progressEnd - progressStart)) * 100, 100);

  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600', bar: 'bg-blue-500', glow: 'shadow-blue-200' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-500', glow: 'shadow-emerald-200' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600', bar: 'bg-purple-500', glow: 'shadow-purple-200' }
  };
  const c = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${c.bg} rounded-3xl p-6 border ${c.border} relative overflow-hidden`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center ${c.text}`}>
            {icon}
          </div>
          <div>
            <h4 className="font-black text-blue-950 capitalize">{type}</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {data.dailyActions}/3 actions today
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FlameIcon count={data.count} size="sm" />
          <span className="text-2xl font-black text-blue-950">{data.count}</span>
          <span className="text-xs font-bold text-slate-400">days</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
          <span>{prevMilestone ? prevMilestone.icon + ' ' + prevMilestone.title : 'Start'}</span>
          <span>{nextMilestone.icon} {nextMilestone.title} ({nextMilestone.days}d)</span>
        </div>
        <div className="h-2.5 bg-white/80 rounded-full overflow-hidden border border-white/50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${c.bar} rounded-full relative`}
          >
            {data.count > 0 && (
              <motion.div
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-white/30 rounded-full"
              />
            )}
          </motion.div>
        </div>
      </div>

      {/* Freeze Button */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-slate-500 italic">
          {getMotivationalMessage(data.count).substring(0, 50)}...
        </p>
        <button
          onClick={() => onFreeze(type)}
          disabled={data.freezesLeft <= 0}
          className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg transition-all ${
            data.freezesLeft > 0
              ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Snowflake size={12} />
          {data.freezesLeft} freeze{data.freezesLeft !== 1 ? 's' : ''}
        </button>
      </div>
    </motion.div>
  );
};

// ─── Milestone Timeline ───
const MilestoneTimeline = ({ currentStreak }) => {
  return (
    <div className="space-y-3">
      {MILESTONES.map((m, i) => {
        const isReached = currentStreak >= m.days;
        const isNext = !isReached && (i === 0 || currentStreak >= MILESTONES[i - 1].days);
        return (
          <motion.div
            key={m.days}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 ${
              isReached 
                ? 'bg-linear-to-r from-emerald-50 to-transparent border border-emerald-100' 
                : isNext
                  ? 'bg-linear-to-r from-amber-50 to-transparent border border-amber-100 animate-pulse'
                  : 'bg-slate-50/50 border border-slate-100 opacity-50'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              isReached ? 'bg-emerald-100' : 'bg-slate-100'
            }`}>
              {isReached ? '✅' : m.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-black text-blue-950 text-sm">{m.days} Days</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{m.title}</span>
              </div>
              <p className="text-xs font-bold text-slate-500">{m.reward}</p>
            </div>
            <div className={`${isReached ? 'text-emerald-500' : 'text-slate-300'}`}>
              {isReached ? <Unlock size={16} /> : <Lock size={16} />}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// ─── Notification Toast ───
const StreakNotification = ({ notification, onDismiss }) => {
  if (!notification) return null;
  
  const typeStyles = {
    warning: 'from-amber-500 to-orange-500',
    success: 'from-emerald-500 to-green-500',
    milestone: 'from-purple-500 to-indigo-500'
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-100 w-full max-w-md px-4"
      >
        <div className={`bg-linear-to-r ${typeStyles[notification.type] || typeStyles.success} p-5 rounded-2xl shadow-2xl text-white flex items-start gap-4`}>
          <div className="text-3xl shrink-0">{notification.icon || '🔥'}</div>
          <div className="flex-1">
            <h4 className="font-black text-lg">{notification.title}</h4>
            <p className="text-white/80 text-sm font-medium">{notification.message}</p>
          </div>
          <button onClick={onDismiss} className="text-white/60 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Streak Dashboard Panel ───
export const StreakDashboard = ({ user, setUser }) => {
  const [streaks, setStreaks] = useState(getDefaultStreaks());
  const [notification, setNotification] = useState(null);
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    // Check streak validity on mount
    const init = async () => {
      const loaded = await loadStreaks();
      const today = new Date().toDateString();
      const updated = { ...loaded };
      let hasChanges = false;

    ['learning', 'helping', 'contribution'].forEach(type => {
      const streak = updated[type];
      if (streak.lastDate) {
        const lastDate = new Date(streak.lastDate);
        const daysDiff = Math.floor((new Date(today) - lastDate) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Yesterday — streak is still valid, reset daily actions
          if (streak.dailyActions > 0) {
            streak.dailyActions = 0;
            hasChanges = true;
          }
        } else if (daysDiff === 2 && streak.freezesLeft > 0) {
          // 2 days — use freeze
          streak.freezesLeft -= 1;
          streak.dailyActions = 0;
          hasChanges = true;
          setNotification({
            type: 'warning',
            icon: '❄️',
            title: 'Streak Freeze Used!',
            message: `Your ${type} streak was saved. ${streak.freezesLeft} freezes remaining.`
          });
        } else if (daysDiff >= 2) {
          // Too many days, reset streak
          if (streak.count > 0) {
            streak.count = 0;
            streak.dailyActions = 0;
            hasChanges = true;
            setNotification({
              type: 'warning',
              icon: '💔',
              title: 'Streak Lost!',
              message: `Your ${type} streak has been reset. Start again today!`
            });
          }
        }
      }
    });

      if (hasChanges) {
        setStreaks(updated);
        await persistStreaks(updated);
      } else {
        setStreaks(updated);
      }
    };
    init();
  }, []);

  const logAction = (type) => {
    const today = new Date().toDateString();
    const updated = { ...streaks };
    const streak = { ...updated[type] };

    // Anti-abuse: max 3 meaningful actions per day per type
    if (streak.lastDate === today && streak.dailyActions >= 3) {
      setNotification({
        type: 'warning',
        icon: '⏳',
        title: 'Daily Limit Reached',
        message: `You've reached the max actions for ${type} today. Come back tomorrow!`
      });
      return;
    }

    // Increment
    if (streak.lastDate !== today) {
      streak.count += 1;
      streak.dailyActions = 1;
      streak.lastDate = today;
    } else {
      streak.dailyActions += 1;
    }

    // Also boost contribution
    if (type !== 'contribution') {
      const contrib = { ...updated.contribution };
      if (contrib.lastDate !== today) {
        contrib.count += 1;
        contrib.dailyActions = 1;
        contrib.lastDate = today;
      } else {
        contrib.dailyActions = Math.min(contrib.dailyActions + 1, 3);
      }
      updated.contribution = contrib;
    }

    streak.totalEarned += 1;
    updated[type] = streak;

    // Check milestone
    const milestone = MILESTONES.find(m => m.days === streak.count);
    if (milestone) {
      setNotification({
        type: 'milestone',
        icon: milestone.icon,
        title: `${milestone.title} Milestone!`,
        message: `${streak.count}-day streak! Reward: ${milestone.reward}`
      });

      // Award credits
      if (milestone.credits > 0 && user && setUser) {
        setUser({ ...user, time_balance: (user.time_balance || 0) + milestone.credits });
      }
    }

    setStreaks(updated);
    persistStreaks(updated);
  };

  const useFreeze = (type) => {
    const updated = { ...streaks };
    // Freeze doesn't do anything proactively, it's used passively. 
    // We just show the user the current count.
    setNotification({
      type: 'success',
      icon: '❄️',
      title: 'Streak Freeze Info',
      message: `You have ${updated[type].freezesLeft} freeze(s) for your ${type} streak. Freezes are used automatically if you miss 1 day.`
    });
  };

  const maxStreak = Math.max(streaks.contribution.count, streaks.learning.count, streaks.helping.count);

  return (
    <div className="space-y-8">
      {/* Notification */}
      <StreakNotification 
        notification={notification} 
        onDismiss={() => setNotification(null)} 
      />

      {/* Hero Section */}
      <div className="bg-linear-to-br from-orange-500 via-amber-500 to-yellow-500 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-orange-200/50">
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-4 right-8 text-8xl opacity-20"
        >
          🔥
        </motion.div>
        
        <div className="relative z-10">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-white/60 mb-2">
                Your Streak
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-7xl md:text-8xl font-black tracking-tighter">{maxStreak}</span>
                <span className="text-2xl font-bold text-white/70">days</span>
              </div>
              <p className="text-white/80 font-bold mt-2 text-lg max-w-md">
                {getMotivationalMessage(maxStreak)}
              </p>
            </div>

            <div className="flex gap-3">
              {['learning', 'helping', 'contribution'].map(type => (
                <button
                  key={type}
                  onClick={() => logAction(type)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 border border-white/10"
                >
                  +1 {type.slice(0, 5)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex gap-2 bg-white rounded-2xl p-1.5 border border-blue-50 shadow-sm">
        {[
          { id: 'overview', label: 'Streaks', icon: <Flame size={16} /> },
          { id: 'milestones', label: 'Milestones', icon: <Trophy size={16} /> },
          { id: 'rewards', label: 'Rewards', icon: <Gift size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveView(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${
              activeView === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <StreakCard
              type="learning"
              data={streaks.learning}
              icon={<BookOpen size={20} />}
              color="blue"
              onFreeze={useFreeze}
            />
            <StreakCard
              type="helping"
              data={streaks.helping}
              icon={<HeartHandshake size={20} />}
              color="emerald"
              onFreeze={useFreeze}
            />
            <StreakCard
              type="contribution"
              data={streaks.contribution}
              icon={<Activity size={20} />}
              color="purple"
              onFreeze={useFreeze}
            />
          </motion.div>
        )}

        {activeView === 'milestones' && (
          <motion.div
            key="milestones"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm"
          >
            <h3 className="text-2xl font-black text-blue-950 mb-6 flex items-center gap-2">
              <Trophy className="text-amber-500" size={24} /> Milestone Roadmap
            </h3>
            <MilestoneTimeline currentStreak={maxStreak} />
          </motion.div>
        )}

        {activeView === 'rewards' && (
          <motion.div
            key="rewards"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm">
              <h3 className="text-2xl font-black text-blue-950 mb-6 flex items-center gap-2">
                <Gift className="text-purple-500" size={24} /> What You Can Earn
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: <Zap className="text-amber-500" />, title: 'Time Credits', desc: 'Earn bonus hours at 7 and 30-day streaks to spend on help.' },
                  { icon: <Award className="text-indigo-500" />, title: 'Exclusive Badges', desc: 'Unlock streak badges displayed on your profile for credibility.' },
                  { icon: <Star className="text-blue-500" />, title: 'Profile Highlights', desc: 'Get featured in the community as a top contributor.' },
                  { icon: <TrendingUp className="text-emerald-500" />, title: 'Visibility Boost', desc: 'Your offers appear higher in community search results.' }
                ].map((reward, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                      {reward.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-blue-950 text-sm">{reward.title}</h4>
                      <p className="text-xs text-slate-500 font-medium">{reward.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-blue-50 shadow-sm">
              <h3 className="text-2xl font-black text-blue-950 mb-4 flex items-center gap-2">
                <ShieldCheck className="text-emerald-500" size={24} /> Fair Play Rules
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {[
                  'Only meaningful actions count (not spam)',
                  'Maximum 3 streak actions per day per type',
                  'Missing 2+ days resets your streak',
                  '1 streak freeze per type (auto-used)',
                  'Freezes replenish every 30-day milestone',
                  'Streaks are verified against activity logs'
                ].map((rule, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-600 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Profile Streak Widget (compact, for embedding in Profile page) ───
export const ProfileStreakWidget = () => {
  const [streaks, setStreaks] = useState(null);

  useEffect(() => {
    loadStreaks().then(s => setStreaks(s));
  }, []);

  if (!streaks) return null;
  const maxStreak = Math.max(
    streaks.contribution?.count || 0,
    streaks.learning?.count || 0,
    streaks.helping?.count || 0
  );
  
  const currentMilestone = [...MILESTONES].reverse().find(m => m.days <= maxStreak);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-linear-to-br from-orange-50 to-amber-50 rounded-[2.5rem] p-6 border border-orange-100 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <FlameIcon count={maxStreak} size="lg" />
          <div>
            <div className="text-3xl font-black text-blue-950 tracking-tighter">{maxStreak}-day</div>
            <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest">
              {currentMilestone ? currentMilestone.title : 'No Streak'} Streak
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Learning', count: streaks.learning?.count || 0, color: 'text-blue-600' },
          { label: 'Helping', count: streaks.helping?.count || 0, color: 'text-emerald-600' },
          { label: 'Overall', count: streaks.contribution?.count || 0, color: 'text-purple-600' }
        ].map((s, i) => (
          <div key={i} className="text-center p-2 bg-white/60 rounded-xl">
            <div className={`text-lg font-black ${s.color}`}>{s.count}d</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export { loadStreaks, persistStreaks, MILESTONES };
export default StreakDashboard;
