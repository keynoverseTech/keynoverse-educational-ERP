import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, School, ArrowRight } from 'lucide-react';
import PixelBlast from '../../components/PixelBlast';

const AuthSelection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden font-sans selection:bg-blue-500/30 text-slate-200">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <PixelBlast 
                    color="#10b981"
                    variant="diamond"
                    pixelSize={4}
                    speed={1}
                    className="opacity-40"
                    enableRipples={true}
                />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
                
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Keynoverse</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-lg mx-auto">
                        Please select your administrative role to access the dashboard.
                    </p>
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full">
                    
                    {/* Super Admin Card */}
                    <button 
                        onClick={() => navigate('/auth/super-admin')}
                        className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] animate-fade-in-up"
                        style={{ animationDelay: '100ms' }}
                    >
                        <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 mb-4 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                            <Shield className="w-8 h-8" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">Super Admin</h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            System control & global configs.
                        </p>

                        <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-blue-400 opacity-80 group-hover:opacity-100 group-hover:gap-3 transition-all duration-300">
                            Access Portal <ArrowRight className="w-3 h-3" />
                        </div>
                    </button>

                    {/* School Admin Card */}
                    <button 
                        onClick={() => navigate('/auth/school-admin')}
                        className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)] animate-fade-in-up"
                        style={{ animationDelay: '200ms' }}
                    >
                        <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 mb-4 group-hover:bg-emerald-500/20 group-hover:scale-110 transition-all duration-300">
                            <School className="w-8 h-8" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">School Admin</h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Manage school operations.
                        </p>

                        <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-emerald-400 opacity-80 group-hover:opacity-100 group-hover:gap-3 transition-all duration-300">
                            Access Portal <ArrowRight className="w-3 h-3" />
                        </div>
                    </button>

                    {/* Staff Portal Card */}
                    <button 
                        onClick={() => navigate('/staff/dashboard')}
                        className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(168,85,247,0.3)] animate-fade-in-up"
                        style={{ animationDelay: '300ms' }}
                    >
                        <div className="p-4 rounded-full bg-purple-500/10 text-purple-400 mb-4 group-hover:bg-purple-500/20 group-hover:scale-110 transition-all duration-300">
                            <School className="w-8 h-8" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">Staff Portal</h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Classes, grading & schedule.
                        </p>

                        <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-purple-400 opacity-80 group-hover:opacity-100 group-hover:gap-3 transition-all duration-300">
                            Access Portal <ArrowRight className="w-3 h-3" />
                        </div>
                    </button>

                    {/* Student Portal Card */}
                    <button 
                        onClick={() => navigate('/student/dashboard')}
                        className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-orange-500/50 transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)] animate-fade-in-up"
                        style={{ animationDelay: '400ms' }}
                    >
                        <div className="p-4 rounded-full bg-orange-500/10 text-orange-400 mb-4 group-hover:bg-orange-500/20 group-hover:scale-110 transition-all duration-300">
                            <School className="w-8 h-8" />
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">Student Portal</h3>
                        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                            Courses, results & fees.
                        </p>

                        <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-orange-400 opacity-80 group-hover:opacity-100 group-hover:gap-3 transition-all duration-300">
                            Access Portal <ArrowRight className="w-3 h-3" />
                        </div>
                    </button>

                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-slate-500 text-sm animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <p>&copy; {new Date().getFullYear()} Keynoverse Educational ERP. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default AuthSelection;
