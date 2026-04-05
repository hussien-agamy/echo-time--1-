import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Compass, HeartHandshake, Briefcase, Code, Network, PenTool, Layout, 
  Languages, LineChart, Target, Trophy, Star, ArrowRight, UserPlus, 
  BookOpen, Activity, Play, CheckCircle2, Loader2 
} from 'lucide-react';
import { api } from '../services/api';

const Onboarding = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    intent: '',
    category: '',
    otherCategory: '',
    level: '',
    startPoint: '',
    goal: ''
  });

  const steps = [
    {
      title: "Why did you join Echo Time?",
      subtitle: "Let's personalize your journey.",
      key: 'intent',
      options: [
        { label: 'Learn new skills', value: 'learn', icon: <BookOpen className="text-blue-500" /> },
        { label: 'Help others', value: 'help', icon: <HeartHandshake className="text-emerald-500" /> },
        { label: 'Both', value: 'both', icon: <Activity className="text-purple-500" /> },
        { label: 'Find freelance opportunities', value: 'freelance', icon: <Briefcase className="text-amber-500" /> }
      ]
    },
    {
      title: "What is your main interest?",
      subtitle: "We'll suggest relevant tasks and users.",
      key: 'category',
      options: [
        { label: 'Programming', value: 'programming', icon: <Code className="text-indigo-500" /> },
        { label: 'Networking', value: 'networking', icon: <Network className="text-blue-500" /> },
        { label: 'UI/UX Design', value: 'design', icon: <Layout className="text-pink-500" /> },
        { label: 'Translation', value: 'translation', icon: <Languages className="text-emerald-500" /> },
        { label: 'Data Analysis', value: 'data', icon: <LineChart className="text-cyan-500" /> },
        { label: 'Content Writing', value: 'writing', icon: <PenTool className="text-orange-500" /> },
        { label: 'Other', value: 'other', icon: <Compass className="text-slate-500" /> }
      ]
    },
    {
      title: "What is your skill level?",
      subtitle: "Be honest! This helps us match you accurately.",
      key: 'level',
      options: [
        { label: 'Beginner', value: 'beginner', icon: '🌱' },
        { label: 'Intermediate', value: 'intermediate', icon: '🚀' },
        { label: 'Advanced', value: 'advanced', icon: '🔥' }
      ]
    },
    {
      title: "Where do you want to start?",
      subtitle: "You can always change this later.",
      key: 'startPoint',
      options: [
        { label: 'Request help', value: 'request', icon: <UserPlus className="text-blue-500" /> },
        { label: 'Offer help', value: 'offer', icon: <HeartHandshake className="text-emerald-500" /> },
        { label: 'Explore community', value: 'community', icon: <Compass className="text-purple-500" /> }
      ]
    },
    {
      title: "What's your short-term goal?",
      subtitle: "We'll track your progress towards this.",
      key: 'goal',
      options: [
        { label: 'Build portfolio', value: 'portfolio', icon: <Briefcase className="text-indigo-500" /> },
        { label: 'Learn a specific skill', value: 'learn', icon: <Target className="text-emerald-500" /> },
        { label: 'Get first review', value: 'review', icon: <Star className="text-amber-500" /> },
        { label: 'Reach freelance mode', value: 'freelance', icon: <Trophy className="text-blue-500" /> }
      ]
    }
  ];

  const handleSelect = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
    
    // Auto-advance after small delay for options (except 'other' category which needs input)
    if (key !== 'category' || value !== 'other') {
      setTimeout(() => {
        if (step < 5) setStep(step + 1);
      }, 400);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const surveyData = {
        ...data,
        interests: [data.category === 'other' ? data.otherCategory : data.category]
      };

      const response = await api.post('/users/onboarding', surveyData);
      
      setUser({ ...user, ...response.data, hasCompletedOnboarding: true });
      
      // Redirect based on intent
      if (data.startPoint === 'request') navigate('/request-help');
      else if (data.startPoint === 'offer') navigate('/offer-help');
      else navigate('/community');
    } catch (error) {
      alert(error.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  const currentStepData = steps[step - 1];

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white shadow-[0_50px_100px_-20px_rgba(30,64,175,0.15)] rounded-[3rem] border border-blue-50 overflow-hidden relative">
        
        {/* Progress Bar */}
        <div className="flex h-2 w-full bg-slate-50">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(step / 5) * 100}%` }}
            className="bg-blue-600 h-full"
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>

        <div className="p-10 md:p-14">
          <div className="flex items-center justify-between mb-8">
            <span className="text-xs font-black text-blue-400 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              Step {step} of 5
            </span>
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="text-slate-400 hover:text-blue-600 font-bold text-sm transition-colors">
                Back
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-black text-blue-950 tracking-tight leading-tight">
                  {currentStepData.title}
                </h2>
                <p className="text-blue-500/80 font-bold text-lg">{currentStepData.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentStepData.options.map((opt) => {
                  const isSelected = data[currentStepData.key] === opt.value;
                  return (
                    <motion.button
                      key={opt.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(currentStepData.key, opt.value)}
                      className={`relative flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                        isSelected 
                          ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100' 
                          : 'border-slate-100 bg-white hover:border-blue-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`text-2xl w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-sm border ${
                        isSelected ? 'border-blue-200' : 'border-slate-100'
                      }`}>
                        {opt.icon}
                      </div>
                      <span className={`font-black text-lg ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-4 right-4 text-blue-600">
                          <CheckCircle2 size={20} fill="currentColor" className="text-white" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {step === 2 && data.category === 'other' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="pt-4"
                >
                  <input 
                    type="text" 
                    placeholder="Type your category here..."
                    value={data.otherCategory}
                    onChange={(e) => setData({ ...data, otherCategory: e.target.value })}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-blue-900 text-lg"
                  />
                  <div className="mt-6 flex justify-end">
                    <button 
                      onClick={() => data.otherCategory.trim() && setStep(3)}
                      disabled={!data.otherCategory.trim()}
                      className="bg-blue-600 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
                    >
                      Continue
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 5 && data.goal && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-8 mt-8 border-t border-blue-50"
                >
                  <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-8 rounded-4xl text-white shadow-xl shadow-blue-200/50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h4 className="text-2xl font-black mb-2">Ready to start?</h4>
                      <p className="text-blue-100 font-medium">We've personalized your Echo Time experience.</p>
                    </div>
                    <button 
                      onClick={handleComplete}
                      disabled={loading}
                      className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-all shadow-lg w-full md:w-auto justify-center disabled:opacity-70"
                    >
                      {loading ? <Loader2 className="animate-spin" /> : <><Play size={20} fill="currentColor" /> Let's Go</>}
                    </button>
                  </div>
                </motion.div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
