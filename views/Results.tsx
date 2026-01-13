
import React, { useState } from 'react';
import { VerificationResult, RiskLevel, AnalysisMode, LawyerProfile } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  RefreshCw,
  Info,
  Brain,
  Hash,
  Globe,
  Gavel,
  BookOpen,
  Scale,
  Library,
  Bookmark,
  MessageCircle,
  Video as VideoIcon,
  BadgeCheck,
  PhoneCall,
  ArrowRight,
  Loader2,
  CheckCircle2
} from 'lucide-react';

interface ResultsProps {
  result: VerificationResult;
  onNew: () => void;
}

const MOCK_LAWYERS: LawyerProfile[] = [
  {
    id: 'l1',
    name: "Adv. Ishaan Malhotra",
    specialization: "Cyber Fraud & Financial Crimes",
    experience: "12+ Years",
    location: "New Delhi",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200",
    verified: true,
    activeNow: true,
    matchingStatutes: ["IT Act 66D", "BNS 318", "BNS 319"]
  },
  {
    id: 'l2',
    name: "Adv. Ananya Reddy",
    specialization: "Privacy Law & Digital Rights",
    experience: "8+ Years",
    location: "Hyderabad",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
    verified: true,
    activeNow: false,
    matchingStatutes: ["IT Act 66E", "IT Act 67A", "NCDI"]
  },
  {
    id: 'l3',
    name: "Adv. Vikram Singh",
    specialization: "Identity Theft & Deepfake Litigation",
    experience: "15+ Years",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200",
    verified: true,
    activeNow: true,
    matchingStatutes: ["IT Act 66C", "Identity Theft", "Forensic Admissibility"]
  },
  {
    id: 'l4',
    name: "Adv. Sarah D'Souza",
    specialization: "Digital Defamation & IP Rights",
    experience: "10+ Years",
    location: "Bangalore",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
    verified: true,
    activeNow: true,
    matchingStatutes: ["BNS 356", "Copyright Act", "Defamation"]
  }
];

const MOCK_ADVISOR = {
  name: "VeriTrust Legal Bot / Advisor",
  role: "Immediate Guidance Specialist",
  image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
  active: true
};

const Results: React.FC<ResultsProps> = ({ result, onNew }) => {
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected'>('idle');
  const [liaisonType, setLiaisonType] = useState<'lawyer' | 'advisor' | null>(null);
  
  // Strict check for professional legal modes
  const isProfessionalMode = result.mode === AnalysisMode.LEGAL || result.mode === AnalysisMode.TRUTHLENS;

  const getRecommendedLawyer = (): LawyerProfile => {
    if (result.fraudRisk?.isScam) return MOCK_LAWYERS[0];
    const categories = result.legalAssessment?.applicableLaws?.map(l => l.category) || [];
    if (categories.includes('Privacy')) return MOCK_LAWYERS[1];
    if (categories.includes('Identity') || result.originLabel === 'AI-Generated') return MOCK_LAWYERS[2];
    if (categories.includes('Defamation')) return MOCK_LAWYERS[3];
    return MOCK_LAWYERS[2];
  };

  const recommendedLawyer = getRecommendedLawyer();

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH: return 'text-red-600 bg-red-50 border-red-100';
      case RiskLevel.MEDIUM: return 'text-orange-600 bg-orange-50 border-orange-100';
      case RiskLevel.LOW: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  const handleConnect = (type: 'lawyer' | 'advisor') => {
    setLiaisonType(type);
    setConnectionStatus('connecting');
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
            <Search size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Report</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-black uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded tracking-widest">Hash: {result.fingerprint}</span>
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest ${getRiskColor(result.riskLevel)}`}>{result.mode} MODE</span>
            </div>
          </div>
        </div>
        <button onClick={onNew} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-all">
          <RefreshCw size={18} />
          <span>New Intel Request</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Core Risk Gauge */}
        <div className={`lg:col-span-4 rounded-[40px] border-2 p-10 flex flex-col items-center text-center space-y-8 ${getRiskColor(result.riskLevel)}`}>
           <div className="relative">
              <div className="w-48 h-48 rounded-full border-8 border-white/30 flex items-center justify-center">
                <span className="text-6xl font-black">{result.fakeProbability}%</span>
              </div>
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white ${getRiskColor(result.riskLevel).split(' ')[0]}`}>
                Manipulation probability
              </div>
           </div>
           
           <div className="space-y-4 w-full">
             <div className="p-4 bg-white/50 rounded-3xl">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Origin Signature</p>
               <p className="text-xl font-black">{result.originLabel}</p>
             </div>
             
             <div className="p-4 bg-white/50 rounded-3xl">
               <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Publish Safety Score</p>
               <div className="w-full bg-white/30 h-2 rounded-full mt-2">
                 <div className="h-full bg-current rounded-full" style={{width: `${100 - result.publishRiskScore}%`}} />
               </div>
               <p className="text-xs font-bold mt-1">{100 - result.publishRiskScore}% Verified Safety</p>
             </div>
           </div>
        </div>

        {/* Intelligence Panels */}
        <div className="lg:col-span-8 space-y-8">
          {/* Cyber Law Trace - ONLY VISIBLE FOR LAWYER MODES */}
          {isProfessionalMode && result.legalAssessment?.applicableLaws && (
            <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                 <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black flex items-center gap-3">
                     <Library className="text-blue-400" /> Automated Cyber-Law Trace
                   </h3>
                   <span className="text-[10px] font-black uppercase bg-blue-600 px-3 py-1 rounded-full">Professional Insight</span>
                 </div>
                 
                 <div className="grid gap-4">
                    {result.legalAssessment.applicableLaws.slice(0, 3).map((law, i) => (
                      <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                         <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Bookmark size={14} className="text-blue-400" />
                                <p className="text-sm font-black text-blue-100">{law.title}</p>
                              </div>
                              <p className="text-xs font-bold text-blue-400/80">Section: {law.section}</p>
                              <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-2">{law.description}</p>
                            </div>
                            <span className={`shrink-0 text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${
                              law.relevanceLevel === 'Direct' ? 'border-blue-400 text-blue-400' : 'border-slate-500 text-slate-500'
                            }`}>
                              {law.relevanceLevel}
                            </span>
                         </div>
                      </div>
                    ))}
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            </div>
          )}

          {/* Reasoning & Psychological Signal */}
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <Brain className="text-blue-500" /> Forensic Reasoning
              </h3>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                <Info size={14} /> AI Conf: {Math.round(result.confidenceScore * 100)}%
              </div>
            </div>
            
            <p className="text-lg text-slate-600 leading-relaxed font-medium">"{result.reasoning}"</p>
          </div>
        </div>
      </div>

      {/* Intelligent Legal Liaison Section - RECOMMENDATION FOR USER MODE */}
      <div className="bg-indigo-50 border-2 border-indigo-100 p-10 rounded-[50px] shadow-2xl relative overflow-hidden group">
        {connectionStatus === 'connected' ? (
          <div className="relative z-10 flex flex-col items-center justify-center py-10 space-y-6 text-center animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-500/30">
               <CheckCircle2 size={48} />
             </div>
             <div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">Liaison Established</h3>
               <p className="text-slate-600 font-medium max-w-md mt-2">
                 Case <b>#{result.id}</b> has been securely transmitted. {liaisonType === 'lawyer' ? recommendedLawyer.name : MOCK_ADVISOR.name} will be in touch within 15 minutes.
               </p>
             </div>
             <button 
               onClick={() => setConnectionStatus('idle')}
               className="px-8 py-3 bg-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-300 transition-all"
             >
               Dismiss Notification
             </button>
          </div>
        ) : (
          <>
            <div className="absolute top-0 right-0 p-8 text-indigo-100 group-hover:text-indigo-200 transition-colors pointer-events-none">
              <Gavel size={120} />
            </div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1 space-y-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-600 p-2 rounded-lg text-white">
                      <ShieldCheck size={20} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Intelligent Legal Liaison</h3>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed max-w-lg">
                    {result.riskLevel === RiskLevel.HIGH 
                      ? "Critical manipulation detected. We strongly recommend connecting with a specialized legal advisor to protect your digital identity."
                      : "Potential risks identified. Connect with our legal partners to understand your rights regarding this content."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Lawyer Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-indigo-200 shadow-sm space-y-5 group/card transition-all hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={recommendedLawyer.image} 
                          alt={recommendedLawyer.name} 
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50"
                        />
                        {recommendedLawyer.activeNow && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-slate-900 truncate">{recommendedLawyer.name}</h4>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase truncate">{recommendedLawyer.specialization}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-indigo-50 flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase">{recommendedLawyer.location}</span>
                      <button 
                        onClick={() => handleConnect('lawyer')}
                        disabled={connectionStatus === 'connecting'}
                        className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                      >
                        {connectionStatus === 'connecting' && liaisonType === 'lawyer' ? <Loader2 size={16} className="animate-spin" /> : <PhoneCall size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Advisor Card */}
                  <div className="bg-white p-6 rounded-[32px] border border-indigo-200 shadow-sm space-y-5 transition-all hover:shadow-lg">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={MOCK_ADVISOR.image} 
                          alt={MOCK_ADVISOR.name} 
                          className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-black text-slate-900 truncate">{MOCK_ADVISOR.name}</h4>
                        <p className="text-[10px] font-bold text-indigo-600 uppercase truncate">{MOCK_ADVISOR.role}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-indigo-50 flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase">VeriTrust HQ</span>
                      <button 
                        onClick={() => handleConnect('advisor')}
                        disabled={connectionStatus === 'connecting'}
                        className="p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                      >
                         {connectionStatus === 'connecting' && liaisonType === 'advisor' ? <Loader2 size={16} className="animate-spin" /> : <MessageCircle size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-80 bg-indigo-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                 <div className="relative z-10 space-y-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-indigo-300">Case Matching Intelligence</p>
                      <h4 className="text-xl font-black">Ready for Connection</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                        <span className="text-xs font-bold text-indigo-100">Advisor Online (Wait: 2m)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <span className="text-xs font-bold text-indigo-100">Expert Partner Verified</span>
                      </div>
                    </div>
                 </div>
                 
                 <div className="relative z-10 pt-8 border-t border-indigo-800">
                    <button 
                      onClick={() => handleConnect('lawyer')}
                      className="w-full py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-50 transition-all active:scale-95"
                    >
                      Secure Consultation <ArrowRight size={16} />
                    </button>
                    <p className="text-[9px] text-indigo-400 text-center mt-4 italic font-bold">
                      * Data strictly protected by AES-256
                    </p>
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fraud & Integrity Section */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
            <Scale className="text-blue-600" /> Integrity Verification Cluster
          </h3>
          <div className="flex items-center gap-3">
            <button 
               onClick={() => window.print()} 
               className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-100"
            >
              <Gavel size={16}/> Certificate for Legal Use
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
             <div className="flex items-center gap-2 mb-4 text-slate-400">
               <Hash size={16}/> <span className="text-[10px] font-black uppercase tracking-widest">Forensic Hash</span>
             </div>
             <p className="text-xs font-mono font-bold break-all text-slate-600">{result.verificationHash}</p>
           </div>
           
           <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
             <div className="flex items-center gap-2 mb-4 text-slate-400">
               <ShieldCheck size={16}/> <span className="text-[10px] font-black uppercase tracking-widest">Digital Fingerprint</span>
             </div>
             <p className="text-sm font-bold text-slate-800">{result.fingerprint}</p>
           </div>

           <div className={`p-6 rounded-3xl border ${result.fraudRisk?.isScam ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className={`flex items-center gap-2 mb-4 ${result.fraudRisk?.isScam ? 'text-red-500' : 'text-emerald-500'}`}>
               <AlertTriangle size={16}/> <span className="text-[10px] font-black uppercase tracking-widest">Fraud Risk Intel</span>
             </div>
             <p className="text-sm font-bold text-slate-800">{result.fraudRisk?.isScam ? 'Impersonation Pattern Detected' : 'No Fraud Patterns Identified'}</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
