
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, UserCheck, AlertCircle, Database } from 'lucide-react';

interface AuthProps {
  onSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) throw signUpError;
        alert("Registration initiated! Please check your email for verification.");
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="bg-white rounded-[50px] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="bg-slate-950 p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[100px] -mr-32 -mt-32 animate-pulse"></div>
          <div className="bg-blue-600 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/40 relative z-10 rotate-3 transition-transform">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-4xl font-black relative z-10 tracking-tight">{isLogin ? 'Sign In' : 'Join VeriTrust'}</h2>
          <p className="text-slate-400 text-sm mt-3 relative z-10 font-medium">Secure Forensic Analysis Uplink</p>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-8">
          {error && (
            <div className="p-5 bg-red-50 text-red-600 text-xs rounded-3xl border border-red-100 font-bold leading-relaxed flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 font-bold placeholder:text-slate-300"
                  placeholder="agent@veritrust.ai"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-slate-800 font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg flex items-center justify-center space-x-3 hover:bg-blue-700 transition-all shadow-2xl shadow-blue-500/30 active:scale-[0.97] disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <span>{isLogin ? 'Access Hub' : 'Create Account'}</span>
                <ArrowRight size={22} />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-10 p-8 bg-white border border-slate-200 rounded-[40px] text-center">
         <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-4">
           <UserCheck size={14} />
           Demo Credentials
         </div>
         <div 
            onClick={() => { setEmail('standard.user@veritrust.ai'); setPassword('user1234'); }}
            className="p-4 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer hover:bg-blue-50 hover:border-blue-100 transition-all group"
          >
            <p className="text-xs font-bold text-slate-600 mb-1">Standard User Access</p>
            <p className="text-sm font-black text-blue-600">standard.user@veritrust.ai</p>
            <p className="text-[10px] text-slate-400 font-medium">Password: <span className="font-bold">user1234</span></p>
          </div>
      </div>
    </div>
  );
};

export default Auth;
