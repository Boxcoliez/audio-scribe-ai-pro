import { Mic } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4 py-12">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-2">
            <div className="relative">
              <Mic className="h-8 w-8 text-primary" />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-md" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Transcription Studio
            </span>
          </div>

          {/* Description */}
          <div className="max-w-2xl mx-auto space-y-2">
            <p className="text-lg font-medium">
              Powered by Gemini AI • Built by Professional Development Team
            </p>
            <p className="text-muted-foreground">
              Multi-language audio transcription • High accuracy • Lightning fast processing
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-4 py-6">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-hero border border-border/50">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
              <span className="text-sm">99.5% Accuracy</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-hero border border-border/50">
              <div className="w-2 h-2 bg-studio-blue rounded-full animate-pulse" />
              <span className="text-sm">50+ Languages</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-hero border border-border/50">
              <div className="w-2 h-2 bg-studio-violet rounded-full animate-pulse" />
              <span className="text-sm">Enterprise Security</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-border/40">
            <p className="text-sm text-muted-foreground">
              © 2024 AI Transcription Studio. Powered by advanced AI technology.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};