import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Sun, Moon, Zap, Shield, Globe, Home, Settings, History, FileAudio } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  apiStatus: 'ready' | 'pending' | 'error';
  onThemeToggle: () => void;
  isDark: boolean;
}

export const Header = ({ apiStatus, onThemeToggle, isDark }: HeaderProps) => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const getStatusColor = () => {
    switch (apiStatus) {
      case 'ready': return 'text-success';
      case 'pending': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusText = () => {
    switch (apiStatus) {
      case 'ready': return t('header.geminiReady');
      case 'pending': return t('header.apiSetupRequired');
      case 'error': return t('header.apiError');
      default: return t('header.loading');
    }
  };

  const isActivePage = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', label: t('header.home'), icon: Home },
    { path: '/transcription', label: t('header.transcription'), icon: FileAudio },
    { path: '/history', label: t('header.history'), icon: History },
    { path: '/settings', label: t('header.settings'), icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
            <img src="/botnoiLogo.png" alt="Botnoi Logo" className="h-20 w-20 rounded-full" />
          </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t('header.title')}
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {t('header.subtitle')}
              </p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePage(item.path);
              
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center space-x-2 ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Right Side - Status & Actions */}
        <div className="flex items-center space-x-4">
          {/* Feature Badges - Hidden on smaller screens to save space */}
          <div className="hidden xl:flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-hero border border-border/50">
              <Zap className="h-3 w-3 text-studio-blue" />
              <span className="text-xs font-medium">{t('header.fast')}</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-hero border border-border/50">
              <Shield className="h-3 w-3 text-studio-violet" />
              <span className="text-xs font-medium">{t('header.secure')}</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-hero border border-border/50">
              <Globe className="h-3 w-3 text-studio-indigo" />
              <span className="text-xs font-medium">{t('header.multiLang')}</span>
            </div>
          </div>

          {/* API Status */}
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-card border border-border/50">
            <div className={`w-2 h-2 rounded-full ${
              apiStatus === 'ready' ? 'bg-success animate-pulse-glow' :
              apiStatus === 'pending' ? 'bg-warning animate-pulse' :
              'bg-destructive animate-pulse'
            }`} />
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="h-9 w-9 hover:bg-accent/20"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-studio-blue" />
            ) : (
              <Moon className="h-4 w-4 text-studio-violet" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className="md:hidden flex items-center space-x-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActivePage(item.path);
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                className={`${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-accent/50"
                }`}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
        </div>
      </div>
    </header>
  );
};