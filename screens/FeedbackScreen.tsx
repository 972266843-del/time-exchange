
import React from 'react';
import { FeedbackOption } from '../types';

interface FeedbackScreenProps {
  onClose: () => void;
  onSubmit: () => void;
}

const FEEDBACK_OPTIONS: FeedbackOption[] = [
  { id: '1', icon: 'air', label: '唤醒了某些时刻' },
  { id: '2', icon: 'fiber_manual_record', label: '感受到一种陪伴' },
  { id: '3', icon: 'footprint', label: '只是路过这段时间' },
  { id: '4', icon: 'directions_run', label: '我也想去使用时间了', isAction: true },
];

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ onClose, onSubmit }) => {
  return (
    <div className="min-h-screen bg-natural-bg text-text-main flex flex-col relative overflow-hidden animate-in fade-in duration-700">
      {/* Background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-20%] w-[300px] h-[300px] bg-brand-green/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-5%] left-[-10%] w-[250px] h-[250px] bg-white rounded-full blur-[80px]"></div>
      </div>

      <header className="flex items-center p-8 justify-between">
        <button 
          onClick={onClose}
          className="size-10 flex items-center justify-start opacity-30 active:opacity-100 transition-opacity"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
        <h2 className="text-text-light/50 text-[11px] font-medium tracking-[0.3em] uppercase">Feedback</h2>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 flex flex-col px-8 pb-16">
        <div className="mt-10 mb-14 text-center">
          <p className="text-brand-green/60 text-[11px] tracking-[0.4em] mb-5 font-medium uppercase">时间使者</p>
          <h3 className="text-text-main text-[22px] font-light leading-[1.8] tracking-[0.05em]">
            你正在见证另一位<br/>
            时间使者的 <span className="font-normal border-b-[0.5px] border-brand-green/40">10 分钟</span>
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {FEEDBACK_OPTIONS.map((option) => (
            <button 
              key={option.id}
              onClick={onSubmit}
              className={`flex items-center gap-5 rounded-3xl p-6 text-left shadow-soft border transition-all active:scale-[0.98] ${
                option.isAction 
                  ? 'bg-brand-green/10 border-brand-green/20 mt-4' 
                  : 'bg-white/70 backdrop-blur-md border-white/50 hover:bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                option.isAction ? 'bg-brand-green/20' : 'bg-natural-bg'
              }`}>
                <span className={`material-symbols-outlined text-[22px] ${
                  option.isAction ? 'text-brand-green' : 'text-brand-green/70'
                }`}>
                  {option.icon}
                </span>
              </div>
              <p className={`text-text-main text-[15px] tracking-[0.1em] ${option.isAction ? 'font-medium' : 'font-light'}`}>
                {option.label}
              </p>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-12">
          <p className="text-text-light/40 text-[10px] font-light tracking-[0.2em] text-center uppercase leading-loose">
            选择任一反馈，回到你的现实世界<br/>
            Return to your own journey
          </p>
        </div>
      </main>

      <footer className="pb-3 flex justify-center">
        <div className="w-32 h-1 bg-text-main/5 rounded-full"></div>
      </footer>
    </div>
  );
};

export default FeedbackScreen;
