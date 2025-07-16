import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AudioUploader } from "@/components/AudioUploader";
import { TranscriptionResults } from "@/components/TranscriptionResults";
import { Footer } from "@/components/Footer";
import { transcribeAudio } from "@/lib/transcription";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

const Transcription = () => {
  const [apiStatus, setApiStatus] = useState<'ready' | 'pending' | 'error'>('pending');
  const [isDark, setIsDark] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

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
        title: "API Key Required",
        description: "Please configure your Gemini API key first",
        variant: "destructive"
      });
      navigate('/settings');
    }
  }, [navigate, toast]);

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
        console.log(`Transcription progress: ${progress}%`);
      });
      
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
      
      <main className="py-12">
        <div className="container px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Audio Transcription
              </span>
            </h1>
            <p className="text-muted-foreground">
              Upload your audio files and get accurate transcriptions powered by AI
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Panel - Audio Upload */}
            <div className="animate-fade-in">
              <AudioUploader 
                onTranscriptionStart={handleTranscriptionStart}
                apiStatus={apiStatus}
              />
            </div>

            {/* Right Panel - Results */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
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