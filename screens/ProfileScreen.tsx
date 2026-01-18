
import React, { useState, useEffect } from 'react';
import Logo from '../components/Logo';
import { User } from '../types';

interface ProfileScreenProps {
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onClose, onLogout }) => {
  const [showPoster, setShowPoster] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // 自动抓取当前环境地址
    let current = window.location.href;
    // 如果是临时环境，预设一个占位符提醒用户
    if (current.startsWith('blob:') || current.includes('localhost') || current.includes('usercontent.goog')) {
      setCustomUrl(current); 
    } else {
      setCustomUrl(current); // 已经是公网地址
    }
  }, []);

  if (!user) return null;

  // 环境检测逻辑
  const isLocal = customUrl.startsWith('blob:') || customUrl.includes('localhost') || customUrl.includes('127.0.0.1');
  const isSandbox = customUrl.includes('usercontent.goog') || customUrl.includes('aistudio.google.com');
  const isNotLive = isLocal || isSandbox;

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(customUrl)}&bgcolor=FFFFFF&color=1A1A1A&margin=2`;

  const copyToClipboard = async () => {
    try {
      await window.navigator.clipboard.writeText(customUrl);
      alert('分享链接已复制');
    } catch (err) {
      alert('复制失败');
    }
  };

  return (
    <div className="h-screen bg-brand-beige flex flex-col animate-in fade-in slide-in-from-right-4 duration-500 overflow-hidden relative">
      <header className="p-8 flex justify-between items-center z-10 shrink-0">
        <button onClick={onClose} className="size-10 flex items-center justify-center rounded-full hover:bg-black/5">
          <span className="material-symbols-outlined text-2xl opacity-40">arrow_back</span>
        </button>
        <div className="flex flex-col items-center">
            <span className="text-[11px] font-medium tracking-[0.3em] text-primary-taupe/40 uppercase">Messenger Identity</span>
            {!isNotLive && (
                <div className="flex items-center gap-1 mt-1">
                    <span className="size-1.5 bg-brand-green rounded-full animate-pulse"></span>
                    <span className="text-[8px] text-brand-green font-bold tracking-widest uppercase">Live on Web</span>
                </div>
            )}
        </div>
        <div className="size-10"></div>
      </header>

      <main className="flex-1 px-8 flex flex-col items-center justify-center pb-20 z-10 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-xs relative group">
          <div className="absolute inset-0 bg-brand-green/10 blur-3xl rounded-[2.5rem] opacity-50"></div>
          
          <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 shadow-card flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <div className="size-20 rounded-full bg-brand-tea/10 flex items-center justify-center border border-brand-tea/20">
                <span className="material-symbols-outlined text-4xl text-brand-green/80">face_retouching_natural</span>
              </div>
              <div className="absolute -bottom-1 -right-1 size-6 bg-brand-green rounded-full border-4 border-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[10px] text-white">verified</span>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-primary-taupe text-2xl font-light tracking-wide">{user.title}</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="w-4 h-[1px] bg-brand-tea/30"></span>
                <p className="text-brand-green text-[10px] font-bold tracking-[0.2em] uppercase">Messenger</p>
                <span className="w-4 h-[1px] bg-brand-tea/30"></span>
              </div>
            </div>

            <p className="text-primary-taupe/60 italic text-[15px] font-light leading-relaxed px-2">
              “{user.mantra}”
            </p>

            <div className="pt-4 w-full">
              <div className="bg-brand-beige/50 rounded-2xl py-3 px-4 flex items-center justify-between">
                <span className="text-[9px] text-primary-taupe/40 uppercase tracking-widest font-bold">Messenger No.</span>
                <span className="text-[10px] text-primary-taupe/60 font-mono">#{user.id}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 w-full max-w-xs space-y-4">
          <button 
            onClick={() => setShowPoster(true)}
            className="w-full py-5 bg-brand-tea text-white rounded-full text-[13px] tracking-[0.3em] font-medium flex items-center justify-center gap-3 shadow-lg shadow-brand-tea/20 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-lg">qr_code_2</span>
            生成分享名片
          </button>
          
          {isNotLive && (
            <button 
              onClick={() => setShowGuide(true)}
              className="w-full py-4 bg-white/60 text-brand-green rounded-full text-[11px] tracking-[0.2em] uppercase font-bold border border-brand-green/20"
            >
              如何部署到公网？
            </button>
          )}

          <button 
            onClick={onLogout}
            className="w-full py-5 text-primary-taupe/30 text-[11px] tracking-[0.2em] uppercase hover:text-red-300 transition-colors"
          >
            注销并重置身份
          </button>
        </div>
      </main>

      {/* Share Poster Modal */}
      {showPoster && (
        <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-brand-beige rounded-[3rem] p-6 flex flex-col items-center space-y-6 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 overflow-y-auto max-h-[95vh] no-scrollbar">
            
            <div className="w-full flex justify-between items-center px-2 shrink-0">
              <div className="flex flex-col">
                <Logo size="sm" />
                <p className="text-[8px] tracking-[0.4em] text-brand-green font-bold uppercase mt-1">TIME EXCHANGE</p>
              </div>
              <button onClick={() => setShowPoster(false)} className="size-10 bg-black/5 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-lg opacity-40">close</span>
              </button>
            </div>

            <div className="bg-white p-6 rounded-[2.5rem] shadow-xl w-full flex flex-col items-center space-y-5 border border-white relative overflow-hidden shrink-0">
              <div className="text-center space-y-1">
                <h4 className="text-primary-taupe text-lg font-medium">{user.title}</h4>
                <p className="text-[10px] text-primary-taupe/40 font-mono uppercase tracking-widest">Messenger NO. {user.id}</p>
              </div>
              
              <div className="w-full aspect-square bg-white rounded-3xl flex items-center justify-center p-2 border-4 border-brand-beige relative overflow-hidden">
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code" 
                  className={`w-full h-full object-contain transition-all ${isNotLive && !isEditingUrl ? 'opacity-20 blur-[2px]' : 'opacity-100'}`} 
                />
                
                {isNotLive && !isEditingUrl && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4 bg-white/40">
                    <span className="material-symbols-outlined text-3xl text-brand-green">language_off</span>
                    <p className="text-[10px] text-primary-taupe font-bold uppercase tracking-wider">
                      当前处于本地环境<br/>
                      <span className="text-brand-green">二维码仅供你自己预览</span>
                    </p>
                    <button 
                      onClick={() => setIsEditingUrl(true)}
                      className="px-5 py-2 bg-brand-green text-white rounded-full text-[9px] font-bold uppercase tracking-widest shadow-lg"
                    >
                      手动填入公网域名
                    </button>
                  </div>
                )}

                {isEditingUrl && (
                  <div className="absolute inset-0 bg-white/98 p-6 flex flex-col items-center justify-center gap-4 animate-in zoom-in-95">
                    <p className="text-[10px] font-bold text-primary-taupe/60 uppercase tracking-widest text-center">将部署后的域名贴在这里</p>
                    <input 
                      autoFocus
                      type="text" 
                      value={customUrl} 
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="w-full bg-brand-beige border-none rounded-xl text-[12px] p-4 text-primary-taupe text-center font-mono"
                      placeholder="https://..."
                    />
                    <button 
                      onClick={() => setIsEditingUrl(false)}
                      className="w-full py-3 bg-brand-green text-white rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md"
                    >
                      生成异地可用二维码
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full space-y-3 text-center">
                <p className="text-[13px] text-primary-taupe/80 italic px-4 leading-relaxed font-light">
                  “{user.mantra}”
                </p>
              </div>
            </div>

            {/* Deploy Helper Section */}
            <div className="w-full bg-brand-green/10 border border-brand-green/20 rounded-[2rem] p-5 space-y-4 shrink-0">
               <div className="flex gap-3">
                  <span className="material-symbols-outlined text-brand-green">rocket_launch</span>
                  <div className="space-y-1">
                    <p className="text-[11px] text-primary-taupe font-bold uppercase tracking-wider">
                        {isNotLive ? "想要异地分享？" : "你的交换大厅已上线"}
                    </p>
                    <p className="text-[10px] text-primary-taupe/70 leading-relaxed">
                      {isNotLive 
                        ? "你需要将代码部署到 Vercel。部署后，这里的二维码将自动变成全球通用地址。" 
                        : "现在你可以将此名片发送给任何人，他们扫码即可进入你的时间池。"}
                    </p>
                  </div>
               </div>
               <div className="flex gap-2">
                 <button onClick={copyToClipboard} className="flex-1 py-3 bg-brand-green text-white rounded-full text-[10px] uppercase font-bold tracking-widest shadow-sm">复制链接</button>
                 {isNotLive && (
                    <button onClick={() => setShowGuide(true)} className="flex-1 py-3 bg-white text-brand-green rounded-full text-[10px] uppercase font-bold tracking-widest border border-brand-green/20">部署教程</button>
                 )}
               </div>
            </div>

            <button onClick={() => setShowPoster(false)} className="w-full py-4 bg-primary-taupe text-white rounded-full text-[11px] tracking-widest uppercase font-bold">返回</button>
          </div>
        </div>
      )}

      {/* Deployment Guide Modal */}
      {showGuide && (
        <div className="absolute inset-0 z-[60] bg-brand-beige flex flex-col p-8 animate-in slide-in-from-bottom duration-500">
            <header className="flex justify-between items-center mb-10">
                <h3 className="text-primary-taupe font-bold tracking-widest uppercase text-sm">公网部署指引</h3>
                <button onClick={() => setShowGuide(false)} className="size-10 bg-black/5 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-lg opacity-40">close</span>
                </button>
            </header>
            <div className="flex-1 space-y-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="size-6 bg-brand-green text-white rounded-full flex items-center justify-center text-[10px] font-bold">1</span>
                        <p className="text-[13px] font-bold text-primary-taupe">下载代码包</p>
                    </div>
                    <p className="text-[11px] text-primary-taupe/60 pl-9 leading-relaxed">点击当前页面的“下载”或“导出”按钮，获取所有源文件（index.html, App.tsx 等）。</p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="size-6 bg-brand-green text-white rounded-full flex items-center justify-center text-[10px] font-bold">2</span>
                        <p className="text-[13px] font-bold text-primary-taupe">上传至 GitHub</p>
                    </div>
                    <p className="text-[11px] text-primary-taupe/60 pl-9 leading-relaxed">在 GitHub 创建新项目并上传文件。GitHub 是你的“代码仓库”。</p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="size-6 bg-brand-green text-white rounded-full flex items-center justify-center text-[10px] font-bold">3</span>
                        <p className="text-[13px] font-bold text-primary-taupe">关联 Vercel</p>
                    </div>
                    <p className="text-[11px] text-primary-taupe/60 pl-9 leading-relaxed">登录 Vercel.com，点击 "Add New Project"，选择你的 GitHub 项目。它会自动生成一个公网域名。</p>
                </div>
                <div className="bg-brand-green/5 p-6 rounded-3xl border border-brand-green/10">
                    <p className="text-[11px] text-brand-green font-medium leading-relaxed">
                        🌟 部署完成后，通过 Vercel 给你的链接打开应用。那时，你的分享名片里的二维码将自动生效，全国各地的朋友都能扫码进入。
                    </p>
                </div>
            </div>
            <button onClick={() => setShowGuide(false)} className="w-full py-5 bg-brand-tea text-white rounded-full font-bold uppercase tracking-widest text-[12px] shadow-xl">我明白了</button>
        </div>
      )}
      
      <footer className="p-10 text-center relative z-10 shrink-0">
         <p className="text-[10px] text-primary-taupe/30 tracking-[0.4em] uppercase">Built for Mindful Moments</p>
      </footer>
    </div>
  );
};

export default ProfileScreen;
