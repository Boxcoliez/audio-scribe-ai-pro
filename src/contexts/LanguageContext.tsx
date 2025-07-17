
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'th';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.title': 'Botnoi Transcription',
    'header.subtitle': 'Professional Audio-to-Text Service',
    'header.home': 'Home',
    'header.transcription': 'Transcription',
    'header.history': 'History',
    'header.settings': 'Settings',
    'header.fast': 'Fast',
    'header.secure': 'Secure',
    'header.multiLang': 'Multi-Lang',
    'header.geminiReady': 'Gemini Ready',
    'header.apiSetupRequired': 'API Setup Required',
    'header.apiError': 'API Error',
    'header.loading': 'Loading...',
    
    // Hero Section
    'hero.title': 'Professional Audio Transcription',
    'hero.subtitle': 'Transform your audio content into accurate text with our AI-powered transcription service. Fast, secure, and supports multiple languages.',
    'hero.startNow': 'Start Transcription Now',
    'hero.learnMore': 'Learn More',
    
    // Features Section
    'features.title': 'Why Choose Our Transcription Service?',
    'features.subtitle': 'Discover the powerful features that make our service the best choice for your transcription needs.',
    'features.transcription.title': 'Lightning Fast',
    'features.transcription.description': 'Get your transcriptions in minutes, not hours. Our AI processes audio files with incredible speed.',
    'features.history.title': 'Enterprise Secure',
    'features.history.description': 'Your data is protected with enterprise-grade security. We never store your audio files permanently.',
    'features.settings.title': 'Multi-Language',
    'features.settings.description': 'Support for 100+ languages with high accuracy. Perfect for global content creators.',
    
    // Settings Page
    'settings.title': 'API Configuration',
    'settings.subtitle': 'Configure your Gemini API key to start transcribing audio files',
    
    // Transcription Page
    'transcription.title': 'Audio Transcription',
    'transcription.subtitle': 'Upload your audio files and get accurate transcriptions powered by AI',
    'transcription.apiKeyRequired': 'API Key Required',
    'transcription.apiKeyRequiredDesc': 'Please configure your Gemini API key first',
    
    // History Page
    'history.title': 'Transcription History',
    'history.subtitle': 'View, manage, and download your previous transcriptions',
    
    // Footer
    'footer.description': 'Professional audio transcription service powered by advanced AI technology.',
    'footer.quickLinks': 'Quick Links',
    'footer.support': 'Support',
    'footer.legal': 'Legal',
    'footer.home': 'Home',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.help': 'Help Center',
    'footer.documentation': 'Documentation',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.rights': 'All rights reserved.',
    
    // Language Selector
    'language.english': 'English',
    'language.thai': 'ไทย',
  },
  th: {
    // Header
    'header.title': 'Botnoi Transcription',
    'header.subtitle': 'บริการแปลงเสียงเป็นข้อความระดับมืออาชีพ',
    'header.home': 'หน้าแรก',
    'header.transcription': 'การถอดเสียง',
    'header.history': 'ประวัติ',
    'header.settings': 'การตั้งค่า',
    'header.fast': 'รวดเร็ว',
    'header.secure': 'ปลอดภัย',
    'header.multiLang': 'หลายภาษา',
    'header.geminiReady': 'Gemini พร้อมใช้',
    'header.apiSetupRequired': 'ต้องตั้งค่า API',
    'header.apiError': 'ข้อผิดพลาด API',
    'header.loading': 'กำลังโหลด...',
    
    // Hero Section
    'hero.title': 'บริการถอดเสียงระดับมืออาชีพ',
    'hero.subtitle': 'เปลี่ยนเนื้อหาเสียงของคุณให้เป็นข้อความที่แม่นยำด้วยบริการถอดเสียงที่ขับเคลื่อนด้วย AI รวดเร็ว ปลอดภัย และรองรับหลายภาषา',
    'hero.startNow': 'เริ่มถอดเสียงตอนนี้',
    'hero.learnMore': 'เรียนรู้เพิ่มเติม',
    
    // Features Section
    'features.title': 'ทำไมต้องเลือกบริการถอดเสียงของเรา?',
    'features.subtitle': 'ค้นพบคุณสมบัติอันทรงพลังที่ทำให้บริการของเราเป็นตัวเลือกที่ดีที่สุดสำหรับความต้องการถอดเสียงของคุณ',
    'features.transcription.title': 'รวดเร็วเหมือนฟ้าแลบ',
    'features.transcription.description': 'รับการถอดเสียงของคุณในไม่กี่นาที ไม่ใช่หลายชั่วโมง AI ของเราประมวลผลไฟล์เสียงด้วยความเร็วที่น่าทึ่ง',
    'features.history.title': 'ปลอดภัยระดับองค์กร',
    'features.history.description': 'ข้อมูลของคุณได้รับการปกป้องด้วยความปลอดภัยระดับองค์กร เราไม่เก็บไฟล์เสียงของคุณไว้อย่างถาวร',
    'features.settings.title': 'หลายภาษา',
    'features.settings.description': 'รองรับมากกว่า 100 ภาษาด้วยความแม่นยำสูง เหมาะสำหรับผู้สร้างเนื้อหาระดับโลก',
    
    // Settings Page
    'settings.title': 'การตั้งค่า API',
    'settings.subtitle': 'ตั้งค่า Gemini API key ของคุณเพื่อเริ่มการถอดเสียงไฟล์เสียง',
    
    // Transcription Page
    'transcription.title': 'การถอดเสียง',
    'transcription.subtitle': 'อัปโหลดไฟล์เสียงของคุณและรับการถอดเสียงที่แม่นยำด้วยพลัง AI',
    'transcription.apiKeyRequired': 'จำเป็นต้องมี API Key',
    'transcription.apiKeyRequiredDesc': 'กรุณาตั้งค่า Gemini API key ก่อน',
    
    // History Page
    'history.title': 'ประวัติการถอดเสียง',
    'history.subtitle': 'ดู จัดการ และดาวน์โหลดการถอดเสียงก่อนหน้าของคุณ',
    
    // Footer
    'footer.description': 'บริการถอดเสียงระดับมืออาชีพที่ขับเคลื่อนด้วยเทคโนโลยี AI ขั้นสูง',
    'footer.quickLinks': 'ลิงก์ด่วน',
    'footer.support': 'การสนับสนุน',
    'footer.legal': 'กฎหมาย',
    'footer.home': 'หน้าแรก',
    'footer.about': 'เกี่ยวกับเรา',
    'footer.contact': 'ติดต่อ',
    'footer.help': 'ศูนย์ช่วยเหลือ',
    'footer.documentation': 'เอกสาร',
    'footer.privacy': 'นโยบายความเป็นส่วนตัว',
    'footer.terms': 'ข้อกำหนดการให้บริการ',
    'footer.rights': 'สงวนลิขสิทธิ์',
    
    // Language Selector
    'language.english': 'English',
    'language.thai': 'ไทย',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'th')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
