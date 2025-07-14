import { Card, CardContent } from "@/components/ui/card";
import { Zap, Globe, Shield, CheckCircle } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Processing",
      description: "Convert audio files to text within seconds using advanced AI algorithms",
      highlights: ["< 30 second processing", "Real-time transcription", "Optimized for speed"]
    },
    {
      icon: Globe,
      title: "Multi-Language Support", 
      description: "Automatic detection and processing of Thai, English, Japanese, and 50+ languages",
      highlights: ["Auto language detection", "50+ languages", "High accuracy rates"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Your data is protected with the highest security standards and privacy controls",
      highlights: ["End-to-end encryption", "No data retention", "GDPR compliant"]
    }
  ];

  return (
    <section className="py-20 bg-gradient-hero">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Powerful Features
            </span>
            <br />
            <span className="text-foreground">Built for Professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for professional audio transcription in one powerful platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="relative overflow-hidden group hover:shadow-card transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-8">
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-primary opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Highlights */}
                  <div className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              99.5%
            </div>
            <div className="text-sm text-muted-foreground">Accuracy Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              50+
            </div>
            <div className="text-sm text-muted-foreground">Languages</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              &lt;30s
            </div>
            <div className="text-sm text-muted-foreground">Processing Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <div className="text-sm text-muted-foreground">Availability</div>
          </div>
        </div>
      </div>
    </section>
  );
};