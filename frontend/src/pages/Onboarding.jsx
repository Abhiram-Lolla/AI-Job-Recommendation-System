import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Sparkles, MapPin, DollarSign, Briefcase, Cpu } from 'lucide-react';

const steps = [
  {
    title: "Primary Skills",
    description: "What are your core technical strengths?",
    icon: <Cpu className="w-8 h-8 text-indigo-500" />,
  },
  {
    title: "Experience",
    description: "How long have you been in the industry?",
    icon: <Briefcase className="w-8 h-8 text-purple-500" />,
  },
  {
    title: "Preferences",
    description: "Salary expectations and location.",
    icon: <DollarSign className="w-8 h-8 text-emerald-500" />,
  },
  {
    title: "Ready!",
    description: "Your personalized AI workspace is ready.",
    icon: <Sparkles className="w-8 h-8 text-amber-500" />,
  }
];

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    skills: [],
    experience: 'Intermediate',
    salary: 100000,
    location: 'Remote',
    role: 'Frontend Developer'
  });
  const [skillInput, setSkillInput] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Finalize - would save to DB here
      navigate('/dashboard');
    }
  };

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput && !formData.skills.includes(skillInput)) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                idx <= currentStep ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-card p-10 rounded-[32px] border border-slate-800 shadow-2xl relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full" />
            
            <div className="mb-8 text-center">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-800 shadow-lg">
                {steps[currentStep].icon}
              </div>
              <h2 className="text-3xl font-extrabold text-white mb-2">{steps[currentStep].title}</h2>
              <p className="text-slate-400 font-medium">{steps[currentStep].description}</p>
            </div>

            <div className="space-y-6 min-h-[220px] flex flex-col justify-center">
              {currentStep === 0 && (
                <div>
                  <form onSubmit={addSkill} className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      placeholder="e.g. React, Python, Cloud..."
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                    />
                    <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-4 rounded-xl font-bold flex items-center gap-1 transition-all">
                      Add
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map(skill => (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        key={skill}
                        className="px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-lg text-sm font-bold flex items-center gap-1"
                      >
                        {skill}
                        <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setFormData({...formData, skills: formData.skills.filter(s => s !== skill)})} />
                      </motion.span>
                    ))}
                    {formData.skills.length === 0 && <p className="text-slate-600 italic text-sm">Add at least 3 skills to start...</p>}
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  {['Junior', 'Intermediate', 'Senior', 'Lead'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData({...formData, experience: level})}
                      className={`w-full py-4 px-6 rounded-2xl text-left font-bold transition-all border-2 ${
                        formData.experience === level 
                          ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {level} Level
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <div>
                    <label className="text-sm font-bold text-slate-500 mb-4 block uppercase tracking-wider">Salary Preference</label>
                    <input 
                      type="range" 
                      min="50000" 
                      max="300000" 
                      step="5000"
                      value={formData.salary}
                      onChange={e => setFormData({...formData, salary: e.target.value})}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <div className="flex justify-between mt-4">
                      <span className="text-slate-500 font-bold">$50k</span>
                      <span className="text-indigo-400 font-extrabold text-xl">${Number(formData.salary).toLocaleString()}k</span>
                      <span className="text-slate-500 font-bold">$300k+</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-500 mb-4 block uppercase tracking-wider">Location Type</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['Remote', 'Hybrid', 'On-site'].map(loc => (
                         <button
                           key={loc}
                           onClick={() => setFormData({...formData, location: loc})}
                           className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                             formData.location === loc 
                             ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                             : 'border-slate-800 bg-slate-900/50 text-slate-500 hover:border-slate-700'
                           }`}
                         >
                           {loc}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="text-center py-6 animate-pulse">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-indigo-500" />
                  </div>
                  <p className="text-xl font-bold text-white mb-2">Analyzing Marketplace...</p>
                  <p className="text-slate-500 font-medium">Matching your skills with 2,400+ live opportunities.</p>
                </div>
              )}
            </div>

            <div className="mt-12 flex gap-4">
              {currentStep > 0 && (
                <button 
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="p-4 rounded-2xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-all shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <button 
                onClick={handleNext}
                disabled={currentStep === 0 && formData.skills.length < 1}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {currentStep === steps.length - 1 ? "Launch Workspace" : "Continue"} 
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Simple X icon since we missed it in lucide-react import
const X = ({ className, onClick }) => (
  <svg 
    onClick={onClick}
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" height="24" viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default Onboarding;
