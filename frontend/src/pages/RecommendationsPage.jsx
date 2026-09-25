import React, { useEffect, useState } from 'react';
import { jobService } from '../services/api';
import { Briefcase, MapPin, DollarSign, BrainCircuit, ArrowUpRight, X, Sparkles, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JobCard = ({ job, index, onSelect }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ delay: index * 0.1 }}
    className="glass-card p-8 rounded-[32px] hover-lift border border-slate-800/50 group relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent cursor-pointer"
    onClick={() => onSelect(job)}
  >
    <div className="absolute top-0 right-0 p-6">
      <div className="flex items-center gap-1.5 bg-brand-500/10 text-brand-400 px-4 py-1.5 rounded-2xl text-xs font-black border border-brand-500/20 shadow-lg">
        <BrainCircuit className="w-3.5 h-3.5" />
        {job.match_score}% MATCH
      </div>
    </div>

    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border border-slate-800 shadow-xl group-hover:scale-105 transition-transform">
      <Briefcase className="w-8 h-8 text-indigo-500" />
    </div>

    <h3 className="text-2xl font-black text-white mb-1 group-hover:text-brand-400 transition-colors leading-tight">
      {job.title}
    </h3>
    <p className="font-bold text-slate-400 mb-6">{job.company}</p>

    <div className="flex flex-wrap gap-4 text-xs text-slate-500 mb-8 font-black uppercase tracking-widest">
      <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/50">
        <MapPin className="w-3.5 h-3.5 text-indigo-500" /> {job.location}
      </span>
      {job.salary_range && (
        <span className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800/50">
          <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> {job.salary_range}
        </span>
      )}
    </div>

    {job.match_explanation && (
      <div className="text-sm bg-indigo-500/5 text-slate-400 p-5 rounded-2xl mb-8 font-medium border border-indigo-500/10 italic">
        " {job.match_explanation} "
      </div>
    )}

    <div className="flex gap-2 flex-wrap mb-8">
       {job.matched_skills_list?.slice(0, 3).map(skill => (
         <span key={skill} className="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
           {skill}
         </span>
       ))}
       {job.missing_skills_list?.slice(0, 2).map(skill => (
         <span key={skill} className="px-3 py-1 text-xs font-bold bg-slate-900 text-slate-500 border border-slate-800 rounded-lg opacity-70">
           {skill}
         </span>
       ))}
    </div>

    <button className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black hover:bg-brand-500 hover:text-white transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 group">
      SYNC DETAILS <ArrowUpRight className="w-5 h-5 group-hover:-translate-y-[2px] group-hover:translate-x-[2px] transition-transform"/>
    </button>
  </motion.div>
);

const RecommendationsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsApplying(false);
    setIsApplied(false);
    setIsSaved(false);
  }, [selectedJob]);

  useEffect(() => {
    jobService.getRecommendations().then(res => {
      setJobs(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 mb-20 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-white leading-tight flex items-center gap-4">
             Neural Matches <Sparkles className="text-brand-400 w-10 h-10" />
          </h1>
          <p className="text-slate-500 font-bold text-lg max-w-lg mt-2 font-['Inter']">AI-synchronised opportunities calculated directly from your latest document ingest.</p>
        </div>
        <button className="bg-slate-900 border border-slate-800 text-white px-6 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl">
           <Filter className="w-5 h-5" /> Filter Matrix
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[400px] space-y-6">
          <div className="flex gap-2">
             {[0,1,2].map(i => <motion.div key={i} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, delay: i*0.2 }} className="w-4 h-4 bg-brand-500 rounded-full" />)}
          </div>
          <p className="text-slate-500 font-black uppercase tracking-widest text-sm">Processing Neural Stream...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job, idx) => (
            <JobCard key={job._id || idx} job={job} index={idx} onSelect={setSelectedJob} />
          ))}
          {jobs.length === 0 && (
            <div className="col-span-full text-center py-20">
               <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
                  <Briefcase className="w-10 h-10" />
               </div>
               <h3 className="text-white font-black text-2xl">Stream Empty</h3>
               <p className="text-slate-500 font-bold mt-2">Adjust your skill matrix or upload a new resume.</p>
            </div>
          )}
        </div>
      )}

      {/* Modern Glass Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="glass-card relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[40px] p-10 border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)] no-scrollbar"
            >
              <button 
                onClick={() => setSelectedJob(null)}
                className="absolute top-8 right-8 p-3 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors border border-slate-800 text-white"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                  <Briefcase className="w-10 h-10" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-4xl font-black text-white leading-none tracking-tighter">{selectedJob.title}</h2>
                    <div className="text-brand-400 font-black text-xs uppercase tracking-widest bg-brand-500/10 px-4 py-2 rounded-xl border border-brand-500/20">
                       Top Score
                    </div>
                  </div>
                  <p className="text-xl font-bold text-slate-400">{selectedJob.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                 {[
                   { icon: MapPin, val: selectedJob.location, label: 'Location' },
                   { icon: DollarSign, val: selectedJob.salary_range, label: 'Budget' },
                   { icon: BrainCircuit, val: `${selectedJob.match_score}%`, label: 'AI Match' },
                   { icon: Briefcase, val: 'Full-time', label: 'Inbound' }
                 ].map((stat, i) => (
                   <div key={i} className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800 text-center">
                      <div className="flex justify-center mb-2"><stat.icon className="w-4 h-4 text-slate-500" /></div>
                      <div className="text-white font-black text-sm uppercase">{stat.val}</div>
                      <div className="text-slate-600 text-[10px] font-black uppercase tracking-widest">{stat.label}</div>
                   </div>
                 ))}
              </div>

              <div className="space-y-10">
                <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5">
                  <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Strategic Mission</h3>
                  <p className="text-slate-300 dark:text-slate-400 leading-relaxed font-medium text-lg">
                    {selectedJob.description || "Mission status: Classified."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter flex items-center gap-2">
                       <CheckCircle className="w-5 h-5 text-emerald-500" /> Your Strengths
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedJob.matched_skills_list?.length > 0 ? selectedJob.matched_skills_list.map(skill => (
                        <span key={skill} className="px-4 py-2 bg-emerald-500/10 text-emerald-400 font-black rounded-xl text-xs border border-emerald-500/20 shadow-sm">
                          {skill}
                        </span>
                      )) : <span className="text-slate-500 italic text-sm">No direct matching skills found.</span>}
                    </div>
                  </div>
                  <div className="opacity-75 hover:opacity-100 transition-all">
                    <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tighter flex items-center gap-2 text-slate-400">
                       <Zap className="w-5 h-5 text-amber-500" /> Missing Core Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                       {selectedJob.missing_skills_list?.length > 0 ? selectedJob.missing_skills_list.map(s => (
                         <span key={s} className="px-4 py-2 bg-red-500/10 text-red-400 font-black rounded-xl text-xs border border-red-500/20 shadow-sm">
                           {s}
                         </span>
                       )) : <span className="text-slate-500 italic text-sm">Optimal alignment. No critical gaps.</span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    setIsApplying(true);
                    setTimeout(() => { setIsApplying(false); setIsApplied(true); }, 1500);
                  }}
                  disabled={isApplied || isApplying}
                  className={`flex-1 font-black py-5 rounded-3xl shadow-2xl flex items-center justify-center gap-3 transition-all text-lg ${
                    isApplied 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20 cursor-default'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20 active:scale-95'
                  }`}
                >
                  {isApplying ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> TRANSMITTING PROFILE...</>
                  ) : isApplied ? (
                    <><CheckCircle className="w-6 h-6" /> APPLICATION SYNCED</>
                  ) : (
                    <>INITIALIZE APPLICATION <ArrowUpRight className="w-6 h-6" /></>
                  )}
                </button>
                <button 
                  onClick={() => setIsSaved(true)}
                  disabled={isSaved}
                  className={`sm:w-1/3 border font-black py-5 rounded-3xl transition-all flex items-center justify-center gap-3 text-lg ${
                    isSaved 
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 cursor-default'
                      : 'bg-slate-900 border-slate-800 text-white hover:bg-slate-800'
                  }`}
                >
                  {isSaved ? "DATA SAVED" : "SAVE DATA"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Re-importing CheckCircle as it was missing from initial import block
const CheckCircle = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

export default RecommendationsPage;
