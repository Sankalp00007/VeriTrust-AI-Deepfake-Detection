
import React, { useState, useMemo } from 'react';
import { 
  Scale, 
  Briefcase, 
  FileCheck, 
  ShieldAlert, 
  Search, 
  Eye, 
  BookOpen, 
  Library, 
  Gavel, 
  ExternalLink, 
  ChevronRight,
  Info,
  Download,
  Zap,
  FileText,
  Filter,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { VerificationResult, UserProfile, ApplicableLaw } from '../types';
import Verify from './Verify';

// Expanded database focusing on Indian Cyber Crime Laws with categories
const CYBER_LAW_DATABASE: ApplicableLaw[] = [
  {
    title: "Information Technology Act, 2000",
    section: "Section 66",
    description: "Computer related offences. Covers any person who, with intent to cause damage, commits any act that destroys, alters or diminishes the value of any information.",
    relevanceLevel: "Direct",
    category: "Evidence"
  },
  {
    title: "Information Technology Act, 2000",
    section: "Section 66C",
    description: "Punishment for identity theft. Directly applicable to deepfake impersonations and credential harvesting.",
    relevanceLevel: "Direct",
    category: "Identity"
  },
  {
    title: "Information Technology Act, 2000",
    section: "Section 66D",
    description: "Cheating by personation by using computer resource. Primary section for pursuing deepfake-based financial fraud.",
    relevanceLevel: "Direct",
    category: "Fraud"
  },
  {
    title: "Information Technology Act, 2000",
    section: "Section 66E",
    description: "Punishment for violation of privacy. Capturing or transmitting images of private parts without consent (Deepfake morphing).",
    relevanceLevel: "Direct",
    category: "Privacy"
  },
  {
    title: "Information Technology Act, 2000",
    section: "Section 67A",
    description: "Punishment for publishing/transmitting sexually explicit material in electronic form. Highly relevant for Non-Consensual Deepfake Imagery (NCDI).",
    relevanceLevel: "Direct",
    category: "Privacy"
  },
  {
    title: "Bhartiya Nyaya Sanhita (BNS)",
    section: "Section 319 / 318",
    description: "Cheating and Personation. Replaces/augments IPC 419/420 for digital fraudulent inducement.",
    relevanceLevel: "Supporting",
    category: "Fraud"
  },
  {
    title: "Bhartiya Nyaya Sanhita (BNS)",
    section: "Section 356",
    description: "Defamation. Applicable when deepfakes are used to tarnish the reputation of a public figure or private citizen.",
    relevanceLevel: "Direct",
    category: "Defamation"
  },
  {
    title: "Copyright Act, 1957",
    section: "Section 51",
    description: "Infringement of copyright. Relevant for AI models trained on copyrighted data without authorization.",
    relevanceLevel: "Contextual",
    category: "Copyright"
  },
  {
    title: "Personal Data Protection Act (DPDP), 2023",
    section: "Section 8",
    description: "Obligations of Data Fiduciary. Relevant for how companies handle forensic data and evidence files.",
    relevanceLevel: "Supporting",
    category: "Evidence"
  },
  {
    title: "GDPR (European Union)",
    section: "Article 22",
    description: "Automated individual decision-making, including profiling. Relevant for cross-border legal cases involving EU citizens.",
    relevanceLevel: "Contextual",
    category: "Privacy"
  }
];

const TruthLens: React.FC<{ userProfile: UserProfile | null; onComplete: (r: VerificationResult) => void; isLoggedIn: boolean; lastResult?: VerificationResult | null }> = ({ userProfile, onComplete, isLoggedIn, lastResult }) => {
  const [isVerificationMode, setIsVerificationMode] = useState(false);
  const [lawSearchQuery, setLawSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const crimeCategories = ['All', 'Fraud', 'Privacy', 'Defamation', 'Identity', 'Copyright', 'Evidence'];

  const recommendedLaws = useMemo(() => {
    if (!lastResult) return [];
    
    // Logic to suggest laws based on the result
    return CYBER_LAW_DATABASE.filter(law => {
      if (lastResult.fraudRisk?.isScam && law.category === 'Fraud') return true;
      if (lastResult.originLabel === 'AI-Generated' && (law.category === 'Identity' || law.category === 'Copyright')) return true;
      if (lastResult.riskLevel === 'High' && law.relevanceLevel === 'Direct') return true;
      return false;
    }).slice(0, 2);
  }, [lastResult]);

  const filteredLaws = useMemo(() => {
    return CYBER_LAW_DATABASE.filter(law => {
      const matchesSearch = 
        law.title.toLowerCase().includes(lawSearchQuery.toLowerCase()) ||
        law.section.toLowerCase().includes(lawSearchQuery.toLowerCase()) ||
        law.description.toLowerCase().includes(lawSearchQuery.toLowerCase());
      
      const matchesLevel = filterLevel === 'All' || law.relevanceLevel === filterLevel;
      const matchesCategory = selectedCategory === 'All' || law.category === selectedCategory;
      
      return matchesSearch && matchesLevel && matchesCategory;
    });
  }, [lawSearchQuery, filterLevel, selectedCategory]);

  const LegalDisclaimer = () => (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[40px] flex items-start gap-6 mb-8 shadow-2xl relative overflow-hidden group">
      <div className="bg-blue-600/20 p-4 rounded-2xl text-blue-400 shrink-0">
        <ShieldAlert size={28}/>
      </div>
      <div className="space-y-2 relative z-10">
        <p className="text-sm font-black text-white uppercase tracking-[0.2em]">Forensic Protocol & Authority</p>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          TruthLens functions as a <strong>Digital Evidence Support System</strong>. It is designed to assist legal counsel in surfacing statutory markers and does not constitute a legal certification of evidence. All outputs should be corroborated by a certified forensic expert for deposition purposes.
        </p>
      </div>
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Gavel size={120} />
      </div>
    </div>
  );

  if (isVerificationMode) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setIsVerificationMode(false)}
          className="text-slate-500 font-bold text-sm flex items-center gap-2 hover:text-slate-800 transition-all"
        >
          <Search size={16}/> Back to Legal Dashboard
        </button>
        <Verify 
          onComplete={onComplete} 
          isLoggedIn={isLoggedIn} 
          onAuthNeeded={() => {}} 
          userProfile={userProfile}
          title="Evidence"
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-xl">
              <Scale size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">TruthLens <span className="text-blue-600 font-light">Counsel</span></h2>
          </div>
          <p className="text-slate-500">Advanced Evidence Authentication Suite for Legal Counsel.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsVerificationMode(true)}
            className="px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg flex items-center gap-3 shadow-2xl hover:bg-slate-800 transition-all active:scale-95"
          >
            <FileCheck size={20} />
            Submit Evidence
          </button>
        </div>
      </div>

      <LegalDisclaimer />

      {/* Case Context Auto-Statutes (Reacts to last result) */}
      {lastResult && recommendedLaws.length > 0 && (
        <div className="bg-blue-600 p-10 rounded-[40px] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black flex items-center gap-3">
                  <Sparkles size={24} className="text-blue-200" /> Case-Aware Suggestions
                </h3>
                <p className="text-blue-100 text-sm">Statutes recommended based on detected manipulation markers in current evidence.</p>
              </div>
              <div className="bg-white/10 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20">
                Context: {lastResult.originLabel}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedLaws.map((law, idx) => (
                <div key={idx} className="bg-white/10 border border-white/10 p-6 rounded-3xl hover:bg-white/20 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-200">{law.category}</span>
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold text-lg mb-1">{law.title}</h4>
                  <p className="text-blue-200 text-xs font-black">{law.section}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-40 -mt-40"></div>
        </div>
      )}

      {/* Enhanced Cyber Law Search Tool */}
      <div className="bg-slate-950 rounded-[40px] p-10 shadow-2xl space-y-10 border border-slate-900">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <Gavel className="text-blue-400" /> Statute Intelligence Search
              </h3>
              <p className="text-slate-400 text-sm">Quickly locate sections relevant to digital crime, fraud, and privacy.</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1">
                  {['All', 'Direct', 'Supporting'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setFilterLevel(level)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        filterLevel === level ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
               </div>
            </div>
          </div>

          {/* Category Pill Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
             <div className="text-slate-500 p-2"><Filter size={16}/></div>
             {crimeCategories.map(cat => (
               <button
                 key={cat}
                 onClick={() => setSelectedCategory(cat)}
                 className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                   selectedCategory === cat 
                   ? 'bg-white text-slate-900 border-white shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                   : 'bg-transparent text-slate-500 border-slate-800 hover:border-slate-600'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
          <input 
            type="text" 
            placeholder="Search statutes (e.g., 'Identity Theft', 'Section 66C', 'IPC 356')..."
            value={lawSearchQuery}
            onChange={(e) => setLawSearchQuery(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium text-lg placeholder:text-slate-600"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLaws.length > 0 ? (
            filteredLaws.map((law, idx) => (
              <div key={idx} className="bg-white/5 border border-slate-900 p-8 rounded-3xl hover:bg-white/10 transition-all group flex flex-col justify-between h-full">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                      <Library size={24} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{law.category}</span>
                      <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${
                        law.relevanceLevel === 'Direct' ? 'border-blue-500 text-blue-400' : 'border-slate-700 text-slate-600'
                      }`}>
                        {law.relevanceLevel}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1 leading-tight">{law.title}</h4>
                    <p className="text-blue-400 text-sm font-black mb-3">{law.section}</p>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-4">{law.description}</p>
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-white/5">
                  <button className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors group">
                    Reference Manual <ExternalLink size={12} className="group-hover:translate-y-[-2px] transition-transform"/>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4 bg-white/5 rounded-[40px] border border-dashed border-white/10">
              <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-700">
                <Search size={32} />
              </div>
              <p className="text-slate-500 font-bold">No statutes found matching your criteria.</p>
              <button onClick={() => {setLawSearchQuery(''); setFilterLevel('All'); setSelectedCategory('All');}} className="text-blue-400 text-xs font-black uppercase tracking-widest">Reset Discovery</button>
            </div>
          )}
        </div>
      </div>

      {/* Support Documentation Footer */}
      <div className="bg-slate-50 p-12 rounded-[40px] border border-slate-200 flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3 space-y-4">
          <div className="bg-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center text-white">
            <BookOpen size={24}/>
          </div>
          <h4 className="text-2xl font-black text-slate-900">Evidence Framework</h4>
          <p className="text-sm text-slate-500 leading-relaxed">Systematic handling of digital evidence under BNS & IT Act standards for litigation preparedness.</p>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
             <div className="text-blue-600 mb-4"><Info size={24}/></div>
             <p className="text-sm font-black text-slate-800 mb-2">Statutory Alignment</p>
             <p className="text-xs text-slate-400 leading-relaxed">Ensures that every detected manipulation is linked to specific legal violations for stronger initial filings.</p>
           </div>
           <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
             <div className="text-blue-600 mb-4"><Download size={24}/></div>
             <p className="text-sm font-black text-slate-800 mb-2">Integrity Ledger Export</p>
             <p className="text-xs text-slate-400 leading-relaxed">Generates timestamped proof-of-review to maintain the chain of custody for digital artifacts.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default TruthLens;
