import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Layout/Header";
import { MainDashboard } from "@/components/Dashboard/MainDashboard";
import { SpeechTherapy } from "@/components/Speech/SpeechTherapy";
import { EmotionTracking } from "@/components/Emotion/EmotionTracking";
import { EmergencyAlert } from "@/components/Emergency/EmergencyAlert";
import { QuickPhrases } from "@/components/QuickPhrases/QuickPhrases";
import { LanguageProvider } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

type ActiveModule = 'dashboard' | 'speech' | 'emotion' | 'emergency' | 'phrases';

const Index = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleNavigate = (module: string) => {
    setActiveModule(module as ActiveModule);
  };

  const handleBack = () => {
    setActiveModule('dashboard');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/auth');
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'speech':
        return <SpeechTherapy onBack={handleBack} />;
      case 'emotion':
        return <EmotionTracking onBack={handleBack} />;
      case 'emergency':
        return <EmergencyAlert onBack={handleBack} />;
      case 'phrases':
        return <QuickPhrases onBack={handleBack} />;
      default:
        return <MainDashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        {activeModule === 'dashboard' && (
          <Header 
            user={user}
            onSignOut={handleSignOut}
            onSignIn={() => navigate('/auth')}
          />
        )}
        {renderActiveModule()}
      </div>
    </LanguageProvider>
  );
};

export default Index;
