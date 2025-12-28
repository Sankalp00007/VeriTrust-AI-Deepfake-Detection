
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileSearch, 
  BookOpen, 
  LogOut,
  Info,
  User,
  LogIn
} from 'lucide-react';
import { supabase } from './services/supabase';
import Dashboard from './views/Dashboard';
import Verify from './views/Verify';
import Results from './views/Results';
import Education from './views/Education';
import ResponsibleAI from './views/ResponsibleAI';
import Home from './views/Home';
import Auth from './views/Auth';
import { VerificationResult, UserStats, ContentType, RiskLevel } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'verify' | 'results' | 'education' | 'responsible' | 'auth'>('home');
  const [user, setUser] = useState<any>(null);
  const [lastResult, setLastResult] = useState<VerificationResult | null>(null);
  const [userStats, setUserStats] = useState<UserStats>({
    totalVerifications: 0,
    highRiskCount: 0,
    history: []
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleUserSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      handleUserSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleUserSession = async (session: any) => {
    const currentUser = session?.user ?? null;
    setUser(currentUser);
    
    if (currentUser) {
      fetchUserHistory(currentUser.id);
      if (activeView === 'auth') {
        setActiveView('dashboard');
      }
    } else {
      setUserStats({ totalVerifications: 0, highRiskCount: 0, history: [] });
      // Redirect protected views to home if logged out
      if (['dashboard', 'verify', 'results', 'education', 'responsible'].includes(activeView)) {
        setActiveView('home');
      }
    }
  };

  const fetchUserHistory = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedHistory: VerificationResult[] = data.map(item => ({
          id: item.id,
          timestamp: new Date(item.created_at).getTime(),
          type: item.type as ContentType,
          content: item.content,
          fakeProbability: item.fake_probability,
          riskLevel: item.risk_level as RiskLevel,
          confidenceScore: item.confidence_score,
          reasoning: item.reasoning,
          isMisinformation: item.is_misinformation
        }));

        setUserStats({
          totalVerifications: formattedHistory.length,
          highRiskCount: formattedHistory.filter(h => h.riskLevel === RiskLevel.HIGH).length,
          history: formattedHistory
        });
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleVerificationComplete = async (result: VerificationResult) => {
    setLastResult(result);
    
    if (user) {
      try {
        const { error } = await supabase.from('verifications').insert({
          user_id: user.id,
          type: result.type,
          content: result.content,
          fake_probability: result.fakeProbability,
          risk_level: result.riskLevel,
          confidence_score: result.confidenceScore,
          reasoning: result.reasoning,
          is_misinformation: result.isMisinformation
        });
        
        if (error) throw error;
        await fetchUserHistory(user.id);
      } catch (err) {
        console.error("Critical error saving verification:", err);
        setUserStats(prev => ({
          ...prev,
          totalVerifications: prev.totalVerifications + 1,
          history: [result, ...prev.history]
        }));
      }
    }
    
    setActiveView('results');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setActiveView('home');
  };

  const NavItem: React.FC<{ view: any; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 ${
        activeView === view ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Persistent Global Header */}
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => setActiveView('home')}
        >
          <div className="bg-blue-600 p-2 rounded-xl">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">VeriTrust AI</h1>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <button 
                onClick={() => setActiveView('education')}
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${activeView === 'education' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'}`}
              >
                Awareness
              </button>
              <button 
                onClick={() => setActiveView('responsible')}
                className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors ${activeView === 'responsible' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:text-blue-600'}`}
              >
                Ethics
              </button>
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
            </>
          )}

          {!user ? (
            <button 
              onClick={() => setActiveView('auth')}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <LogIn size={18} />
              Login / Sign Up
            </button>
          ) : (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setActiveView('dashboard')}
                className="hidden md:flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-50 transition-all"
                title="Logout"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border-2 border-white shadow-sm">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar only for authenticated users on large screens */}
        {user && (
          <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col p-4 space-y-2 sticky top-20 h-[calc(100vh-5rem)]">
            <NavItem view="dashboard" icon={<LayoutDashboard size={20} />} label="My Dashboard" />
            <NavItem view="verify" icon={<FileSearch size={20} />} label="New Analysis" />
            <NavItem view="education" icon={<BookOpen size={20} />} label="Awareness" />
            <NavItem view="responsible" icon={<Info size={20} />} label="Ethics" />
            <div className="pt-4 mt-auto">
              <button 
                onClick={handleSignOut}
                className="flex items-center space-x-3 w-full p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-medium"
              >
                <LogOut size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        )}

        <main className={`flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full ${!user ? 'lg:max-w-5xl' : ''}`}>
          {activeView === 'home' && <Home onStart={() => user ? setActiveView('verify') : setActiveView('auth')} />}
          {activeView === 'auth' && <Auth onSuccess={() => setActiveView('dashboard')} />}
          {activeView === 'dashboard' && <Dashboard stats={userStats} onVerify={() => setActiveView('verify')} />}
          {activeView === 'verify' && (
            <Verify 
              onComplete={handleVerificationComplete} 
              isLoggedIn={!!user} 
              onAuthNeeded={() => setActiveView('auth')} 
            />
          )}
          {activeView === 'results' && lastResult && <Results result={lastResult} onNew={() => setActiveView('verify')} />}
          {activeView === 'education' && user && <Education />}
          {activeView === 'responsible' && user && <ResponsibleAI />}
        </main>
      </div>

      <footer className="p-8 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
        <p>© 2025 VeriTrust AI • Your Shield Against Digital Misinformation</p>
      </footer>
    </div>
  );
};

export default App;
