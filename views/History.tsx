
import React from 'react';
import { VerificationResult, RiskLevel } from '../types';
import { Calendar, Download, MoreVertical, FileSpreadsheet, ExternalLink, ChevronRight } from 'lucide-react';

interface HistoryViewProps {
  history: VerificationResult[];
}

const HistoryView: React.FC<HistoryViewProps> = ({ history }) => {
  const escapeCSV = (val: any) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;

    const headers = [
      'Record ID', 
      'Timestamp (ISO)', 
      'Category', 
      'Analyzed Content', 
      'Risk Classification', 
      'Manipulation Probability %', 
      'AI Confidence Score', 
      'Detailed Reasoning'
    ];

    const rows = history.map(item => [
      item.id,
      new Date(item.timestamp).toISOString(),
      item.type,
      escapeCSV(item.content),
      item.riskLevel,
      `${item.fakeProbability}%`,
      item.confidenceScore,
      escapeCSV(item.reasoning)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `veritrust_forensic_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Forensic Audit Log</h2>
          <p className="text-slate-500">Secure digital ledger of your verification transactions.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleExportCSV}
            disabled={history.length === 0}
            className="flex items-center space-x-3 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
          >
            <FileSpreadsheet size={18} />
            <span>Export Archive (CSV)</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Analysis Target</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Factor</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-32 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-5">
                      <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 border border-dashed border-slate-200">
                        <Calendar size={48} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-slate-400">No records found in database.</p>
                        <p className="text-sm max-w-xs mx-auto">Upload content for verification to populate your forensic history.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-700">
                        {new Date(item.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                        item.type === 'text' ? 'bg-blue-100 text-blue-700' :
                        item.type === 'image' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 max-w-sm">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-800 font-bold block truncate">{item.content}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] text-slate-400 font-bold">Logic: {item.fakeProbability}%</span>
                          <span className="text-[10px] text-slate-300">•</span>
                          <span className="text-[10px] text-slate-400 font-bold">Conf: {Math.round(item.confidenceScore * 100)}%</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2.5 h-2.5 rounded-full ring-4 ring-offset-2 ${
                          item.riskLevel === RiskLevel.HIGH ? 'bg-red-500 ring-red-50' : 
                          item.riskLevel === RiskLevel.MEDIUM ? 'bg-amber-500 ring-amber-50' : 'bg-emerald-500 ring-emerald-50'
                        }`} />
                        <span className={`text-xs font-black uppercase tracking-widest ${
                          item.riskLevel === RiskLevel.HIGH ? 'text-red-600' : 
                          item.riskLevel === RiskLevel.MEDIUM ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {item.riskLevel}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100 opacity-0 group-hover:opacity-100">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {history.length > 0 && (
        <div className="flex items-center justify-center gap-3 p-6 bg-slate-100/50 rounded-3xl border border-slate-200 border-dashed">
          <p className="text-xs text-slate-500 font-medium">All data is protected by AES-256 encryption within the VeriTrust DB cluster.</p>
        </div>
      )}
    </div>
  );
};

export default HistoryView;
