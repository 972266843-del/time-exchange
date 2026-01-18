
import React, { useState } from 'react';
import Logo from '../components/Logo';
import { getAIClient } from '../lib/gemini';
import { User } from '../types';

interface OnboardingScreenProps {
  onComplete: (user: User) => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [identity, setIdentity] = useState<User | null>(null);

  const getNextMessengerId = (): string => {
    const lastCount = localStorage.getItem('global_messenger_count');
    const nextCount = lastCount ? parseInt(lastCount) + 1 : 1;
    localStorage.setItem('global_messenger_count', nextCount.toString());
    // 格式化为 4 位数字，如 0001
    return nextCount.toString().padStart(4, '0');
  };

  const handleGenerateIdentity = async () => {
    if (!input.trim()) return;
    setIsGenerating(true);
    
    try {
      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `用户此刻的心境：“${input}”。请为该用户生成一个独特的“时间使者”身份。
        要求返回 JSON 格式：
        {
          "title": "一个诗意的头衔，如'落日余晖的捕捉者'",
          "mantra": "一句关于时间的格言，不超过15个字"
        }`,
        config: { responseMimeType: "application/json" }
      });
      
      let data = { title: '', mantra: '' };
      try {
        const text = response.text || '{}';
        const cleanJson = text.replace(/```json|```/g, '').trim();
        data = JSON.parse(cleanJson);
      } catch (parseError) {
        console.error("JSON Parse error", parseError);
      }

      const newUser: User = {
        id: getNextMessengerId(), // 使用递增自然数
        title: data.title || '无名使者',
        mantra: data.mantra || '时间如水，静默流淌。',
        avatarSeed: Math.random().toString()
      };
      
      setIdentity(newUser);
    } catch (e) {
      console.error("Identity generation failed", e);
      setIdentity({
        id: getNextMessengerId(),
        title: '静默的观察者',
        mantra: '在喧嚣中寻找片刻宁静。',
        avatarSeed: '1'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (identity) {
    return (
      <div className="h-screen bg-brand-beige flex flex-col items-center justify-center px-10 text-center space-y-12 animate-in fade-in zoom-in-95 duration-1000">
        <Logo size="lg" />
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-brand-green text-[10px] font-medium tracking-[0.4em] uppercase">你是第 {identity.id} 位时间使者</p>
            <h2 className="text-primary-taupe text-2xl font-light tracking-wider">{identity.title}</h2>
          </div>
          <p className="text-primary-taupe/60 italic text-[15px] font-light">“{identity.mantra}”</p>
        </div>
        <button 
          onClick={() => onComplete(identity)}
          className="px-12 py-4 bg-brand-tea text-white rounded-full text-[13px] tracking-[0.3em] uppercase shadow-lg shadow-brand-tea/20 active:scale-95 transition-all"
        >
          进入时间大厅
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen bg-natural-bg flex flex-col px-8 py-16 animate-in fade-in duration-700">
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <Logo size="md" />
        <div className="text-center space-y-4">
          <h1 className="text-primary-taupe text-2xl font-light tracking-tight">欢迎来到时间交换</h1>
          <p className="text-primary-taupe/50 text-[13px] leading-relaxed max-w-[240px] mx-auto">
            这里没有账号，只有当下。<br/>告诉我们，你此刻的感受是什么？
          </p>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-soft">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-transparent border-none focus:ring-0 text-[15px] p-0 min-h-[100px] placeholder:text-primary-taupe/20"
              placeholder="如：有点焦虑，但窗外的阳光很好。"
            />
          </div>
          
          <button 
            disabled={!input.trim() || isGenerating}
            onClick={handleGenerateIdentity}
            className={`w-full py-5 rounded-full text-[13px] tracking-[0.3em] font-medium transition-all flex items-center justify-center gap-3 ${
              input.trim() && !isGenerating 
              ? 'bg-brand-green text-white shadow-lg shadow-brand-green/20 active:scale-[0.98]' 
              : 'bg-primary-taupe/5 text-primary-taupe/20'
            }`}
          >
            {isGenerating ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">progress_activity</span>
                生成身份中...
              </>
            ) : (
              '开启这段时间'
            )}
          </button>
        </div>
      </div>
      
      <footer className="text-center">
        <p className="text-[10px] text-primary-taupe/30 tracking-[0.2em] uppercase">An anonymous space for mindful living</p>
      </footer>
    </div>
  );
};

export default OnboardingScreen;
