import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, File, Play, Pause, Trash2, Mic, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioFile {
  file: File;
  url: string;
  duration?: number;
  size: string;
}

interface AudioUploaderProps {
  onTranscriptionStart: (file: AudioFile) => void;
  apiStatus: 'ready' | 'pending' | 'error';
}

export const AudioUploader = ({ onTranscriptionStart, apiStatus }: AudioUploaderProps) => {
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg', 'audio/x-wav'];
    const maxSize = 25 * 1024 * 1024; // 25MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload MP3, WAV, or M4A files only",
        variant: "destructive"
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "File size must be under 25MB",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleFile = useCallback((file: File) => {
    if (!validateFile(file)) return;

    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    
    audio.addEventListener('loadedmetadata', () => {
      const newAudioFile: AudioFile = {
        file,
        url,
        duration: audio.duration,
        size: formatFileSize(file.size)
      };
      
      setAudioFile(newAudioFile);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} (${formatFileSize(file.size)}) ready for transcription`,
        variant: "default"
      });
    });
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const toggleAudioPlayback = () => {
    if (!audioRef.current || !audioFile) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const removeFile = () => {
    if (audioFile) {
      URL.revokeObjectURL(audioFile.url);
      setAudioFile(null);
      setIsPlaying(false);
      setTranscriptionProgress(0);
    }
  };

  const startTranscription = async () => {
    if (!audioFile || apiStatus !== 'ready') return;

    setIsTranscribing(true);
    setTranscriptionProgress(0);

    try {
      await onTranscriptionStart(audioFile);
      // Clear the audio file after successful transcription start
      removeFile();
    } catch (error) {
      console.error('Transcription failed:', error);
      toast({
        title: "Transcription Failed",
        description: error instanceof Error ? error.message : "An error occurred during transcription",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
      setTranscriptionProgress(0);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5 text-primary" />
          <span>Audio File Upload</span>
        </CardTitle>
        <CardDescription>
          Upload your audio file for AI transcription (MP3, WAV, M4A - Max 25MB)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        {!audioFile && (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer ${
              isDragOver 
                ? 'border-primary bg-gradient-hero' 
                : 'border-border hover:border-primary/50 hover:bg-gradient-hero/50'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Drop your audio file here</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse files
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline">MP3</Badge>
                <Badge variant="outline">WAV</Badge>
                <Badge variant="outline">M4A</Badge>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mp3,audio/wav,audio/m4a,audio/mpeg,audio/x-wav"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* File Preview */}
        {audioFile && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <File className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">{audioFile.file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {audioFile.size} • {audioFile.duration ? formatDuration(audioFile.duration) : 'Loading...'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAudioPlayback}
                    disabled={!audioFile.duration}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Audio Player */}
            <audio
              ref={audioRef}
              src={audioFile.url}
              onEnded={() => setIsPlaying(false)}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Transcription Progress */}
            {isTranscribing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Transcribing audio...</span>
                  <span>{Math.round(transcriptionProgress)}%</span>
                </div>
                <Progress value={transcriptionProgress} className="h-2" />
              </div>
            )}

            {/* Start Transcription Button */}
            <Button
              onClick={startTranscription}
              disabled={apiStatus !== 'ready' || isTranscribing}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {isTranscribing ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Transcription
                </>
              )}
            </Button>

            {apiStatus !== 'ready' && (
              <p className="text-sm text-muted-foreground text-center">
                Please configure your API key to start transcription
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};