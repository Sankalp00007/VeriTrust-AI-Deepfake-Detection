
import React, { useState, useRef } from 'react';
import { ContentType, VerificationResult } from '../types';
import { analyzeContent } from '../services/geminiService';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  X,
  Lock
} from 'lucide-react';

interface VerifyProps {
  onComplete: (result: VerificationResult) => void;
  isLoggedIn: boolean;
  onAuthNeeded: () => void;
}

const Verify: React.FC<VerifyProps> = ({ onComplete, isLoggedIn, onAuthNeeded }) => {
  const [activeType, setActiveType] = useState<ContentType>(ContentType.TEXT);
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (activeType === ContentType.IMAGE && !selectedFile.type.startsWith('image/')) {
        setError('Please select an image file (JPG/PNG).');
        return;
      }
      if (activeType === ContentType.VIDEO && !selectedFile.type.startsWith('video/')) {
        setError('Please select a video file.');
        return;
      }
      
      setFile(selectedFile);
      setError(null);

      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
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
        if (!text.trim()) throw new Error("Please enter text to analyze.");
        result = await analyzeContent(ContentType.TEXT, text);
      } else {
        if (!filePreview) throw new Error("Please upload a file to analyze.");
        result = await analyzeContent(activeType, filePreview, file?.name);
      }

      onComplete(result);
    } catch (err: any) {
      setError(err.message || "Analysis failed. Please try again.");
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
        <h2 className="text-3xl font-bold text-slate-800">Submit for Verification</h2>
        <p className="text-slate-500">Paste text, upload images, or short video clips to start the AI audit.</p>
      </div>

      <div className={`bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden relative`}>
        {!isLoggedIn && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-8 text-center space-y-4">
            <div className="bg-blue-600 p-5 rounded-3xl text-white shadow-2xl shadow-blue-500/40">
              <Lock size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 tracking-tight">Access Restricted</h3>
            <p className="text-slate-500 max-w-sm">
              Please sign in to your VeriTrust account to access our forensic analysis engine and detailed reports.
            </p>
            <button 
              onClick={onAuthNeeded}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-lg active:scale-95 transition-all"
            >
              Login / Sign Up
            </button>
          </div>
        )}

        <div className="flex border-b border-slate-100">
          <button 
            disabled={!isLoggedIn}
            onClick={() => { setActiveType(ContentType.TEXT); clearUpload(); }}
            className={`flex-1 py-6 flex flex-col items-center gap-2 transition-colors ${activeType === ContentType.TEXT ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <FileText size={24} />
            <span className="font-bold text-sm">Text Analysis</span>
          </button>
          <button 
            disabled={!isLoggedIn}
            onClick={() => { setActiveType(ContentType.IMAGE); clearUpload(); }}
            className={`flex-1 py-6 flex flex-col items-center gap-2 transition-colors ${activeType === ContentType.IMAGE ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <ImageIcon size={24} />
            <span className="font-bold text-sm">Image Forensic</span>
          </button>
          <button 
            disabled={!isLoggedIn}
            onClick={() => { setActiveType(ContentType.VIDEO); clearUpload(); }}
            className={`flex-1 py-6 flex flex-col items-center gap-2 transition-colors ${activeType === ContentType.VIDEO ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Video size={24} />
            <span className="font-bold text-sm">Video Sync</span>
          </button>
        </div>

        <div className="p-10">
          {activeType === ContentType.TEXT ? (
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Content Sample</label>
              <textarea 
                value={text}
                disabled={!isLoggedIn}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the suspicious text or social media post here..."
                className="w-full h-48 p-6 rounded-[32px] bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white resize-none text-slate-700 transition-all outline-none font-medium leading-relaxed"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                Media Source
              </label>
              
              {!filePreview ? (
                <div 
                  onClick={() => isLoggedIn && fileInputRef.current?.click()}
                  className="w-full h-72 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center space-y-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group bg-slate-50"
                >
                  <div className="p-5 bg-white rounded-3xl group-hover:bg-blue-100 transition-colors shadow-sm">
                    <Upload className="text-slate-400 group-hover:text-blue-500" size={32} />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-700">Drag & drop or click to upload</p>
                    <p className="text-sm text-slate-400 font-medium mt-1">Maximum file size: 10MB</p>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-[40px] overflow-hidden border border-slate-200 shadow-inner bg-slate-100 group">
                  <button 
                    onClick={clearUpload}
                    className="absolute top-6 right-6 p-3 bg-black/50 text-white rounded-full hover:bg-red-500 transition-all z-10 opacity-0 group-hover:opacity-100"
                  >
                    <X size={20} />
                  </button>
                  {activeType === ContentType.IMAGE ? (
                    <img src={filePreview} alt="Preview" className="w-full h-auto max-h-[500px] object-contain mx-auto" />
                  ) : (
                    <video src={filePreview} controls className="w-full h-auto max-h-[500px] object-contain mx-auto" />
                  )}
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                onChange={handleFileChange}
                accept={activeType === ContentType.IMAGE ? "image/*" : "video/*"}
              />
            </div>
          )}

          {error && (
            <div className="mt-8 p-5 bg-red-50 border border-red-100 rounded-3xl flex items-center space-x-4 text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={24} />
              <p className="text-sm font-bold">{error}</p>
            </div>
          )}

          <div className="mt-10">
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !isLoggedIn}
              className={`w-full py-5 rounded-[24px] font-black text-lg flex items-center justify-center space-x-3 shadow-2xl transition-all ${
                isAnalyzing ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-[0.98] disabled:bg-slate-300 disabled:shadow-none'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  <span>Deep Scanning Content...</span>
                </>
              ) : (
                <>
                  <span>Initialize AI Verification</span>
                  <ArrowRight size={22} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify;
