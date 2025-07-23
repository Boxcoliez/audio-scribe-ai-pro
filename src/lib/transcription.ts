interface TranscriptionSegment {
  timestamp: string;
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
}

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
  segments?: TranscriptionSegment[];
}

interface AudioFile {
  file: File;
  url: string;
  duration?: number;
  size: string;
}

// Extract audio from video files
const extractAudioFromVideo = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    
    video.onloadedmetadata = () => {
      try {
        // Create audio context for extraction
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = audioContext.createMediaElementSource(video);
        const destination = audioContext.createMediaStreamDestination();
        source.connect(destination);
        
        const recorder = new MediaRecorder(destination.stream);
        const chunks: Blob[] = [];
        
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], file.name.replace(/\.[^/.]+$/, '.wav'), {
            type: 'audio/wav',
          });
          resolve(audioFile);
        };
        
        recorder.start();
        video.play();
        
        video.onended = () => {
          recorder.stop();
          video.remove();
        };
      } catch (error) {
        reject(new Error('Audio extraction not supported in this browser'));
      }
    };
    
    video.onerror = () => reject(new Error('Failed to load video file'));
    video.src = URL.createObjectURL(file);
    video.load();
  });
};

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

// Enhanced Gemini AI transcription with Pain/Gain analysis
const transcribeWithGemini = async (
  audioFile: File, 
  apiKey: string,
  spokenLanguage: string = 'English',
  targetLanguage: 'Thai' | 'English' | 'Both' = 'English'
): Promise<{
  transcription: string;
  painSummary: string;
  gainSummary: string;
  detectedLanguage: string;
  segments: TranscriptionSegment[];
}> => {
  try {
    const base64Audio = await audioToBase64(audioFile);
    
    // Create structured prompt for Pain/Gain analysis
    const getPrompt = () => {
      if (targetLanguage === 'Thai') {
        return `กรุณาถอดเสียงไฟล์เสียงต่อไปนี้เป็นภาษาไทยทั้งหมด 
        สำคัญ: โปรดระบุเวลาและระบุผู้พูดที่แตกต่างกันหากมีผู้พูดหลายคน จัดรูปแบบแต่ละส่วนด้วยข้อมูลเวลา
        รวมถึงส่วนวิเคราะห์ "Pain" และ "Gain" ห้ามมีภาษาอังกฤษหรือคำแปลในวงเล็บ

จัดรูปแบบผลลัพธ์ดังนี้:

SEGMENTS:
[00:00:00] ผู้พูด 1: [ข้อความกลุ่มแรก]
[00:00:03] ผู้พูด 1: [ข้อความกลุ่มที่สอง]
[00:00:06] ผู้พูด 2: [ข้อความกลุ่มที่สาม หากผู้พูดคนละคน]
(ดำเนินการต่อกับทุกกลุ่ม...)

TRANSCRIPTION:
[ข้อความถอดเสียงเป็นภาษาไทย]

ANALYSIS:
Pain: [ปัญหา ความท้าทาย จุดเจ็บปวด หรือความยากลำบากใดที่ได้รับการกล่าวถึง - ให้ระบุเจาะจงและให้รายละเอียดเป็นภาษาไทย]
Gain: [มีการกล่าวถึงวิธีแก้ปัญหา ประโยชน์ ผลลัพธ์เชิงบวก โอกาส หรือข้อดีใดบ้าง - ให้ระบุและให้รายละเอียดเป็นภาษาไทย]

LANGUAGE: [ตรวจพบภาษาหลักของผู้พูด]`;
      } else if (targetLanguage === 'English') {
        return `Please transcribe the following audio file in English. 
        IMPORTANT: Please also provide timestamps and identify different speakers if there are multiple speakers. Format each segment with timing information.
        Then analyze the key "Pain" and "Gain" themes in English.

Format your response EXACTLY as follows:

SEGMENTS:
[00:00:00] Speaker 1: [First segment text]
[00:00:03] Speaker 1: [Second segment text]
[00:00:06] Speaker 2: [Third segment text if different speaker]
(Continue with all segments...)

TRANSCRIPTION:
[Full transcription in English]

ANALYSIS:
Pain: [What problems, challenges, pain points, or difficulties were mentioned - be specific and detailed in English]
Gain: [What solutions, benefits, positive outcomes, opportunities, or advantages were mentioned - be specific and detailed in English]

LANGUAGE: [Detected primary language of the speaker]`;
      } else {
        // Default to English if not Thai
        return `Please transcribe the following audio file in English. 
        IMPORTANT: Please also provide timestamps and identify different speakers if there are multiple speakers. Format each segment with timing information.
        Then analyze the key "Pain" and "Gain" themes in English.

Format your response EXACTLY as follows:

SEGMENTS:
[00:00:00] Speaker 1: [First segment text]
[00:00:03] Speaker 1: [Second segment text]
[00:00:06] Speaker 2: [Third segment text if different speaker]
(Continue with all segments...)

TRANSCRIPTION:
[Full transcription in English]

ANALYSIS:
Pain: [What problems, challenges, pain points, or difficulties were mentioned - be specific and detailed in English]
Gain: [What solutions, benefits, positive outcomes, opportunities, or advantages were mentioned - be specific and detailed in English]

LANGUAGE: [Detected primary language of the speaker]`;
      }
    };
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: getPrompt()
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
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 4096,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Fallback to gemini-1.5-flash if 2.0 fails
      if (response.status === 404 || errorData.error?.message?.includes('not found')) {
        return await transcribeWithGeminiLegacy(audioFile, apiKey, spokenLanguage, targetLanguage);
      }
      throw new Error(errorData.error?.message || 'Gemini API request failed');
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('No transcription received from Gemini API');
    }

    // Parse the structured response
    const sections = responseText.split(/(?:SEGMENTS:|TRANSCRIPTION:|ANALYSIS:|LANGUAGE:)/i);
    
    let segments: TranscriptionSegment[] = [];
    let transcription = '';
    let painSummary = 'No specific pain points identified';
    let gainSummary = 'No specific benefits identified';
    let detectedLanguage = spokenLanguage;
    
    if (sections.length >= 2) {
      // Parse segments from the first section
      if (sections.length >= 3) {
        segments = parseSegments(sections[1].trim());
        transcription = sections[2].trim();
        
        if (sections.length >= 4) {
          const analysisSection = sections[3].trim();
          const painMatch = analysisSection.match(/Pain:\s*(.+?)(?=\nGain:|$)/is);
          const gainMatch = analysisSection.match(/Gain:\s*(.+?)(?=\n|$)/is);
          
          if (painMatch) painSummary = painMatch[1].trim();
          if (gainMatch) gainSummary = gainMatch[1].trim();
        }
        
        if (sections.length >= 5) {
          const languageSection = sections[4].trim();
          if (languageSection) {
            detectedLanguage = languageSection;
          }
        }
      } else {
        transcription = sections[1].trim();
      }
    } else {
      // Fallback if parsing fails
      transcription = responseText.trim();
    }

    return {
      transcription: transcription || responseText.trim(),
      painSummary,
      gainSummary,
      detectedLanguage,
      segments
    };
  } catch (error) {
    console.error('Gemini 2.0 transcription error:', error);
    // Fallback to legacy version
    return await transcribeWithGeminiLegacy(audioFile, apiKey, spokenLanguage, targetLanguage);
  }
};

// Legacy fallback for Gemini 1.5 Flash
const transcribeWithGeminiLegacy = async (
  audioFile: File,
  apiKey: string,
  spokenLanguage: string = 'English',
  targetLanguage: 'Thai' | 'English' | 'Both' = 'English'
): Promise<{
  transcription: string;
  painSummary: string;
  gainSummary: string;
  detectedLanguage: string;
  segments: TranscriptionSegment[];
}> => {
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
              text: targetLanguage === 'Thai' 
                ? `กรุณาถอดเสียงไฟล์เสียงนี้เป็นภาษาไทยทั้งหมด รวมถึงการวิเคราะห์ปัญหาและประโยชน์ที่กล่าวถึง ห้ามมีภาษาอังกฤษหรือคำแปลในวงเล็บ` 
                : `Please transcribe this audio file in English. The speaker is likely speaking in ${spokenLanguage}. Provide the transcription in English and briefly analyze any pain points and benefits mentioned.`
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

    return {
      transcription: transcribedText.trim(),
      painSummary: 'Analysis not available with legacy model',
      gainSummary: 'Analysis not available with legacy model',
      detectedLanguage: spokenLanguage,
      segments: []
    };
  } catch (error) {
    console.error('Gemini legacy transcription error:', error);
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

// Parse timestamp segments from AI response
const parseSegments = (segmentsText: string): TranscriptionSegment[] => {
  if (!segmentsText || segmentsText.trim().length === 0) {
    return [];
  }

  const segments: TranscriptionSegment[] = [];
  const lines = segmentsText.split('\n').filter(line => line.trim().length > 0);
  
  for (const line of lines) {
    // Match format: [00:00:00] Speaker 1: text
    const match = line.match(/\[(\d{2}:\d{2}:\d{2})\]\s*(Speaker\s*\d+|[^:]+):\s*(.+)/i);
    if (match) {
      const [, timestamp, speaker, text] = match;
      const timeInSeconds = timeToSeconds(timestamp);
      
      segments.push({
        timestamp,
        speaker: speaker.trim(),
        text: text.trim(),
        startTime: timeInSeconds,
        endTime: timeInSeconds + 3 // Default 3 second duration
      });
    }
  }
  
  // Update end times based on next segment start times
  for (let i = 0; i < segments.length - 1; i++) {
    segments[i].endTime = segments[i + 1].startTime;
  }
  
  return segments;
};

// Convert timestamp to seconds
const timeToSeconds = (timestamp: string): number => {
  const [hours, minutes, seconds] = timestamp.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Convert seconds to timestamp
const secondsToTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Enhanced main transcription function with Pain/Gain analysis
export const transcribeAudio = async (
  audioFile: AudioFile,
  onProgress: (progress: number) => void,
  spokenLanguage: string = 'English',
  targetLanguage: 'Thai' | 'English' | 'Both' = 'English'
): Promise<TranscriptionResult> => {
  const apiKey = sessionStorage.getItem('gemini_api_key');
  
  if (!apiKey) {
    throw new Error('API key not found. Please configure your Gemini API key.');
  }

  onProgress(10);
  
  let fileToProcess = audioFile.file;
  
  // Extract audio from video if needed
  if (audioFile.file.type === 'video/mp4') {
    onProgress(20);
    try {
      fileToProcess = await extractAudioFromVideo(audioFile.file);
      onProgress(30);
    } catch (error) {
      throw new Error('Failed to extract audio from video file');
    }
  }
  
  let transcriptionResult: {
    transcription: string;
    painSummary: string;
    gainSummary: string;
    detectedLanguage: string;
    segments: TranscriptionSegment[];
  };
  let transcriptionMethod = 'Gemini AI';
  
  try {
    // Try Gemini AI first with Pain/Gain analysis
    onProgress(40);
    transcriptionResult = await transcribeWithGemini(fileToProcess, apiKey, spokenLanguage, targetLanguage);
    onProgress(80);
  } catch (geminiError) {
    console.warn('Gemini transcription failed, trying Web Speech API:', geminiError);
    
    try {
      // Fallback to Web Speech API
      onProgress(50);
      const webSpeechText = await transcribeWithWebSpeech(fileToProcess);
      transcriptionResult = {
        transcription: webSpeechText,
        painSummary: 'Analysis not available with Web Speech API',
        gainSummary: 'Analysis not available with Web Speech API',
        detectedLanguage: detectLanguage(webSpeechText),
        segments: []
      };
      transcriptionMethod = 'Web Speech API';
      onProgress(80);
    } catch (webSpeechError) {
      console.error('Web Speech API also failed:', webSpeechError);
      throw new Error(`Transcription failed: ${geminiError instanceof Error ? geminiError.message : 'Unknown error'}`);
    }
  }

  onProgress(90);

  const transcribedText = transcriptionResult.transcription;
  
  if (!transcribedText || transcribedText.length < 10) {
    throw new Error('Transcription result is too short or empty. Please try with a clearer audio file.');
  }

  const language = transcriptionResult.detectedLanguage || detectLanguage(transcribedText);
  
  // More accurate word count calculation
  const wordCount = transcribedText
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0 && /\S/.test(word))
    .length;

  // Generate formatted content for download
  const formattedContent = generateFormattedContent({
    fileName: audioFile.file.name,
    timestamp: new Date().toLocaleString(),
    language,
    duration: audioFile.duration ? 
      `${Math.floor(audioFile.duration / 60)}:${Math.floor(audioFile.duration % 60).toString().padStart(2, '0')}` : 
      '0:00',
    wordCount,
    charCount: transcribedText.length,
    spokenLanguage,
    targetLanguage,
    fullTranscription: transcribedText,
    painSummary: transcriptionResult.painSummary,
    gainSummary: transcriptionResult.gainSummary,
    transcriptionMethod
  });

  // Generate unique ID
  const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const result: TranscriptionResult = {
    id,
    fileName: audioFile.file.name,
    duration: audioFile.duration ? 
      `${Math.floor(audioFile.duration / 60)}:${Math.floor(audioFile.duration % 60).toString().padStart(2, '0')}` : 
      '0:00',
    language,
    text: transcribedText,
    timestamp: new Date().toLocaleString(),
    audioUrl: audioFile.url,
    wordCount,
    charCount: transcribedText.length,
    painSummary: transcriptionResult.painSummary,
    gainSummary: transcriptionResult.gainSummary,
    fullTranscription: transcribedText,
    formattedContent,
    spokenLanguage,
    transcriptionTarget: targetLanguage,
    segments: transcriptionResult.segments
  };

  onProgress(100);
  
  // Save to history
  const history = JSON.parse(localStorage.getItem('transcription_history') || '[]');
  history.unshift(result);
  localStorage.setItem('transcription_history', JSON.stringify(history.slice(0, 100))); // Keep last 100
  
  return result;
};

// Generate formatted content for download
const generateFormattedContent = (data: {
  fileName: string;
  timestamp: string;
  language: string;
  duration: string;
  wordCount: number;
  charCount: number;
  spokenLanguage?: string;
  targetLanguage?: 'Thai' | 'English' | 'Both';
  fullTranscription: string;
  painSummary: string;
  gainSummary: string;
  transcriptionMethod: string;
}): string => {
  const isThai = data.targetLanguage === 'Thai';
  
  if (isThai) {
    return `
รายงานการถอดเสียงเป็นข้อความ
${'='.repeat(50)}

ข้อมูลไฟล์:
• ชื่อไฟล์: ${data.fileName}
• วันที่: ${data.timestamp}
• ระยะเวลา: ${data.duration}
• ภาษาที่ตรวจพบ: ${data.language}
• ภาษาที่พูด: ${data.spokenLanguage || 'ไม่ระบุ'}
• ภาษาเป้าหมาย: ${data.targetLanguage || 'ไม่ระบุ'}
• วิธีการถอดเสียง: ${data.transcriptionMethod}

สถิติ:
• จำนวนคำ: ${data.wordCount}
• จำนวนตัวอักษร: ${data.charCount}

${'='.repeat(50)}
ข้อความถอดเสียงเต็ม
${'='.repeat(50)}

${data.fullTranscription}

${'='.repeat(50)}
การวิเคราะห์ปัญหาและประโยชน์
${'='.repeat(50)}

🔴 จุดเจ็บปวด:
${data.painSummary}

🟢 ประโยชน์และผลลัพธ์:
${data.gainSummary}

${'='.repeat(50)}
สร้างเมื่อ ${data.timestamp}
    `.trim();
  } else {
    return `
AUDIO TRANSCRIPTION REPORT
${'='.repeat(50)}

File Information:
• File Name: ${data.fileName}
• Date: ${data.timestamp}
• Duration: ${data.duration}
• Detected Language: ${data.language}
• Spoken Language: ${data.spokenLanguage || 'Not specified'}
• Target Language: ${data.targetLanguage || 'Not specified'}
• Transcription Method: ${data.transcriptionMethod}

Statistics:
• Word Count: ${data.wordCount}
• Character Count: ${data.charCount}

${'='.repeat(50)}
FULL TRANSCRIPTION
${'='.repeat(50)}

${data.fullTranscription}

${'='.repeat(50)}
PAIN & GAIN ANALYSIS
${'='.repeat(50)}

🔴 PAIN POINTS:
${data.painSummary}

🟢 BENEFITS & GAINS:
${data.gainSummary}

${'='.repeat(50)}
Generated on ${data.timestamp}
    `.trim();
  }
};

// Helper function to convert date format from DD/MM/YYYY to YYYY-MM-DD
export const convertDateFormat = (ddmmyyyy: string): string => {
  const [day, month, year] = ddmmyyyy.split('/');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Helper function to format date as DD/MM/YYYY
export const formatDateDDMMYYYY = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${day}/${month}/${year}`;
};

// Declare Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
