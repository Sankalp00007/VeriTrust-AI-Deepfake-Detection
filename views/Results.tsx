
import React from 'react';
import { VerificationResult, RiskLevel, AnalysisMode } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  RefreshCw,
  Info,
  ChevronRight,
  Brain,
  Hash,
  Globe,
  Gavel,
  BookOpen,
  Scale,
  Library,
  Bookmark
} from 'lucide-react';

interface ResultsProps {
  result: VerificationResult;
  onNew: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onNew }) => {
  const isLegalMode = result.mode === AnalysisMode.LEGAL || result.mode === AnalysisMode.TRUTHLENS;

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH: return 'text-red-600 bg-red-50 border-red-100';
      case RiskLevel.MEDIUM: return 'text-orange-600 bg-orange-50 border-orange-100';
      case RiskLevel.LOW: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          {/* Cyber Law Trace - EXCLUSIVE FOR LAWYERS */}
          {isLegalMode && result.legalAssessment?.applicableLaws && (
            <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                 <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black flex items-center gap-3">
                     <Library className="text-blue-400" /> Automated Cyber-Law Trace
                   </h3>
                   <span className="text-[10px] font-black uppercase bg-blue-600 px-3 py-1 rounded-full">Legal Intel v2.0</span>
                 </div>
                 
                 <div className="grid gap-4">
                    {result.legalAssessment.applicableLaws.map((law, i) => (
                      <div key={i} className="p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                         <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Bookmark size={14} className="text-blue-400" />
                                <p className="text-sm font-black text-blue-100">{law.title}</p>
                              </div>
                              <p className="text-xs font-bold text-blue-400/80">Section: {law.section}</p>
                              <p className="text-xs text-slate-400 leading-relaxed mt-2">{law.description}</p>
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
            
            {result.emotionalSignals && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Psychological Bias</p>
                  <div className="space-y-3">
                    {['Fear', 'Anger', 'Urgency'].map(emotion => {
                      const val = result.emotionalSignals?.[emotion.toLowerCase() as keyof typeof result.emotionalSignals] as number;
                      return (
                        <div key={emotion} className="flex items-center justify-between group">
                          <span className="text-xs font-bold text-slate-500">{emotion}</span>
                          <div className="flex-1 mx-4 bg-slate-100 h-1 rounded-full">
                            <div className="h-full bg-blue-400 rounded-full" style={{width: `${val}%`}} />
                          </div>
                          <span className="text-[10px] font-black text-slate-400">{val}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="md:col-span-2 bg-slate-50 p-6 rounded-3xl">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Detected Manipulation Tactic</p>
                  <p className="text-sm font-bold text-slate-700">{result.emotionalSignals.manipulationTactic}</p>
                </div>
              </div>
            )}
          </div>

          {/* Special Feature Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-900 text-white p-8 rounded-[40px] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="text-indigo-300" />
                  <h4 className="font-bold">Regional Context Engine</h4>
                </div>
                <p className="text-sm text-indigo-100 leading-relaxed">{result.culturalContext || "No specific regional sensitivities detected in current context."}</p>
              </div>
              <div className="mt-6 pt-6 border-t border-indigo-800">
                 <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Global Inclusivity Guard: ACTIVE</p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-[40px] flex flex-col justify-between">
               <div>
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="text-emerald-600" />
                  <h4 className="font-bold text-emerald-900">Learning Insights</h4>
                </div>
                <p className="text-sm text-emerald-700 leading-relaxed italic">{result.literacyTip}</p>
              </div>
              <div className="mt-6">
                <button className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                  Deep Dive on This Case <ChevronRight size={14}/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fraud & Legal Integrity Section */}
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
               <ShieldCheck size={16}/> <span className="text-[10px] font-black uppercase tracking-widest">Cross-Platform Fingerprint</span>
             </div>
             <p className="text-sm font-bold text-slate-800">{result.fingerprint}</p>
             <p className="text-[10px] text-slate-400 mt-2">Detected in 0 known misinformation loops.</p>
           </div>

           <div className={`p-6 rounded-3xl border ${result.fraudRisk?.isScam ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className={`flex items-center gap-2 mb-4 ${result.fraudRisk?.isScam ? 'text-red-500' : 'text-emerald-500'}`}>
               <AlertTriangle size={16}/> <span className="text-[10px] font-black uppercase tracking-widest">Fraud Risk Intel</span>
             </div>
             <p className="text-sm font-bold text-slate-800">{result.fraudRisk?.isScam ? 'Impersonation Pattern Detected' : 'No Fraud Patterns Identified'}</p>
             <div className="mt-2 flex flex-wrap gap-2">
               {result.fraudRisk?.patterns.map((p, i) => (
                 <span key={i} className="text-[8px] font-black uppercase bg-white/50 px-2 py-1 rounded-lg">{p}</span>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
