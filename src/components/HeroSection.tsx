import { Button } from "@/components/ui/button";
import { ArrowRight, Mic2, Sparkles, Shield, Globe } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="AI Transcription Studio" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      {/* Content */}
      <div className="relative container px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-card">
              <Sparkles className="h-4 w-4 text-studio-blue animate-pulse-glow" />
              <span className="text-sm font-medium">Lightning Fast Processing</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-card">
              <Shield className="h-4 w-4 text-studio-violet animate-pulse-glow" />
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-card">
              <Globe className="h-4 w-4 text-studio-indigo animate-pulse-glow" />
              <span className="text-sm font-medium">Multi-Language Support</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-6 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Professional Audio
              </span>
              <br />
              <span className="text-foreground">Transcription</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your audio files into accurate text with advanced AI technology. 
              Automatic language detection, lightning-fast processing, and enterprise-grade security.
            </p>
          </div>

          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-scale-in">
            <Button 
              variant="hero" 
              size="xl" 
              className="group"
              onClick={() => {
                const apiSection = document.querySelector('[data-api-setup]');
                if (apiSection) {
                  apiSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <Mic2 className="h-5 w-5 group-hover:animate-pulse" />
              Start Transcribing Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="outline" size="xl" className="hover:bg-card/50 backdrop-blur-sm">
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-16 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                99.5%
              </div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                &lt;30s
              </div>
              <div className="text-muted-foreground">Average Processing</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                50+
              </div>
              <div className="text-muted-foreground">Languages Supported</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-studio-blue/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-studio-violet/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-studio-indigo/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
    </section>
  );
};