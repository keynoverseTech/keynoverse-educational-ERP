import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, RefreshCw, Mail, Check } from 'lucide-react';
import PixelBlast from '../../components/PixelBlast';

const SuperAdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay for better UX
    setTimeout(() => {
        navigate('/super-admin/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-sans bg-black">
        {/* PixelBlast Background */}
        <div className="absolute inset-0 z-0">
            <PixelBlast 
                color="#ffffff"
                variant="square"
                pixelSize={3}
                speed={0.5}
                className="opacity-50"
                enableRipples={true}
            />
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
                            disabled={isLoading}
                            className="w-full bg-white hover:bg-slate-200 disabled:bg-slate-600 disabled:opacity-70 text-black font-bold py-4 rounded-xl transition-all duration-200 shadow-lg shadow-white/10 hover:shadow-white/20 active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                        >
                            {isLoading ? (
                                <>
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Login
                                </>
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
