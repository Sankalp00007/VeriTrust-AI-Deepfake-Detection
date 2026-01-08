
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  FileSearch, 
  BookOpen, 
  LogOut,
  Info,
  Scale
} from 'lucide-react';
import { supabase } from './services/supabase';
import Dashboard from './views/Dashboard';
import Verify from './views/Verify';
import Results from './views/Results';
import Education from './views/Education';
import ResponsibleAI from './views/ResponsibleAI';
import TruthLens from './views/TruthLens';
import Home from './views/Home';
import Auth from './views/Auth';
import { VerificationResult, UserStats, ContentType, RiskLevel, AnalysisMode, UserProfile } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'home' | 'dashboard' | 'verify' | 'results' | 'education' | 'responsible' | 'auth' | 'truthlens'>('home');
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
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
      const { data: profile, error } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
      if (error && error.code !== 'PGRST116') {
        console.error("Profile Fetch Error:", error.message);
      }
      setUserProfile(profile || { role: currentUser.user_metadata?.role || 'user' });
      
      fetchUserHistory(currentUser.id);
      if (activeView === 'auth') {
        setActiveView('dashboard');
      }
    } else {
      setUserProfile(null);
      setUserStats({ totalVerifications: 0, highRiskCount: 0, history: [] });
      if (['dashboard', 'verify', 'results', 'education', 'responsible', 'truthlens'].includes(activeView)) {
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
          mode: item.mode as AnalysisMode || AnalysisMode.STANDARD,
          content: item.content,
          fakeProbability: item.fake_probability,
          risk_level: item.risk_level as RiskLevel,
          confidence_score: item.confidence_score,
          reasoning: item.reasoning,
          is_misinformation: item.is_misinformation,
          origin_label: item.origin_label || 'Unknown',
          fingerprint: item.fingerprint || 'Pending',
          publish_risk: item.publish_risk || 0,
          literacy_tip: item.literacy_tip || '',
          verificationHash: item.hash || ''
        }));

        setUserStats({
          totalVerifications: formattedHistory.length,
          highRiskCount: formattedHistory.filter(h => h.riskLevel === RiskLevel.HIGH).length,
          history: formattedHistory
        });
      }
    } catch (err: any) {
      console.error("Error fetching history:", err.message || err);
    }
  };

  const handleVerificationComplete = async (result: VerificationResult) => {
    setLastResult(result);
    
    if (user) {
      try {
        const { error } = await supabase.from('verifications').insert({
          user_id: user.id,
          type: result.type,
          mode: result.mode,
          content: result.content,
          fake_probability: result.fakeProbability,
          risk_level: result.riskLevel,
          confidence_score: result.confidenceScore,
          reasoning: result.reasoning,
          is_misinformation: result.isMisinformation,
          origin_label: result.originLabel,
          fingerprint: result.fingerprint,
          publish_risk: result.publishRiskScore,
          literacy_tip: result.literacyTip,
          hash: result.verificationHash
        });
        
        if (error) throw error;
        await fetchUserHistory(user.id);
      } catch (err: any) {
        console.error("Critical error saving verification:", err.message || err);
      }
    }
    
    setActiveView('results');
  };

  const isLawyer = userProfile?.role === 'lawyer';

  const NavItem: React.FC<{ view: any; icon: React.ReactNode; label: string }> = ({ view, icon, label }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center space-x-3 w-full p-3 rounded-xl transition-all duration-200 ${
        activeView === view ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveView('home')}>
          <div className="bg-blue-600 p-2 rounded-xl">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">VeriTrust AI</h1>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              {isLawyer && (
                <button 
                  onClick={() => setActiveView('truthlens')}
                  className={`flex items-center gap-2 text-sm font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-all ${activeView === 'truthlens' ? 'text-white bg-slate-900 shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <Scale size={16} /> TruthLens
                </button>
              )}
              <button onClick={() => setActiveView('education')} className={`text-sm font-semibold px-4 py-2 rounded-lg ${activeView === 'education' ? 'text-blue-600 bg-blue-50' : 'text-slate-600'}`}>Awareness</button>
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
            </>
          )}

          {!user ? (
            <button onClick={() => setActiveView('auth')} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:bg-blue-700 transition-all">Login / Sign Up</button>
          ) : (
            <div className="flex items-center space-x-3">
              <button onClick={() => setActiveView('dashboard')} className="hidden md:flex items-center space-x-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm">
                <LayoutDashboard size={18} /> <span>Dashboard</span>
              </button>
              <button onClick={() => supabase.auth.signOut()} className="flex items-center space-x-2 text-red-600 px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-50">
                <LogOut size={18} /> <span className="hidden sm:inline">Logout</span>
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1">
        {user && (
          <aside className="hidden lg:flex w-64 bg-white border-r border-slate-200 flex-col p-4 space-y-2 sticky top-20 h-[calc(100vh-5rem)]">
            <NavItem view="dashboard" icon={<LayoutDashboard size={20} />} label="My Dashboard" />
            <NavItem view="verify" icon={<FileSearch size={20} />} label="New Analysis" />
            {isLawyer && <NavItem view="truthlens" icon={<Scale size={20} />} label="TruthLens Legal" />}
            <NavItem view="education" icon={<BookOpen size={20} />} label="Awareness" />
            <NavItem view="responsible" icon={<Info size={20} />} label="Ethics" />
          </aside>
        )}

        <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full">
          {activeView === 'home' && <Home onStart={() => user ? setActiveView('verify') : setActiveView('auth')} />}
          {activeView === 'auth' && <Auth onSuccess={() => setActiveView('dashboard')} />}
          {activeView === 'dashboard' && <Dashboard stats={userStats} onVerify={() => setActiveView('verify')} />}
          {activeView === 'verify' && <Verify userProfile={userProfile} onComplete={handleVerificationComplete} isLoggedIn={!!user} onAuthNeeded={() => setActiveView('auth')} />}
          {activeView === 'results' && lastResult && <Results result={lastResult} onNew={() => setActiveView('verify')} />}
          {activeView === 'truthlens' && userProfile && (
            <TruthLens 
              userProfile={userProfile} 
              isLoggedIn={!!user} 
              onComplete={handleVerificationComplete}
              lastResult={lastResult}
            />
          )}
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
