import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'ta' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.title': 'VoiceAid Pro',
    'header.subtitle': 'Assistive Technology',
    'header.notifications': 'Notifications',
    'header.speechReminder': 'Speech therapy reminder',
    'header.timeForExercise': 'Time for your daily exercise',
    'header.profile': 'Profile Settings',
    'header.medicalHistory': 'Medical History',
    'header.emergencyContacts': 'Emergency Contacts',
    'header.signOut': 'Sign Out',
    
    // Dashboard
    'dashboard.welcome': 'Welcome to VoiceAid Pro',
    'dashboard.subtitle': 'Your comprehensive assistive technology companion for speech therapy, emotional wellness, and emergency support',
    'dashboard.startSpeech': 'Start Speech Therapy',
    'dashboard.emergencySetup': 'Emergency Setup',
    'dashboard.careModules': 'Your Care Modules',
    'dashboard.careDescription': 'Access comprehensive assistive tools designed specifically for your needs',
    
    // Modules
    'module.speech.title': 'Speech Therapy',
    'module.speech.description': 'AI-powered speech exercises and pronunciation practice',
    'module.speech.button': 'Continue Practice',
    'module.emotion.title': 'Emotion Tracking',
    'module.emotion.description': 'Monitor your emotional wellness and get personalized support',
    'module.emotion.button': 'Check Mood',
    'module.phrases.title': 'Quick Phrases',
    'module.phrases.description': 'Set phrases for emergency situations that repeat aloud',
    'module.phrases.button': 'Manage Phrases',
    'module.emergency.title': 'Emergency Alert',
    'module.emergency.description': 'Quick access to emergency contacts and medical information',
    'module.emergency.button': 'Setup Emergency',
    
    // Stats
    'stats.speechImprovement': 'Speech Improvement',
    'stats.daysActive': 'Days Active',
    'stats.avgMoodScore': 'Avg Mood Score',
    'stats.supportContacts': 'Support Contacts',
    
    // Speech Therapy
    'speech.backToDashboard': 'Back to Dashboard',
    'speech.exercisesCompleted': 'exercises completed',
    'speech.sessionProgress': 'Session Progress',
    'speech.keepPracticing': 'Keep practicing to improve your speech clarity',
    'speech.currentSession': 'Current Session',
    'speech.startRecording': 'Start Recording',
    'speech.stopRecording': 'Stop Recording',
    'speech.whatYouSaid': 'What you said:',
    'speech.accuracyScore': 'Accuracy Score',
    'speech.basedOnWordMatching': 'Based on word matching',
    'speech.excellent': 'Excellent!',
    'speech.nextExercise': 'Next Exercise',
    'speech.allExercises': 'All Exercises',
    'speech.practicePatterns': 'Practice different types of speech patterns',
    
    // Emergency
    'emergency.emergencyAlert': 'Emergency Alert',
    'emergency.pressOnlyEmergency': 'Press only in case of real emergency',
    'emergency.systemReady': 'Emergency System',
  },
  hi: {
    // Header
    'header.title': 'VoiceAid Pro',
    'header.subtitle': 'सहायक तकनीक',
    'header.notifications': 'सूचनाएं',
    'header.speechReminder': 'वाक चिकित्सा अनुस्मारक',
    'header.timeForExercise': 'आपके दैनिक अभ्यास का समय',
    'header.profile': 'प्रोफ़ाइल सेटिंग्स',
    'header.medicalHistory': 'चिकित्सा इतिहास',
    'header.emergencyContacts': 'आपातकालीन संपर्क',
    'header.signOut': 'साइन आउट',
    
    // Dashboard
    'dashboard.welcome': 'VoiceAid Pro में आपका स्वागत है',
    'dashboard.subtitle': 'वाक चिकित्सा, भावनात्मक कल्याण और आपातकालीन सहायता के लिए आपका व्यापक सहायक तकनीक साथी',
    'dashboard.startSpeech': 'वाक चिकित्सा शुरू करें',
    'dashboard.emergencySetup': 'आपातकालीन सेटअप',
    'dashboard.careModules': 'आपके देखभाल मॉड्यूल',
    'dashboard.careDescription': 'आपकी आवश्यकताओं के लिए विशेष रूप से डिज़ाइन किए गए व्यापक सहायक उपकरणों तक पहुंच',
    
    // Modules
    'module.speech.title': 'वाक चिकित्सा',
    'module.speech.description': 'AI-संचालित वाक अभ्यास और उच्चारण अभ्यास',
    'module.speech.button': 'अभ्यास जारी रखें',
    'module.emotion.title': 'भावना ट्रैकिंग',
    'module.emotion.description': 'अपनी भावनात्मक कल्याण की निगरानी करें और व्यक्तिगत सहायता प्राप्त करें',
    'module.emotion.button': 'मूड चेक करें',
    'module.phrases.title': 'त्वरित वाक्य',
    'module.phrases.description': 'आपातकालीन स्थितियों के लिए वाक्य सेट करें जो जोर से दोहराते हैं',
    'module.phrases.button': 'वाक्य प्रबंधित करें',
    'module.emergency.title': 'आपातकालीन चेतावनी',
    'module.emergency.description': 'आपातकालीन संपर्कों और चिकित्सा जानकारी तक त्वरित पहुंच',
    'module.emergency.button': 'आपातकाल सेटअप',
    
    // Stats
    'stats.speechImprovement': 'वाक सुधार',
    'stats.daysActive': 'सक्रिय दिन',
    'stats.avgMoodScore': 'औसत मूड स्कोर',
    'stats.supportContacts': 'सहायता संपर्क',
    
    // Speech Therapy
    'speech.backToDashboard': 'डैशबोर्ड पर वापस',
    'speech.exercisesCompleted': 'अभ्यास पूर्ण',
    'speech.sessionProgress': 'सत्र प्रगति',
    'speech.keepPracticing': 'अपनी वाणी स्पष्टता में सुधार के लिए अभ्यास जारी रखें',
    'speech.currentSession': 'वर्तमान सत्र',
    'speech.startRecording': 'रिकॉर्डिंग शुरू करें',
    'speech.stopRecording': 'रिकॉर्डिंग बंद करें',
    'speech.whatYouSaid': 'आपने क्या कहा:',
    'speech.accuracyScore': 'सटीकता स्कोर',
    'speech.basedOnWordMatching': 'शब्द मिलान के आधार पर',
    'speech.excellent': 'उत्कृष्ट!',
    'speech.nextExercise': 'अगला अभ्यास',
    'speech.allExercises': 'सभी अभ्यास',
    'speech.practicePatterns': 'विभिन्न प्रकार के वाक पैटर्न का अभ्यास करें',
    
    // Emergency
    'emergency.emergencyAlert': 'आपातकालीन चेतावनी',
    'emergency.pressOnlyEmergency': 'केवल वास्तविक आपातकाल में दबाएं',
    'emergency.systemReady': 'आपातकालीन प्रणाली',
  },
  ta: {
    // Header
    'header.title': 'VoiceAid Pro',
    'header.subtitle': 'உதவி தொழில்நுட்பம்',
    'header.notifications': 'அறிவிப்புகள்',
    'header.speechReminder': 'பேச்சு சிகிச்சை நினைவூட்டல்',
    'header.timeForExercise': 'உங்கள் தினசரி பயிற்சியின் நேரம்',
    'header.profile': 'சுயவிவர அமைப்புகள்',
    'header.medicalHistory': 'மருத்துவ வரலாறு',
    'header.emergencyContacts': 'அவசர தொடர்புகள்',
    'header.signOut': 'வெளியேறு',
    
    // Dashboard
    'dashboard.welcome': 'VoiceAid Pro க்கு வரவேற்கிறோம்',
    'dashboard.subtitle': 'பேச்சு சிகிச்சை, உணர்ச்சி நல்வாழ்வு மற்றும் அவசர ஆதரவுக்கான உங்கள் விரிவான உதவி தொழில்நுட்ப துணை',
    'dashboard.startSpeech': 'பேச்சு சிகிச்சை தொடங்கவும்',
    'dashboard.emergencySetup': 'அவசர அமைப்பு',
    'dashboard.careModules': 'உங்கள் பராமரிப்பு தொகுதிகள்',
    'dashboard.careDescription': 'உங்கள் தேவைகளுக்காக குறிப்பாக வடிவமைக்கப்பட்ட விரிவான உதவி கருவிகளை அணுகவும்',
    
    // Modules
    'module.speech.title': 'பேச்சு சிகிச்சை',
    'module.speech.description': 'AI-இயங்கும் பேச்சு பயிற்சிகள் மற்றும் உச்சரிப்பு பயிற்சி',
    'module.speech.button': 'பயிற்சியைத் தொடரவும்',
    'module.emotion.title': 'உணர்ச்சி கண்காணிப்பு',
    'module.emotion.description': 'உங்கள் உணர்ச்சி நல்வாழ்வைக் கண்காணிக்கவும் மற்றும் தனிப்பயன் ஆதரவைப் பெறவும்',
    'module.emotion.button': 'மனநிலை சரிபார்க்கவும்',
    'module.phrases.title': 'விரைவு வாக்கியங்கள்',
    'module.phrases.description': 'அவசர சூழ்நிலைகளுக்கு வாக்கியங்களை அமைக்கவும் அவை உரக்க மீண்டும் சொல்கின்றன',
    'module.phrases.button': 'வாக்கியங்களை நிர்வகிக்கவும்',
    'module.emergency.title': 'அவசர எச்சரிக்கை',
    'module.emergency.description': 'அவசர தொடர்புகள் மற்றும் மருத்துவ தகவல்களுக்கான விரைவான அணுகல்',
    'module.emergency.button': 'அவசர அமைப்பு',
    
    // Stats
    'stats.speechImprovement': 'பேச்சு மேம்பாடு',
    'stats.daysActive': 'செயலில் உள்ள நாட்கள்',
    'stats.avgMoodScore': 'சராசரி மனநிலை மதிப்பெண்',
    'stats.supportContacts': 'ஆதரவு தொடர்புகள்',
    
    // Speech Therapy
    'speech.backToDashboard': 'டாஷ்போர்டுக்கு திரும்பு',
    'speech.exercisesCompleted': 'பயிற்சிகள் முடிந்தது',
    'speech.sessionProgress': 'அமர்வு முன்னேற்றம்',
    'speech.keepPracticing': 'உங்கள் பேச்சு தெளிவை மேம்படுத்த பயிற்சி செய்யுங்கள்',
    'speech.currentSession': 'தற்போதைய அமர்வு',
    'speech.startRecording': 'பதிவை தொடங்கவும்',
    'speech.stopRecording': 'பதிவை நிறுத்தவும்',
    'speech.whatYouSaid': 'நீங்கள் என்ன சொன்னீர்கள்:',
    'speech.accuracyScore': 'துல்லிய மதிப்பெண்',
    'speech.basedOnWordMatching': 'சொல் பொருத்தத்தின் அடிப்படையில்',
    'speech.excellent': 'சிறப்பு!',
    'speech.nextExercise': 'அடுத்த பயிற்சி',
    'speech.allExercises': 'எல்லா பயிற்சிகளும்',
    'speech.practicePatterns': 'பல்வேறு வகையான பேச்சு வடிவங்களை பயிற்சி செய்யுங்கள்',
    
    // Emergency
    'emergency.emergencyAlert': 'அவசர எச்சரிக்கை',
    'emergency.pressOnlyEmergency': 'உண்மையான அவசரநிலையில் மட்டுமே அழுத்தவும்',
    'emergency.systemReady': 'அவசர அமைப்பு',
  },
  te: {
    // Header
    'header.title': 'VoiceAid Pro',
    'header.subtitle': 'సహాయక సాంకేతికత',
    'header.notifications': 'నోటిఫికేషన్లు',
    'header.speechReminder': 'స్పీచ్ థెరపీ రిమైండర్',
    'header.timeForExercise': 'మీ దైనందిన వ్యాయామ సమయం',
    'header.profile': 'ప్రొఫైల్ సెట్టింగ్లు',
    'header.medicalHistory': 'వైద్య చరిత్ర',
    'header.emergencyContacts': 'అత్యవసర పరిచయాలు',
    'header.signOut': 'సైన్ అవుట్',
    
    // Dashboard
    'dashboard.welcome': 'VoiceAid Pro కి స్వాగతం',
    'dashboard.subtitle': 'స్పీచ్ థెరపీ, భావోద్వేగ సంక్షేమం మరియు అత్యవసర మద్దతు కోసం మీ సమగ్ర సహాయక సాంకేతిక భాగస్వామి',
    'dashboard.startSpeech': 'స్పీచ్ థెరపీ ప్రారంభించండి',
    'dashboard.emergencySetup': 'అత్యవసర సెటప్',
    'dashboard.careModules': 'మీ కేర్ మాడ్యూల్స్',
    'dashboard.careDescription': 'మీ అవసరాలకు ప్రత్యేకంగా రూపొందించబడిన సమగ్ర సహాయక సాధనాలను యాక్సెస్ చేయండి',
    
    // Modules
    'module.speech.title': 'స్పీచ్ థెరపీ',
    'module.speech.description': 'AI-శక్తితో నడిచే స్పీచ్ వ్యాయామాలు మరియు ఉచ్చారణ అభ్యాసం',
    'module.speech.button': 'అభ్యాసం కొనసాగించండి',
    'module.emotion.title': 'ఎమోషన్ ట్రాకింగ్',
    'module.emotion.description': 'మీ భావోద్వేగ సంక్షేమాన్ని పర్యవేక్షించండి మరియు వ్యక్తిగత మద్దతును పొందండి',
    'module.emotion.button': 'మూడ్ చెక్ చేయండి',
    'module.phrases.title': 'క్విక్ ఫ్రేసెస్',
    'module.phrases.description': 'అత్యవసర పరిస్థితుల కోసం వాక్యాలను సెట్ చేయండి అవి గట్టిగా పునరావృతం అవుతాయి',
    'module.phrases.button': 'వాక్యాలను నిర్వహించండి',
    'module.emergency.title': 'అత్యవసర హెచ్చరిక',
    'module.emergency.description': 'అత్యవసర పరిచయాలు మరియు వైద్య సమాచారానికి త్వరిత యాక్సెస్',
    'module.emergency.button': 'అత్యవసర సెటప్',
    
    // Stats
    'stats.speechImprovement': 'స్పీచ్ మెరుగుదల',
    'stats.daysActive': 'చురుకైన రోజులు',
    'stats.avgMoodScore': 'సగటు మూడ్ స్కోర్',
    'stats.supportContacts': 'మద్దతు పరిచయాలు',
    
    // Speech Therapy
    'speech.backToDashboard': 'డాష్‌బోర్డ్‌కు తిరిగి',
    'speech.exercisesCompleted': 'వ్యాయామాలు పూర్తయ్యాయి',
    'speech.sessionProgress': 'సెషన్ ప్రోగ్రెస్',
    'speech.keepPracticing': 'మీ స్పీచ్ స్పష్టతను మెరుగుపరచడానికి అభ్యాసం కొనసాగించండి',
    'speech.currentSession': 'ప్రస్తుత సెషన్',
    'speech.startRecording': 'రికార్డింగ్ ప్రారంభించండి',
    'speech.stopRecording': 'రికార్డింగ్ ఆపండి',
    'speech.whatYouSaid': 'మీరు ఏమి చెప్పారు:',
    'speech.accuracyScore': 'ఖచ్చితత్వ స్కోర్',
    'speech.basedOnWordMatching': 'పద మ్యాచింగ్ ఆధారంగా',
    'speech.excellent': 'అద్భుతం!',
    'speech.nextExercise': 'తదుపరి వ్యాయామం',
    'speech.allExercises': 'అన్ని వ్యాయామాలు',
    'speech.practicePatterns': 'విభిన్న రకాల స్పీచ్ పేటర్న్లను అభ్యసించండి',
    
    // Emergency
    'emergency.emergencyAlert': 'అత్యవసర హెచ్చరిక',
    'emergency.pressOnlyEmergency': 'నిజమైన అత్యవసర పరిస్థితిలో మాత్రమే నొక్కండి',
    'emergency.systemReady': 'అత్యవసర వ్యవస్థ',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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