import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  History,
  Search,
  Filter,
  Download,
  Trash2,
  Calendar,
  Globe,
  FileText,
  Play,
  Pause,
  CheckSquare,
  Square,
  Eye,
  Edit2,
  Check,
  X,
  Copy,
  Clock
} from "lucide-react";
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
  transcriptionTarget?: 'Thai' | 'English';
}

interface TranscriptionHistoryProps {
  onLoadTranscription: (result: TranscriptionResult) => void;
  latestResult?: TranscriptionResult | null;
}

export const TranscriptionHistory = ({ onLoadTranscription, latestResult }: TranscriptionHistoryProps) => {
  const [history, setHistory] = useState<TranscriptionResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [selectedItem, setSelectedItem] = useState<TranscriptionResult | null>(null);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');
  const { toast } = useToast();
  const { t } = useLanguage();

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('transcription_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Update history when new transcription is completed
  useEffect(() => {
    if (latestResult) {
      setHistory(prevHistory => {
        // Check if this result already exists to avoid duplicates
        const exists = prevHistory.some(item =>
          item.fileName === latestResult.fileName &&
          item.timestamp === latestResult.timestamp
        );

        if (!exists) {
          const updatedHistory = [latestResult, ...prevHistory].slice(0, 100);
          localStorage.setItem('transcription_history', JSON.stringify(updatedHistory));
          return updatedHistory;
        }
        return prevHistory;
      });
    }
  }, [latestResult]);

  // Get unique languages from history
  const availableLanguages = useMemo(() => {
    const languages = [...new Set(history.map(item => item.language))];
    return languages.sort();
  }, [history]);

  // Filter history based on search and filters
  const filteredHistory = useMemo(() => {
    let filtered = history;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.fileName.toLowerCase().includes(query) ||
        item.text.toLowerCase().includes(query)
      );
    }

    // Language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter(item => item.language === languageFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();

      switch (dateFilter) {
        case 'today':
          filtered = filtered.filter(item => {
            const date = new Date(item.timestamp);
            return date.toDateString() === now.toDateString();
          });
          break;
        case 'week':
          filtered = filtered.filter(item => {
            const date = new Date(item.timestamp);
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return date >= weekAgo;
          });
          break;
        case 'month':
          filtered = filtered.filter(item => {
            const date = new Date(item.timestamp);
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return date >= monthAgo;
          });
          break;
        case 'custom':
          if (customDateRange.start && customDateRange.end) {
            filtered = filtered.filter(item => {
              const date = new Date(item.timestamp);
              const start = new Date(customDateRange.start);
              const end = new Date(customDateRange.end);
              return date >= start && date <= end;
            });
          }
          break;
      }
    }

    return filtered;
  }, [history, searchQuery, languageFilter, dateFilter, customDateRange]);

  const handleSelectAll = () => {
    if (selectedItems.size === filteredHistory.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredHistory.map((_, index) => index)));
    }
  };

  const handleSelectItem = (index: number) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = () => {
    const selectedIndices = Array.from(selectedItems);
    const updatedHistory = history.filter((_, originalIndex) => {
      const filteredIndex = filteredHistory.findIndex(item =>
        history.indexOf(item) === originalIndex
      );
      return !selectedIndices.includes(filteredIndex);
    });

    setHistory(updatedHistory);
    localStorage.setItem('transcription_history', JSON.stringify(updatedHistory));
    setSelectedItems(new Set());

    toast({
      title: t('history.itemsDeleted'),
      description: `${selectedIndices.length} ${t('history.itemsDeletedDesc')}`,
      variant: "default"
    });
  };

  const handleDeleteSingle = (index: number) => {
    const itemToDelete = filteredHistory[index];
    const originalIndex = history.findIndex(item =>
      item.timestamp === itemToDelete.timestamp && item.fileName === itemToDelete.fileName
    );

    if (originalIndex !== -1) {
      const updatedHistory = history.filter((_, idx) => idx !== originalIndex);
      setHistory(updatedHistory);
      localStorage.setItem('transcription_history', JSON.stringify(updatedHistory));

      toast({
        title: t('history.itemDeleted'),
        description: t('history.itemDeletedDesc'),
        variant: "default"
      });
    }
  };

  const handleEditName = (index: number) => {
    const item = filteredHistory[index];
    setEditingIndex(index);
    setEditingName(item.fileName);
  };

  const handleSaveEdit = (index: number) => {
    if (editingName.trim()) {
      const itemToEdit = filteredHistory[index];
      const originalIndex = history.findIndex(item =>
        item.timestamp === itemToEdit.timestamp && item.fileName === itemToEdit.fileName
      );

      if (originalIndex !== -1) {
        const updatedHistory = [...history];
        updatedHistory[originalIndex] = { ...updatedHistory[originalIndex], fileName: editingName.trim() };
        setHistory(updatedHistory);
        localStorage.setItem('transcription_history', JSON.stringify(updatedHistory));

        toast({
          title: t('history.nameUpdated'),
          description: t('history.nameUpdatedDesc'),
          variant: "default"
        });
      }
    }
    setEditingIndex(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditingName('');
  };

  const handleDownloadSingle = (item: TranscriptionResult) => {
    // Use formattedContent if available (new format with Pain/Gain analysis), otherwise fallback to basic format
    const content = item.formattedContent || 
      `File: ${item.fileName}\n` +
      `Date: ${item.timestamp}\n` +
      `Language: ${item.language}\n` +
      `Duration: ${item.duration}\n` +
      `Words: ${item.wordCount} | Characters: ${item.charCount || item.text.length}\n\n` +
      `Transcription:\n${item.text}`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${item.fileName.replace(/\.[^/.]+$/, '')}_analysis.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Mark item as downloaded
    const updatedHistory = history.map(historyItem =>
      historyItem.timestamp === item.timestamp && historyItem.fileName === item.fileName
        ? { ...historyItem, downloaded: true }
        : historyItem
    );
    setHistory(updatedHistory);
    localStorage.setItem('transcription_history', JSON.stringify(updatedHistory));

    toast({
      title: t('history.downloadStarted'),
      description: t('history.downloadDesc'),
      variant: "default"
    });
  };

  const handleDownloadSelected = () => {
    const selectedIndices = Array.from(selectedItems);
    const selectedTranscriptions = selectedIndices.map(index => filteredHistory[index]);

    const content = selectedTranscriptions.map(item => {
      // Use formattedContent if available, otherwise fallback to basic format
      if (item.formattedContent) {
        return `${item.formattedContent}\n\n${'='.repeat(80)}\n\n`;
      } else {
        return `File: ${item.fileName}\n` +
          `Date: ${item.timestamp}\n` +
          `Language: ${item.language}\n` +
          `Duration: ${item.duration}\n` +
          `Words: ${item.wordCount} | Characters: ${item.charCount || item.text.length}\n\n` +
          `Transcription:\n${item.text}\n\n` +
          `${'='.repeat(80)}\n\n`;
      }
    }).join('');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcriptions_analysis_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Mark items as downloaded
    const updatedHistory = history.map(item => {
      const isSelected = selectedTranscriptions.some(selected =>
        selected.timestamp === item.timestamp && selected.fileName === item.fileName
      );
      return isSelected ? { ...item, downloaded: true } : item;
    });
    setHistory(updatedHistory);
    localStorage.setItem('transcription_history', JSON.stringify(updatedHistory));

    toast({
      title: t('history.downloadStarted'),
      description: `${selectedIndices.length} ${t('history.downloadMultipleDesc')}`,
      variant: "default"
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: t('history.textCopied'),
        description: t('history.textCopiedDesc'),
        variant: "default"
      });
    } catch (error) {
      toast({
        title: t('history.copyFailed'),
        description: t('history.copyFailedDesc'),
        variant: "destructive"
      });
    }
  };

  const toggleAudio = (audioUrl: string) => {
    const audio = document.getElementById(`audio-${audioUrl}`) as HTMLAudioElement;
    if (audio) {
      if (isPlaying === audioUrl) {
        audio.pause();
        setIsPlaying(null);
      } else {
        // Pause any currently playing audio
        if (isPlaying) {
          const currentAudio = document.getElementById(`audio-${isPlaying}`) as HTMLAudioElement;
          if (currentAudio) currentAudio.pause();
        }

        // Reset audio to beginning and try to play
        audio.currentTime = 0;
        audio.play().then(() => {
          setIsPlaying(audioUrl);
        }).catch((error) => {
          console.error('Audio play failed:', error);
          toast({
            title: t('history.audioError'),
            description: t('history.audioErrorDesc'),
            variant: "destructive"
          });
        });
      }
    }
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

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5 text-primary" />
              <span>{t('history.title')}</span>
            </CardTitle>
            <CardDescription>
              {t('history.managePrevious')}
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {filteredHistory.length} {t('history.items')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('history.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('history.filterLanguage')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('history.allLanguages')}</SelectItem>
                {availableLanguages.map(lang => (
                  <SelectItem key={lang} value={lang}>
                    <div className="flex items-center space-x-2">
                      <FlagImage language={lang} size="w-5 h-3" />
                      <span>{lang}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t('history.filterDate')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('history.allTime')}</SelectItem>
                <SelectItem value="today">{t('history.today')}</SelectItem>
                <SelectItem value="week">{t('history.thisWeek')}</SelectItem>
                <SelectItem value="month">{t('history.thisMonth')}</SelectItem>
                <SelectItem value="custom">{t('history.customRange')}</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-2 sm:col-span-2 lg:col-span-1">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
                className="flex-1"
              >
                {selectedItems.size === filteredHistory.length && filteredHistory.length > 0 ? (
                  <CheckSquare className="h-4 w-4 mr-1" />
                ) : (
                  <Square className="h-4 w-4 mr-1" />
                )}
                <span className="hidden sm:inline">{t('history.selectAll')}</span>
                <span className="sm:hidden">{t('history.all')}</span>
              </Button>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateFilter === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                placeholder={t('history.startDate')}
              />
              <Input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                placeholder={t('history.endDate')}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {selectedItems.size > 0 && (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 p-3 bg-accent rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSelected}
              className="flex-1 sm:flex-none"
            >
              <Download className="h-4 w-4 mr-1" />
              {t('history.download')} ({selectedItems.size})
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              className="flex-1 sm:flex-none"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              {t('history.delete')} ({selectedItems.size})
            </Button>
          </div>
        )}

        {/* History List */}
        <div className="space-y-3 max-h-[60vh] sm:max-h-96 overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">{t('history.noResults')}</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {history.length === 0
                  ? t('history.noHistory')
                  : t('history.noResultsDesc')
                }
              </p>
            </div>
          ) : (
            filteredHistory.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="group p-3 sm:p-4 border rounded-lg bg-card hover:bg-accent/15 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <Checkbox
                      checked={selectedItems.has(index)}
                      onCheckedChange={() => handleSelectItem(index)}
                      className="mt-1"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                        {editingIndex === index ? (
                          <div className="flex items-center space-x-2 flex-1">
                            <Input
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="h-6 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(index);
                                if (e.key === 'Escape') handleCancelEdit();
                              }}
                              autoFocus
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveEdit(index)}
                              className="h-6 w-6 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEdit}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {item.fileName}
                          </h4>
                        )}
                        <Badge variant="outline" className="text-xs flex items-center space-x-1">
                          <FlagImage language={item.language} size="w-4 h-3" />
                          <span>{item.language}</span>
                        </Badge>
                         {item.downloaded && (
                           <Badge className="text-xs bg-blue-100 text-blue-800">
                             {t('transcriptionResults.downloadTxt')}ed
                           </Badge>
                         )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="sm:col-span-2">
                          Duration: {item.duration} • {item.wordCount} words
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {item.text.substring(0, 100)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 ml-2 flex-wrap sm:flex-nowrap">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditName(index)}
                      disabled={editingIndex === index}
                      className="hidden sm:inline-flex"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAudio(item.audioUrl)}
                    >
                      {isPlaying === item.audioUrl ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadSingle(item)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-lg sm:text-xl">{item.fileName}</DialogTitle>
                          <DialogDescription className="text-sm">
                            {new Date(item.timestamp).toLocaleString()} • {item.language} • {item.duration}
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          value={item.text}
                          readOnly
                          className="min-h-[300px] resize-none text-sm"
                        />
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div className="text-sm text-muted-foreground">
                            {item.wordCount} words • {item.charCount} characters
                          </div>
                          <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(item.text)}
                              className="flex-1 sm:flex-none"
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              {t('history.copy')}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadSingle(item)}
                              className="flex-1 sm:flex-none"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              {t('history.download')}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSingle(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <audio
                  id={`audio-${item.audioUrl}`}
                  src={item.audioUrl}
                  onEnded={() => setIsPlaying(null)}
                  onError={(e) => {
                    console.error('Audio playback error:', e);
                    setIsPlaying(null);
                  }}
                  preload="metadata"
                  style={{ display: 'none' }}
                />
              </div>
            ))

          )}
        </div>
      </CardContent>
    </Card>
  );
};
