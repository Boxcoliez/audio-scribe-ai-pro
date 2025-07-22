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
    'hero.title': 'BOTNOI Transcription',
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
    'transcription.uploadTitle': 'Upload Audio File',
    'transcription.uploadSubtitle': 'Drag and drop your audio file or click to browse',
    'transcription.supportedFormats': 'Supported formats: MP3, WAV, M4A',
    'transcription.processing': 'Processing...',
    'transcription.selectFile': 'Select File',
    'transcription.resultsTitle': 'Transcription Results',
    'transcription.noResults': 'No transcription results yet. Upload an audio file to get started.',
    'transcription.download': 'Download Text',
    'transcription.copy': 'Copy to Clipboard',
    'transcription.fileName': 'File Name',
    'transcription.duration': 'Duration',
    'transcription.language': 'Language',
    'transcription.wordCount': 'Word Count',
    'transcription.charCount': 'Character Count',
    'transcription.items': 'items',
    'transcription.searchPlaceholder': 'Search by filename or content...',
    'transcription.date1': 'All Time',
    'transcription.date2': 'Today',
    'transcription.date3': 'This Week',
    'transcription.date4': 'This Month',
    'transcription.date5': 'Custom Range',
    'transcription.AllLanguages': 'All Languages',
    'transcription.SelectAll': 'Select All',
    'transcription.Notranscriptions': 'No transcriptions found',
    'transcription.NoTranscriptionsDesc': 'Start transcribing audio files to build your history.',
    'transcription.NoTranscriptionsDesc2': 'Try adjusting your search or filters.',
    
    // History Page
    'history.title': 'Transcription History',
    'history.subtitle': 'View, manage, and download your previous transcriptions',
    'history.noHistory': 'No transcription history found.',
    'history.loadTranscription': 'Load Transcription',
    'history.delete': 'Delete',
    'history.export': 'Export',
    'history.managePrevious': 'Manage and filter your previous transcriptions',
    'history.items': 'items',
    'history.searchPlaceholder': 'Search by filename or content...',
    'history.filterLanguage': 'Filter by language',
    'history.filterDate': 'Filter by date',
    'history.allLanguages': 'All Languages',
    'history.allTime': 'All Time',
    'history.today': 'Today',
    'history.thisWeek': 'This Week',
    'history.thisMonth': 'This Month',
    'history.customRange': 'Custom Range',
    'history.startDate': 'Start date',
    'history.endDate': 'End date',
    'history.selectAll': 'Select All',
    'history.all': 'All',
    'history.downloadSelected': 'Download Selected',
    'history.deleteSelected': 'Delete Selected',
    'history.edit': 'Edit',
    'history.view': 'View',
    'history.copy': 'Copy',
    'history.download': 'Download',
    'history.noResults': 'No results found',
    'history.noResultsDesc': 'Try adjusting your search or filter criteria.',
    'history.itemsDeleted': 'Items Deleted',
    'history.itemsDeletedDesc': 'transcription(s) deleted',
    'history.itemDeleted': 'Item Deleted',
    'history.itemDeletedDesc': 'Transcription deleted successfully',
    'history.nameUpdated': 'Name Updated',
    'history.nameUpdatedDesc': 'File name updated successfully',
    'history.downloadStarted': 'Download Started',
    'history.downloadDesc': 'Enhanced transcription report downloaded',
    'history.downloadMultipleDesc': 'enhanced transcription report(s) downloaded',
    'history.textCopied': 'Text Copied',
    'history.textCopiedDesc': 'Transcription text copied to clipboard',
    'history.copyFailed': 'Copy Failed',
    'history.copyFailedDesc': 'Failed to copy text to clipboard',
    'history.audioError': 'Audio Playback Error',
    'history.audioErrorDesc': 'Unable to play audio file. The file may be corrupted or in an unsupported format.',
    
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
    
    // Common
    'common.learnMore': 'Learn More',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    
    // Audio Uploader
    'audioUploader.title': 'Audio File Upload',
    'audioUploader.subtitle': 'Upload your audio file for AI transcription (MP3, WAV, M4A, MP4 - Max 25MB)',
    'audioUploader.dropHere': 'Drop your audio file here',
    'audioUploader.clickToBrowse': 'or click to browse files',
    'audioUploader.transcribing': 'Transcribing audio...',
    'audioUploader.startTranscription': 'Start Transcription',
    'audioUploader.transcribingProgress': 'Transcribing...',
    'audioUploader.apiKeyRequired': 'Please configure your API key to start transcription',
    
    // Transcription Results
    'transcriptionResults.title': 'Transcription Results',
    'transcriptionResults.subtitle': 'AI-powered transcription completed successfully',
    'transcriptionResults.uploadSubtitle': 'Upload and transcribe an audio file to see results here',
    'transcriptionResults.noTranscription': 'No Transcription Yet',
    'transcriptionResults.uploadToStart': 'Upload an audio file and start transcription to see results',
    'transcriptionResults.completed': 'Completed',
    'transcriptionResults.originalAudio': 'Original Audio',
    'transcriptionResults.clickToPlay': 'Click to play/pause',
    'transcriptionResults.transcriptionText': 'Transcription Text',
    'transcriptionResults.words': 'Words',
    'transcriptionResults.copyText': 'Copy Text',
    'transcriptionResults.downloadTxt': 'Download .txt',
    'transcriptionResults.painGainAnalysis': 'Pain & Gain Analysis',
    'transcriptionResults.painPoints': 'Pain Points',
    'transcriptionResults.benefitsGains': 'Benefits & Gains',
    
    // History
    'historyComponent.title': 'Transcription History',
    'historyComponent.subtitle': 'Manage and download your previous transcriptions',
    'historyComponent.noHistory': 'No transcription history found.',
    'historyComponent.noHistoryDesc': 'Start transcribing audio files to build your history.',
    'historyComponent.clearAll': 'Clear All',
    'historyComponent.exportAll': 'Export All',
    
    // API Setup
    'apiSetup.title': 'API Configuration',
    'apiSetup.subtitle': 'Configure your Google Gemini API for AI transcription',
    'apiSetup.apiKeyLabel': 'Google Gemini API Key',
    'apiSetup.apiKeyPlaceholder': 'Enter your API key (AIza...)',
    'apiSetup.validateSave': 'Validate & Save',
    'apiSetup.validating': 'Validating...',
    'apiSetup.validated': 'Validated',
    'apiSetup.needApiKey': 'Need an API Key?',
    'apiSetup.getApiKeyDesc': 'Get your free Google Gemini API key from Google AI Studio. The free tier includes generous usage limits perfect for personal projects.',
    'apiSetup.getApiKey': 'Get API Key',
    'apiSetup.freeTier': 'Free Tier',
    'apiSetup.highAccuracy': 'High Accuracy',
    'apiSetup.requestsPerMin': '15 requests/min',
    'apiSetup.precision': '99.5%+ precision',
    'apiSetup.readyToStart': 'Ready to Start!',
    'apiSetup.configuredDesc': 'Your API is configured. Start transcribing audio files now.',
    'apiSetup.startTranscribing': 'Start Transcribing',
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
    'hero.title': 'บอทน้อย บริการถอดเสียงระดับมืออาชีพ',
    'hero.subtitle': 'เปลี่ยนเนื้อหาเสียงของคุณให้เป็นข้อความที่แม่นยำด้วยบริการถอดเสียงที่ขับเคลื่อนด้วย AI รวดเร็ว ปลอดภัย และรองรับหลายภาษา',
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
    'transcription.uploadTitle': 'อัปโหลดไฟล์เสียง',
    'transcription.uploadSubtitle': 'ลากและวางไฟล์เสียงของคุณหรือคลิกเพื่อเลือกไฟล์',
    'transcription.supportedFormats': 'รูปแบบที่รองรับ: MP3, WAV, M4A',
    'transcription.processing': 'กำลังประมวลผล...',
    'transcription.selectFile': 'เลือกไฟล์',
    'transcription.resultsTitle': 'ผลการถอดเสียง',
    'transcription.noResults': 'ยังไม่มีผลการถอดเสียง อัปโหลดไฟล์เสียงเพื่อเริ่มต้น',
    'transcription.download': 'ดาวน์โหลดข้อความ',
    'transcription.copy': 'คัดลอกไปยังคลิปบอร์ด',
    'transcription.fileName': 'ชื่อไฟล์',
    'transcription.duration': 'ระยะเวลา',
    'transcription.language': 'ภาษา',
    'transcription.wordCount': 'จำนวนคำ',
    'transcription.charCount': 'จำนวนตัวอักษร',
    'transcription.items': 'รายการ',
    'transcription.searchPlaceholder': 'ค้นหาตามชื่อไฟล์หรือเนื้อหา...',
    'transcription.date1': 'ตลอดเวลา',
    'transcription.date2': 'วันนี้',
    'transcription.date3': 'สัปดาห์นี้',
    'transcription.date4': 'เดือนนี้',
    'transcription.date5': 'ช่วงวันที่กำหนด',
    'transcription.AllLanguages': 'ทุกภาษา',
    'transcription.SelectAll': 'เลือกทั้งหมด',
    'transcription.Notranscriptions': 'ไม่พบการถอดเสียง',
    'transcription.NoTranscriptionsDesc': 'เริ่มการถอดเสียงไฟล์เสียงเพื่อสร้างประวัติของคุณ',
    'transcription.NoTranscriptionsDesc2': 'ลองปรับการค้นหาหรือฟิลเตอร์ของคุณ',
    
    // History Page
    'history.title': 'ประวัติการถอดเสียง',
    'history.subtitle': 'ดู จัดการ และดาวน์โหลดการถอดเสียงก่อนหน้าของคุณ',
    'history.noHistory': 'ไม่พบประวัติการถอดเสียง',
    'history.loadTranscription': 'โหลดการถอดเสียง',
    'history.delete': 'ลบ',
    'history.export': 'ส่งออก',
    'history.managePrevious': 'จัดการและกรองการถอดเสียงก่อนหน้านี้ของคุณ',
    'history.items': 'รายการ',
    'history.searchPlaceholder': 'ค้นหาตามชื่อไฟล์หรือเนื้อหา...',
    'history.filterLanguage': 'กรองตามภาษา',
    'history.filterDate': 'กรองตามวันที่',
    'history.allLanguages': 'ทุกภาษา',
    'history.allTime': 'ทุกช่วงเวลา',
    'history.today': 'วันนี้',
    'history.thisWeek': 'สัปดาห์นี้',
    'history.thisMonth': 'เดือนนี้',
    'history.customRange': 'ช่วงกำหนดเอง',
    'history.startDate': 'วันที่เริ่มต้น',
    'history.endDate': 'วันที่สิ้นสุด',
    'history.selectAll': 'เลือกทั้งหมด',
    'history.all': 'ทั้งหมด',
    'history.downloadSelected': 'ดาวน์โหลดที่เลือก',
    'history.deleteSelected': 'ลบที่เลือก',
    'history.edit': 'แก้ไข',
    'history.view': 'ดู',
    'history.copy': 'คัดลอก',
    'history.download': 'ดาวน์โหลด',
    'history.noResults': 'ไม่พบผลลัพธ์',
    'history.noResultsDesc': 'ลองปรับเกณฑ์การค้นหาหรือตัวกรองของคุณ',
    'history.itemsDeleted': 'ลบรายการแล้ว',
    'history.itemsDeletedDesc': 'การถอดเสียงถูกลบแล้ว',
    'history.itemDeleted': 'ลบรายการแล้ว',
    'history.itemDeletedDesc': 'ลบการถอดเสียงเรียบร้อยแล้ว',
    'history.nameUpdated': 'อัปเดตชื่อแล้ว',
    'history.nameUpdatedDesc': 'อัปเดตชื่อไฟล์เรียบร้อยแล้ว',
    'history.downloadStarted': 'เริ่มดาวน์โหลดแล้ว',
    'history.downloadDesc': 'ดาวน์โหลดรายงานการถอดเสียงขั้นสูงแล้ว',
    'history.downloadMultipleDesc': 'ดาวน์โหลดรายงานการถอดเสียงขั้นสูงแล้ว',
    'history.textCopied': 'คัดลอกข้อความแล้ว',
    'history.textCopiedDesc': 'คัดลอกข้อความการถอดเสียงไปยังคลิปบอร์ดแล้ว',
    'history.copyFailed': 'คัดลอกไม่สำเร็จ',
    'history.copyFailedDesc': 'ไม่สามารถคัดลอกข้อความไปยังคลิปบอร์ดได้',
    'history.audioError': 'ข้อผิดพลาดในการเล่นเสียง',
    'history.audioErrorDesc': 'ไม่สามารถเล่นไฟล์เสียงได้ ไฟล์อาจเสียหายหรืออยู่ในรูปแบบที่ไม่รองรับ',
    
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
    
    // Common
    'common.learnMore': 'เรียนรู้เพิ่มเติม',
    'common.loading': 'กำลังโหลด...',
    'common.error': 'ข้อผิดพลาด',
    'common.success': 'สำเร็จ',
    'common.cancel': 'ยกเลิก',
    'common.save': 'บันทึก',
    'common.delete': 'ลบ',
    'common.edit': 'แก้ไข',
    'common.close': 'ปิด',
    
    // Audio Uploader
    'audioUploader.title': 'อัปโหลดไฟล์เสียง',
    'audioUploader.subtitle': 'อัปโหลดไฟล์เสียงของคุณเพื่อการถอดเสียงด้วย AI (MP3, WAV, M4A, MP4- สูงสุด 25MB)',
    'audioUploader.dropHere': 'วางไฟล์เสียงของคุณที่นี่',
    'audioUploader.clickToBrowse': 'หรือคลิกเพื่อเลือกไฟล์',
    'audioUploader.transcribing': 'กำลังถอดเสียง...',
    'audioUploader.startTranscription': 'เริ่มการถอดเสียง',
    'audioUploader.transcribingProgress': 'กำลังถอดเสียง...',
    'audioUploader.apiKeyRequired': 'กรุณาตั้งค่า API key ก่อนเริ่มการถอดเสียง',
    
    // Transcription Results
    'transcriptionResults.title': 'ผลการถอดเสียง',
    'transcriptionResults.subtitle': 'การถอดเสียงด้วย AI เสร็จสมบูรณ์แล้ว',
    'transcriptionResults.uploadSubtitle': 'อัปโหลดและถอดเสียงไฟล์เสียงเพื่อดูผลลัพธ์ที่นี่',
    'transcriptionResults.noTranscription': 'ยังไม่มีการถอดเสียง',
    'transcriptionResults.uploadToStart': 'อัปโหลดไฟล์เสียงและเริ่มการถอดเสียงเพื่อดูผลลัพธ์',
    'transcriptionResults.completed': 'เสร็จสมบูรณ์',
    'transcriptionResults.originalAudio': 'เสียงต้นฉบับ',
    'transcriptionResults.clickToPlay': 'คลิกเพื่อเล่น/หยุด',
    'transcriptionResults.transcriptionText': 'ข้อความที่ถอดเสียง',
    'transcriptionResults.words': 'คำ',
    'transcriptionResults.copyText': 'คัดลอกข้อความ',
    'transcriptionResults.downloadTxt': 'ดาวน์โหลด .txt',
    'transcriptionResults.painGainAnalysis': 'การวิเคราะห์ปัญหาและประโยชน์',
    'transcriptionResults.painPoints': 'จุดเจ็บปวด',
    'transcriptionResults.benefitsGains': 'ประโยชน์และผลลัพธ์',
    
    // History
    'historyComponent.title': 'ประวัติการถอดเสียง',
    'historyComponent.subtitle': 'จัดการและดาวน์โหลดการถอดเสียงก่อนหน้าของคุณ',
    'historyComponent.noHistory': 'ไม่พบประวัติการถอดเสียง',
    'historyComponent.noHistoryDesc': 'เริ่มการถอดเสียงไฟล์เสียงเพื่อสร้างประวัติของคุณ',
    'historyComponent.clearAll': 'ล้างทั้งหมด',
    'historyComponent.exportAll': 'ส่งออกทั้งหมด',
    
    // API Setup
    'apiSetup.title': 'การตั้งค่า API',
    'apiSetup.subtitle': 'ตั้งค่า Google Gemini API ของคุณสำหรับการถอดเสียงด้วย AI',
    'apiSetup.apiKeyLabel': 'Google Gemini API Key',
    'apiSetup.apiKeyPlaceholder': 'ใส่ API key ของคุณ (AIza...)',
    'apiSetup.validateSave': 'ตรวจสอบและบันทึก',
    'apiSetup.validating': 'กำลังตรวจสอบ...',
    'apiSetup.validated': 'ตรวจสอบแล้ว',
    'apiSetup.needApiKey': 'ต้องการ API Key?',
    'apiSetup.getApiKeyDesc': 'รับ Google Gemini API key ฟรีจาก Google AI Studio แพ็กเกจฟรีมีขอบเขตการใช้งานที่เหมาะสำหรับโปรเจ็กต์ส่วนตัว',
    'apiSetup.getApiKey': 'รับ API Key',
    'apiSetup.freeTier': 'แพ็กเกจฟรี',
    'apiSetup.highAccuracy': 'ความแม่นยำสูง',
    'apiSetup.requestsPerMin': '15 คำขอ/นาที',
    'apiSetup.precision': 'ความแม่นยำ 99.5%+',
    'apiSetup.readyToStart': 'พร้อมเริ่มต้น!',
    'apiSetup.configuredDesc': 'API ของคุณได้รับการตั้งค่าแล้ว เริ่มการถอดเสียงไฟล์เสียงตอนนี้',
    'apiSetup.startTranscribing': 'เริ่มการถอดเสียง',
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
