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

interface AudioFile {
  file: File;
  url: string;
  duration?: number;
  size: string;
}

// Convert audio file to base64 for Gemini API
const audioToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Web Speech API transcription as fallback
const transcribeWithWebSpeech = (audioFile: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Web Speech API not supported'));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    let finalTranscript = '';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
    };

    recognition.onend = () => {
      resolve(finalTranscript.trim() || 'Unable to transcribe audio using Web Speech API');
    };

    recognition.onerror = (event) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    // Create audio element to play file for speech recognition
    const audio = document.createElement('audio');
    audio.src = URL.createObjectURL(audioFile);
    audio.onplay = () => recognition.start();
    audio.onended = () => recognition.stop();
    
    // Start playing audio
    audio.play().catch(() => {
      reject(new Error('Unable to play audio file'));
    });
  });
};

// Gemini AI transcription
const transcribeWithGemini = async (audioFile: File, apiKey: string): Promise<string> => {
  try {
    const base64Audio = await audioToBase64(audioFile);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: "Please transcribe this audio file. Provide only the transcribed text without any additional commentary or formatting."
            },
            {
              inline_data: {
                mime_type: audioFile.type,
                data: base64Audio
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Gemini API request failed');
    }

    const data = await response.json();
    const transcribedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!transcribedText) {
      throw new Error('No transcription received from Gemini API');
    }

    return transcribedText.trim();
  } catch (error) {
    console.error('Gemini transcription error:', error);
    throw error;
  }
};

// Detect language from text
const detectLanguage = (text: string): string => {
  // Simple language detection based on character patterns
  const thaiPattern = /[\u0E00-\u0E7F]/;
  const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
  const chinesePattern = /[\u4E00-\u9FFF]/;
  const koreanPattern = /[\uAC00-\uD7AF]/;
  
  if (thaiPattern.test(text)) return 'Thai';
  if (japanesePattern.test(text)) return 'Japanese';
  if (chinesePattern.test(text)) return 'Chinese';
  if (koreanPattern.test(text)) return 'Korean';
  
  // Check for other European languages based on common words
  const spanishWords = /\b(el|la|de|que|y|en|un|es|se|no|te|lo|le|da|su|por|son|con|para|al|del|los|se|me|si|ya|vez|ni|mi|pero|muy|dos|más|bien|hasta|donde|como|está|desde|hacer|cada|siendo|antes|mismo|tengo|aquí)\b/gi;
  const frenchWords = /\b(le|de|et|à|un|il|être|et|en|avoir|que|pour|dans|ce|son|une|sur|avec|ne|se|pas|tout|plus|par|grand|quand|même|lui|temps|très|sans|autre|après|venir|faire|depuis|contre|encore|sous|pourquoi|pendant|dire|comme|aller)\b/gi;
  const germanWords = /\b(der|die|und|in|den|von|zu|das|mit|sich|des|auf|für|ist|im|dem|nicht|ein|eine|als|auch|es|an|werden|aus|er|hat|dass|sie|nach|wird|bei|noch|wie|einem|einen|über|so|man|haben|diese|seinem|war|oder|wenn|aber|kann|durch|gegen|ihn|wo|sehr|doch|nur|was|mehr|wir|alle|sein)\b/gi;
  
  if (spanishWords.test(text)) return 'Spanish';
  if (frenchWords.test(text)) return 'French';
  if (germanWords.test(text)) return 'German';
  
  return 'English';
};

// Main transcription function
export const transcribeAudio = async (
  audioFile: AudioFile,
  onProgress: (progress: number) => void
): Promise<TranscriptionResult> => {
  const apiKey = sessionStorage.getItem('gemini_api_key');
  
  if (!apiKey) {
    throw new Error('API key not found. Please configure your Gemini API key.');
  }

  onProgress(10);
  
  let transcribedText = '';
  let transcriptionMethod = 'Gemini AI';
  
  try {
    // Try Gemini AI first
    onProgress(30);
    transcribedText = await transcribeWithGemini(audioFile.file, apiKey);
    onProgress(80);
  } catch (geminiError) {
    console.warn('Gemini transcription failed, trying Web Speech API:', geminiError);
    
    try {
      // Fallback to Web Speech API
      onProgress(50);
      transcribedText = await transcribeWithWebSpeech(audioFile.file);
      transcriptionMethod = 'Web Speech API';
      onProgress(80);
    } catch (webSpeechError) {
      console.error('Web Speech API also failed:', webSpeechError);
      throw new Error(`Transcription failed: ${geminiError instanceof Error ? geminiError.message : 'Unknown error'}`);
    }
  }

  onProgress(90);

  if (!transcribedText || transcribedText.length < 10) {
    throw new Error('Transcription result is too short or empty. Please try with a clearer audio file.');
  }

  const language = detectLanguage(transcribedText);
  
  // More accurate word count calculation
  const wordCount = transcribedText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0 && /\S/.test(word))
    .length;

  const result: TranscriptionResult = {
    fileName: audioFile.file.name,
    duration: audioFile.duration ? 
      `${Math.floor(audioFile.duration / 60)}:${Math.floor(audioFile.duration % 60).toString().padStart(2, '0')}` : 
      '0:00',
    language,
    text: transcribedText,
    timestamp: new Date().toLocaleString(),
    audioUrl: audioFile.url,
    wordCount,
  };

  onProgress(100);
  
  // Save to history
  const history = JSON.parse(localStorage.getItem('transcription_history') || '[]');
  history.unshift(result);
  localStorage.setItem('transcription_history', JSON.stringify(history.slice(0, 100))); // Keep last 100
  
  return result;
};

// Declare Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}