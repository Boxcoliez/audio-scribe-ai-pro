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
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TranscriptionResult {
  fileName: string;
  duration: string;
  language: string;
  text: string;
  timestamp: string;
  audioUrl: string;
  wordCount: number;
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
  const { toast } = useToast();

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
      title: "Items Deleted",
      description: `${selectedIndices.length} transcription(s) deleted`,
      variant: "default"
    });
  };

  const handleDownloadSelected = () => {
    const selectedIndices = Array.from(selectedItems);
    const selectedTranscriptions = selectedIndices.map(index => filteredHistory[index]);
    
    const content = selectedTranscriptions.map(item => 
      `File: ${item.fileName}\n` +
      `Date: ${item.timestamp}\n` +
      `Language: ${item.language}\n` +
      `Duration: ${item.duration}\n` +
      `Words: ${item.wordCount} | Characters: ${item.charCount}\n\n` +
      `Transcription:\n${item.text}\n\n` +
      `${'='.repeat(80)}\n\n`
    ).join('');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcriptions_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Started",
      description: `${selectedIndices.length} transcription(s) downloaded`,
      variant: "default"
    });
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
        audio.play();
        setIsPlaying(audioUrl);
      }
    }
  };

  const getLanguageFlag = (language: string) => {
    const flags: { [key: string]: string } = {
      'Thai': '🇹🇭',
      'English': '🇺🇸',
      'Japanese': '🇯🇵',
      'Chinese': '🇨🇳',
      'Korean': '🇰🇷',
      'Spanish': '🇪🇸',
      'French': '🇫🇷',
      'German': '🇩🇪'
    };
    return flags[language] || '🌍';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5 text-primary" />
              <span>Transcription History</span>
            </CardTitle>
            <CardDescription>
              Manage and filter your previous transcriptions
            </CardDescription>
          </div>
          <Badge variant="outline" className="ml-2">
            {filteredHistory.length} items
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
              placeholder="Search by filename or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Select value={languageFilter} onValueChange={setLanguageFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                {availableLanguages.map(lang => (
                  <SelectItem key={lang} value={lang}>
                    {getLanguageFlag(lang)} {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
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
                Select All
              </Button>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateFilter === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={customDateRange.start}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e.target.value }))}
                placeholder="Start date"
              />
              <Input
                type="date"
                value={customDateRange.end}
                onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e.target.value }))}
                placeholder="End date"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {selectedItems.size > 0 && (
          <div className="flex space-x-2 p-3 bg-accent rounded-lg">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadSelected}
            >
              <Download className="h-4 w-4 mr-1" />
              Download ({selectedItems.size})
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete ({selectedItems.size})
            </Button>
          </div>
        )}

        {/* History List */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <History className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-2">No transcriptions found</h3>
              <p className="text-sm text-muted-foreground">
                {history.length === 0 
                  ? "Start transcribing audio files to see them here"
                  : "Try adjusting your search or filters"
                }
              </p>
            </div>
          ) : (
            filteredHistory.map((item, index) => (
              <div
                key={`${item.timestamp}-${index}`}
                className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Checkbox
                      checked={selectedItems.has(index)}
                      onCheckedChange={() => handleSelectItem(index)}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                        <h4 className="font-medium text-sm truncate">{item.fileName}</h4>
                        <Badge variant="outline" className="text-xs">
                          {getLanguageFlag(item.language)} {item.language}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div>
                          Duration: {item.duration} • {item.wordCount} words
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.text.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
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
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{item.fileName}</DialogTitle>
                          <DialogDescription>
                            {item.timestamp} • {item.language} • {item.duration}
                          </DialogDescription>
                        </DialogHeader>
                        <Textarea
                          value={item.text}
                          readOnly
                          className="min-h-[300px] resize-none"
                        />
                        <div className="flex justify-between">
                          <div className="text-sm text-muted-foreground">
                            {item.wordCount} words
                          </div>
                          <Button onClick={() => onLoadTranscription(item)}>
                            Load This Transcription
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                
                {/* Hidden audio elements */}
                <audio
                  id={`audio-${item.audioUrl}`}
                  src={item.audioUrl}
                  onEnded={() => setIsPlaying(null)}
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