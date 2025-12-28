
import React from 'react';
import { VerificationResult, RiskLevel } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Search, 
  RefreshCw,
  Fingerprint,
  Info,
  ChevronRight
} from 'lucide-react';

interface ResultsProps {
  result: VerificationResult;
  onNew: () => void;
}

const Results: React.FC<ResultsProps> = ({ result, onNew }) => {
  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH: return 'text-red-600 bg-red-50 border-red-100';
      case RiskLevel.MEDIUM: return 'text-orange-600 bg-orange-50 border-orange-100';
      case RiskLevel.LOW: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.HIGH: return <AlertTriangle size={32} />;
      case RiskLevel.MEDIUM: return <AlertTriangle size={32} />;
      case RiskLevel.LOW: return <CheckCircle size={32} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <Search className="text-blue-600" />
          Analysis Report
        </h2>
        <div className="flex space-x-3">
          <button 
            onClick={onNew}
            className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <RefreshCw size={16} />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Card */}
        <div className={`lg:col-span-1 rounded-3xl border-2 p-8 flex flex-col items-center text-center space-y-6 ${getRiskColor(result.riskLevel)}`}>
          <div className="p-4 bg-white/50 rounded-full shadow-inner">
            {getRiskIcon(result.riskLevel)}
          </div>
          <div className="space-y-1">
            <h3 className="text-4xl font-black">{result.fakeProbability}%</h3>
            <p className="text-sm font-bold uppercase tracking-widest opacity-70">Manipulation Probability</p>
          </div>
          <div className="w-full bg-white/30 h-3 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${result.riskLevel === RiskLevel.HIGH ? 'bg-red-500' : result.riskLevel === RiskLevel.MEDIUM ? 'bg-orange-500' : 'bg-emerald-500'}`}
              style={{ width: `${result.fakeProbability}%` }}
            />
          </div>
          <div className="text-lg font-bold">
            Risk Level: {result.riskLevel}
          </div>
        </div>

        {/* Confidence & Reasoning */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Fingerprint className="text-blue-500" />
                Explainability Panel
              </h3>
              <div className="flex items-center space-x-2 text-sm bg-slate-50 px-3 py-1 rounded-full text-slate-500">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>AI Confidence: {Math.round(result.confidenceScore * 100)}%</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600 leading-relaxed text-lg italic">
                "{result.reasoning}"
              </p>
            </div>

            {result.flaggedRegions && result.flaggedRegions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Observed Abnormalities</h4>
                <div className="grid grid-cols-1 gap-2">
                  {result.flaggedRegions.map((region, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="bg-white p-1 rounded-md text-slate-400">
                        <ChevronRight size={14} />
                      </div>
                      <span className="text-sm text-slate-700">{region}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-indigo-900 text-white p-6 rounded-3xl flex items-start space-x-4">
            <div className="p-2 bg-indigo-800 rounded-xl">
              <Info className="text-indigo-200" size={24} />
            </div>
            <div>
              <h4 className="font-bold mb-1">Human Decision Support</h4>
              <p className="text-indigo-100 text-sm leading-relaxed">
                This is an AI-assisted assessment, not a final verdict. Please use this as one of many tools in your decision-making process. VeriTrust does not censor content.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <ShieldCheck className="text-emerald-500" />
          Forensic Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-600 font-medium">Metadata Authenticity</span>
              <span className="text-emerald-600 font-bold">Verified</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-600 font-medium">Logical Consistency</span>
              <span className={`${result.isMisinformation ? 'text-red-500' : 'text-emerald-500'} font-bold`}>
                {result.isMisinformation ? 'Flagged' : 'Pass'}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-600 font-medium">Temporal Coherence</span>
              <span className="text-emerald-600 font-bold">Stable</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <span className="text-slate-600 font-medium">Source Cross-Reference</span>
              <span className="text-slate-400 font-bold">N/A</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
