
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    {
      code: 'en' as const,
      name: t('language.english'),
      flagIcon: (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <rect x="0" y="0" width="32" height="32" fill="#012169"/>
          <path d="M0,0 L32,21.33 L32,0 L0,0 Z" fill="#FFFFFF"/>
          <path d="M32,0 L0,21.33 L0,32 L32,32 L32,0 Z" fill="#FFFFFF"/>
          <path d="M13.33,0 L13.33,32 L18.67,32 L18.67,0 L13.33,0 Z" fill="#FFFFFF"/>
          <path d="M0,10.67 L0,21.33 L32,21.33 L32,10.67 L0,10.67 Z" fill="#FFFFFF"/>
          <path d="M0,12.8 L0,19.2 L32,19.2 L32,12.8 L0,12.8 Z" fill="#C8102E"/>
          <path d="M14.93,0 L14.93,32 L17.07,32 L17.07,0 L14.93,0 Z" fill="#C8102E"/>
        </svg>
      )
    },
    {
      code: 'th' as const,
      name: t('language.thai'),
      flagIcon: (
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <rect x="0" y="0" width="32" height="32" fill="#ED1C24"/>
          <rect x="0" y="5.33" width="32" height="5.33" fill="#FFFFFF"/>
          <rect x="0" y="10.67" width="32" height="10.67" fill="#241D4F"/>
          <rect x="0" y="21.33" width="32" height="5.33" fill="#FFFFFF"/>
        </svg>
      )
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 hover:bg-accent/20 flex items-center space-x-2"
        >
          <Globe className="h-4 w-4 text-studio-blue" />
          <div className="w-6 h-6 rounded-full overflow-hidden shadow-sm border border-border/50 flex-shrink-0">
            <div className="w-full h-full">
              {currentLanguage?.flagIcon}
            </div>
          </div>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-popover border border-border shadow-lg"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center space-x-3 px-3 py-2 cursor-pointer hover:bg-accent/50 ${
              language === lang.code ? 'bg-accent text-accent-foreground' : ''
            }`}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden shadow-sm border border-border/30 flex-shrink-0">
              <div className="w-full h-full">
                {lang.flagIcon}
              </div>
            </div>
            <span className="text-sm font-medium">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
