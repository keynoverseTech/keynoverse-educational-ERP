import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, RefreshCw, Mail, Check, AlertCircle } from 'lucide-react';
// import PixelBlast from '../../components/PixelBlast';
import { useAuth } from '../../state/authContext';

const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading: authLoading, error: authError, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Suppress unused var warning for now
  void rememberMe;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/super-admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Navigation handled by useEffect
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans bg-black">
        {/* Background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 to-black">
            {/* 
            <PixelBlast 
                color="#ffffff"
                variant="square"
                pixelSize={3}
                speed={0.5}
                className="opacity-50"
                enableRipples={true}
            /> 
            */}
        </div>

        {/* Floating Card Container */}
        <div className="relative z-10 flex w-full max-w-[1000px] h-[600px] bg-transparent rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up border border-white/20">
            
            {/* Left Side - Welcome Panel */}
            <div className="hidden lg:flex w-5/12 relative flex-col justify-between p-12 text-white overflow-visible">
                {/* Black Background */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm">
                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-10" 
                        style={{
                            backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`,
                            backgroundSize: '24px 24px'
                        }}>
                    </div>
                </div>

                {/* The "Arrow" protruding to the right */}
                <div className="absolute top-1/2 -right-4 w-10 h-10 bg-transparent transform -translate-y-1/2 rotate-45 z-20 hidden lg:block border-r border-t border-white/20"></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center">
                    <div className="mb-8">
                         <h2 className="text-xl font-bold tracking-[0.2em] mb-2 text-white">WELCOME SUPER ADMIN PORTAL</h2>
                         <div className="h-1 w-24 bg-white mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-2xl shadow-lg mb-6">
                         <Shield className="w-16 h-16 text-black" strokeWidth={1.5} />
                    </div>

                    <h1 className="text-2xl font-bold leading-tight mb-4 drop-shadow-md text-white">
                        KEYNOVERSE<br/>
                        <span className="text-lg font-medium opacity-90">EDUCATIONAL ERP</span>
                    </h1>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-7/12 bg-transparent p-8 lg:p-16 flex flex-col justify-center relative">
                
                <div className="max-w-md mx-auto w-full">
                    {/* Header for Mobile/Form Side */}
                    <div className="text-center mb-10">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="bg-white p-3 rounded-xl shadow-lg shadow-white/10 inline-flex">
                                <Shield className="w-8 h-8 text-black" strokeWidth={2} />
                            </div>
                        </div>
                    </div>

                    {authError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} className="text-red-500 shrink-0" />
                            <p>{authError}</p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors">
                                    <Mail size={20} />
                                </div>
                                <input 
                                    type="email" 
                                    className="w-full pl-12 pr-4 py-4 bg-black border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all duration-200"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-white uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-white transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-12 pr-12 py-4 bg-black border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all duration-200"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                  type="button" 
                                  onClick={() => setShowPassword(!showPassword)} 
                                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-white border-white' : 'bg-transparent border-slate-500 group-hover:border-white'}`}>
                                    {rememberMe && <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={rememberMe}
                                    onChange={() => setRememberMe(!rememberMe)}
                                />
                                <span className="text-sm text-white group-hover:text-slate-200 transition-colors">Remember</span>
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={authLoading}
                            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                        >
                            {authLoading ? (
                                <>
                                    <RefreshCw size={20} className="animate-spin" />
                                    <span>Signing In...</span>
                                </>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  );
};

export default SuperAdminLogin;
