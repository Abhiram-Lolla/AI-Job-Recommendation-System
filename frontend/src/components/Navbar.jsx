import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LayoutDashboard, Search, TrendingUp, LogOut, Moon, Sparkles } from 'lucide-react';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`relative flex items-center gap-2 px-4 py-2 text-sm font-bold transition-all rounded-xl ${
        isActive 
          ? 'text-brand-400 bg-brand-500/10' 
          : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-400' : 'text-slate-500'}`} />
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-500 rounded-full shadow-[0_0_8px_#0ea5e9]"></span>
      )}
    </Link>
  );
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-18 items-center py-4">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">
              SMART<span className="text-brand-500">REC</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {user && (
              <>
                <NavLink to="/dashboard" icon={LayoutDashboard}>Index</NavLink>
                <NavLink to="/discovery" icon={Search}>Discovery</NavLink>
                <NavLink to="/insights" icon={TrendingUp}>Insights</NavLink>
                <NavLink to="/recommendations" icon={Briefcase}>Matches</NavLink>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Master</span>
                  <span className="text-sm font-bold text-white">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg active:scale-95"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-black text-slate-500 hover:text-white transition-colors uppercase tracking-widest">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-white text-slate-900 px-6 py-2.5 rounded-[18px] text-sm font-black hover:bg-brand-500 hover:text-white transition-all shadow-xl active:scale-95"
                >
                  Join Alpha
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
