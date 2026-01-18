
import React, { useState, useEffect } from 'react';
import { FeedTab, Moment, Screen } from '../types';
import { generateComicScenario, generateComicImage } from '../lib/gemini';
import Logo from '../components/Logo';

interface FeedScreenProps {
  onPost: () => void;
  onWatch: (moment: Moment) => void;
  onNavigate: (screen: Screen) => void;
}

const MOCK_MOMENTS: Moment[] = [
  {
    id: '0001',
    author: '时间使者 #0001',
    avatar: 'https://picsum.photos/seed/user1/100/100',
    location: '1.2km away',
    contentUrl: 'https://picsum.photos/seed/moment1/600/800',
    description: '午后茶歇，看茶叶在杯中舒展。',
    timestamp: '10:00',
    type: 'video'
  },
  {
    id: '0042',
    author: '时间使者 #0042',
    avatar: 'https://picsum.photos/seed/user2/100/100',
    location: '0.5km away',
    contentUrl: 'https://picsum.photos/seed/moment2/600/800',
    description: '窗边的一束阳光，落在老旧的书脊上。',
    timestamp: '05:23',
    type: 'image'
  }
];

const FeedScreen: React.FC<FeedScreenProps> = ({ onPost, onWatch, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<FeedTab>(FeedTab.REAL_TIME);
  const [comicData, setComicData] = useState<{ image: string, text: string } | null>(null);
  const [loadingComic, setLoadingComic] = useState(false);

  useEffect(() => {
    if (activeTab === FeedTab.OFFICIAL_COMIC && !comicData) {
      loadComic();
    }
  }, [activeTab]);

  const loadComic = async () => {
    setLoadingComic(true);
    try {
      const text = await generateComicScenario("一场突如其来的阵雨，人们在街角屋檐下静静等待。");
      const image = await generateComicImage(text || "雨后初晴的街道");
      if (image && text) {
        setComicData({ image, text });
      }
    } catch (e) {
      console.error("AI Generation failed", e);
    } finally {
      setLoadingComic(false);
    }
  };

  const handleNextMoment = () => {
    const randomMoment = MOCK_MOMENTS[Math.floor(Math.random() * MOCK_MOMENTS.length)];
    onWatch(randomMoment);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center p-6 justify-between z-10 shrink-0 bg-natural-bg/80 backdrop-blur-md">
        <button 
          onClick={() => onNavigate(Screen.PROFILE)}
          className="flex items-center gap-3 active:scale-95 transition-transform"
        >
          <Logo size="sm" />
          <span className="text-[11px] font-semibold tracking-[0.3em] text-primary-taupe/40 uppercase">My Identity</span>
        </button>
        <div className="flex items-center gap-2">
          <button 
            onClick={onPost}
            className="flex cursor-pointer items-center justify-center rounded-full h-10 w-10 text-primary-taupe/80 hover:bg-white/40 transition-colors"
          >
            <span className="material-symbols-outlined text-[26px]">add_circle</span>
          </button>
        </div>
      </header>

      <nav className="z-10 px-4 shrink-0">
        <div className="flex gap-10 justify-center border-b border-primary-taupe/10">
          <button 
            onClick={() => setActiveTab(FeedTab.REAL_TIME)}
            className={`flex flex-col items-center justify-center pb-3 pt-2 transition-all border-b-[1.5px] ${activeTab === FeedTab.REAL_TIME ? 'border-primary-taupe text-primary-taupe' : 'border-transparent text-primary-taupe/40'}`}
          >
            <p className="text-[15px] font-semibold">真实时间</p>
          </button>
          <button 
            onClick={() => setActiveTab(FeedTab.OFFICIAL_COMIC)}
            className={`flex flex-col items-center justify-center pb-3 pt-2 transition-all border-b-[1.5px] ${activeTab === FeedTab.OFFICIAL_COMIC ? 'border-primary-taupe text-primary-taupe' : 'border-transparent text-primary-taupe/40'}`}
          >
            <p className="text-[15px] font-medium">官方漫剧</p>
          </button>
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto px-8 py-6 space-y-8 no-scrollbar pb-24">
        {activeTab === FeedTab.REAL_TIME ? (
          <>
            <div className="glass-effect py-6 px-7 rounded-lg text-center border border-white/60 shadow-soft">
              <h3 className="text-primary-taupe/90 text-[14px] font-medium leading-relaxed">
                这里不是让你刷的，<br/><span className="text-brand-green">是让你看看别人如何用 10 分钟的。</span>
              </h3>
            </div>

            {MOCK_MOMENTS.map((moment) => (
              <div key={moment.id} className="bg-natural-card rounded-xl shadow-card overflow-hidden flex flex-col border border-white/80 transition-transform active:scale-[0.98] cursor-pointer" onClick={() => onWatch(moment)}>
                <div className="flex items-center justify-between px-5 py-4 bg-white/40 border-b border-natural-bg/50">
                  <div className="flex items-center gap-3">
                    <img src={moment.avatar} className="rounded-full h-9 w-9 border border-natural-bg shadow-sm" alt={moment.author} />
                    <div className="flex flex-col">
                      <p className="text-primary-taupe text-[13px] font-semibold">{moment.author}</p>
                      <p className="text-primary-taupe/50 text-[10px] font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">location_on</span>
                        {moment.location}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="relative group aspect-[4/5] overflow-hidden">
                  <img 
                    src={moment.contentUrl} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    alt="Moment Content" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <button className="flex shrink-0 items-center justify-center rounded-full size-14 glass-effect text-primary-taupe/70 border border-white/40 transition-all shadow-lg">
                      <span className="material-symbols-outlined text-3xl">{moment.type === 'video' ? 'play_arrow' : 'visibility'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center text-center space-y-2 mb-4">
              <h4 className="text-primary-taupe text-lg font-semibold tracking-widest">AI 每日漫剧</h4>
              <p className="text-primary-taupe/40 text-[10px] uppercase tracking-widest">Selected from the exchange pool</p>
            </div>
            
            {loadingComic ? (
              <div className="aspect-[3/4] rounded-xl bg-primary-taupe/5 flex flex-col items-center justify-center border border-dashed border-primary-taupe/20 animate-pulse">
                <span className="material-symbols-outlined text-4xl text-primary-taupe/20 animate-spin">auto_awesome</span>
                <p className="mt-4 text-[12px] text-primary-taupe/40">AI 正在捕捉这一刻的诗意...</p>
              </div>
            ) : comicData ? (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <div className="rounded-xl overflow-hidden shadow-card border border-white/60">
                  <img src={comicData.image} className="w-full aspect-[3/4] object-cover" alt="Comic Scene" />
                </div>
                <div className="px-4 text-center">
                  <p className="text-primary-taupe/80 text-[15px] leading-relaxed italic font-light">
                    “{comicData.text}”
                  </p>
                  <button onClick={loadComic} className="mt-8 text-[11px] text-primary-taupe/40 uppercase tracking-[0.3em] flex items-center justify-center gap-2 mx-auto">
                    <span className="material-symbols-outlined text-sm">refresh</span>
                    换一段时光
                  </button>
                </div>
              </div>
            ) : (
                <div className="p-12 text-center text-primary-taupe/40">加载失败，请重试</div>
            )}
          </div>
        )}

        <button 
          onClick={handleNextMoment}
          className="w-full flex flex-col items-center py-12 group active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/60 border border-white/80 shadow-soft group-hover:bg-white transition-colors">
            <span className="material-symbols-outlined text-primary-taupe/60 text-xl group-hover:rotate-12 transition-transform">schedule</span>
            <span className="text-primary-taupe text-[17px] font-semibold tracking-widest uppercase">Next</span>
          </div>
          <p className="mt-4 text-primary-taupe/30 text-[9px] font-semibold tracking-[0.25em] uppercase">Exchange Another 10 Minutes</p>
        </button>
      </main>

      <div className="h-8 flex items-center justify-center pb-2 shrink-0 bg-natural-bg">
        <div className="w-16 h-1 bg-primary-taupe/10 rounded-full"></div>
      </div>
    </div>
  );
};

export default FeedScreen;
