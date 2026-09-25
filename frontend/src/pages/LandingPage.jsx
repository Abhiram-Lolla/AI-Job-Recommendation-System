import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BrainCircuit, Zap, Globe, ShieldCheck, Cpu } from 'lucide-react';

const Feature = ({ icon: Icon, title, desc, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="glass-card p-8 rounded-[32px] border border-white/5 hover:border-brand-500/30 transition-all group"
  >
    <div className="w-14 h-14 bg-brand-500/10 rounded-2xl flex items-center justify-center text-brand-400 mb-6 group-hover:scale-110 transition-transform border border-brand-500/20">
      <Icon className="w-7 h-7" />
    </div>
    <h3 className="text-xl font-black text-white mb-2 tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
  </motion.div>
);

const LandingPage = () => {
  return (
    <div className="relative overflow-hidden bg-[#0B0F19]">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-screen pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-brand-400 text-sm font-black mb-10 shadow-2xl"
          >
            <Sparkles className="w-4 h-4" /> RECRUITMENT INTELLIGENCE v4.0
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8"
          >
            THE FUTURE OF <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-brand-400 to-purple-500">CAREER SYNCING</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-xl md:text-2xl font-bold max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Ingest your identity. Analyze the marketplace. <br className="hidden md:block" />
            Discover opportunities you were designed for.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <Link 
              to="/register" 
              className="w-full sm:w-auto bg-white text-slate-900 px-10 py-5 rounded-[24px] text-lg font-black hover:bg-brand-500 hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-95 flex items-center justify-center gap-3 group"
            >
              Start Your Sync <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto bg-slate-900/50 backdrop-blur-xl border border-slate-800 text-white px-10 py-5 rounded-[24px] text-lg font-black hover:bg-slate-800 transition-all flex items-center justify-center"
            >
              System Access
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="py-20 border-y border-white/5 bg-white/[0.01]">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'Market Jobs', val: '2.4M+' },
              { label: 'Analysed Profiles', val: '800k+' },
              { label: 'Recruitment Accuracy', val: '98.4%' },
              { label: 'Latency', val: '12ms' }
            ].map((stat, i) => (
              <div key={i}>
                 <div className="text-4xl font-black text-white mb-2">{stat.val}</div>
                 <div className="text-sm font-black text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
         </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">POWERED BY NEURAL ARCHITECTURE</h2>
            <p className="text-slate-500 font-bold text-lg max-w-xl mx-auto">Our recruitment engine analyzes your resume with the same precision as a human headhunter, only 1,000x faster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Feature 
              icon={BrainCircuit} 
              title="Semantic Matching" 
              desc="We don't just find keywords. We understand your experience and match it to the deeper requirements of the role."
              delay={0.1}
            />
            <Feature 
              icon={Zap} 
              title="Real-time Extraction" 
              desc="Upload your PDF and get a complete skill-gap analysis in milliseconds. Optimized for modern tech stacks."
              delay={0.2}
            />
            <Feature 
              icon={ShieldCheck} 
              title="Verified Intelligence" 
              desc="Every job match comes with a comprehensive 'Why' report, explaining the logic behind our selection."
              delay={0.3}
            />
            <Feature 
              icon={Globe} 
              title="Global Market Reach" 
              desc="Access live opportunities from remote-first companies and unicorn startups worldwide."
              delay={0.4}
            />
            <Feature 
              icon={Cpu} 
              title="Resume Tuning" 
              desc="Our AI doesn't just find flaws—it rewrites your professional summary to ensure maximum ATS impact."
              delay={0.5}
            />
            <Feature 
              icon={Sparkles} 
              title="Career Coaching" 
              desc="A dedicated 24/7 AI Career assistant built directly into your dashboard to guide your next move."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-32 px-4">
        <div className="max-w-3xl mx-auto glass-card p-16 rounded-[48px] border border-brand-500/20 text-center relative overflow-hidden bg-gradient-to-br from-indigo-600/10 to-transparent">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-brand-500 rounded-full shadow-[0_0_20px_#0ea5e9]" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8">READY TO UPGRADE <br /> YOUR IDENTITY?</h2>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-3 bg-white text-slate-900 px-12 py-5 rounded-[24px] text-xl font-black hover:bg-brand-500 hover:text-white transition-all shadow-2xl active:scale-95 group"
          >
            Initialize Sync <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 text-center text-slate-700 font-bold text-sm tracking-widest uppercase">
        © 2026 SmartRec Intelligence Protocol. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;
