import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AudioUploader } from "@/components/AudioUploader";
import { TranscriptionResults } from "@/components/TranscriptionResults";
import { Footer } from "@/components/Footer";
import { transcribeAudio } from "@/lib/transcription";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface AudioFile {
  file: File;
  url: string;
  duration?: number;
  size: string;
}

interface TranscriptionResult {
  id: string;
  fileName: string;
  duration: string;
  language: string;
  text: string;
  timestamp: string;
  audioUrl: string;
  wordCount: number;
  charCount: number;
  downloaded?: boolean;
  painSummary?: string;
  gainSummary?: string;
  fullTranscription: string;
  formattedContent: string;
  spokenLanguage?: string;
  transcriptionTarget?: 'Thai' | 'English' | 'Both';
}

const Transcription = () => {
  const [apiStatus, setApiStatus] = useState<'ready' | 'pending' | 'error'>('pending');
  const [isDark, setIsDark] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const [spokenLanguage, setSpokenLanguage] = useState<string>('English');
  const [targetLanguage, setTargetLanguage] = useState<'Thai' | 'English' | 'Both'>('English');
  const navigate = useNavigate();
  const { toast } = useToast();
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
    } else {
      // Redirect to settings if no API key
      toast({
        title: t('transcription.apiKeyRequired'),
        description: t('transcription.apiKeyRequiredDesc'),
        variant: "destructive"
      });
      navigate('/settings');
    }
  }, [navigate, toast, t]);

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

  const handleApiKeyChange = (key: string, status: 'ready' | 'pending' | 'error') => {
    setApiStatus(status);
  };

  const handleTranscriptionStart = async (audioFile: AudioFile) => {
    try {
      const result = await transcribeAudio(
        audioFile, 
        (progress) => {
          console.log(`Transcription progress: ${progress}%`);
        },
        spokenLanguage,
        targetLanguage
      );
      
      setTranscriptionResult(result);
    } catch (error) {
      console.error('Transcription failed:', error);
      throw error;
    }
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
                {t('transcription.title')}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('transcription.subtitle')}
            </p>
          </div>

          {/* Language Settings */}
          <div className="max-w-4xl mx-auto mb-6 lg:mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-card border border-border/50">
              <div className="space-y-2">
                <label className="text-sm font-medium">Spoken Language</label>
                <input
                  type="text"
                  value={spokenLanguage}
                  onChange={(e) => setSpokenLanguage(e.target.value)}
                  placeholder="e.g., English, Thai, Mandarin"
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Transcription Target</label>
                <select
                  value={targetLanguage}
                  onChange={(e) => setTargetLanguage(e.target.value as 'Thai' | 'English' | 'Both')}
                  className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm"
                >
                  <option value="English">English</option>
                  <option value="Thai">Thai</option>
                  <option value="Both">Both Languages</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Panel - Audio Upload */}
            <div className="animate-fade-in order-1">
              <AudioUploader 
                onTranscriptionStart={handleTranscriptionStart}
                apiStatus={apiStatus}
              />
            </div>

            {/* Right Panel - Results */}
            <div className="animate-fade-in order-2" style={{ animationDelay: '0.2s' }}>
              <TranscriptionResults result={transcriptionResult} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Transcription;
