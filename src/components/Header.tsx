import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Sun, Moon, Zap, Shield, Globe, Home, Settings, History, FileAudio, Menu } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const isMobile = useIsMobile();

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
      <div className="container flex h-16 items-center px-4">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative flex-shrink-0">
              <img src="/botnoiLogo.png" alt="Botnoi Logo" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t('header.title')}
              </h1>
              <p className="text-xs text-muted-foreground">
                {t('header.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation - Same Level */}
        <div className="hidden md:flex items-center space-x-1 ml-8">
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
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right Side - Status & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          {/* Feature Badges - Hidden on mobile and tablet */}
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
          <div className="flex items-center space-x-2 px-2 sm:px-3 py-1 rounded-full bg-card border border-border/50">
            <div className={`w-2 h-2 rounded-full ${
              apiStatus === 'ready' ? 'bg-success animate-pulse-glow' :
              apiStatus === 'pending' ? 'bg-warning animate-pulse' :
              'bg-destructive animate-pulse'
            }`} />
            <span className={`text-xs sm:text-sm font-medium ${getStatusColor()} hidden sm:inline`}>
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
            className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-accent/20 flex-shrink-0"
          >
            {isDark ? (
              <Sun className="h-3 w-3 sm:h-4 sm:w-4 text-studio-blue" />
            ) : (
              <Moon className="h-3 w-3 sm:h-4 sm:w-4 text-studio-violet" />
            )}
          </Button>

          {/* Mobile Navigation Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-accent/20"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-popover border border-border shadow-lg"
              >
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = isActivePage(item.path);
                  
                  return (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`flex items-center space-x-3 px-3 py-2 cursor-pointer hover:bg-accent/50 ${
                        isActive ? 'bg-accent text-accent-foreground' : ''
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
