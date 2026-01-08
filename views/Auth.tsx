
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { ShieldCheck, Mail, Lock, Loader2, ArrowRight, UserCheck, AlertCircle, Scale, User } from 'lucide-react';

interface AuthProps {
  onSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'lawyer'>('user');
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
        const { error: signUpError, data } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { role } // Store role in metadata
          }
        });
        if (signUpError) throw signUpError;
        
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email: email,
            role: role
          });
        }
        
        alert("Account processing initiated. If you just signed up, check your email.");
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

        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          {error && (
            <div className="p-5 bg-red-50 text-red-600 text-xs rounded-3xl border border-red-100 font-bold leading-relaxed flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-3">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Identity Type</label>
               <div className="grid grid-cols-2 gap-2">
                 {[
                   { id: 'user', icon: <User size={14}/>, label: 'Standard User' },
                   { id: 'lawyer', icon: <Scale size={14}/>, label: 'Legal Counsel' }
                 ].map((r) => (
                   <button
                     key={r.id}
                     type="button"
                     onClick={() => setRole(r.id as any)}
                     className={`py-3 rounded-2xl flex flex-col items-center gap-1 transition-all border ${role === r.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                   >
                     {r.icon}
                     <span className="text-[8px] font-black uppercase tracking-widest">{r.label}</span>
                   </button>
                 ))}
               </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold"
                  placeholder="agent@veritrust.ai"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-sm font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-[20px] font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-2xl active:scale-[0.97] disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                <span>{isLogin ? 'Access Hub' : 'Create Account'}</span>
                <ArrowRight size={22} />
              </>
            )}
          </button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 p-6 bg-white border border-slate-200 rounded-[40px] text-center">
         <div className="flex items-center justify-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-4">
           <UserCheck size={14} />
           Demo Identifiers
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => { setEmail('counsel.smith@legal.ai'); setPassword('legal1234'); setIsLogin(true); }}
              className="p-3 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer hover:bg-blue-50 transition-all text-left"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase">Lawyer</p>
              <p className="text-[11px] font-black text-blue-600 truncate">counsel.smith@legal.ai</p>
            </div>
            <div 
              onClick={() => { setEmail('citizen.test@veritrust.ai'); setPassword('user1234'); setIsLogin(true); }}
              className="p-3 bg-slate-50 border border-slate-100 rounded-3xl cursor-pointer hover:bg-emerald-50 transition-all text-left"
            >
              <p className="text-[10px] font-black text-slate-400 uppercase">General User</p>
              <p className="text-[11px] font-black text-emerald-600 truncate">citizen.test@veritrust.ai</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Auth;
