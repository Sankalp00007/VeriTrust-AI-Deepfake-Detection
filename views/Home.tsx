
import React from 'react';
import { ShieldCheck, ArrowRight, Zap, Eye, BarChart3 } from 'lucide-react';

interface HomeProps {
  onStart: () => void;
}

const Home: React.FC<HomeProps> = ({ onStart }) => {
  return (
    <div className="space-y-16 py-8">
      <section className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm border border-blue-100 mb-4 animate-pulse">
          <Zap size={16} className="mr-2" />
          Powered by Gemini 3.0 Multimodal Reasoning
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
          Trust, but <span className="text-blue-600">Verify</span>.
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Advanced AI digital forensics for detecting deepfakes, text manipulation, and online misinformation. Protect your truth with explainable AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
          <button 
            onClick={onStart}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200/50 flex items-center justify-center group"
          >
            Start Analyzing
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
            Learn How it Works
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <ShieldCheck className="text-blue-600" size={32} />, title: "Deepfake Detection", desc: "Our multimodal engine identifies inconsistencies in human speech, movement, and pixel patterns." },
          { icon: <Eye className="text-indigo-600" size={32} />, title: "Explainable AI", desc: "No black boxes. Get a detailed breakdown of why content was flagged with evidence-based reasoning." },
          { icon: <BarChart3 className="text-emerald-600" size={32} />, title: "Confidence Scoring", desc: "Probabilistic assessments from 0-100% to help you gauge risk level effectively." }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-4 bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center">{feature.icon}</div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
            <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>

      <section className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4">Responsible AI Commitment</h2>
          <p className="text-slate-300 mb-6 text-lg">
            We don't censor content. Our mission is to provide you with the tools to verify information for yourself. We empower humans to make the final decision.
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex flex-col">
              <span className="text-2xl font-bold">99.8%</span>
              <span className="text-slate-400 text-sm">Model Uptime</span>
            </div>
            <div className="h-10 w-px bg-slate-700"></div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">0ms</span>
              <span className="text-slate-400 text-sm">Data Retention</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-16 -mt-16 bg-blue-600 w-64 h-64 rounded-full blur-3xl opacity-20"></div>
      </section>
    </div>
  );
};

export default Home;
