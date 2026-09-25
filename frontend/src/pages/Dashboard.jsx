import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  UploadCloud, CheckCircle, BrainCircuit, AlertTriangle, Lightbulb, 
  FileText, ArrowRight, TrendingUp, Briefcase, Zap, Target
} from 'lucide-react';
import { resumeService } from '../services/api';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StatCard = ({ label, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-card p-6 rounded-[28px] border border-slate-800 flex items-center gap-5 shadow-xl hover:border-slate-700 transition-all bg-gradient-to-br from-white/5 to-transparent"
  >
    <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 flex items-center justify-center text-${color}-400 border border-${color}-500/20`}>
      <Icon className="w-7 h-7" />
    </div>
    <div>
      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl font-black text-white">{value}</h3>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    try {
      const res = await resumeService.uploadResume(file);
      setResult(res.data);
      // Auto-scroll to results after short delay
      setTimeout(() => {
        window.scrollTo({ top: 800, behavior: 'smooth' });
      }, 500);
    } catch (err) {
      console.error(err);
      const backendMsg = err.response?.data?.detail || err.response?.data?.error || err.message;
      alert(`Failed to upload. Make sure you selected a PDF or Docx.\nBackend Error: ${backendMsg}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* Personalized Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-brand-400 font-black text-sm uppercase tracking-widest mb-2">
             <Zap className="w-4 h-4" /> AI System Active
          </div>
          <h1 className="text-5xl font-black text-white tracking-tight">
            Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">{user?.name}</span>
          </h1>
          <p className="text-slate-500 mt-2 font-bold text-lg">Your career intelligence dashboard is ready for analysis.</p>
        </div>
        <Link 
          to="/discovery" 
          className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-brand-500 hover:text-white transition-all active:scale-95 flex items-center gap-2"
        >
          Discover Jobs <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Live Matches" 
          value={result ? "20+" : "0"} 
          icon={Briefcase} 
          color="indigo" 
          delay={0.1} 
        />
        <StatCard 
          label="Profile Rank" 
          value={result ? result.resume_score > 80 ? "Top 5%" : "Top 15%" : "N/A"} 
          icon={TrendingUp} 
          color="emerald" 
          delay={0.2} 
        />
        <StatCard 
          label="Experience" 
          value={result ? result.analysis.tier : "N/A"} 
          icon={Target} 
          color="purple" 
          delay={0.3} 
        />
        <StatCard 
          label="Skill Match" 
          value={result ? `${result.resume_score}%` : "0%"} 
          icon={BrainCircuit} 
          color="amber" 
          delay={0.4} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Card */}
        <div className="glass-card p-10 rounded-[32px] border border-slate-800 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-700" />
          <h2 className="text-2xl font-black mb-8 dark:text-white flex items-center gap-3">
            <UploadCloud className="text-brand-500 w-8 h-8" />
            Core Analytics
          </h2>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-slate-800 rounded-3xl p-12 text-center hover:bg-slate-900/40 transition duration-300 cursor-pointer relative group flex flex-col items-center justify-center">
              <input 
                type="file" 
                accept=".pdf,.docx" 
                onChange={(e) => setFile(e.target.files[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-slate-500 flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-4 border border-slate-800 shadow-lg group-hover:scale-110 transition-transform">
                   <FileText className="w-8 h-8 text-slate-600" />
                </div>
                <span className="font-black text-white text-lg">
                  {file ? file.name : 'Ingest Resume'}
                </span>
                <span className="text-sm font-bold mt-1 text-slate-600">ATS Optimization Analysis • v2.0</span>
              </div>
            </div>
            <button 
              disabled={uploading || !file}
              className={`w-full py-5 rounded-2xl font-black text-white transition-all shadow-xl flex items-center justify-center gap-3 ${
                uploading || !file ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/20 active:scale-95'
              }`}
            >
              {uploading ? (
                <> <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Neural Processing...</>
              ) : (
                'Perform Deep Sync'
              )}
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div className="glass-card p-10 rounded-[32px] border border-slate-800 shadow-2xl flex flex-col justify-center min-h-[400px]">
          {result ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-6 shadow-xl shadow-emerald-500/5">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-black dark:text-white mb-2">Sync Complete!</h3>
              <p className="text-slate-500 mb-8 font-bold">Integrity Score: <span className="text-brand-400">{result.resume_score}%</span></p>
              
              <div className="flex flex-wrap gap-2 justify-center mb-10">
                {result.extracted_skills.map((skill, idx) => (
                  <span key={idx} className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 rounded-xl text-sm font-bold shadow-md">
                    {skill}
                  </span>
                ))}
              </div>

              <Link to="/insights" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-brand-500 hover:text-white transition-all shadow-xl active:scale-95">
                <Zap className="w-5 h-5"/> View Intelligence
              </Link>
            </motion.div>
          ) : (
            <div className="text-center space-y-6 flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-900/50 rounded-3xl flex items-center justify-center border border-slate-800 shadow-inner">
                 <BrainCircuit className="w-10 h-10 text-slate-700 opacity-50"/>
              </div>
              <div>
                <h3 className="text-white font-black text-xl mb-1">Awaiting Data</h3>
                <p className="text-slate-600 font-bold max-w-xs mx-auto">Upload your document to begin AI-powered recruitment intelligence mapping.</p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Analysis Section */}
      {result?.analysis && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="glass-card p-10 rounded-[32px] border border-brand-500/30 shadow-2xl relative overflow-hidden bg-gradient-to-b from-brand-500/[0.05] to-transparent ring-2 ring-brand-500/20"
        >
          <div className="absolute top-0 right-0 p-8">
             <div className="bg-brand-500 text-white px-4 py-2 rounded-2xl text-[10px] font-black animate-pulse shadow-[0_0_20px_rgba(14,165,233,0.5)]">
               NEXT STEP AVAILABLE
             </div>
          </div>
          <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
          
          <div className="flex items-center gap-4 mb-10">
             <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                <BrainCircuit className="w-8 h-8 text-indigo-400" />
             </div>
             <div>
                <h2 className="text-3xl font-black text-white">AI Strategy Report</h2>
                <p className="text-slate-500 font-bold">Deep analysis of your current market positioning.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="font-black text-blue-400 text-lg flex items-center gap-3 uppercase tracking-wider">
                <Target className="w-5 h-5" /> Intelligence Profile
              </h3>
              <div className="flex flex-wrap gap-4">
                 <div className="px-6 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-extrabold flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Detected Domain</span>
                    <span className="text-lg">{result.analysis.domain}</span>
                 </div>
                 <div className="px-6 py-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-extrabold flex flex-col">
                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Experience Band</span>
                    <span className="text-lg">{result.analysis.tier}</span>
                 </div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <h4 className="text-emerald-400 font-black text-xs uppercase mb-3 flex items-center gap-2">
                   <CheckCircle className="w-3 h-3" /> Technical Strengths
                </h4>
                <p className="text-slate-300 font-bold text-sm italic leading-relaxed">
                  {result.analysis.strengths}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-black text-red-500 text-lg flex items-center gap-3 uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5" /> Critical Friction Points
              </h3>
              <div className="space-y-4">
                {result.analysis.flaws.map((flaw, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-slate-300 font-bold text-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 shadow-[0_0_8px_#ef4444]" />
                    {flaw}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 mt-10">
             <div className="space-y-6">
              <h3 className="font-black text-emerald-400 text-lg flex items-center gap-3 uppercase tracking-wider">
                <Lightbulb className="w-5 h-5" /> Neural Improvement Protocol
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.analysis.improvements.map((improvement, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 text-slate-300 font-bold text-sm">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-[0_0_8px_#10b981]" />
                    {improvement}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-inner relative group">
             <div className="absolute top-4 right-4 text-slate-800 group-hover:text-slate-700 transition-colors">
                <FileText className="w-10 h-10" />
             </div>
             <h3 className="font-black text-brand-400 text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
                Suggested Professional Identity
             </h3>
             <p className="text-slate-300 font-bold leading-relaxed text-xl border-l-4 border-brand-500 pl-6 py-2 shadow-2xl italic">
               "{result.analysis.better_summary}"
             </p>
             <button onClick={() => {navigator.clipboard.writeText(result.analysis.better_summary); alert('Summarized copied!')}} className="mt-6 text-sm font-black text-brand-400 hover:text-white flex items-center gap-2 transition-all group">
               COPY TO CLIPBOARD <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          <div className="mt-12 flex justify-center">
             <Link 
               to="/discovery" 
               className="group relative inline-flex items-center gap-3 bg-brand-500 text-white px-12 py-6 rounded-[24px] font-black text-xl hover:bg-brand-400 transition-all shadow-[0_0_40px_rgba(14,165,233,0.3)] hover:-translate-y-1"
             >
               LAUNCH DISCOVERY CORE <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
               <span className="absolute -inset-1 bg-brand-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
             </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
