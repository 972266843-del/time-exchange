
import React, { useState, useRef, useEffect } from 'react';
import { getAIClient } from '../lib/gemini';

interface PostScreenProps {
  onClose: () => void;
}

const PostScreen: React.FC<PostScreenProps> = ({ onClose }) => {
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isArchiving, setIsArchiving] = useState(false);
  const [aiReflection, setAiReflection] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' }, 
        audio: false 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsRecording(true);
    } catch (err) {
      console.error("Camera access denied", err);
      alert("请允许相机权限以记录这10分钟");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsRecording(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleArchive = async () => {
    stopCamera();
    setIsArchiving(true);
    try {
      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `你是一个温柔的观察者。用户记录了这10分钟：${content}。请给出一个极简、诗意的回应（不超过15个字），作为这段时间的结语。`,
      });
      setAiReflection(response.text || "时间流逝，痕迹永存。");
      
      setTimeout(() => {
        setIsArchiving(false);
        setTimeout(() => onClose(), 3500);
      }, 1000);
    } catch (e) {
      console.error(e);
      setIsArchiving(false);
      onClose();
    }
  };

  if (isArchiving || aiReflection) {
    return (
      <div className="h-screen bg-brand-beige flex flex-col items-center justify-center px-10 text-center space-y-8 animate-in fade-in duration-500">
        <div className="relative">
          <div className="size-24 rounded-full border border-brand-tea flex items-center justify-center animate-hourglass">
             <span className="material-symbols-outlined text-4xl text-brand-green">hourglass_empty</span>
          </div>
          <div className="absolute inset-0 bg-brand-green/10 blur-2xl animate-pulse rounded-full"></div>
        </div>
        
        {isArchiving ? (
          <div className="space-y-4">
            <h3 className="text-primary-taupe text-lg font-medium tracking-widest">AI 正在见证你的这段时间...</h3>
            <p className="text-primary-taupe/40 text-[11px] uppercase tracking-[0.3em]">Extracting the essence of 10 minutes</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-xs animate-in zoom-in-95 duration-700">
             <div className="w-8 h-[1px] bg-brand-tea/40 mx-auto"></div>
             <p className="text-primary-taupe italic text-[17px] leading-relaxed font-light">
               “{aiReflection}”
             </p>
             <div className="w-8 h-[1px] bg-brand-tea/40 mx-auto"></div>
             <p className="text-brand-green text-[10px] font-medium tracking-[0.4em] uppercase">已成功封存入交换池</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans selection:bg-brand-tea/20">
      <header className="flex items-center justify-between px-6 pt-12 pb-6 sticky top-0 bg-white/80 backdrop-blur-md z-10 shrink-0">
        <button 
          onClick={onClose}
          className="flex items-center justify-center size-10 rounded-full hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined text-[22px] opacity-40">close</span>
        </button>
        <h1 className="text-[13px] font-medium tracking-[0.25em] text-slate-400 uppercase">封存这段 10 分钟</h1>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 flex flex-col px-7 max-w-md mx-auto w-full overflow-y-auto no-scrollbar pb-10">
        <div className="mt-4 relative">
          {isRecording ? (
            <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden bg-black relative group">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <div className="absolute inset-0 border-[10px] border-brand-tea/20 rounded-[2.5rem] pointer-events-none"></div>
              <button 
                onClick={stopCamera}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-[10px] tracking-widest uppercase border border-white/30"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="bg-brand-tea/10 rounded-[2.5rem] p-8 transition-all duration-500 border border-brand-tea/5">
              <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-transparent text-[15px] leading-[1.8] placeholder:text-slate-300 resize-none min-h-[200px] p-0 font-light tracking-wide border-none focus:ring-0" 
                placeholder="描述正在发生的 10 分钟，不需要总结，不需要好看。"
              />
            </div>
          )}
        </div>

        <div className="mt-12 flex items-center justify-center gap-12 shrink-0">
          <button onClick={startCamera} className="flex flex-col items-center gap-3 group">
            <div className="size-12 flex items-center justify-center group-active:scale-95 transition-transform">
              <span className={`material-symbols-outlined text-[28px] ${isRecording ? 'text-brand-green' : 'text-slate-300'} group-hover:text-brand-tea transition-colors`}>image</span>
            </div>
            <span className="text-[9px] tracking-[0.2em] text-slate-300 font-medium uppercase">Capture</span>
          </button>
          <button onClick={startCamera} className="flex flex-col items-center gap-3 group">
            <div className="size-12 flex items-center justify-center group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[28px] text-slate-300 group-hover:text-brand-tea transition-colors">videocam</span>
            </div>
            <span className="text-[9px] tracking-[0.2em] text-slate-300 font-medium uppercase">Video</span>
          </button>
          <button className="flex flex-col items-center gap-3 group">
            <div className="size-12 flex items-center justify-center group-active:scale-95 transition-transform">
              <span className="material-symbols-outlined text-[28px] text-slate-300 group-hover:text-brand-tea transition-colors">mic</span>
            </div>
            <span className="text-[9px] tracking-[0.2em] text-slate-300 font-medium uppercase">Audio</span>
          </button>
        </div>

        <div className="mt-14 space-y-7 px-2 shrink-0">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <span className="text-[11px] font-light tracking-wider text-slate-400">可见性</span>
            <div className="flex items-center gap-1 cursor-pointer group" onClick={() => setIsPublic(!isPublic)}>
              <span className="text-[11px] font-medium text-slate-500 group-hover:text-brand-tea transition-colors">
                {isPublic ? '公开' : '仅自己'}
              </span>
              <span className="material-symbols-outlined text-sm text-slate-400">expand_more</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="checkbox" 
              id="comic"
              className="h-4 w-4 rounded-full border-slate-200 text-brand-tea focus:ring-0"
              defaultChecked
            />
            <label htmlFor="comic" className="text-[10px] tracking-wide text-slate-300 leading-relaxed cursor-pointer">
              允许官方在未来将此瞬间改编为漫剧
            </label>
          </div>
        </div>
      </main>

      <footer className="mt-auto pb-12 pt-6 overflow-hidden shrink-0">
        <div className="w-full mb-12 overflow-hidden relative">
          <div className="animate-scroll text-[11px] font-light tracking-[0.5em] text-slate-200/60 uppercase italic">
            只是记录时间本身 &nbsp;&nbsp;&nbsp;&nbsp; JUST RECORD TIME ITSELF &nbsp;&nbsp;&nbsp;&nbsp; 只是记录时间本身
          </div>
        </div>
        <div className="px-8">
          <button 
            disabled={!content.trim() && !isRecording}
            onClick={handleArchive}
            className={`w-full text-white text-[13px] font-normal py-4 rounded-[2rem] transition-all active:scale-[0.97] tracking-[0.3em] shadow-sm ${content.trim() || isRecording ? 'bg-brand-tea shadow-brand-tea/20' : 'bg-slate-200'}`}
          >
            封存这 10 分钟
          </button>
          <p className="text-center text-[9px] text-slate-300 mt-8 tracking-[0.2em] uppercase opacity-50">
            Time will enter the exchange pool
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PostScreen;
