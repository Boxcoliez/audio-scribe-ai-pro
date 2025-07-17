
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Shield, Globe, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const FeaturesSection = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      title: t('features.transcription.title'),
      description: t('features.transcription.description'),
      icon: Zap,
      gradient: "from-studio-blue to-studio-cyan",
      onClick: () => navigate('/transcription')
    },
    {
      title: t('features.history.title'),
      description: t('features.history.description'),
      icon: Shield,
      gradient: "from-studio-violet to-studio-indigo",
      onClick: () => navigate('/history')
    },
    {
      title: t('features.settings.title'),
      description: t('features.settings.description'),
      icon: Globe,
      gradient: "from-studio-indigo to-studio-blue",
      onClick: () => navigate('/settings')
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="group relative overflow-hidden border-border/50 bg-gradient-card hover:shadow-card transition-all duration-300 hover:scale-105 cursor-pointer"
                onClick={feature.onClick}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
                
                <CardHeader className="relative z-10">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="relative z-10">
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </CardDescription>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="group/btn p-0 h-auto font-semibold text-primary hover:text-primary"
                  >
                    {t('common.learnMore')}
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
