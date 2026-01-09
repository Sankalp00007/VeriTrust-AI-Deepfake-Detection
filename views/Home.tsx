
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  Eye, 
  BarChart3, 
  Globe, 
  Gavel, 
  ShieldAlert, 
  Cpu, 
  Target, 
  Layers,
  ChevronRight,
  Fingerprint,
  Search,
  Activity,
  AlertCircle
} from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const ScannerSimulation = () => {
  const [scanPos, setScanPos] = useState(0);
  const [detectedItems, setDetectedItems] = useState<{x: number, y: number, label: string}[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanPos(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Periodically "detect" something
    const detect = setInterval(() => {
      const newItem = {
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        label: Math.random() > 0.5 ? 'Artifact Detected' : 'Pixel Inconsistency'
      };
      setDetectedItems(prev => [...prev.slice(-3), newItem]);
    }, 2000);
    return () => clearInterval(detect);
  }, []);

  return (
    <div className="relative w-full h-[500px] bg-slate-900 rounded-[50px] overflow-hidden border-4 border-slate-800 shadow-2xl group">
      {/* Background Image - Representing Victim Evidence/Forensic Scan */}
      <img 
        src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&q=80&w=1200" 
        alt="Forensic Evidence Scan" 
        className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-1000 brightness-75"
      />
      
      {/* Scanning Line */}
      <div 
        className="absolute w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent z-10 shadow-[0_0_15px_rgba(59,130,246,0.8)]"
        style={{ top: `${scanPos}%` }}
      >
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-[8px] font-black text-white px-2 py-0.5 rounded uppercase tracking-tighter">
          Scanning Latency: 12ms
        </div>
      </div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>

      {/* Detection Markers */}
      {detectedItems.map((item, i) => (
        <div 
          key={i} 
          className="absolute z-20 animate-ping"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          <div className="w-8 h-8 border-2 border-red-500 rounded-lg flex items-center justify-center">
             <div className="w-1 h-1 bg-red-500 rounded-full"></div>
          </div>
          <div className="absolute top-10 left-0 bg-red-600 text-white text-[8px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-lg">
            {item.label}
          </div>
        </div>
      ))}

      {/* Bottom Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md p-6 flex items-center justify-between border-t border-white/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-500 uppercase">Live Engine</span>
          </div>
          <div className="w-px h-4 bg-slate-700"></div>
          <div className="text-[10px] font-bold text-slate-400">FPS: 60 • THREADS: 12</div>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-blue-500" />
          <span className="text-[10px] font-black text-white uppercase">Analyzing Patterns...</span>
        </div>
      </div>
    </div>
  );
};

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="space-y-32 py-8 overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex flex-col lg:flex-row items-center gap-16 min-h-[70vh]">
        <div className="flex-1 space-y-8 z-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-black text-[10px] uppercase tracking-[0.2em] border border-blue-100 animate-pulse">
            <Zap size={14} className="mr-2" />
            India's First Gemini-Powered Forensic Engine
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
            Truth is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Traceable.</span>
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed max-w-xl font-medium">
            VeriTrust AI deploys hyper-advanced digital forensics to dismantle misinformation and expose deepfakes with courtroom-grade precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-[24px] font-black text-lg hover:bg-blue-600 transition-all shadow-2xl hover:shadow-blue-500/20 flex items-center justify-center group active:scale-95"
            >
              Secure Ingest
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center gap-8 pt-6 border-t border-slate-100">
             <div className="flex -space-x-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                 </div>
               ))}
             </div>
             <p className="text-xs font-bold text-slate-400">Trusted by <span className="text-slate-900">500+ Legal Professionals</span> across India</p>
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="relative z-10 rounded-[60px] overflow-hidden shadow-3xl border-8 border-white transform lg:rotate-3 hover:rotate-0 transition-all duration-700">
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200" 
              alt="Cyber Forensics Visualization" 
              className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/40 to-transparent"></div>
            {/* Floating UI Element */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-[32px] shadow-2xl border border-white/50 animate-bounce-slow">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                   <Fingerprint className="animate-pulse" />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Spectral Analysis</p>
                   <p className="text-sm font-black text-slate-900">Pixel Inconsistency Detected: 94.2%</p>
                 </div>
               </div>
            </div>
          </div>
          {/* Background Blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[100px]"></div>
        </div>
      </section>

      {/* Impact Statistics Section with Scanner Simulation */}
      <section className="bg-white p-12 md:p-24 rounded-[80px] border border-slate-100 shadow-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Protecting the Digital <span className="text-blue-600">Sovereignty</span> of 1.4 Billion</h2>
              <p className="text-slate-500 font-medium text-lg leading-relaxed">
                In an era of viral manipulation, VeriTrust AI acts as the thin blue line between evidence and fabrication. Our engine identifies sub-pixel anomalies invisible to the human eye.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              {[
                { val: "2M+", label: "Assets Verified", icon: <Layers className="text-blue-600" /> },
                { val: "85%", label: "Fraud Reduction", icon: <ShieldCheck className="text-indigo-600" /> },
                { val: "12s", label: "Latency Avg.", icon: <Zap className="text-amber-500" /> },
                { val: "99.8%", label: "Model Confidence", icon: <Target className="text-emerald-500" /> }
              ].map((s, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-4">{s.icon}</div>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">{s.val}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <ScannerSimulation />
            <div className="absolute -right-8 top-1/2 -translate-y-1/2 bg-slate-900 text-white p-10 rounded-[40px] shadow-3xl max-w-[280px] space-y-4 hidden xl:block z-30">
               <div className="flex items-center gap-2 mb-2">
                 <AlertCircle size={16} className="text-red-500" />
                 <p className="text-[10px] font-black uppercase text-red-500 tracking-widest">Critical Alert</p>
               </div>
               <p className="text-2xl font-black italic">"The gold standard for Indian cyber-law."</p>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600"></div>
                  <div>
                    <p className="text-xs font-bold">Adv. Rajesh Kumar</p>
                    <p className="text-[10px] text-slate-400">Cyber Law Specialist</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Grid */}
      <section className="space-y-16">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-5xl font-black text-slate-900 tracking-tight">Our <span className="text-indigo-600">Blueprint</span></h2>
          <p className="text-slate-500 font-medium">Building a resilient digital ecosystem where trust is no longer a luxury, but a verifiable fact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { 
               title: "Democratized Forensics", 
               desc: "Providing high-level forensic tools once reserved for elite intelligence agencies to every citizen and lawyer.",
               img: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
               icon: <Globe className="text-blue-500" />
             },
             { 
               title: "Judicial Integrity", 
               desc: "Hardening the chain of custody for digital evidence to ensure Indian courts remain resilient against AI spoofing.",
               img: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=800",
               icon: <Gavel className="text-indigo-500" />
             },
             { 
               title: "Global Misinfo Shield", 
               desc: "Mapping coordinated misinformation networks in real-time to neutralize viral threats before they cause social unrest.",
               img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
               icon: <ShieldAlert className="text-red-500" />
             }
           ].map((v, i) => (
             <div key={i} className="group bg-white rounded-[48px] overflow-hidden border border-slate-100 hover:border-blue-200 transition-all shadow-sm hover:shadow-2xl">
                <div className="h-64 overflow-hidden relative">
                  <img src={v.img} alt={v.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white">
                    {v.icon}
                  </div>
                </div>
                <div className="p-10 space-y-4">
                  <h3 className="text-2xl font-black text-slate-900">{v.title}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{v.desc}</p>
                  <button className="pt-4 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:gap-4 transition-all">
                    Explore Strategy <ChevronRight size={14} />
                  </button>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* Corporate/Government Ready Section */}
      <section className="bg-slate-900 rounded-[80px] p-12 md:p-24 text-white relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8">
            <h2 className="text-5xl font-black tracking-tight leading-tight">Ready for <span className="text-blue-500">Government</span> & Enterprise Deployment.</h2>
            <p className="text-slate-400 text-lg font-medium max-w-xl">
              VeriTrust offers air-gapped forensic solutions for critical infrastructure, election monitoring, and financial sectors.
            </p>
            <div className="flex flex-wrap gap-4">
               {["IT Act 2021 Compliant", "Zero-Knowledge Ingest", "No-Retention Policy", "API Driven Forensics"].map((tag, i) => (
                 <div key={i} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-300">
                   {tag}
                 </div>
               ))}
            </div>
          </div>
          
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
             <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-[50px] p-10 space-y-8">
                <div className="space-y-1">
                  <h4 className="text-xl font-black">System Status</h4>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-widest">Active Intelligence Link</p>
                </div>
                <div className="space-y-6">
                   {[
                     { label: "Deepfake Radar", val: "Operational", color: "bg-emerald-500" },
                     { label: "Text Sincerity Scan", val: "High Load", color: "bg-amber-500" },
                     { label: "BNS Statute Mapping", val: "Synced", color: "bg-blue-500" }
                   ].map((sys, i) => (
                     <div key={i} className="flex items-center justify-between">
                        <span className="text-sm font-bold text-slate-300">{sys.label}</span>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black uppercase text-slate-500">{sys.val}</span>
                           <div className={`w-2 h-2 rounded-full ${sys.color} animate-pulse`}></div>
                        </div>
                     </div>
                   ))}
                </div>
                <div className="pt-8 border-t border-white/10 text-center">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model: Gemini 3.0 Pro Forensic v2.6</p>
                </div>
             </div>
          </div>
        </div>
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_120%,rgba(37,99,235,0.15),transparent)]"></div>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]"></div>
      </section>
    </div>
  );
};

export default Home;
