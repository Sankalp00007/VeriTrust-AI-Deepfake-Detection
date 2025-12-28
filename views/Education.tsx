
import React from 'react';
import { BookMarked, Eye, Brain, HelpCircle, ShieldAlert } from 'lucide-react';

const Education: React.FC = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-slate-800">Master Digital Truth</h2>
        <p className="text-xl text-slate-500">Learn to identify the subtle signs of manipulation in the digital age.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-2">
            <ShieldAlert size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">What are Deepfakes?</h3>
          <p className="text-slate-600 leading-relaxed">
            Deepfakes use Generative Adversarial Networks (GANs) to swap faces, alter speech, or create entirely synthetic videos of people saying or doing things they never did. They exploit our biological instinct to trust visual evidence.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-2">
            <Eye size={28} />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Visual Red Flags</h3>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-center gap-2">• Inconsistent lighting on facial features</li>
            <li className="flex items-center gap-2">• Unnatural eye blinking patterns</li>
            <li className="flex items-center gap-2">• Blurry borders around hair or clothing</li>
            <li className="flex items-center gap-2">• Mismatched audio and lip movements</li>
          </ul>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl p-10 text-white space-y-8">
        <h3 className="text-3xl font-bold flex items-center gap-3">
          <Brain className="text-blue-400" />
          The Psychology of Misinformation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Confirmation Bias", desc: "We tend to believe info that supports our existing worldview." },
            { title: "Echo Chambers", desc: "Algorithms feed us similar content, creating a false sense of consensus." },
            { title: "Emotional Triggers", desc: "Fake news often uses fear or anger to bypass critical thinking." }
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="font-bold text-lg text-blue-300">{item.title}</h4>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="text-emerald-500" />
          Manual Verification Checklist
        </h3>
        <div className="space-y-4">
          {[
            { step: "1", title: "Reverse Image Search", desc: "Use Google Lens or TinEye to see if the image appeared in another context." },
            { step: "2", title: "Check the Source", desc: "Is the URL legitimate? Look for small typos like 'bbc-news.co.co'." },
            { step: "3", title: "Wait and Corroborate", desc: "If it's breaking news, wait for reputable agencies (AP, Reuters) to confirm." }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <span className="bg-slate-100 text-slate-500 font-black w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">{item.step}</span>
              <div>
                <h4 className="font-bold text-slate-800">{item.title}</h4>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Education;
