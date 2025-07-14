import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Sun, Moon, Zap, Shield, Globe } from "lucide-react";

interface HeaderProps {
  apiStatus: 'ready' | 'pending' | 'error';
  onThemeToggle: () => void;
  isDark: boolean;
}

export const Header = ({ apiStatus, onThemeToggle, isDark }: HeaderProps) => {
  const [mounted, setMounted] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
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
        </div>

        {/* Status & Actions */}
        <div className="flex items-center space-x-4">
          {/* Feature Badges */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-hero border border-border/50">
              <Zap className="h-3 w-3 text-studio-blue" />
              <span className="text-xs font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-hero border border-border/50">
              <Shield className="h-3 w-3 text-studio-violet" />
              <span className="text-xs font-medium">Enterprise Secure</span>
            </div>
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-gradient-hero border border-border/50">
              <Globe className="h-3 w-3 text-studio-indigo" />
              <span className="text-xs font-medium">Multi-Language</span>
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
      </div>
    </header>
  );
};