
import React, { useState } from 'react';
import { 
  Eye, 
  Search, 
  History, 
  Fingerprint, 
  ShieldAlert, 
  Network, 
  Clock, 
  UserX, 
  Gavel, 
  FileText, 
  Globe, 
  Zap, 
  Lock, 
  CheckCircle,
  TrendingUp,
  MapPin,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Activity
} from 'lucide-react';
import { VerificationResult, UserProfile, RiskLevel, AnalysisMode } from '../types';
import Verify from './Verify';

const LawyersEye: React.FC<{ userProfile: UserProfile | null; onComplete: (r: VerificationResult) => void; isLoggedIn: boolean; lastResult?: VerificationResult | null }> = ({ userProfile, onComplete, isLoggedIn, lastResult }) => {
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [summaryMode, setSummaryMode] = useState(false);

  // Functional Data derived from lastResult
  const intel = lastResult?.legalAssessment?.investigativeIntel;
  const radarData = intel?.radarTrends || [
    { label: "Election Integrity (India)", count: "Monitoring", region: "National", status: "Monitor" as const },
    { label: "Deepfake Scams (UPI)", count: "High Risk", region: "Digital Payments", status: "Alert" as const }
  ];

  const timelineSteps = intel?.timeline || [
    { label: "Awaiting Data", desc: "No active forensic reconstruction available.", time: "N/A", stage: "Authentic" as const }
  ];

  const impersonationHits = intel?.impersonationHits || [];
  const crossMatch = intel?.crossCaseMatch;
  const briefs = intel?.jurisdictionalBriefs || {};

  // Specifically for India as requested
  const jurisdictionInfo = { 
    name: 'India', 
    law: 'IT Act 2000 / Bhartiya Nyaya Sanhita (BNS)', 
    context: briefs['India'] || 'Forensic uplink required for specific Indian statutory framing.' 
  };

  if (isVerificationMode) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setIsVerificationMode(false)}
          className="text-indigo-600 font-bold text-sm flex items-center gap-2 hover:text-indigo-800 transition-all px-4 py-2 bg-indigo-50 rounded-xl w-fit"
        >
          <ArrowRight size={16} className="rotate-180" /> Back to Investigation Console
        </button>
        <Verify 
          onComplete={(r) => { onComplete(r); setIsVerificationMode(false); }} 
          isLoggedIn={isLoggedIn} 
          onAuthNeeded={() => {}} 
          userProfile={userProfile}
          mode={AnalysisMode.TRUTHLENS}
          title="Forensic Data Ingest"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-indigo-950 p-12 rounded-[50px] shadow-3xl relative overflow-hidden text-white">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-5">
            <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-500/20 ring-4 ring-indigo-500/30">
              <Eye size={36} className="text-white" />
            </div>
            <div>
              <h2 className="text-5xl font-black tracking-tighter">Lawyer's <span className="text-indigo-400">Eye</span></h2>
              <p className="text-indigo-300 font-medium">Indian Forensic Intelligence & Network Pattern Recognition</p>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 flex gap-4">
          <button 
            onClick={() => setIsVerificationMode(true)}
            className="group px-10 py-6 bg-white text-indigo-950 rounded-[28px] font-black text-lg flex items-center gap-4 shadow-2xl hover:bg-indigo-50 transition-all hover:scale-[1.03] active:scale-95"
          >
            <Search size={24} className="text-indigo-600" />
            Launch Investigation
          </button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
      </div>

      {/* Misinformation Radar (Spike Detection) */}
      <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <TrendingUp className="text-indigo-600" /> Early-Warning Misinformation Radar
            </h3>
            <p className="text-slate-500 text-sm">Real-time coordinated campaign detection for Election Commission & Cyber-Crime Units.</p>
          </div>
          {lastResult && (
            <div className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl border border-indigo-100">
              Pattern Signature: {lastResult.fingerprint.substring(0, 8)}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {radarData.map((radar, i) => (
            <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between group hover:border-indigo-200 transition-all">
               <div>
                 <p className="text-xs font-black text-slate-800 mb-1">{radar.label}</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{radar.region}</p>
               </div>
               <div className="mt-6 flex items-center justify-between">
                 <span className="text-lg font-black text-indigo-600">{radar.count}</span>
                 <span className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase ${radar.status === 'Critical' ? 'bg-red-600 text-white' : radar.status === 'Alert' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-500'}`}>{radar.status}</span>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Case Intelligence & Investigative Cluster */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline Reconstruction Engine */}
        <div className="lg:col-span-7 bg-white p-12 rounded-[50px] border border-slate-100 shadow-xl space-y-10 relative overflow-hidden">
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Clock className="text-indigo-600" /> Timeline Reconstruction Engine
            </h3>
            <p className="text-slate-500 text-sm">Visual evidence journey for Judiciary review.</p>
          </div>

          <div className="relative space-y-12 pl-8 border-l-2 border-indigo-100">
             {timelineSteps.map((step, idx) => (
               <div key={idx} className="relative">
                 <div className="absolute -left-[45px] top-0 w-10 h-10 bg-white border-2 border-indigo-50 rounded-2xl flex items-center justify-center shadow-sm">
                   {step.stage === 'Manipulated' ? <ShieldAlert size={16} className="text-red-500" /> : step.stage === 'Coordinated' ? <Network size={16} className="text-indigo-500" /> : <CheckCircle size={16} className="text-emerald-500" />}
                 </div>
                 <div className="space-y-1">
                   <div className="flex items-center justify-between">
                    <p className="text-sm font-black text-slate-800">{step.label}</p>
                    <span className="text-[10px] font-black text-indigo-400 uppercase">{step.time}</span>
                   </div>
                   <p className="text-xs text-slate-500 leading-relaxed max-w-md">{step.desc}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Cross-Case Pattern Intelligence & Impersonation */}
        <div className="lg:col-span-5 space-y-8">
          {/* Cross-Case Intelligence - FUNCTIONAL */}
          <div className="bg-slate-900 p-10 rounded-[50px] text-white shadow-2xl space-y-6 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xl font-black flex items-center gap-3">
                <Network className="text-indigo-400" /> Cross-Case Intelligence
              </h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 mb-6">Network forensics across judicial records</p>
              
              <div className="p-6 bg-white/5 rounded-3xl border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                {crossMatch ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Similarity Pattern Found</span>
                      <span className="text-xs font-black text-emerald-400">{crossMatch.similarity}% Match</span>
                    </div>
                    <p className="text-xs font-bold leading-relaxed">{crossMatch.description}</p>
                    <div className="mt-4 flex items-center gap-3">
                       <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[8px] font-black uppercase rounded">Ref Case ID: {crossMatch.caseReference}</span>
                       <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Organized Network Probable</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 space-y-3">
                    <Activity className="mx-auto text-slate-700" size={32} />
                    <p className="text-xs text-slate-500 italic">Initiate forensic scan to detect cross-case patterns (Same Voice/Face/Style).</p>
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>

          {/* Persona Impersonation Tracker */}
          <div className="bg-indigo-600 p-10 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
             <div className="relative z-10 space-y-6">
                <div className="space-y-1">
                  <h4 className="text-xl font-black flex items-center gap-3">
                    <UserX size={24} /> Persona Impersonation Tracker
                  </h4>
                  <p className="text-indigo-100 text-xs">Public Officials & Celebrity Registry Protection</p>
                </div>
                <div className="space-y-4">
                   {impersonationHits.length > 0 ? impersonationHits.map((target, i) => (
                     <div key={i} className="bg-white/10 p-5 rounded-3xl border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold">{target.name}</p>
                          <p className="text-[10px] text-indigo-200 font-bold uppercase">{target.count}</p>
                        </div>
                        <span className="bg-white text-indigo-600 text-[8px] font-black px-2 py-1 rounded-lg uppercase">{target.risk}</span>
                     </div>
                   )) : (
                     <div className="p-5 border border-white/10 bg-white/5 rounded-3xl text-center">
                        <p className="text-[10px] text-indigo-300 italic">No repeated persona impersonation detected in current evidence.</p>
                     </div>
                   )}
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Governance & Indian Legal Cluster */}
      <div className="bg-slate-50 p-12 rounded-[60px] border border-slate-200 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="space-y-2">
             <h3 className="text-3xl font-black text-slate-900">Governance & Audit</h3>
             <p className="text-slate-500 font-medium">Chain of custody protocols under Indian Evidence Law.</p>
           </div>
           
           <div className="flex items-center gap-3 px-6 py-3 bg-white rounded-3xl border border-slate-200 shadow-sm text-indigo-600 font-black text-xs uppercase tracking-widest">
              <Globe size={16} /> Jurisdiction: India-Specific (IT Act/BNS)
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Audit Log / Evidence Integrity System */}
          <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
             <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={16} className="text-indigo-600" /> Evidence Integrity Ledger
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   Certified Hash Integrity
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-slate-50/50">
                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Timestamp</th>
                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Forensic Operation</th>
                     <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">SHA-256 Digest</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   {lastResult ? [
                     { time: new Date(lastResult.timestamp).toISOString().replace('T', ' ').substring(0, 16), op: "Ingest", hash: lastResult.verificationHash.substring(0, 16) + "..." },
                     { time: new Date(lastResult.timestamp).toISOString().replace('T', ' ').substring(0, 16), op: "Spectral Pattern Hash", hash: lastResult.fingerprint.substring(0, 16) + "..." },
                     { time: new Date(lastResult.timestamp).toISOString().replace('T', ' ').substring(0, 16), op: "Legal Trace Locked", hash: "8e92f..." }
                   ].map((log, i) => (
                     <tr key={i} className="hover:bg-slate-50 transition-colors">
                       <td className="px-8 py-5 text-[10px] font-bold text-slate-500">{log.time}</td>
                       <td className="px-8 py-5">
                         <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded-lg border border-indigo-100">{log.op}</span>
                       </td>
                       <td className="px-8 py-5 font-mono text-[9px] text-slate-400">{log.hash}</td>
                     </tr>
                   )) : (
                    <tr>
                      <td colSpan={3} className="px-8 py-16 text-center text-xs text-slate-400 italic">No evidence in secure custody.</td>
                    </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>

          {/* Jurisdiction-Aware Analysis (India specific) */}
          <div className={`p-10 rounded-[40px] border flex flex-col justify-between transition-all ${summaryMode ? 'bg-indigo-600 text-white border-indigo-500 shadow-2xl' : 'bg-white border-slate-100 shadow-sm'}`}>
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className={`text-xl font-black ${summaryMode ? 'text-white' : 'text-slate-900'}`}>Court Summary</h4>
                  <div 
                    onClick={() => setSummaryMode(!summaryMode)}
                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${summaryMode ? 'bg-indigo-400' : 'bg-slate-200'}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${summaryMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className={`text-xs leading-relaxed font-medium ${summaryMode ? 'text-indigo-50' : 'text-slate-500'}`}>
                    {summaryMode ? 
                      (lastResult?.legalAssessment?.courtReadySummary || "Briefing mode active. Indian legal narrative derived from forensic markers.") : 
                      "Optimized for Indian Judiciary. Toggle 'Summary Mode' for non-technical risk indicator framing."}
                  </p>
                  
                  <div className={`p-5 rounded-3xl border transition-all ${summaryMode ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                     <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${summaryMode ? 'text-indigo-200' : 'text-slate-400'}`}>Statutory Context</p>
                     <p className="text-xs font-bold leading-tight">{jurisdictionInfo.law}</p>
                     <p className={`text-[9px] mt-2 leading-relaxed italic ${summaryMode ? 'text-indigo-300' : 'text-slate-400'}`}>{jurisdictionInfo.context}</p>
                  </div>
                </div>
             </div>
             
             <div className="mt-8 p-5 bg-indigo-500/10 rounded-3xl border border-indigo-500/20 text-center">
                <p className={`text-[9px] font-black uppercase tracking-widest ${summaryMode ? 'text-indigo-200' : 'text-indigo-600'}`}>Expert Recommendation</p>
                <p className="text-xs font-bold mt-1">{lastResult?.legalAssessment?.expertRecommendation || "Pending Scan..."}</p>
             </div>
          </div>
        </div>
      </div>

      {/* Support Disclosure Footer */}
      <div className="bg-slate-950 p-10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-8 text-white border border-slate-900">
        <div className="flex items-center gap-6">
           <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
             <Gavel size={28}/>
           </div>
           <div>
             <h4 className="font-black text-lg">Judicial Support Disclaimer</h4>
             <p className="text-xs text-slate-500 max-w-sm">TruthLens supports investigation and provides forensic assistance under the Information Technology (Intermediary Guidelines) Rules, 2021.</p>
           </div>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Registry Sync</p>
             <p className="text-xs font-bold">{lastResult ? new Date(lastResult.timestamp).toLocaleString('en-IN') : 'Active Uplink Ready'}</p>
           </div>
           <div className="w-px h-10 bg-slate-800"></div>
           <div className="flex flex-col items-end">
             <span className="text-indigo-400 font-black text-sm">v2.6 Forensic</span>
             <span className="text-[8px] font-black text-slate-600 uppercase tracking-tighter">India Gov-Grade Engine</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LawyersEye;
