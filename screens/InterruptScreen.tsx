
import React from 'react';

interface InterruptScreenProps {
  count: number;
  onContinue: () => void;
  onAction: () => void;
}

const InterruptScreen: React.FC<InterruptScreenProps> = ({ count, onContinue, onAction }) => {
  return (
    <div className="bg-brand-beige h-screen relative flex flex-col justify-between px-10 py-16 text-text-main">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 opacity-20 filter blur-3xl pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-brand-tea rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-brand-tea rounded-full"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-2">
        <div className="w-12 h-1.5 bg-brand-tea rounded-full mb-8"></div>
        <span className="text-[10px] tracking-[0.3em] text-text-light font-medium uppercase">TIME EXCHANGE</span>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-16">
        <div className="space-y-5">
          <h2 className="text-[22px] font-medium tracking-tight leading-relaxed">
            你已经见证了 {count} 段<br/>他人的真实生活
          </h2>
          <p className="text-text-light text-[15px] font-normal tracking-wide">
            此刻，要不要回归自己的世界？
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="w-20 h-20 rounded-full border border-brand-tea flex items-center justify-center">
            <div className="animate-hourglass flex items-center justify-center text-brand-green">
              <span className="material-symbols-outlined text-[40px] font-extralight">hourglass_empty</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-brand-green/5 blur-3xl rounded-full scale-150"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-[280px] mx-auto space-y-4 mb-6">
        <button 
          onClick={onAction}
          className="w-full h-[58px] bg-brand-green/15 text-brand-green rounded-full font-medium text-[16px] tracking-wide active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">park</span>
          <span>我去做点什么</span>
        </button>
        
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onContinue}
            className="w-full h-[58px] bg-brand-tea/40 text-text-light rounded-full font-medium text-[16px] tracking-wide active:bg-brand-tea/60 transition-colors"
          >
            稍后再看
          </button>
          <p className="text-[12px] text-text-light/60 font-normal tracking-wider">
            今日余量：3 条
          </p>
        </div>
      </div>

      <div className="h-1.5 w-32 bg-brand-tea/50 rounded-full mx-auto"></div>
    </div>
  );
};

export default InterruptScreen;
