
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ShieldCheck, Upload, ArrowRight, Check, Info } from 'lucide-react';






const Auth = ({ onLogin }) => {
  const [step, setStep] = useState('welcome');
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [idFile, setIdFile] = useState(null);

  const handleAuth = () => {
    if (mode === 'signup') {
      if (!email || !username || !password) {
        alert("Please fill in all fields to continue.");
        return;
      }
      setStep('verify');
    } else {
      if (!email || !password) {
        alert("Please enter your email and password.");
        return;
      }
      completeAuth();
    }
  };

  const completeAuth = () => {
    onLogin({
      id: 'user_' + Date.now(),
      username: username || 'Alex Rivera',
      email,
      isAuthenticated: true,
      isVerified: idFile ? true : mode === 'login', // Assume old users are verified for this demo
      avatar: 'https://picsum.photos/200',
      bio: 'Ready to help the community!',
      skills: [],
      timeBalance: 10,
      ratingAvg: 5.0,
      reviewsCount: 0,
      badges: [],
      certificates: [],
      freelanceUnlocked: false,
      hasCompletedOnboarding: mode === 'login',
      onboardingData: null,
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div
        layout
        className="bg-white w-full max-w-md p-8 md:p-12 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(30,64,175,0.2)] border border-blue-50">
        
        <AnimatePresence mode="wait">
          {step === 'welcome' &&
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-8">
            
              <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-5xl font-black mx-auto shadow-2xl shadow-blue-200">E</div>
              <div className="space-y-3">
                <h1 className="text-4xl font-black text-blue-900 tracking-tighter">Echo Time</h1>
                <p className="text-blue-500 font-bold text-lg">Your time is more valuable than money.</p>
              </div>
              <button
              onClick={() => setStep('form')}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
              
                Join Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          }

          {step === 'form' &&
          <motion.div
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8">
            
              <div className="text-center">
                <h2 className="text-3xl font-black text-blue-900">{mode === 'signup' ? 'Create Account' : 'Welcome Back'}</h2>
                <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="text-blue-600 font-bold text-sm hover:underline mt-2">
                  {mode === 'signup' ? 'Already have an account? Login' : 'Need an account? Sign up'}
                </button>
              </div>

              <div className="space-y-4">
                {mode === 'signup' &&
              <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                    <input
                  type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-blue-900" />
                
                  </div>
              }
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                  <input
                  type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-blue-900" />
                
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" size={20} />
                  <input
                  type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-blue-50 border-2 border-blue-100 rounded-2xl pl-12 pr-4 py-4 outline-none focus:border-blue-400 focus:bg-white transition-all font-black text-blue-900" />
                
                </div>
              </div>

              <button
              onClick={handleAuth}
              className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">
              
                {mode === 'signup' ? 'Continue' : 'Login'}
              </button>
            </motion.div>
          }

          {step === 'verify' &&
          <motion.div
            key="verify"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center space-y-8">
            
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner border border-blue-100">
                <ShieldCheck size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-blue-900">Verify Identity</h3>
                <p className="text-blue-500 text-sm font-medium leading-relaxed">To keep the community safe, please upload a photo of your ID card.</p>
              </div>

              <label className="block group">
                <div className={`border-4 border-dashed rounded-[2.5rem] p-12 cursor-pointer transition-all ${idFile ? 'bg-blue-600 border-blue-600' : 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-white'}`}>
                  {idFile ?
                <div className="flex flex-col items-center gap-3 text-white animate-in zoom-in-95 duration-300">
                      <Check size={40} className="bg-white text-blue-600 rounded-full p-2" />
                      <span className="font-black text-sm uppercase tracking-widest">{idFile.name}</span>
                    </div> :

                <div className="flex flex-col items-center gap-4 text-blue-400 group-hover:text-blue-600 transition-colors">
                      <Upload size={40} />
                      <span className="font-black uppercase tracking-widest text-xs">Upload ID Card Photo</span>
                    </div>
                }
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setIdFile(e.target.files?.[0] || null)} />
                </div>
              </label>

              <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 text-left border border-blue-100">
                <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Your data is encrypted and will never be shared with others.</p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep('form')} className="flex-1 py-4 text-blue-400 font-black uppercase tracking-widest text-xs hover:text-blue-600 transition-colors">Back</button>
                <button
                onClick={completeAuth}
                disabled={!idFile}
                className="flex-[2] bg-blue-600 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-100 disabled:opacity-50 hover:bg-blue-700 transition-all active:scale-95">
                
                  Confirm & Join
                </button>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </motion.div>
    </div>);

};

export default Auth;