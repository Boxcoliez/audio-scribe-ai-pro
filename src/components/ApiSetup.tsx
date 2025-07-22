import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle, AlertCircle, ExternalLink, ArrowRight, FileAudio, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface ApiSetupProps {
  onApiKeyChange: (key: string, status: 'ready' | 'pending' | 'error') => void;
}

export const ApiSetup = ({ onApiKeyChange }: ApiSetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ready' | 'error'>('idle');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();

    // Check for existing API key on mount
  useEffect(() => {
    const savedApiKey = sessionStorage.getItem('gemini_api_key');
    if (savedApiKey && savedApiKey.startsWith('AIza')) {
      setApiKey(savedApiKey);
      setStatus('ready');
      onApiKeyChange(savedApiKey, 'ready');
    }
  }, [onApiKeyChange]);
  
  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API key",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Test the API key with a simple request to Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Hello"
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 10,
          }
        }),
      });

      if (response.ok) {
        setStatus('ready');
        onApiKeyChange(apiKey, 'ready');
        
        // Store in session storage
        sessionStorage.setItem('gemini_api_key', apiKey);
        
        toast({
          title: "API Key Validated",
          description: "Gemini AI is now ready for transcription",
          variant: "default"
        });
      } else {
        const errorData = await response.json();
        setStatus('error');
        onApiKeyChange(apiKey, 'error');
        
        toast({
          title: "Invalid API Key",
          description: errorData.error?.message || "Please check your Gemini API key and try again",
          variant: "destructive"
        });
      }
    } catch (error) {
      setStatus('error');
      onApiKeyChange(apiKey, 'error');
      
      toast({
        title: "Validation Failed",
        description: "Failed to validate API key. Please check your internet connection.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const deleteApiKey = () => {
    sessionStorage.removeItem('gemini_api_key');
    setApiKey('');
    setStatus('idle');
    onApiKeyChange('', 'pending');
    
    toast({
      title: t('apiSetup.apiKeyDeleted'),
      description: t('apiSetup.apiKeyDeletedDesc'),
      variant: "default"
    });
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'ready':
        return (
          <Badge variant="default" className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            {t('header.geminiReady')}
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            {t('header.apiError')}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Key className="h-3 w-3 mr-1" />
            {t('header.apiSetupRequired')}
          </Badge>
        );
    }
  };

  return (
    <Card className="w-full" data-api-setup>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5 text-primary" />
              <span>{t('apiSetup.title')}</span>
            </CardTitle>
            <CardDescription>
              {t('apiSetup.subtitle')}
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">{t('apiSetup.apiKeyLabel')}</label>
          <div className="flex space-x-2">
            <Input
              type="password"
              placeholder={t('apiSetup.apiKeyPlaceholder')}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
              disabled={isValidating}
            />
            <Button
              onClick={validateApiKey}
              disabled={isValidating || !apiKey.trim()}
              variant={status === 'ready' ? 'success' : 'default'}
              className="min-w-[120px]"
            >
              {isValidating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>{t('apiSetup.validating')}</span>
                </div>
              ) : status === 'ready' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('apiSetup.validated')}
                </>
              ) : (
                t('apiSetup.validateSave')
              )}
            </Button>
            {status === 'ready' && (
              <Button
                onClick={deleteApiKey}
                variant="outline"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title={t('apiSetup.deleteApiKey')}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="p-4 rounded-lg bg-gradient-hero border border-border/50">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <ExternalLink className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">{t('apiSetup.needApiKey')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('apiSetup.getApiKeyDesc')}
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
                className="mt-2"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                {t('apiSetup.getApiKey')}
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-card border border-border/50">
            <div className="text-lg font-semibold text-primary">{t('apiSetup.freeTier')}</div>
            <div className="text-xs text-muted-foreground">{t('apiSetup.requestsPerMin')}</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border border-border/50">
            <div className="text-lg font-semibold text-primary">{t('apiSetup.highAccuracy')}</div>
            <div className="text-xs text-muted-foreground">{t('apiSetup.precision')}</div>
          </div>
        </div>

        {/* Navigation to Transcription - Only shown after successful validation */}
        {status === 'ready' && (
          <div className="p-4 rounded-lg bg-gradient-primary/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm text-primary">{t('apiSetup.readyToStart')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('apiSetup.configuredDesc')}
                </p>
              </div>
              <Button 
                onClick={() => navigate('/transcription')}
                className="flex items-center space-x-2"
              >
                <FileAudio className="h-4 w-4" />
                <span>{t('apiSetup.startTranscribing')}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
