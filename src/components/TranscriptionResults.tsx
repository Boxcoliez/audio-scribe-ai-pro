import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Download, Play, Pause, FileText, Globe, Clock, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Import flag images
import thFlag from "@/assets/flags/th.png"; // Thai
import usFlag from "@/assets/flags/gb.png"; // English
import jpFlag from "@/assets/flags/jp.png"; // Japanese
import cnFlag from "@/assets/flags/cn.png"; // Chinese
import krFlag from "@/assets/flags/kr.png"; // Korean
import esFlag from "@/assets/flags/es.png"; // Spanish
import frFlag from "@/assets/flags/fr.png"; // French
import deFlag from "@/assets/flags/de.png"; // German
import itFlag from "@/assets/flags/it.png"; // Italian
import ptFlag from "@/assets/flags/pt.png"; // Portuguese
import ruFlag from "@/assets/flags/ru.png"; // Russian
import vnFlag from "@/assets/flags/vn.png"; // Vietnamese
import inFlag from "@/assets/flags/in.png"; // Hindi
import saFlag from "@/assets/flags/sa.png"; // Arabic
import ilFlag from "@/assets/flags/il.png"; // Hebrew
import trFlag from "@/assets/flags/tr.png"; // Turkish
import idFlag from "@/assets/flags/id.png"; // Indonesian
import myFlag from "@/assets/flags/my.png"; // Malay
import phFlag from "@/assets/flags/ph.png"; // Filipino
import irFlag from "@/assets/flags/ir.png"; // Persian
import nlFlag from "@/assets/flags/nl.png"; // Dutch
import uaFlag from "@/assets/flags/ua.png"; // Ukrainian
import plFlag from "@/assets/flags/pl.png"; // Polish
import keFlag from "@/assets/flags/ke.png"; // Swahili (Kenya)
import zaFlag from "@/assets/flags/za.png"; // Zulu (South Africa)
import grFlag from "@/assets/flags/gr.png"; // Greek



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

interface TranscriptionResultsProps {
  result: TranscriptionResult | null;
}

export const TranscriptionResults = ({ result }: TranscriptionResultsProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const toggleAudioPlayback = () => {
    if (!audioRef.current || !result) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const copyToClipboard = async () => {
    if (!result?.text) return;

    try {
      await navigator.clipboard.writeText(result.text);
      toast({
        title: "Text Copied",
        description: "Transcription text copied to clipboard",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadText = () => {
    if (!result?.formattedContent) return;

    const blob = new Blob([result.formattedContent], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.fileName.replace(/\.[^/.]+$/, '')}_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Mark as downloaded in history
    const history = JSON.parse(localStorage.getItem('transcription_history') || '[]');
    const updatedHistory = history.map((item: any) => 
      item.id === result.id 
        ? { ...item, downloaded: true } 
        : item
    );
    localStorage.setItem('transcription_history', JSON.stringify(updatedHistory));

    toast({
      title: "Download Started",
      description: "Enhanced transcription report downloaded",
      variant: "default"
    });
  };

  const getLanguageFlag = (language: string) => {
  const flagMap: { [key: string]: string } = {
    'Thai': thFlag,
    'English': usFlag,
    'Japanese': jpFlag,
    'Chinese': cnFlag,
    'Mandarin': cnFlag,
    'Cantonese': cnFlag,
    'Simplified Chinese': cnFlag,
    'Traditional Chinese': cnFlag,
    'Korean': krFlag,
    'Spanish': esFlag,
    'Latin American Spanish': esFlag,
    'European Spanish': esFlag,
    'French': frFlag,
    'German': deFlag,
    'Italian': itFlag,
    'Portuguese': ptFlag,
    'Brazilian Portuguese': ptFlag,
    'Russian': ruFlag,
    'Vietnamese': vnFlag,
    'Hindi': inFlag,
    'Arabic': saFlag,
    'Hebrew': ilFlag,
    'Turkish': trFlag,
    'Indonesian': idFlag,
    'Malay': myFlag,
    'Filipino': phFlag,
    'Persian': irFlag,
    'Dutch': nlFlag,
    'Ukrainian': uaFlag,
    'Polish': plFlag,
    'Swahili': keFlag,
    'Zulu': zaFlag,
    'Greek': grFlag,
  };

  return flagMap[language] || null;
};


  const FlagImage = ({ language, size = "w-6 h-4" }: { language: string; size?: string }) => {
    const flagSrc = getLanguageFlag(language);
    
    if (!flagSrc) {
      return <Globe className="h-4 w-4 text-muted-foreground" />;
    }

    return (
      <img
        src={flagSrc}
        alt={`${language} flag`}
        className={`${size} object-cover rounded-sm border border-border/20 shadow-sm`}
      />
    );
  };

  if (!result) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <span>{t('transcriptionResults.title')}</span>
          </CardTitle>
          <CardDescription>
            {t('transcriptionResults.uploadSubtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-gradient-hero flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t('transcriptionResults.noTranscription')}</h3>
            <p className="text-muted-foreground">
              {t('transcriptionResults.uploadToStart')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-success" />
              <span>{t('transcriptionResults.title')}</span>
            </CardTitle>
            <CardDescription>
              {t('transcriptionResults.subtitle')}
            </CardDescription>
          </div>
          <Badge variant="default" className="bg-success text-success-foreground">
            {t('transcriptionResults.completed')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm break-all">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium">{result.fileName}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>{result.duration}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <FlagImage language={result.language} />
              <span className="font-medium">{result.language}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date(result.timestamp).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="p-4 rounded-lg bg-gradient-hero border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAudioPlayback}
                className="h-8 w-8 p-0"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <div>
                <div className="text-sm font-medium">{t('transcriptionResults.originalAudio')}</div>
                <div className="text-xs text-muted-foreground">{t('transcriptionResults.clickToPlay')}</div>
              </div>
            </div>
          </div>
          
          <audio
            ref={audioRef}
            src={result.audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>

        {/* Pain/Gain Analysis */}
        {(result.painSummary || result.gainSummary) && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Pain & Gain Analysis</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {result.painSummary && result.painSummary !== 'No specific pain points identified' && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-destructive"></div>
                    <h4 className="font-medium text-sm">Pain Points</h4>
                  </div>
                  <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <p className="text-sm text-muted-foreground">{result.painSummary}</p>
                  </div>
                </div>
              )}
              
              {result.gainSummary && result.gainSummary !== 'No specific benefits identified' && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-success"></div>
                    <h4 className="font-medium text-sm">Benefits & Gains</h4>
                  </div>
                  <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                    <p className="text-sm text-muted-foreground">{result.gainSummary}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Language Settings */}
        {(result.spokenLanguage || result.transcriptionTarget) && (
          <div className="p-4 rounded-lg bg-muted/20 border border-border/50">
            <h4 className="font-medium text-sm mb-2">Transcription Settings</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
              {result.spokenLanguage && (
                <div>Spoken Language: <span className="font-medium">{result.spokenLanguage}</span></div>
              )}
              {result.transcriptionTarget && (
                <div>Target: <span className="font-medium">{result.transcriptionTarget}</span></div>
              )}
            </div>
          </div>
        )}

        {/* Transcription Text */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="font-medium">{t('transcriptionResults.transcriptionText')}</h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex-1 sm:flex-none"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{t('transcription.copy')}</span>
                  <span className="sm:hidden">Copy</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadText}
                  className="flex-1 sm:flex-none"
                >
                  <Download className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{t('transcription.download')}</span>
                  <span className="sm:hidden">Download</span>
                </Button>
              </div>
            </div>
          
          <Textarea
            value={result.text}
            readOnly
            className="min-h-[200px] resize-none bg-card border-border/50"
            placeholder="Transcribed text will appear here..."
          />
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 sm:p-4 rounded-lg bg-card border border-border/50">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-semibold text-base sm:text-lg">{result.wordCount}</span>
            </div>
            <div className="text-xs text-muted-foreground">{t('transcriptionResults.words')}</div>
          </div>
          
          <div className="text-center p-3 sm:p-4 rounded-lg bg-card border border-border/50">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Hash className="h-4 w-4 text-primary" />
              <span className="font-semibold text-base sm:text-lg">{result.charCount || result.text.length}</span>
            </div>
            <div className="text-xs text-muted-foreground">Characters</div>
          </div>
          
          <div className="text-center p-3 sm:p-4 rounded-lg bg-card border border-border/50 col-span-2 sm:col-span-1">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <FlagImage language={result.language} size="w-8 h-6" />
            </div>
            <div className="text-xs text-muted-foreground font-medium">{result.language}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
          <Button
            variant="gradient"
            className="flex-1"
            onClick={copyToClipboard}
          >
            <Copy className="h-4 w-4 mr-2" />
            {t('transcriptionResults.copyText')}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={downloadText}
          >
            <Download className="h-4 w-4 mr-2" />
            {t('transcriptionResults.downloadTxt')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};