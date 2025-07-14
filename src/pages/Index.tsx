import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ApiSetup } from "@/components/ApiSetup";
import { AudioUploader } from "@/components/AudioUploader";
import { TranscriptionResults } from "@/components/TranscriptionResults";
import { TranscriptionHistory } from "@/components/TranscriptionHistory";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";
import { transcribeAudio } from "@/lib/transcription";

interface AudioFile {
  file: File;
  url: string;
  duration?: number;
  size: string;
}

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

const Index = () => {
  const [apiStatus, setApiStatus] = useState<'ready' | 'pending' | 'error'>('pending');
  const [isDark, setIsDark] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);

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

  const handleApiKeyChange = (key: string, status: 'ready' | 'pending' | 'error') => {
    setApiStatus(status);
  };

  const handleTranscriptionStart = async (audioFile: AudioFile) => {
    try {
      const result = await transcribeAudio(audioFile, (progress) => {
        // Progress is handled internally by the transcription function
        console.log(`Transcription progress: ${progress}%`);
      });
      
      setTranscriptionResult(result);
    } catch (error) {
      console.error('Transcription failed:', error);
      throw error; // Re-throw to be handled by AudioUploader
    }
  };

  const handleLoadTranscription = (result: TranscriptionResult) => {
    setTranscriptionResult(result);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        apiStatus={apiStatus} 
        onThemeToggle={handleThemeToggle}
        isDark={isDark}
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Dashboard */}
      <section className="py-5 bg-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Settings */}
            <div className="space-y-6">
              <div className="animate-fade-in">
                <ApiSetup onApiKeyChange={handleApiKeyChange} />
              </div>
              
              <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <AudioUploader 
                  onTranscriptionStart={handleTranscriptionStart}
                  apiStatus={apiStatus}
                />
              </div>
            </div>

            {/* Right Panel - Results */}
            <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <TranscriptionResults result={transcriptionResult} />
            </div>
          </div>
        </div>
      </section>

      {/* Transcription History Section */}
      <section className="pt-5 pb-12 bg-muted/30">
        <div className="container px-4">
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <TranscriptionHistory onLoadTranscription={handleLoadTranscription} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
