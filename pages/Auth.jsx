import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, User as UserIcon, ShieldCheck, Upload, ArrowRight, 
  Check, Info, Loader2, Camera, UserCircle, Tag, X, ChevronLeft,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { setToken } from '../store';

const Auth = ({ onLogin }) => {
  const [mode, setMode] = useState('signup'); // 'signup' or 'login'
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    skills: [],
    avatarData: null,
    idCardData: null
  });

  const [currentSkill, setCurrentSkill] = useState('');
  const [previews, setPreviews] = useState({ avatar: null, idCard: null });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        setFormData(prev => ({ ...prev, [`${field}Data`]: base64String }));
        setPreviews(prev => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, currentSkill.trim()] }));
      setCurrentSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const validateStep1 = async () => {
    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      setError("All fields are required.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    setLoading(true);
    try {
      const res = await api.get(`/users/check-username?username=${formData.username}`);
      if (res.data.exists) {
        setError("Username is already taken.");
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message || "Failed to validate username.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    setError(null);
    if (step === 1) {
      const isValid = await validateStep1();
      if (isValid) setStep(2);
    } else if (step === 2) {
      if (!formData.bio) {
        setError("Please write a short bio about your expertise.");
      } else {
        setStep(3);
      }
    } else if (step === 3) {
      if (formData.skills.length === 0) {
        setError("Please add at least one skill.");
      } else {
        setStep(4);
      }
    }
  };

  const prevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleLogin = async () => {
    setError(null);
    if (!formData.email || !formData.password) {
      setError("Please enter your credentials.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users/login', { 
        email: formData.email, 
        password: formData.password 
      });
      setToken(response.data.token);
      onLogin({ 
        ...response.data.user, 
        isAuthenticated: true, 
        hasCompletedOnboarding: response.data.is_onboarded 
      });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const finalizeSignup = async () => {
    if (!formData.idCardData) {
      setError("Identity verification is required.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/users/register', formData);
      // Auto login
      const loginRes = await api.post('/users/login', { 
        email: formData.email, 
        password: formData.password 
      });
      setToken(loginRes.data.token);
      onLogin({ ...loginRes.data.user, isAuthenticated: true, hasCompletedOnboarding: true });
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const renderSignupStep = () => {
    switch(step) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="space-y-2 text-center mb-6">
              <h2 className="text-3xl font-black text-blue-900 leading-none">Create Account</h2>
              <p className="text-blue-400 font-bold">Step 1: Your Credentials</p>
            </div>
            
            <div className="space-y-3">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                <input name="fullName" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} 
                  className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-blue-900" />
              </div>
              <div className="relative">
                <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleInputChange} 
                  className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-blue-900" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} 
                  className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-blue-900" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                  <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} 
                    className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-blue-900 text-sm" />
                </div>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                  <input name="confirmPassword" type="password" placeholder="Confirm" value={formData.confirmPassword} onChange={handleInputChange} 
                    className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-blue-900 text-sm" />
                </div>
              </div>
            </div>

            <button onClick={nextStep} disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-100/50 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all mt-6">
              {loading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20}/></>}
            </button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-3xl font-black text-blue-900 leading-none">Profile Setup</h2>
              <p className="text-blue-400 font-bold">Step 2: About You</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-3xl bg-blue-50 border-4 border-dashed border-blue-200 overflow-hidden flex items-center justify-center shadow-inner">
                  {previews.avatar ? 
                    <img src={previews.avatar} className="w-full h-full object-cover" alt="Avatar Preview" /> : 
                    <UserCircle size={48} className="text-blue-200" />
                  }
                </div>
                <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl cursor-pointer shadow-lg hover:scale-110 transition-transform">
                  <Camera size={20} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                </label>
              </div>
              <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Upload Profile Photo</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-black text-blue-900 uppercase tracking-widest pl-2">Biography</label>
              <textarea 
                name="bio"
                placeholder="Tell us about your area of expertise..."
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full h-32 bg-blue-50 border-2 border-blue-100 rounded-3xl p-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-blue-900 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
                <ChevronLeft size={18}/> Back
              </button>
              <button onClick={nextStep} className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100/50 flex items-center justify-center gap-2">
                Continue <ArrowRight size={20}/>
              </button>
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-3xl font-black text-blue-900 leading-none">Your Skillset</h2>
              <p className="text-blue-400 font-bold">Step 3: expertise area</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Type a skill and press Enter" 
                  value={currentSkill}
                  onChange={(e) => setCurrentSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-blue-900" 
                />
              </div>

              <div className="flex flex-wrap gap-2 min-h-[100px] p-4 bg-blue-50/50 rounded-3xl border-2 border-dashed border-blue-100">
                {formData.skills.map((skill, index) => (
                  <motion.span 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={index} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2 shadow-sm"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:bg-white/20 rounded-lg p-0.5"><X size={14}/></button>
                  </motion.span>
                ))}
                {formData.skills.length === 0 && <p className="text-blue-300 text-sm font-bold flex items-center italic w-full justify-center">Add skills like "UI Design", "React", "Translation"...</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
                <ChevronLeft size={18}/> Back
              </button>
              <button onClick={nextStep} className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-blue-100/50 flex items-center justify-center gap-2">
                Continue <ArrowRight size={20}/>
              </button>
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-1 text-center">
              <h2 className="text-3xl font-black text-blue-900 leading-none">Security Check</h2>
              <p className="text-blue-400 font-bold">Step 4: ID Verification</p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-blue-700 font-bold leading-relaxed bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3">
                <ShieldCheck size={24} className="shrink-0 text-blue-600" />
                Upload your National ID to verify your identity. This is required to maintain trust in our community.
              </p>

              <label className="block group">
                <div className={`border-4 border-dashed rounded-[2.5rem] p-10 cursor-pointer transition-all ${previews.idCard ? 'bg-emerald-50 border-emerald-500' : 'bg-blue-50 border-blue-200 hover:border-blue-400'}`}>
                  {previews.idCard ? 
                    <div className="space-y-3 flex flex-col items-center">
                      <Check size={40} className="bg-emerald-500 text-white rounded-full p-2" />
                      <span className="font-black text-emerald-700 text-sm">ID Card Attached</span>
                      <button onClick={(e) => { e.preventDefault(); setPreviews(p => ({...p, idCard: null})); setFormData(f => ({...f, idCardData: null})); }} className="text-xs text-emerald-600 font-black underline">Change Photo</button>
                    </div> : 
                    <div className="flex flex-col items-center gap-3 text-blue-400">
                      <Upload size={32} />
                      <span className="font-black uppercase tracking-widest text-xs">Upload ID Image</span>
                    </div>
                  }
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'idCard')} />
                </div>
              </label>

              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-700 font-black uppercase tracking-widest leading-none">Your data is stored in an encrypted private vault accessible only to project admins.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={prevStep} className="flex-1 bg-slate-100 text-slate-600 py-4 rounded-2xl font-black flex items-center justify-center gap-2">
                <ChevronLeft size={18}/> Back
              </button>
              <button onClick={finalizeSignup} disabled={loading || !formData.idCardData} className="flex-[2] bg-emerald-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin" /> : <>Finish Registration <Check size={20}/></>}
              </button>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  const renderLogin = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-blue-900">Welcome Back</h2>
        <p className="text-blue-400 font-bold">Please enter your credentials</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
          <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} 
            className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-blue-900" />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
          <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleInputChange} 
            className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-bold text-blue-900" />
        </div>
      </div>

      <button onClick={handleLogin} disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-100/50 flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
        {loading ? <Loader2 className="animate-spin" /> : 'Login'}
      </button>

      <div className="text-center">
        <button onClick={() => { setMode('signup'); setStep(1); setError(null); }} className="text-blue-600 font-bold text-sm hover:underline">
          Don't have an account? Sign up
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white p-8 md:p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(30,64,175,0.2)] border border-blue-50 relative overflow-hidden">
        {/* Progress indicator for signup */}
        {mode === 'signup' && (
          <div className="flex h-1.5 w-full bg-blue-50 absolute top-0 left-0">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${(step / 4) * 100}%` }} 
              className="bg-blue-600 h-full" 
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        <AnimatePresence mode="wait">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-xs font-black uppercase tracking-tight leading-tight">{error}</p>
            </motion.div>
          )}

          {mode === 'login' ? renderLogin() : (
            <div className="space-y-6">
              {renderSignupStep()}
              {step === 1 && (
                <div className="text-center mt-4">
                  <button onClick={() => { setMode('login'); setError(null); }} className="text-blue-600 font-bold text-sm hover:underline">
                    Already have an account? Login
                  </button>
                </div>
              )}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;