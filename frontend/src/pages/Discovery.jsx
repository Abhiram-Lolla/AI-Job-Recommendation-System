import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { jobService } from '../services/api';
import { Briefcase, MapPin, DollarSign, BrainCircuit, Heart, X as CloseIcon, Info, Sparkles, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';

const SwipeCard = ({ job, index, onSwipe, onShowDetails }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const scale = useTransform(x, [-200, 0, 200], [0.8, 1, 0.8]);
  
  const labelOpacityRight = useTransform(x, [0, 80], [0, 1]);
  const labelOpacityLeft = useTransform(x, [0, -80], [0, 1]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipe('right', job);
    } else if (info.offset.x < -100) {
      onSwipe('left', job);
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, scale, zIndex: 100 - index }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <div className="w-full h-full glass-card rounded-[48px] border border-white/10 p-10 flex flex-col relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-gradient-to-b from-[#111827] to-[#0B0F19]">
        
        {/* Swipe Labels */}
        <motion.div style={{ opacity: labelOpacityRight }} className="absolute top-12 left-10 z-20 border-4 border-emerald-500 text-emerald-500 px-6 py-2 rounded-2xl font-black text-3xl uppercase rotate-[-20deg] pointer-events-none">
          SAVE
        </motion.div>
        <motion.div style={{ opacity: labelOpacityLeft }} className="absolute top-12 right-10 z-20 border-4 border-red-500 text-red-500 px-6 py-2 rounded-2xl font-black text-3xl uppercase rotate-[20deg] pointer-events-none">
          SKIP
        </motion.div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-3xl flex items-center justify-center border border-indigo-500/20 shadow-xl">
              <Briefcase className="w-10 h-10 text-indigo-400" />
            </div>
            <div className="flex flex-col items-end">
               <div className="bg-brand-500 text-white px-5 py-1.5 rounded-full text-xs font-black shadow-[0_0_20px_rgba(14,165,233,0.4)] flex items-center gap-2">
                 <Sparkles className="w-3.5 h-3.5" />
                 {job.match_score}% MATCH
               </div>
               <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2 px-1">Neural Prediction</span>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-4xl font-black text-white mb-2 leading-[0.9] tracking-tighter">{job.title}</h2>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-500">{job.company}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10 text-slate-400 font-bold">
            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
               <MapPin className="w-5 h-5 text-indigo-500" /> 
               <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
               <DollarSign className="w-5 h-5 text-emerald-500" /> 
               <span className="truncate">{job.salary_range}</span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
               <BrainCircuit className="w-3.5 h-3.5" /> Intelligence Rationale
            </p>
            <p className="text-xs font-bold text-slate-300 leading-relaxed line-clamp-2">
              {job.match_explanation}
            </p>
          </div>
        </div>

        <button 
          onClick={() => onShowDetails(job)}
          className="mt-8 w-full bg-white text-slate-900 font-black py-6 rounded-[28px] flex items-center justify-center gap-2 hover:bg-brand-500 hover:text-white transition-all shadow-2xl group active:scale-95"
        >
          VIEW PROTOCOL <Info className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

const Discovery = () => {
  const [jobs, setJobs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isSecuring, setIsSecuring] = useState(false);
  const [isSecured, setIsSecured] = useState(false);

  useEffect(() => {
    setIsSecuring(false);
    setIsSecured(false);
  }, [selectedJob]);

  useEffect(() => {
    jobService.getRecommendations().then(res => {
      setJobs(res.data);
      setLoading(false);
    });
  }, []);

  const handleSwipe = (direction, job) => {
    setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0B0F19] overflow-hidden flex flex-col p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto w-full flex flex-col h-full flex-1">
        
        <div className="mb-10 flex justify-between items-end px-4">
          <div>
            <div className="flex items-center gap-2 text-brand-400 font-black text-xs uppercase tracking-widest mb-1">
               <Sparkles className="w-3.5 h-3.5" /> Discovery Matrix
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">FIND YOUR <span className="text-indigo-500">SYNC</span></h1>
          </div>
          <div className="bg-slate-900 px-6 py-3 rounded-2xl border border-slate-800 shadow-xl text-slate-400 font-black text-sm flex items-center gap-2">
            Remaining: <span className="text-indigo-400">{Math.max(0, jobs.length - currentIndex)}</span>
          </div>
        </div>

        <div className="flex-1 relative flex justify-center items-center">
          {loading ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Accessing Neural Stream...</p>
            </div>
          ) : (
            <div className="relative w-full max-w-[450px] aspect-[3/4]">
              <AnimatePresence>
                {jobs.length > currentIndex ? (
                   jobs.slice(currentIndex, currentIndex + 2).reverse().map((job, idx) => (
                    <SwipeCard 
                      key={job._id} 
                      job={job} 
                      index={idx}
                      onSwipe={handleSwipe}
                      onShowDetails={setSelectedJob}
                    />
                   ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full flex flex-col items-center justify-center text-center p-12 space-y-8 glass-card rounded-[40px] border border-white/5"
                  >
                    <div className="w-28 h-28 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
                      <CheckCircle className="w-14 h-14" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-white leading-tight">MATRIX SYNCED</h3>
                      <p className="text-slate-500 font-bold mt-2">You've explored all current matches. Return in 24h for fresh data.</p>
                    </div>
                    <button 
                      onClick={() => setCurrentIndex(0)}
                      className="bg-white text-slate-900 px-10 py-5 rounded-[24px] font-black shadow-2xl hover:bg-brand-500 hover:text-white transition-all active:scale-95"
                    >
                      INITIALIZE REFRESH
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-10 mt-12 mb-6">
          <button 
            disabled={jobs.length <= currentIndex}
            onClick={() => handleSwipe('left', jobs[currentIndex])}
            className="w-24 h-24 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-red-500 shadow-2xl hover:bg-red-500 hover:text-white transition-all disabled:opacity-20 active:scale-90 group"
          >
            <CloseIcon className="w-10 h-10 transition-transform group-hover:scale-110" />
          </button>
          <button 
            disabled={jobs.length <= currentIndex}
            onClick={() => handleSwipe('right', jobs[currentIndex])}
            className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 border border-white/10 hover:scale-110 active:scale-90 transition-all disabled:opacity-20 group"
          >
            <Heart className="w-10 h-10 transition-transform group-hover:scale-110 fill-current" />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl"
            onClick={() => setSelectedJob(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
              onClick={e => e.stopPropagation()}
              className="glass-card w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[48px] p-10 md:p-12 border border-white/10 no-scrollbar relative shadow-[0_0_100px_rgba(0,0,0,0.8)]"
            >
              <button 
                onClick={() => setSelectedJob(null)} 
                className="absolute top-8 right-8 p-3 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors border border-slate-800 text-white"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
              
              <div className="flex items-center gap-6 mb-12">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center text-white shadow-2xl">
                  <Briefcase className="w-10 h-10" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tighter">{selectedJob.title}</h2>
                  <p className="text-xl font-bold text-slate-400">{selectedJob.company}</p>
                </div>
              </div>

              <div className="space-y-10">
                <div className="bg-white/5 p-8 rounded-[32px] border border-white/5">
                   <h3 className="text-indigo-400 font-extrabold uppercase text-xs tracking-widest mb-4">Neural Analysis</h3>
                   <p className="text-slate-300 font-bold text-lg leading-relaxed italic">"{selectedJob.match_explanation}"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div>
                        <h3 className="text-emerald-500 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4"/> Synced DNA
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedJob.matched_skills_list?.map(s => (
                              <span key={s} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold">{s}</span>
                            )) || <span className="text-slate-600 text-xs italic">No direct skill sync detected.</span>}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-red-500 font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4"/> Critical Gaps
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedJob.missing_skills_list?.slice(0, 5).map(s => (
                              <span key={s} className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs font-bold">{s}</span>
                            )) || <span className="text-slate-600 text-xs italic">Optimal alignment. No critical gaps.</span>}
                        </div>
                      </div>
                   </div>
                   <div className="bg-indigo-500/5 p-8 rounded-[40px] border border-indigo-500/10 flex flex-col items-center justify-center text-center">
                      <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4 border border-indigo-500/20">
                         <BrainCircuit className="w-10 h-10 text-brand-400"/>
                      </div>
                      <div className="text-5xl font-black text-white mb-2">{selectedJob.match_score}%</div>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Match Certainty</p>
                   </div>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => {
                    if (isSecured || isSecuring) return;
                    setIsSecuring(true);
                    setTimeout(() => { setIsSecuring(false); setIsSecured(true); }, 1500);
                  }}
                  disabled={isSecured || isSecuring}
                  className={`flex-1 font-black py-5 rounded-[24px] text-lg shadow-2xl transition-all flex items-center justify-center gap-3 ${
                    isSecured 
                      ? 'bg-emerald-500 text-white shadow-emerald-500/20 cursor-default'
                      : 'bg-white text-slate-900 hover:bg-brand-500 hover:text-white active:scale-95'
                  }`}
                >
                  {isSecuring ? (
                    <><div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" /> SECURING NODE...</>
                  ) : isSecured ? (
                    <><CheckCircle className="w-6 h-6" /> POSITION SECURED</>
                  ) : (
                    <>SECURE POSITION <ArrowRight className="w-6 h-6" /></>
                  )}
                </button>
                <button 
                  onClick={() => {
                    setSelectedJob(null);
                    handleSwipe('left', selectedJob);
                  }} 
                  className="sm:w-1/3 bg-slate-900 border border-slate-800 text-white font-black py-5 rounded-[24px] hover:bg-red-500 hover:border-red-500 transition-all active:scale-95"
                >
                   DISMISS
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discovery;
