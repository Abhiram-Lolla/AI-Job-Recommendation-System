import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, TrendingUp, BookOpen, Target, Zap, ChevronRight, Award, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const InsightCard = ({ title, value, trend, icon: Icon, color }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -5, scale: 1.02 }}
    className="glass-card p-6 rounded-3xl border border-slate-800 shadow-xl overflow-hidden relative group cursor-pointer"
  >
    <div className={`absolute -right-4 -top-4 p-8 bg-${color}-500/10 rounded-full blur-2xl group-hover:bg-${color}-500/20 transition-all duration-500`}></div>
    <div className={`absolute top-0 right-0 p-4 opacity-10 text-${color}-500 group-hover:scale-110 transition-transform duration-500`}>
      <Icon className="w-16 h-16" />
    </div>
    <div className={`w-12 h-12 rounded-2xl bg-${color}-500/10 flex items-center justify-center mb-4 border border-${color}-500/20`}>
      <Icon className={`w-6 h-6 text-${color}-400`} />
    </div>
    <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">{title}</h3>
    <div className="flex items-end gap-2">
      <span className="text-3xl font-black text-white">{value}</span>
      <span className={`text-${color}-400 text-sm font-black mb-1 flex items-center`}>
        <TrendingUp className="w-3 h-3 mr-1" /> {trend}
      </span>
    </div>
  </motion.div>
);

const SkillInsights = () => {
  const { user } = useAuth();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  // Dynamically generate skills data from user profile
  const skillsData = useMemo(() => {
    if (!user || !user.skills || user.skills.length === 0) {
      return [
        { name: 'React', level: 90, market: 95 },
        { name: 'Node.js', level: 75, market: 88 },
        { name: 'TypeScript', level: 60, market: 92 },
      ];
    }
    
    // Create consistent but pseudo-random levels based on skill string length to make it deterministic
    return user.skills.slice(0, 6).map(skill => {
      const hash = skill.length;
      return {
        name: skill,
        level: Math.min(95, Math.max(40, 50 + (hash * 5))),
        market: Math.min(98, Math.max(70, 70 + (hash * 3)))
      };
    }).sort((a, b) => b.level - a.level);
  }, [user]);

  // Dynamically generate recommendations
  const recommendations = useMemo(() => {
    if (!user || !user.skills || user.skills.length === 0) {
      return [
        { title: 'Master Advanced Cloud Architecture', provider: 'Coursera', time: '12h', impact: 'High' },
        { title: 'Distributed Systems with Node.js', provider: 'Frontend Masters', time: '8h', impact: 'Medium' },
        { title: 'Deep Learning Specialization', provider: 'DeepLearning.AI', time: '40h', impact: 'Critical' }
      ];
    }
    
    const topSkill = skillsData[0]?.name || 'Technology';
    const weakestSkill = skillsData[skillsData.length - 1]?.name || 'System Design';
    
    return [
      { title: `Advanced Architectures in ${topSkill}`, provider: 'Pluralsight', time: '14h', impact: 'High' },
      { title: `Bridging the Gap: ${weakestSkill} Mastery`, provider: 'Coursera', time: '22h', impact: 'Critical' },
      { title: 'System Design Interview Prep', provider: 'AlgoExpert', time: '10h', impact: 'Medium' }
    ];
  }, [user, skillsData]);

  const avgMatch = Math.round(skillsData.reduce((acc, curr) => acc + curr.market, 0) / skillsData.length) || 64;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 py-10 space-y-10"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-white leading-tight">Skill Intelligence</h1>
          <p className="text-slate-500 font-bold text-lg">AI analysis of your competitive edge in the global market.</p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-brand-500/10 px-6 py-3 rounded-2xl border border-brand-500/20 shadow-xl shadow-brand-500/5 cursor-pointer"
        >
          <Zap className="w-6 h-6 text-brand-400 animate-pulse" />
          <div className="text-sm font-black text-brand-400">MARKET MATCH: {avgMatch}%</div>
        </motion.div>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <InsightCard title="Profile Rank" value={`Top ${Math.max(1, 15 - Math.floor(avgMatch/10))}%`} trend="+2% pts" icon={Target} color="indigo" />
        <InsightCard title="Market Demand" value="Rising" trend="High" icon={TrendingUp} color="emerald" />
        <InsightCard title="Active Courses" value={recommendations.length.toString()} trend="On Track" icon={BookOpen} color="amber" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visual Skill Graph */}
        <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <BrainCircuit className="text-indigo-500" /> Skill Competency vs. Market
          </h2>
          <div className="space-y-8 relative z-10">
            {skillsData.map((skill, idx) => (
              <div key={skill.name} className="space-y-3 group">
                <div className="flex justify-between items-center text-sm font-black">
                  <span className="text-white flex items-center gap-2">
                    {idx === 0 && <Star className="w-4 h-4 text-amber-400" />}
                    {skill.name}
                  </span>
                  <div className="flex gap-4">
                    <span className="text-indigo-400">You: {skill.level}%</span>
                    <span className="text-slate-600">Market: {skill.market}%</span>
                  </div>
                </div>
                <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden relative border border-slate-800 shadow-inner group-hover:border-slate-700 transition-colors">
                  {/* Market indicator */}
                  <div 
                    className="absolute inset-y-0 h-full bg-slate-800 opacity-50 transition-all duration-1000"
                    style={{ width: `${skill.market}%` }}
                  />
                  {/* Level indicator */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.5, delay: 0.2 + (idx * 0.1), ease: "easeOut" }}
                    className="absolute inset-y-0 h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] relative overflow-hidden"
                  >
                    {/* Shimmer effect inside the bar */}
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                    />
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div variants={itemVariants} className="glass-card p-8 rounded-[32px] border border-slate-800 shadow-2xl h-fit relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
          <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <Target className="text-emerald-500" /> Learning Path Roadmap
          </h2>
          <div className="space-y-4 relative z-10">
            {recommendations.map((rec, idx) => (
              <motion.div 
                whileHover={{ x: 8, scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                key={idx} 
                className="group flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer shadow-lg"
              >
                <div className="flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-colors ${
                     rec.impact === 'Critical' ? 'bg-red-500/10 text-red-500 group-hover:bg-red-500/20' : 
                     rec.impact === 'High' ? 'bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500/20' : 'bg-slate-500/10 text-slate-500 group-hover:bg-slate-500/20'
                  }`}>
                    {rec.impact[0]}
                  </div>
                  <div>
                    <h4 className="text-white font-bold group-hover:text-brand-400 transition-colors">{rec.title}</h4>
                    <p className="text-slate-500 text-sm font-bold">{rec.provider} • {rec.time}</p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
                  <ChevronRight className="text-slate-400 group-hover:text-white transition-colors w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
          <motion.button 
            whileHover={isEnrolled ? {} : { scale: 1.02 }}
            whileTap={isEnrolled ? {} : { scale: 0.98 }}
            onClick={() => {
              if (isEnrolled || isEnrolling) return;
              setIsEnrolling(true);
              setTimeout(() => { setIsEnrolling(false); setIsEnrolled(true); }, 1500);
            }}
            className={`w-full mt-8 py-4 rounded-2xl font-black shadow-xl transition-all flex items-center justify-center gap-2 group ${
              isEnrolled 
                ? 'bg-emerald-500 text-white shadow-emerald-500/20 cursor-default'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/20'
            }`}
          >
            {isEnrolling ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> SYNCHRONIZING PATH...</>
            ) : isEnrolled ? (
              <><Award className="w-5 h-5" /> PROTOCOL INITIALIZED</>
            ) : (
              <><Award className="w-5 h-5 group-hover:rotate-12 transition-transform" /> Start Learning Path</>
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SkillInsights;
