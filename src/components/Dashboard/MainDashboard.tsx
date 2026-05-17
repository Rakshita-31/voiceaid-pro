import { Mic, Heart, AlertTriangle, MessageSquare, TrendingUp, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/hooks/useLanguage";
import heroImage from "@/assets/hero-image.jpg";
import speechIcon from "@/assets/speech-icon.jpg";
import emotionIcon from "@/assets/emotion-icon.jpg";
import emergencyIcon from "@/assets/emergency-icon.jpg";
import phrasesIcon from "@/assets/phrases-icon.jpg";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  progress?: number;
  buttonText: string;
  buttonVariant?: "default" | "secondary" | "destructive";
  onClick: () => void;
}

const ModuleCard = ({ 
  title, 
  description, 
  icon, 
  image, 
  progress, 
  buttonText, 
  buttonVariant = "default",
  onClick 
}: ModuleCardProps) => (
  <Card className="group hover:shadow-medium transition-all duration-300 border-2 hover:border-primary/20">
    <CardHeader className="pb-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img 
            src={image} 
            alt={title}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="absolute -bottom-1 -right-1 p-1 bg-primary rounded-full">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {progress !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      <Button 
        onClick={onClick}
        variant={buttonVariant}
        className="w-full text-base py-6 font-medium"
        size="lg"
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

interface DashboardProps {
  onNavigate: (module: string) => void;
}

export const MainDashboard = ({ onNavigate }: DashboardProps) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <img 
          src={heroImage} 
          alt="VoiceAid Pro - Empowering disabilities with technology"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {t('dashboard.welcome')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            {t('dashboard.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 font-medium px-8 py-6 text-lg"
              onClick={() => onNavigate('speech')}
            >
              {t('dashboard.startSpeech')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/10 font-medium px-8 py-6 text-lg"
              onClick={() => onNavigate('emergency')}
            >
              {t('dashboard.emergencySetup')}
            </Button>
          </div>
        </div>
      </section>

      {/* Main Modules */}
      <section className="container mx-auto px-4 py-12 bg-card">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">{t('dashboard.careModules')}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('dashboard.careDescription')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <ModuleCard
            title={t('module.speech.title')}
            description={t('module.speech.description')}
            icon={<Mic className="w-4 h-4 text-white" />}
            image={speechIcon}
            progress={65}
            buttonText={t('module.speech.button')}
            onClick={() => onNavigate('speech')}
          />

          <ModuleCard
            title={t('module.emotion.title')}
            description={t('module.emotion.description')}
            icon={<Heart className="w-4 h-4 text-white" />}
            image={emotionIcon}
            progress={40}
            buttonText={t('module.emotion.button')}
            buttonVariant="secondary"
            onClick={() => onNavigate('emotion')}
          />

          <ModuleCard
            title={t('module.phrases.title')}
            description={t('module.phrases.description')}
            icon={<MessageSquare className="w-4 h-4 text-white" />}
            image={phrasesIcon}
            buttonText={t('module.phrases.button')}
            onClick={() => onNavigate('phrases')}
          />

          <ModuleCard
            title={t('module.emergency.title')}
            description={t('module.emergency.description')}
            icon={<AlertTriangle className="w-4 h-4 text-white" />}
            image={emergencyIcon}
            buttonText={t('module.emergency.button')}
            buttonVariant="destructive"
            onClick={() => onNavigate('emergency')}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="text-center p-6">
            <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">85%</h3>
            <p className="text-sm text-muted-foreground">{t('stats.speechImprovement')}</p>
          </Card>

          <Card className="text-center p-6">
            <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">12</h3>
            <p className="text-sm text-muted-foreground">{t('stats.daysActive')}</p>
          </Card>

          <Card className="text-center p-6">
            <Heart className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">7.2</h3>
            <p className="text-sm text-muted-foreground">{t('stats.avgMoodScore')}</p>
          </Card>

          <Card className="text-center p-6">
            <Users className="w-8 h-8 text-secondary mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-foreground">3</h3>
            <p className="text-sm text-muted-foreground">{t('stats.supportContacts')}</p>
          </Card>
        </div>
      </section>
    </div>
  );
};