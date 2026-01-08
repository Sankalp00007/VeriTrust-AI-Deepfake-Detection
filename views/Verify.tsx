
import React, { useState, useRef, useEffect } from 'react';
import { ContentType, VerificationResult, AnalysisMode, UserProfile } from '../types';
import { analyzeContent } from '../services/geminiService';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Loader2, 
  AlertCircle,
  X,
  Lock,
  Gavel,
  Zap
} from 'lucide-react';

interface VerifyProps {
  onComplete: (result: VerificationResult) => void;
  isLoggedIn: boolean;
  onAuthNeeded: () => void;
  userProfile?: UserProfile | null;
  title?: string;
}

const Verify: React.FC<VerifyProps> = ({ onComplete, isLoggedIn, onAuthNeeded, userProfile, title = "Intelligence Intake" }) => {
  const [activeType, setActiveType] = useState<ContentType>(ContentType.TEXT);
  const [mode, setMode] = useState<AnalysisMode>(AnalysisMode.STANDARD);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allModes = [
    { id: AnalysisMode.STANDARD, label: 'Standard', icon: <Zap size={16}/>, desc: 'General verification', roles: ['user'] },
    { id: AnalysisMode.TRUTHLENS, label: 'TruthLens Forensic', icon: <Gavel size={16}/>, desc: 'Cyber-legal integrity', roles: ['lawyer'] }
  ];

  const availableModes = allModes.filter(m => m.roles.includes(userProfile?.role || 'user'));

  useEffect(() => {
    if (availableModes.length > 0) {
      setMode(availableModes[0].id);
    }
  }, [userProfile?.role]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (activeType === ContentType.IMAGE && !selectedFile.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      if (activeType === ContentType.VIDEO && !selectedFile.type.startsWith('video/')) {
        setError('Please select a video file.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!isLoggedIn) {
      onAuthNeeded();
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    try {
      let result: VerificationResult;
      if (activeType === ContentType.TEXT) {
        if (!text.trim()) throw new Error("Enter text for analysis.");
        result = await analyzeContent(ContentType.TEXT, text, mode);
      } else {
        if (!filePreview) throw new Error("Upload media for analysis.");
        result = await analyzeContent(activeType, filePreview, mode, file?.name);
      }
      onComplete(result);
    } catch (err: any) {
      setError(err.message || "Forensic node failure. Check connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearUpload = () => {
    setFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">{title}</h2>
        <p className="text-slate-500">Submit target content for forensic review.</p>
      </div>

      {availableModes.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableModes.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={`p-4 rounded-3xl border text-left transition-all ${
                mode === m.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-[1.02]' 
                : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
              }`}
            >
              <div className={`mb-2 p-2 rounded-xl w-fit ${mode === m.id ? 'bg-white/20' : 'bg-slate-50'}`}>
                {m.icon}
              </div>
              <p className="text-xs font-black uppercase tracking-widest">{m.label}</p>
              <p className={`text-[10px] mt-1 ${mode === m.id ? 'text-blue-100' : 'text-slate-400'}`}>{m.desc}</p>
            </button>
          ))}
        </div>
      )}

      <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden relative">
        {!isLoggedIn && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-8 text-center space-y-4">
            <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-2xl shadow-blue-500/40">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Authentication Required</h3>
            <button onClick={onAuthNeeded} className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all">
              Login to Uplink
            </button>
          </div>
        )}

        <div className="flex border-b border-slate-100 bg-slate-50/50">
          {[ContentType.TEXT, ContentType.IMAGE, ContentType.VIDEO].map((t) => (
            <button 
              key={t}
              onClick={() => { setActiveType(t); clearUpload(); }}
              className={`flex-1 py-6 flex flex-col items-center gap-2 transition-all ${activeType === t ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 opacity-60'}`}
            >
              {t === ContentType.TEXT ? <FileText size={20}/> : t === ContentType.IMAGE ? <ImageIcon size={20}/> : <Video size={20}/>}
              <span className="font-black text-[10px] uppercase tracking-widest">{t}</span>
            </button>
          ))}
        </div>

        <div className="p-10">
          {activeType === ContentType.TEXT ? (
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste content for forensic analysis..."
              className="w-full h-48 p-8 rounded-[32px] bg-slate-50 border-none focus:ring-4 focus:ring-blue-500/10 focus:bg-white text-slate-700 transition-all outline-none font-medium leading-relaxed"
            />
          ) : (
            <div className="space-y-4">
              {!filePreview ? (
                <div onClick={() => fileInputRef.current?.click()} className="w-full h-64 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all bg-slate-50">
                  <div className="p-5 bg-white rounded-3xl shadow-sm"><Upload className="text-slate-400" size={32} /></div>
                  <div className="text-center">
                    <p className="font-bold text-slate-700">Drop Forensic Target</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ready for Deep Scanning</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-[40px] overflow-hidden border border-slate-200 bg-slate-100 group">
                  <button onClick={clearUpload} className="absolute top-6 right-6 p-3 bg-black/50 text-white rounded-full hover:bg-red-500 transition-all z-10"><X size={20} /></button>
                  {activeType === ContentType.IMAGE ? <img src={filePreview} className="w-full h-auto max-h-[400px] object-contain mx-auto" /> : <video src={filePreview} controls className="w-full h-auto max-h-[400px] object-contain mx-auto" />}
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept={activeType === ContentType.IMAGE ? "image/*" : "video/*"} />
            </div>
          )}

          {error && <div className="mt-8 p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-3 text-red-700 text-xs font-bold"><AlertCircle size={20}/>{error}</div>}

          <div className="mt-10">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className={`w-full py-6 rounded-3xl font-black text-lg flex items-center justify-center space-x-3 transition-all ${isAnalyzing ? 'bg-slate-200 text-slate-500' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/30'}`}
            >
              {isAnalyzing ? <><Loader2 className="animate-spin" size={24}/><span>Scanning Context...</span></> : <><Zap size={20}/><span>Engage Intelligence Engine</span></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
