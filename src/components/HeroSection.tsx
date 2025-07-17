
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-studio-blue/5 via-studio-violet/5 to-studio-indigo/5" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-studio-blue/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-studio-violet/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      
      {/* Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="hero" 
              onClick={() => navigate('/settings')}
              className="group"
            >
              {t('hero.startNow')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="group border-2 hover:bg-accent/20"
            >
              <PlayCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
              {t('hero.learnMore')}
            </Button>
          </div>

          {/* Visual Indicator */}
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-studio-blue rounded-full animate-pulse-glow"></div>
              <div className="w-2 h-2 bg-studio-violet rounded-full animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
              <div className="w-2 h-2 bg-studio-indigo rounded-full animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
