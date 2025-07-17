
import { Mic } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-card border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Mic className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
                {t('header.title')}
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.home')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.contact')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t('footer.support')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.help')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.documentation')}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-foreground">{t('footer.legal')}</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.privacy')}</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('footer.terms')}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 {t('header.title')}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};
