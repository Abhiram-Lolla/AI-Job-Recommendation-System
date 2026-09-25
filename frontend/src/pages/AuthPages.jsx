import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/dashboard');
    else alert('Login failed. Check credentials.');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        className="max-w-md w-full glass-card p-12 rounded-[40px] border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.3)] relative overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-indigo-500 rounded-full" />
        
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter">Welcome Back</h2>
          <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-[0.2em]">Authorized Access Only</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input 
                name="email" type="email" required 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold placeholder-slate-700" 
                placeholder="Secure Email" 
                value={email} onChange={e => setEmail(e.target.value)} 
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input 
                name="password" type="password" required 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold placeholder-slate-700" 
                placeholder="Access Key" 
                value={password} onChange={e => setPassword(e.target.value)} 
              />
            </div>
          </div>

          <button type="submit" className="w-full flex justify-center py-5 rounded-2xl bg-white text-slate-900 font-black hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95 group">
            INITIALIZE SESSION <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-center text-sm font-bold text-slate-600">
            New operative? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-black hover:underline uppercase tracking-tighter">create credentials</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      const success = await register(name, email, password);
      if (success) navigate('/onboarding');
      else alert('Registration failed. Email might exist.');
    };
  
    return (
      <div className="min-h-[90vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="max-w-md w-full glass-card p-12 rounded-[40px] border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-purple-500 rounded-full" />
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter">Join Protocol</h2>
            <p className="text-slate-500 font-bold mt-2 uppercase text-xs tracking-[0.2em]">Initialize Your Identity</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="text" required 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold placeholder-slate-700" 
                  placeholder="Full Name" 
                  value={name} onChange={e => setName(e.target.value)} 
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="email" required 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold placeholder-slate-700" 
                  placeholder="Secure Email" 
                  value={email} onChange={e => setEmail(e.target.value)} 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                <input 
                  type="password" required 
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-12 py-4 text-white outline-none focus:ring-2 focus:ring-purple-500 transition-all font-bold placeholder-slate-700" 
                  placeholder="Master Key" 
                  value={password} onChange={e => setPassword(e.target.value)} 
                />
              </div>
            </div>

            <button type="submit" className="w-full flex justify-center py-5 rounded-2xl bg-white text-slate-900 font-black hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-95 group">
              PROCEED TO SYNC <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-center text-sm font-bold text-slate-600">
              Already initialized? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-black hover:underline uppercase tracking-tighter">system login</Link>
            </p>
          </form>
        </motion.div>
      </div>
    );
  };
