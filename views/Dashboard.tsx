
import React from 'react';
import { UserStats, RiskLevel } from '../types';
import { AlertCircle, CheckCircle2, Search, History as HistoryIcon } from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  onVerify: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, onVerify }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">User Hub</h2>
          <p className="text-slate-500">Track your digital forensic integrity reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onVerify}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center space-x-2 shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
          >
            <Search size={20} />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Total Analyzed</span>
            <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-slate-900">{stats.totalVerifications}</p>
        </div>
        
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">High Risk Flagged</span>
            <div className="bg-red-50 text-red-600 p-2.5 rounded-xl">
              <AlertCircle size={20} />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-slate-900">{stats.highRiskCount}</p>
        </div>

        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">Confidence Index</span>
            <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
              <Search size={20} />
            </div>
          </div>
          <p className="text-4xl font-extrabold text-slate-900">98.4%</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-slate-50 p-2 rounded-lg">
              <HistoryIcon size={20} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Analysis Ledger</h3>
          </div>
        </div>
        <div className="divide-y divide-slate-50">
          {stats.history.length === 0 ? (
            <div className="p-20 text-center text-slate-400">
              <div className="mb-4 bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <HistoryIcon size={32} />
              </div>
              <p className="font-medium">No verifications found.</p>
              <p className="text-sm">Start by analyzing suspicious content to build your ledger.</p>
            </div>
          ) : (
            stats.history.slice(0, 5).map((item) => (
              <div key={item.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl ${
                    item.riskLevel === RiskLevel.HIGH ? 'bg-red-50 text-red-600 shadow-sm' : 
                    item.riskLevel === RiskLevel.MEDIUM ? 'bg-yellow-50 text-yellow-600 shadow-sm' : 'bg-emerald-50 text-emerald-600 shadow-sm'
                  }`}>
                    {item.type === 'text' ? '📝' : item.type === 'image' ? '🖼️' : '🎥'}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 truncate max-w-xs md:max-w-md">{item.content}</h4>
                    <p className="text-xs text-slate-400 font-medium">{new Date(item.timestamp).toLocaleDateString()} at {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    item.riskLevel === RiskLevel.HIGH ? 'bg-red-600 text-white' : 
                    item.riskLevel === RiskLevel.MEDIUM ? 'bg-yellow-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {item.riskLevel}
                  </span>
                  <p className="text-xs text-slate-400 mt-2 font-bold">{item.fakeProbability}% Logic Match</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
