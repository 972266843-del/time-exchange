
import React, { useState, useEffect } from 'react';
import { Screen, Moment, User } from './types';
import FeedScreen from './screens/FeedScreen';
import PostScreen from './screens/PostScreen';
import InterruptScreen from './screens/InterruptScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import ProfileScreen from './screens/ProfileScreen';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.ONBOARDING);
  const [witnessedCount, setWitnessedCount] = useState(0);
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null);

  // Check local storage for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('time_exchange_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentScreen(Screen.FEED);
    }
  }, []);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleOnboardingComplete = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('time_exchange_user', JSON.stringify(newUser));
    navigateTo(Screen.FEED);
  };

  const handleLogout = () => {
    if (confirm('注销将永久丢失当前的使者身份，确定吗？')) {
      localStorage.removeItem('time_exchange_user');
      setUser(null);
      navigateTo(Screen.ONBOARDING);
    }
  };

  const handleWatchMoment = (moment: Moment) => {
    setSelectedMoment(moment);
    navigateTo(Screen.FEEDBACK);
  };

  const handleFeedbackSubmit = () => {
    const newCount = witnessedCount + 1;
    setWitnessedCount(newCount);
    
    if (newCount > 0 && newCount % 3 === 0) {
      navigateTo(Screen.INTERRUPT);
    } else {
      navigateTo(Screen.FEED);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.ONBOARDING:
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case Screen.FEED:
        return (
          <FeedScreen 
            onPost={() => navigateTo(Screen.POST)} 
            onWatch={handleWatchMoment}
            onNavigate={navigateTo}
          />
        );
      case Screen.POST:
        return <PostScreen onClose={() => navigateTo(Screen.FEED)} />;
      case Screen.INTERRUPT:
        return (
          <InterruptScreen 
            count={witnessedCount} 
            onContinue={() => navigateTo(Screen.FEED)}
            onAction={() => {
                setWitnessedCount(0);
                navigateTo(Screen.FEED);
            }}
          />
        );
      case Screen.FEEDBACK:
        return (
          <FeedbackScreen 
            onClose={() => navigateTo(Screen.FEED)} 
            onSubmit={handleFeedbackSubmit}
          />
        );
      case Screen.PROFILE:
        return (
          <ProfileScreen 
            user={user} 
            onClose={() => navigateTo(Screen.FEED)} 
            onLogout={handleLogout}
          />
        );
      default:
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }
  };

  return (
    <div className="flex justify-center bg-[#F0F0EB] min-h-screen selection:bg-brand-green/20">
      <div className="w-full max-w-[480px] bg-natural-bg min-h-screen relative shadow-2xl overflow-hidden ring-1 ring-black/5">
        <div className="h-full w-full">
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

export default App;
