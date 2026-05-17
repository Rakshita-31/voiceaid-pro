import { Bell, Globe, User, Menu, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, Language } from "@/hooks/useLanguage";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface HeaderProps {
  user: SupabaseUser | null;
  onSignOut: () => void;
  onSignIn: () => void;
}

export const Header = ({ user, onSignOut, onSignIn }: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <header className="w-full bg-card border-b border-border shadow-soft">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">VA</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{t('header.title')}</h1>
              <p className="text-xs text-muted-foreground">{t('header.subtitle')}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full animate-pulse-soft"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{t('header.speechReminder')}</p>
                  <p className="text-xs text-muted-foreground">{t('header.timeForExercise')}</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange('hi')}>
                🇮🇳 हिंदी
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                🇬🇧 English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('ta')}>
                🇮🇳 தமிழ்
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('te')}>
                🇮🇳 తెలుగు
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem disabled>
                    {user.email?.split('@')[0] || 'User'}
                  </DropdownMenuItem>
                  <DropdownMenuItem>{t('header.profile')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('header.medicalHistory')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('header.emergencyContacts')}</DropdownMenuItem>
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('header.signOut')}
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={onSignIn}>
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};