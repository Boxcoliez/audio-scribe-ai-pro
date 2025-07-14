import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { ApiSetup } from "@/components/ApiSetup";
import { AudioUploader } from "@/components/AudioUploader";
import { TranscriptionResults } from "@/components/TranscriptionResults";
import { FeaturesSection } from "@/components/FeaturesSection";
import { Footer } from "@/components/Footer";

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
    // Simulate AI transcription (replace with actual Gemini API call)
    const mockTranscription = `This is a demonstration of the AI transcription system. The audio file "${audioFile.file.name}" has been processed using advanced artificial intelligence algorithms. The system automatically detected the language and converted the speech to text with high accuracy. This technology enables quick and efficient transcription of audio content for various professional applications including meetings, interviews, lectures, and content creation.`;

    const wordCount = mockTranscription.split(' ').length;
    const charCount = mockTranscription.length;
    
    // Detect language based on file name or content (mock detection)
    const detectLanguage = () => {
      const fileName = audioFile.file.name.toLowerCase();
      if (fileName.includes('thai') || fileName.includes('ไทย')) return 'Thai';
      if (fileName.includes('japan') || fileName.includes('jp')) return 'Japanese';
      return 'English';
    };

    const result: TranscriptionResult = {
      fileName: audioFile.file.name,
      duration: audioFile.duration ? `${Math.floor(audioFile.duration / 60)}:${Math.floor(audioFile.duration % 60).toString().padStart(2, '0')}` : '0:00',
      language: detectLanguage(),
      text: mockTranscription,
      timestamp: new Date().toLocaleString(),
      audioUrl: audioFile.url,
      wordCount,
      charCount
    };

    setTranscriptionResult(result);

    // Save to local storage history
    const history = JSON.parse(localStorage.getItem('transcription_history') || '[]');
    history.unshift(result);
    localStorage.setItem('transcription_history', JSON.stringify(history.slice(0, 100))); // Keep last 100
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
      <section className="py-12 bg-background">
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

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
