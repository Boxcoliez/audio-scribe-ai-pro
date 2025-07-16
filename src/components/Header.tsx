import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Sun, Moon, Zap, Shield, Globe, Home, Settings, History, FileAudio } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  apiStatus: 'ready' | 'pending' | 'error';
  onThemeToggle: () => void;
  isDark: boolean;
}

export const Header = ({ apiStatus, onThemeToggle, isDark }: HeaderProps) => {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
      case 'ready': return 'Gemini Ready';
      case 'pending': return 'API Setup Required';
      case 'error': return 'API Error';
      default: return 'Loading...';
    }
  };

  const isActivePage = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/transcription', label: 'Transcription', icon: FileAudio },
    { path: '/history', label: 'History', icon: History },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative">
              <Mic className="h-8 w-8 text-primary animate-pulse-glow" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse-glow" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                AI Transcription Studio
              </h1>
              <p className="text-xs text-muted-foreground">
                Professional Audio-to-Text Service
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
          <div className="hidden lg:flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-hero border border-border/50">
              <Zap className="h-3 w-3 text-studio-blue" />
              <span className="text-xs font-medium">Fast</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-hero border border-border/50">
              <Shield className="h-3 w-3 text-studio-violet" />
              <span className="text-xs font-medium">Secure</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-hero border border-border/50">
              <Globe className="h-3 w-3 text-studio-indigo" />
              <span className="text-xs font-medium">Multi-Lang</span>
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