import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { TranscriptionHistory } from "@/components/TranscriptionHistory";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

interface TranscriptionResult {
  fileName: string;
  duration: string;
  language: string;
  text: string;
  timestamp: string;
  audioUrl: string;
  wordCount: number;
  charCount: number;
}

const History = () => {
  const [apiStatus, setApiStatus] = useState<'ready' | 'pending' | 'error'>('pending');
  const [isDark, setIsDark] = useState(false);
  const { t } = useLanguage();

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Check for existing API key
    const savedApiKey = sessionStorage.getItem('gemini_api_key');
    if (savedApiKey && savedApiKey.startsWith('AIza')) {
      setApiStatus('ready');
    }
  }, []);

  const handleThemeToggle = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLoadTranscription = (result: TranscriptionResult) => {
    // Store the selected result for viewing
    sessionStorage.setItem('selected_transcription', JSON.stringify(result));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        apiStatus={apiStatus} 
        onThemeToggle={handleThemeToggle}
        isDark={isDark}
      />
      
      <main className="py-6 lg:py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                {t('history.title')}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('history.subtitle')}
            </p>
          </div>
          
          <div className="animate-fade-in max-w-7xl mx-auto">
            <TranscriptionHistory onLoadTranscription={handleLoadTranscription} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default History;