import { Header } from "@/components/Header";
import { ApiSetup } from "@/components/ApiSetup";
import { Footer } from "@/components/Footer";
import { useState, useEffect } from "react";

const Settings = () => {
  const [apiStatus, setApiStatus] = useState<'ready' | 'pending' | 'error'>('pending');
  const [isDark, setIsDark] = useState(false);

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

  return (
    <div className="min-h-screen bg-background">
      <Header 
        apiStatus={apiStatus} 
        onThemeToggle={handleThemeToggle}
        isDark={isDark}
      />
      
      <main className="py-12">
        <div className="container px-4 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                API Configuration
              </span>
            </h1>
            <p className="text-muted-foreground">
              Configure your Gemini API key to start transcribing audio files
            </p>
          </div>
          
          <div className="animate-fade-in">
            <ApiSetup onApiKeyChange={handleApiKeyChange} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;