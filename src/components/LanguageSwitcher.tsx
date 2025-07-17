import enFlag from "@/assets/flags/english.png";
import thFlag from "@/assets/flags/thai.jpg";
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
        <img
          src={enFlag}
          alt="English Flag"
          className="w-full h-full object-cover"
        />
      )
    },
    {
      code: 'th' as const,
      name: t('language.thai'),
      flagIcon: (
        <img
          src={thFlag}
          alt="Thai Flag"
          className="w-full h-full object-cover"
        />
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
            className={`flex items-center space-x-3 px-3 py-2 cursor-pointer hover:bg-accent/50 ${language === lang.code ? 'bg-accent text-accent-foreground' : ''
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
