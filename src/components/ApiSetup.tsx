import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Key, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ApiSetupProps {
  onApiKeyChange: (key: string, status: 'ready' | 'pending' | 'error') => void;
}

export const ApiSetup = ({ onApiKeyChange }: ApiSetupProps) => {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'ready' | 'error'>('idle');
  const { toast } = useToast();

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

  const getStatusBadge = () => {
    switch (status) {
      case 'ready':
        return (
          <Badge variant="default" className="bg-success text-success-foreground">
            <CheckCircle className="h-3 w-3 mr-1" />
            Gemini Ready
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Invalid Key
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Key className="h-3 w-3 mr-1" />
            Setup Required
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
              <span>API Configuration</span>
            </CardTitle>
            <CardDescription>
              Configure your Google Gemini API for AI transcription
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Google Gemini API Key</label>
          <div className="flex space-x-2">
            <Input
              type="password"
              placeholder="Enter your API key (AIza...)"
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
                  <span>Validating...</span>
                </div>
              ) : status === 'ready' ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validated
                </>
              ) : (
                'Validate & Save'
              )}
            </Button>
          </div>
        </div>

        {/* Help Section */}
        <div className="p-4 rounded-lg bg-gradient-hero border border-border/50">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <ExternalLink className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Need an API Key?</h4>
              <p className="text-sm text-muted-foreground">
                Get your free Google Gemini API key from Google AI Studio. 
                The free tier includes generous usage limits perfect for personal projects.
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open('https://makersuite.google.com/app/apikey', '_blank')}
                className="mt-2"
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Get API Key
              </Button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 rounded-lg bg-card border border-border/50">
            <div className="text-lg font-semibold text-primary">Free Tier</div>
            <div className="text-xs text-muted-foreground">15 requests/min</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-card border border-border/50">
            <div className="text-lg font-semibold text-primary">High Accuracy</div>
            <div className="text-xs text-muted-foreground">99.5%+ precision</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};