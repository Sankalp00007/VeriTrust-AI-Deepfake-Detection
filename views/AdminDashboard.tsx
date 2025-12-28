
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { VerificationResult, UserProfile, RiskLevel, ContentType } from '../types';
import { 
  Users, 
  Activity, 
  Database, 
  AlertOctagon,
  Cpu,
  ShieldCheck,
  RefreshCw,
  Search,
  Download,
  Filter,
  Trash2,
  ExternalLink,
  ChevronRight,
  BarChart3,
  FileSpreadsheet,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'users'>('overview');
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<VerificationResult[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    highRisk: 0,
    userCount: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Global Reports (Requires proper RLS for Admin Role)
      const { data: reportData, error: reportErr } = await supabase
        .from('verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportErr) throw reportErr;

      // 2. Fetch Global Profiles
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (profileErr) throw profileErr;

      const formattedReports: VerificationResult[] = reportData.map(r => ({
        id: r.id,
        timestamp: new Date(r.created_at).getTime(),
        type: r.type as ContentType,
        content: r.content,
        fakeProbability: r.fake_probability,
        riskLevel: r.risk_level as RiskLevel,
        confidenceScore: r.confidence_score,
        reasoning: r.reasoning,
        isMisinformation: r.is_misinformation,
        userEmail: profileData.find(p => p.id === r.user_id)?.email || 'Unknown User'
      }));

      setReports(formattedReports);
      setUsers(profileData);
      setStats({
        total: formattedReports.length,
        highRisk: formattedReports.filter(r => r.riskLevel === RiskLevel.HIGH).length,
        userCount: profileData.length
      });
    } catch (err) {
      console.error("Master Console Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleExportCSV = () => {
    const escapeCSV = (val: any) => {
      const str = String(val ?? '');
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const headers = ['Record ID', 'Timestamp', 'Reporter Email', 'Content Type', 'Content Sample', 'Risk Level', 'AI Logic %', 'Reasoning Summary'];
    const rows = reports.map(r => [
      r.id,
      new Date(r.timestamp).toISOString(),
      r.userEmail,
      r.type,
      escapeCSV(r.content),
      r.riskLevel,
      `${r.fakeProbability}%`,
      escapeCSV(r.reasoning)
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `veritrust_master_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredReports = reports.filter(r => 
    r.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chartData = [
    { name: 'Safe/Low', value: reports.filter(r => r.riskLevel === RiskLevel.LOW).length },
    { name: 'Moderate', value: reports.filter(r => r.riskLevel === RiskLevel.MEDIUM).length },
    { name: 'Critical/High', value: reports.filter(r => r.riskLevel === RiskLevel.HIGH).length },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-100 text-red-600 text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-widest">Global Master Node</span>
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">• Authority Context</span>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Intelligence Console</h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-6 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm group"
          >
            <FileSpreadsheet size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span>Master Data Extraction</span>
          </button>
          <button 
            onClick={fetchData}
            className="p-4 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-slate-200/50 rounded-3xl w-fit backdrop-blur-md">
        {[
          { id: 'overview', icon: <BarChart3 size={18} />, label: 'Analytics' },
          { id: 'reports', icon: <Database size={18} />, label: 'Audit Log' },
          { id: 'users', icon: <Users size={18} />, label: 'Registry' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm transition-all ${
              activeTab === tab.id ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-blue-50 group-hover:text-blue-100 transition-colors">
                <Database size={80} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Global Data Points</p>
              <p className="text-6xl font-black text-slate-900 leading-none">{stats.total}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-3 py-1 rounded-full">
                <Activity size={12} /> Total Verifications
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-red-50 group-hover:text-red-100 transition-colors">
                <ShieldAlert size={80} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Platform Incidents</p>
              <p className="text-6xl font-black text-slate-900 leading-none">{stats.highRisk}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 w-fit px-3 py-1 rounded-full">
                <AlertOctagon size={12} /> Critical Risk Flags
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-indigo-50 group-hover:text-indigo-100 transition-colors">
                <Users size={80} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Active Field Agents</p>
              <p className="text-6xl font-black text-slate-900 leading-none">{stats.userCount}</p>
              <div className="mt-6 flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 w-fit px-3 py-1 rounded-full">
                <ShieldCheck size={12} /> Registered Identities
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm h-[450px] flex flex-col">
              <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center justify-between">
                Platform Risk Curve
                <Settings size={18} className="text-slate-300" />
              </h3>
              <div className="flex-1 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} innerRadius={80} outerRadius={120} paddingAngle={10} dataKey="value">
                      {chartData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-3xl font-black text-slate-900">{stats.total}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Analyzed</p>
                </div>
              </div>
              <div className="flex justify-center gap-8 mt-6">
                {chartData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs font-bold text-slate-600">{d.name}: {d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                  <Cpu className="text-blue-600" /> Infrastructure Node Status
                </h3>
                <div className="space-y-5">
                  {[
                    { label: "Core AI Cluster", value: "Gemini 3.0 Pro (Native)", status: "Optimal" },
                    { label: "Database Layer", value: "Supabase Postgres Node", status: "Active" },
                    { label: "Verification Latency", value: "Real-time Forensic Sync", status: "Stable" },
                    { label: "Platform Health", value: "99.99% Performance", status: "Green" }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[28px] border border-slate-100 group hover:border-blue-200 transition-all">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                        <p className="text-sm font-bold text-slate-800">{s.value}</p>
                      </div>
                      <span className="px-4 py-1.5 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-xl shadow-sm">{s.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-8 border-t border-slate-100 mt-8">
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center italic">Encryption Protocol: AES-256-GCM Secure Cluster Active</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search Master Log (User Email or Sample Text)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="p-4 bg-slate-50 text-slate-500 rounded-2xl hover:bg-slate-100 border border-slate-200 transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reporter / Identity</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Content</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Index</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic %</th>
                  <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-black text-sm shadow-sm">
                          {report.userEmail?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-bold text-slate-700">{report.userEmail}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 max-w-sm">
                      <p className="text-sm font-bold text-slate-800 truncate">{report.content}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1.5">{report.type} • {new Date(report.timestamp).toLocaleDateString()}</p>
                    </td>
                    <td className="px-10 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        report.riskLevel === RiskLevel.HIGH ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 
                        report.riskLevel === RiskLevel.MEDIUM ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                      }`}>
                        {report.riskLevel}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-sm font-black text-slate-800">{report.fakeProbability}%</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                          <ExternalLink size={18} />
                        </button>
                        <button className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <div key={user.id} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all group relative overflow-hidden">
               {user.role === 'admin' && (
                 <div className="absolute top-0 right-0 p-4">
                   <ShieldCheck className="text-blue-500 opacity-20" size={48} />
                 </div>
               )}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center font-black text-2xl shadow-inner ${
                    user.role === 'admin' ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {user.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 truncate max-w-[160px]">{user.email}</h4>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-1 inline-block ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                      System {user.role}
                    </span>
                  </div>
                </div>
                <button className="p-2.5 text-slate-300 hover:text-slate-600 transition-colors">
                  <ChevronRight size={24} />
                </button>
              </div>
              
              <div className="pt-6 border-t border-slate-50 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Registry Entry</p>
                  <p className="text-xs font-bold text-slate-800">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Activity Count</p>
                  <p className="text-xs font-bold text-slate-800">{reports.filter(r => r.userEmail === user.email).length} Operations</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
