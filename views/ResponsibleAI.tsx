
import React from 'react';
import { Scale, Heart, Shield, UserCheck, Code2, Sparkles } from 'lucide-react';

const ResponsibleAI: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="bg-blue-900 text-white p-12 rounded-[40px] relative overflow-hidden text-center space-y-4">
        <h2 className="text-4xl font-black relative z-10">Our AI Constitution</h2>
        <p className="text-blue-100 text-lg relative z-10 max-w-2xl mx-auto">
          Technology should empower, not control. We build with transparency, ethics, and privacy at the foundation.
        </p>
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-600/30 rounded-full blur-3xl"></div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { icon: <Scale className="text-blue-500" />, title: "No Censorship", desc: "We provide analysis, not blockades. Users are given evidence to make their own informed decisions about what to read or share." },
          { icon: <UserCheck className="text-emerald-500" />, title: "Human-in-the-Loop", desc: "Our AI is an assistant, not a judge. We prioritize human intuition and provide clear explainability for every flag." },
          { icon: <Shield className="text-purple-500" />, title: "Privacy First", desc: "Your data is not our product. We process content in transient memory and never train our models on private user uploads." },
          { icon: <Code2 className="text-amber-500" />, title: "Bias Awareness", desc: "We actively audit our models to reduce algorithmic bias against specific dialects, cultures, or viewpoints." }
        ].map((principle, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="p-3 bg-slate-50 w-fit rounded-2xl">{principle.icon}</div>
            <h3 className="text-xl font-bold text-slate-800">{principle.title}</h3>
            <p className="text-slate-600 leading-relaxed text-sm">{principle.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <Heart className="text-red-500 fill-red-500" />
          <h3 className="text-2xl font-bold text-slate-800">Transparency Disclosure</h3>
        </div>
        <div className="prose prose-slate max-w-none text-slate-600 space-y-4">
          <p>
            VeriTrust uses <strong>Gemini 3.0 Multimodal</strong> as its primary reasoning engine. While highly accurate, LLMs can occasionally experience hallucinations or fail to detect state-of-the-art obfuscation.
          </p>
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-sm">
            <p className="font-bold text-slate-800 mb-2">Key Limitations:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Low-resolution media may yield lower confidence scores.</li>
              <li>Highly context-dependent satire may occasionally be flagged as misinformation.</li>
              <li>New deepfake techniques (Zero-day) may take a few hours/days for model adjustment.</li>
            </ul>
          </div>
          <p>
            By using this tool, you acknowledge that the final responsibility for sharing or believing content rests with you. We are here to support your critical thinking, not replace it.
          </p>
        </div>
      </div>

      <section className="text-center space-y-6 py-8">
        <h3 className="text-2xl font-bold text-slate-800">Future Roadmap</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Browser Extension", icon: <Sparkles size={16} /> },
            { label: "API for Media", icon: <Sparkles size={16} /> },
            { label: "Multilingual Support", icon: <Sparkles size={16} /> },
            { label: "Real-time Scanning", icon: <Sparkles size={16} /> }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-slate-500">
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResponsibleAI;
