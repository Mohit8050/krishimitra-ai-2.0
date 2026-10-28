export type SupportedLanguage = 'en-IN' | 'kn-IN' | 'hi-IN' | 'mr-IN' | 'te-IN';

export interface LanguageMeta {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  short: string;
}

export const LANGUAGES: LanguageMeta[] = [
  { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🟡', short: 'ಕನ್ನಡ' },
  { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', short: 'हिन्दी' },
  { code: 'en-IN', name: 'English', nativeName: 'English', flag: '🇬🇧', short: 'EN' },
  { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', flag: '🚩', short: 'मराठी' },
  { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', flag: '☀️', short: 'తెలుగు' }
];

export const TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  'kn-IN': {
    appName: 'ಕೃಷಿ ಮಿತ್ರ AI',
    tagline: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ • ಲೈವ್ ಹವಾಮಾನ • ಮಂಡಿ ಬೆಲೆಗಳು • AI ವೈದ್ಯ',
    backendActive: 'ಲೈವ್ ಬ್ಯಾಕೆಂಡ್ ಸಕ್ರಿಯ',

    // Nav Hubs
    navHome: 'ಮುಖಪುಟ',
    navCrops: 'ಬೆಳೆ & ರೋಗ',
    navMarket: 'ಮಂಡಿ & ಖಾತೆ',
    navWater: 'ನೀರಾವರಿ & ಯೋಜನೆ',
    navVoice: 'ಧ್ವನಿ AI',
    navPages: 'ಎಲ್ಲಾ 14 ಮಾಡ್ಯೂಲ್‌ಗಳು',
    backToHome: '← ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ',

    // Sub-nav Crops
    subLeafDoctor: '📸 ಎಲೆ ರೋಗ ಪರೀಕ್ಷೆ',
    subFertilizer: '🧪 ರಸಗೊಬ್ಬರ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
    subCropMatch: '🌱 ಬೆಳೆ ಆಯ್ಕೆ ಶಿಫಾರಸು',
    subOrganic: '🌿 ಸಾವಯವ ಕೃಷಿ ವಿಧಾನ',

    // Sub-nav Market
    subMandi: '📈 ಇಂದಿನ ಮಂಡಿ ದರ',
    subKhata: '📒 ಕಿಸಾನ್ ಖಾತೆ (ವೆಚ್ಚ & ಲಾಭ)',
    subSell: '🛒 ನೇರವಾಗಿ ಬೆಳೆ ಮಾರಿ',
    subMachinery: '🚜 ಯಂತ್ರೋಪಕರಣ ಬಾಡಿಗೆ (CHC)',
    subStore: '🛍️ ರಿಯಾಯಿತಿ ಕೃಷಿ ಅಂಗಡಿ',

    // Sub-nav Water & Govt
    subWeather: '☁️ ಹವಾಮಾನ & ಔಷಧಿ ಸಿಂಪಡಣೆ',
    subPump: '⚡ ಸ್ಮಾರ್ಟ್ ಪಂಪ್ 220V',
    subInsurance: '🛡️ 72 ಗಂಟೆ ಬೆಳೆ ವಿಮೆ & ಕೋಲ್ಡ್ ಸ್ಟೋರೇಜ್',
    subSchemes: '🏛️ ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ ಯೋಜನೆಗಳು',

    // Daily Banner
    bannerWeather: 'ಇಂದಿನ ಹವಾಮಾನ',
    bannerGreeting: 'ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ!',
    bannerQuestion: 'ಇಂದು ಹೊಲದಲ್ಲಿ ಏನು ಕೆಲಸ ಮಾಡಬೇಕು?',
    bannerDesc: 'ಲೈವ್ ಹವಾಮಾನ, ಮಂಡಿ ಬೆಲೆ, ನಿಖರ ರಸಗೊಬ್ಬರ, ಬೆಳೆ ರೋಗ ಮತ್ತು ಕೃಷಿ ವೆಚ್ಚ — ಎಲ್ಲವೂ ಕೇವಲ 1 ಕ್ಲಿಕ್‌ನಲ್ಲಿ.',
    bannerSpraySafe: 'ಔಷಧ ಸಿಂಪಡಣೆಗೆ ಉತ್ತಮ ಸಮಯ',
    bannerSprayCaution: 'ಎಚ್ಚರಿಕೆ: ಗಾಳಿ/ಮಳೆ ಅಪಾಯ',
    mandiActive: 'ಬೆಳೆಗಳು ಲೈವ್',
    tempLive: 'ತಾಪಮಾನ',
    wind: 'ಗಾಳಿ',
    humidity: 'ತೇವಾಂಶ',
    tubewellMotor: 'ಬೋರ್ವೆಲ್ ಮೋಟಾರ್',
    motorOn: 'ಮೋಟಾರ್ ಚಾಲನೆಯಲ್ಲಿದೆ',
    motorOff: 'ಮೋಟಾರ್ ಆಫ್ ಆಗಿದೆ',

    // Quick Voice Prompts
    voiceChipTitle: 'ಒಂದೇ ಕ್ಲಿಕ್‌ನಲ್ಲಿ ಧ್ವನಿಯಿಂದ ಕೇಳಿ (Tap to Ask):',
    voiceNoType: 'ಟೈಪ್ ಮಾಡದೆ ಕೇಳಿ',
    voicePrompt1: '🌧️ ಇಂದು ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಲು ಸೂಕ್ತ ಸಮಯವೇ?',
    voicePrompt2: '🌾 ಭತ್ತಕ್ಕೆ ಯೂರಿಯಾ ಮತ್ತು ಡಿಎಪಿ ಎಷ್ಟು ಹಾಕಬೇಕು?',
    voicePrompt3: '🍅 ಇಂದಿನ ಟೊಮೆಟೊ ಮಂಡಿ ದರ ಎಷ್ಟಿದೆ?',
    voicePrompt4: '🍃 ಎಲೆಗಳ ಮೇಲೆ ಹಳದಿ ಕಪ್ಪು ಚುಕ್ಕೆಗಳಿವೆ, ಏನು ಔಷಧ ಹಾಕಬೇಕು?',
    voicePrompt5: '🚜 ಡ್ರೋನ್ ಸ್ಪ್ರೇಯರ್ ಬಾಡಿಗೆ ದರ ಎಷ್ಟು?',
    askPlaceholder: 'ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ (ಉದಾ: ಹತ್ತಿ ಹುಳುವಿನ ಔಷಧ, ಗೋಧಿ ಮಂಡಿ ದರ, ಪಂಪ್ ವೋಲ್ಟೇಜ್)...',
    askBtn: 'ಕೇಳಿ',
    thinking: 'ಯೋಚಿಸುತ್ತಿದೆ...',

    // 6 Big Action Tiles
    tileLeafTitle: 'ಎಲೆ ಡಾಕ್ಟರ್ • Leaf Scanner',
    tileLeafDesc: 'ಬೆಳೆಯ ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ. 5 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ರೋಗ ಪತ್ತೆ ಮತ್ತು ಸರಿಯಾದ ಔಷಧ ತಿಳಿಯಿರಿ.',
    tileLeafBtn: 'ಫೋಟೋ ತೆಗೆಯಿರಿ (Scan)',

    tileMandiTitle: 'ಇಂದಿನ ಮಂಡಿ ದರ • Mandi Rates',
    tileMandiDesc: 'ದಾವಣಗೆರೆ, ರಾಯಚೂರು, ಕಲಬುರಗಿ ಮಂಡಿಗಳ ಇಂದಿನ ಲೈವ್ ದರ ಮತ್ತು ಲಾಭದ ಲೆಕ್ಕಾಚಾರ.',
    tileMandiBtn: 'ದರ ಪರಿಶೀಲಿಸಿ (View)',

    tileFertTitle: 'ರಸಗೊಬ್ಬರ ಲೆಕ್ಕ • NPK Fertilizer',
    tileFertDesc: 'ನಿಮ್ಮ ಜಮೀನಿಗೆ ಎಷ್ಟು ಚೀಲ ಯೂರಿಯಾ, ಡಿಎಪಿ, ಪೊಟ್ಯಾಶ್ ಬೇಕು ಎಂದು ನಿಖರವಾಗಿ ಲೆಕ್ಕ ಹಾಕಿ.',
    tileFertBtn: 'ಗೊಬ್ಬರ ಲೆಕ್ಕ ಹಾಕಿ',

    tileKhataTitle: 'ಕಿಸಾನ್ ಖಾತೆ • Farm Expense Ledger',
    tileKhataDesc: 'ಉಳುಮೆ, ಬೀಜ, ಕೂಲಿ ಖರ್ಚು ಬರೆದಿಡಿ. ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ನಿಮ್ಮ ಉತ್ಪಾದನಾ ವೆಚ್ಚ ತಿಳಿಯಿರಿ.',
    tileKhataBtn: 'ಖಾತೆ ತೆರೆಯಿರಿ (Khata)',

    tileMachTitle: 'ಟ್ರ್ಯಾಕ್ಟರ್ & ಡ್ರೋನ್ ಬಾಡಿಗೆ • CHC Hub',
    tileMachDesc: 'ಕೊಯ್ಲು ಯಂತ್ರ, ರೋಟಾವೇಟರ್ ಮತ್ತು 40L ಡ್ರೋನ್ ಸ್ಪ್ರೇಯರ್ ಗಂಟೆ ಅಥವಾ ಎಕರೆ ಲೆಕ್ಕದಲ್ಲಿ ಬುಕ್ ಮಾಡಿ.',
    tileMachBtn: 'ಯಂತ್ರ ಬುಕ್ ಮಾಡಿ',

    tilePumpTitle: 'ಬೋರ್ವೆಲ್ ಮೋಟಾರ್ ರಿಮೋಟ್ • Smart Pump',
    tilePumpDesc: 'ವೋಲ್ಟೇಜ್ 220V ಮೇಲ್ವಿಚಾರಣೆ. ವಿದ್ಯುತ್ ಏರಿಳಿತವಾದಾಗ ಮೋಟಾರ್ ಸುಟ್ಟುಹೋಗದಂತೆ ಆಟೋ-ಆಫ್.',
    tilePumpBtn: 'ಪಂಪ್ ನಿಯಂತ್ರಣ',

    // Secondary
    secInsurance: '72 ಗಂಟೆ ಬೆಳೆ ವಿಮೆ (PMFBY)',
    secSchemes: 'ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ (KUSUM, KISAN)',
    secMarket: 'ನೇರವಾಗಿ ಬೆಳೆ ಮಾರಿ (Direct Sell)',
    secOrganic: 'ಜೀವಾಮೃತ & ಸಾವಯವ ಸೂತ್ರ',

    // Guide
    guideTitle: 'ರೈತ ಮಿತ್ರ: ಆ್ಯಪ್ ಬಳಸಲು 3 ಸುಲಭ ಹಂತಗಳು',
    guideStep1Title: '೧. ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಮಾತನಾಡಿ',
    guideStep1Desc: 'ಹಾಳಾದ ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ನೇರವಾಗಿ ಕನ್ನಡದಲ್ಲಿ ನಿಮ್ಮ ಸಮಸ್ಯೆ ಹೇಳಿ.',
    guideStep2Title: '೨. ನಿಖರ ಗೊಬ್ಬರ & ಔಷಧ ತಿಳಿಯಿರಿ',
    guideStep2Desc: 'ಕ್ಯಾಲ್ಕುಲೇಟರ್ ಮೂಲಕ ಜಮೀನಿನ ಅಳತೆಗೆ ಸರಿಯಾಗಿ ಚೀಲಗಳ ಲೆಕ್ಕ ಮತ್ತು ಸಿಂಪಡಣೆ ವಿವರ ಪಡೆಯಿರಿ.',
    guideStep3Title: '೩. ಮಂಡಿಯಲ್ಲಿ ಉತ್ತಮ ಬೆಲೆಗೆ ಮಾರಿ',
    guideStep3Desc: 'ಮಂಡಿ ಬೆಲೆ ಹಾಗೂ ನಿಮ್ಮ ಉತ್ಪಾದನಾ ವೆಚ್ಚ ಪರಿಶೀಲಿಸಿ ಉತ್ತಮ ಲಾಭಕ್ಕೆ ನೇರವಾಗಿ ಮಾರಾಟ ಮಾಡಿ.'
  },

  'hi-IN': {
    appName: 'कृषि मित्र AI',
    tagline: 'स्मार्ट फार्मिंग • रियल-टाइम मौसम • लाइव मंडी भाव • AI डॉक्टर',
    backendActive: 'लाइव बैकएंड सक्रिय',

    navHome: 'मुख्य पृष्ठ',
    navCrops: 'फसल व खाद',
    navMarket: 'मंडी व खाता',
    navWater: 'सिंचाई व योजना',
    navVoice: 'बोलकर पूछें',
    navPages: 'सभी 14 मॉड्युल्स',
    backToHome: '← मुख्य पृष्ठ पर जाएं',

    subLeafDoctor: '📸 पत्ता डॉक्टर (Disease Scanner)',
    subFertilizer: '🧪 खाद कैलकुलेटर (NPK Fertilizer)',
    subCropMatch: '🌱 फसल चयन (Crop Matcher)',
    subOrganic: '🌿 जैविक खेती (Organic Guides)',

    subMandi: '📈 आज का मंडी भाव (Mandi Rates)',
    subKhata: '📒 किसान खाता (Farm P&L Ledger)',
    subSell: '🛒 सीधे फसल बेचें (Marketplace)',
    subMachinery: '🚜 मशीनरी व ड्रोन किराया (Machinery CHC)',
    subStore: '🛍️ रियायती कृषि स्टोर (Store)',

    subWeather: '☁️ मौसम व स्प्रे सलाह (Weather & Spray)',
    subPump: '⚡ ट्यूबवेल मोटर 220V (Smart Pump)',
    subInsurance: '🛡️ 72h फसल बीमा व कोल्ड स्टोरेज',
    subSchemes: '🏛️ सरकारी सब्सिडी (Govt Schemes)',

    bannerWeather: 'आज का मौसम',
    bannerGreeting: 'नमस्ते किसान साथी!',
    bannerQuestion: 'आज खेत में क्या करना है?',
    bannerDesc: 'लाइव मौसम, मंडी भाव, खाद की सही मात्रा, फसल की बीमारी और खर्चे का हिसाब — सब कुछ सिर्फ 1 क्लिक में।',
    bannerSpraySafe: 'दवा छिड़कना सुरक्षित (Safe Spray Window)',
    bannerSprayCaution: 'सावधानी: तेज हवा या बारिश की चेतावनी',
    mandiActive: 'फसलें लाइव',
    tempLive: 'तापमान',
    wind: 'हवा',
    humidity: 'नमी',
    tubewellMotor: 'ट्यूबवेल मोटर',
    motorOn: 'मोटर चालू है',
    motorOff: 'मोटर बंद है',

    voiceChipTitle: 'एक क्लिक में सीधे सवाल पूछें (Tap to Ask):',
    voiceNoType: 'बिना लिखे पूछें',
    voicePrompt1: '🌧️ आज का मौसम और दवा छिड़कने का सही समय क्या है?',
    voicePrompt2: '🌾 धान (Paddy) में यूरिया और डीएपी कितना डालें?',
    voicePrompt3: '🍅 टमाटर का आज का मंडी भाव क्या है?',
    voicePrompt4: '🍃 पत्ते पर पीले और काले धब्बे हैं, कौन सी दवा छिड़कें?',
    voicePrompt5: '🚜 ड्रोन स्प्रेयर और कंबाइन हार्वेस्टर का किराया क्या है?',
    askPlaceholder: 'कोई भी सवाल पूछें (जैसे: कपास में कीट की दवा, गेहूं का भाव, पंप वोल्टेज)...',
    askBtn: 'पूछें',
    thinking: 'सोच रहा है...',

    tileLeafTitle: 'पत्ता डॉक्टर • Leaf Scanner',
    tileLeafDesc: 'फसल के पत्ते की फोटो खींचें। 5 सेकंड में बीमारी, कारण और सही कीटनाशक व जैविक इलाज जानें।',
    tileLeafBtn: 'फोटो खींचें (Scan Now)',

    tileMandiTitle: 'आज का मंडी भाव • Mandi Rates',
    tileMandiDesc: 'दावणगेरे, नासिक, करनाल, इंदौर मंडियों के ताजा रेट, आमद और मुनाफा कैलकुलेटर।',
    tileMandiBtn: 'ताजा रेट देखें (View Prices)',

    tileFertTitle: 'खाद कैलकुलेटर • NPK Fertilizer',
    tileFertDesc: 'जमीन के हिसाब से यूरिया, DAP और पोटाश के सही कट्टे (Bags) निकालें। फसल को जलने से बचाएं।',
    tileFertBtn: 'खाद निकालें (Calculate Bags)',

    tileKhataTitle: 'किसान खाता • Farm Expense Ledger',
    tileKhataDesc: 'बीज, जुताई, मजदूरी और दवा का हिसाब। प्रति क्विंटल लागत जानकर सही दाम पर फसल बेचें।',
    tileKhataBtn: 'खाता देखें (Open Ledger)',

    tileMachTitle: 'ट्रैक्टर व ड्रोन किराया • Machinery CHC',
    tileMachDesc: 'कंबाइन हार्वेस्टर, रोटावेटर और 40L ड्रोन स्प्रेयर प्रति घंटा या एकड़ के हिसाब से बुक करें।',
    tileMachBtn: 'मशीन बुक करें (Book Rental)',

    tilePumpTitle: 'ट्यूबवेल मोटर रिमोट • Smart Pump 220V',
    tilePumpDesc: 'खेत की मोटर का वोल्टेज देखें। हाई-वोल्टेज या ड्राय-रन पर मोटर जलने से पहले अपने आप कटऑफ।',
    tilePumpBtn: 'पंप रिमोट (Manage Pump)',

    secInsurance: '72h फसल बीमा क्लेम (PMFBY)',
    secSchemes: 'सरकारी सब्सिडी (KUSUM, KISAN)',
    secMarket: 'सीधे फसल बेचें (Direct Sell)',
    secOrganic: 'जीवामृत व जैविक विधि',

    guideTitle: 'किसान साथी: ऐप का सही इस्तेमाल कैसे करें? (3 सरल कदम)',
    guideStep1Title: '१. फोटो खींचें या बोलें',
    guideStep1Desc: 'फसल के खराब पत्ते की फोटो लें या सीधे माइक दबाकर हिंदी में अपनी समस्या बताएं।',
    guideStep2Title: '२. सही खाद व दवा की मात्रा जानें',
    guideStep2Desc: 'खाद कैलकुलेटर से जमीन के अनुसार यूरिया, DAP और पोटाश के कट्टों की सही संख्या निकालें।',
    guideStep3Title: '३. मंडी में सबसे अच्छा भाव पाएं',
    guideStep3Desc: 'मंडी भाव और अपनी प्रति क्विंटल लागत देखकर तय करें कि फसल कब और किस रेट पर बेचनी है।'
  },

  'en-IN': {
    appName: 'KrishiMitra AI',
    tagline: 'Smart Farming • Real Weather • Live Mandi • Gemini 3.8',
    backendActive: 'Live Backend Active',

    navHome: 'Home',
    navCrops: 'Crops & Health',
    navMarket: 'Market & Khata',
    navWater: 'Water & Schemes',
    navVoice: 'Voice AI',
    navPages: 'All 14 Modules',
    backToHome: '← Back to Dashboard',

    subLeafDoctor: '📸 Leaf Disease Scanner',
    subFertilizer: '🧪 NPK Fertilizer Calculator',
    subCropMatch: '🌱 Crop Matcher',
    subOrganic: '🌿 Organic Farming Guides',

    subMandi: '📈 Today Mandi Rates',
    subKhata: '📒 Kisan Khata (Farm P&L Ledger)',
    subSell: '🛒 Direct Produce Marketplace',
    subMachinery: '🚜 Machinery & Drone CHC',
    subStore: '🛍️ Subsidized Inputs Store',

    subWeather: '☁️ Live Weather & Spraying',
    subPump: '⚡ Smart Pump 220V Core',
    subInsurance: '🛡️ 72h Crop Loss & Cold Chain',
    subSchemes: '🏛️ Government Subsidies',

    bannerWeather: 'Real-Time Weather',
    bannerGreeting: 'Welcome Farmer Friend!',
    bannerQuestion: 'What would you like to do on the farm today?',
    bannerDesc: 'Live weather telemetry, APMC mandi rates, precision fertilizer bags, leaf disease diagnosis, and farm expense ledger in 1 click.',
    bannerSpraySafe: 'Optimal Spray Window (Safe to Spray)',
    bannerSprayCaution: 'Caution: Wind or Rain Hazard',
    mandiActive: 'Commodities Active',
    tempLive: 'Live Temp',
    wind: 'Wind',
    humidity: 'Humidity',
    tubewellMotor: 'Smart Tubewell Pump',
    motorOn: 'Motor is Running',
    motorOff: 'Motor is OFF',

    voiceChipTitle: 'Ask with 1-Tap Voice (No typing needed):',
    voiceNoType: 'Voice Assistant Ready',
    voicePrompt1: '🌧️ What is today weather and best spraying time?',
    voicePrompt2: '🌾 How much Urea and DAP for 1 acre Paddy?',
    voicePrompt3: '🍅 What is today live Tomato Mandi rate?',
    voicePrompt4: '🍃 Leaves have yellow spots, what fungicide to spray?',
    voicePrompt5: '🚜 What is the rental rate for drone sprayers?',
    askPlaceholder: 'Ask KRISH AI anything (e.g. Sona Masuri urea dose, cotton bollworm cure, current mandi trends)...',
    askBtn: 'Ask AI',
    thinking: 'Thinking...',

    tileLeafTitle: 'Leaf Doctor • Disease Scanner',
    tileLeafDesc: 'Snap a leaf photo. In 5 seconds get pathogen identification, chemical dosage and organic remedy.',
    tileLeafBtn: 'Scan Leaf Now',

    tileMandiTitle: 'Mandi Rates & Profit Calculator',
    tileMandiDesc: 'Live APMC rates across Karnataka, Maharashtra, Haryana with arrival volumes & lot net margin.',
    tileMandiBtn: 'Check Mandi Rates',

    tileFertTitle: 'NPK Fertilizer & Soil Nutrition',
    tileFertDesc: 'Calculate exact commercial bags of Urea, DAP, MOP and Zinc. Prevent root burning and save costs.',
    tileFertBtn: 'Calculate Bags',

    tileKhataTitle: 'Kisan Khata • Cost of Cultivation',
    tileKhataDesc: 'Log all tilling, seed, labor and spray costs. Discover your break-even cost per quintal before selling.',
    tileKhataBtn: 'Open Farm Ledger',

    tileMachTitle: 'Machinery & Drone Rental CHC',
    tileMachDesc: 'Rent combine harvesters, rotavators, tractors and 40L drone sprayers with verified operators.',
    tileMachBtn: 'Book Equipment',

    tilePumpTitle: 'Smart Pump Remote • 220V Core',
    tilePumpDesc: 'Monitor real line voltage. Automated surge trip protects motor from burning out during voltage drops.',
    tilePumpBtn: 'Manage Pump',

    secInsurance: '72h PMFBY Loss Dossier',
    secSchemes: 'Government Subsidies (KUSUM, KISAN)',
    secMarket: 'Zero Broker Marketplace',
    secOrganic: 'Jeevamrutha & Bio-Inputs',

    guideTitle: 'Farmer Guide: 3 Easy Steps to Maximum Profit',
    guideStep1Title: '1. Take Photo or Speak',
    guideStep1Desc: 'Upload a leaf photo or tap the mic to ask your farming query in your mother tongue.',
    guideStep2Title: '2. Get Exact Fertilizer & Spray Dosage',
    guideStep2Desc: 'Follow scientific split applications and save 30% of input costs without burning crops.',
    guideStep3Title: '3. Sell at the Highest Mandi Rate',
    guideStep3Desc: 'Check your break-even price per quintal and sell directly to verified buyers.'
  },

  'mr-IN': {
    appName: 'कृषी मित्र AI',
    tagline: 'स्मार्ट शेती • थेट हवामान • मंडी भाव • AI डॉक्टर',
    backendActive: 'थेट बॅकएंड सक्रिय',

    navHome: 'मुख्य',
    navCrops: 'पीक व खत',
    navMarket: 'मंडी व खाते',
    navWater: 'पाणी व योजना',
    navVoice: 'आवाज AI',
    navPages: 'सर्व 14 मॉड्यूल्स',
    backToHome: '← मुख्य पानावर परत जा',

    subLeafDoctor: '📸 पान डॉक्टर (Disease Scanner)',
    subFertilizer: '🧪 खत कॅल्क्युलेटर (NPK Fertilizer)',
    subCropMatch: '🌱 पीक निवड शिफारस',
    subOrganic: '🌿 सेंद्रिय शेती पद्धती',

    subMandi: '📈 आजचे मंडी भाव (Mandi Rates)',
    subKhata: '📒 किसान खाते (खर्च व नफा)',
    subSell: '🛒 थेट शेतमाल विक्री',
    subMachinery: '🚜 अवजारे व ट्रॅक्टर भाड्याने (CHC)',
    subStore: '🛍️ सवलतीचे कृषी स्टोअर',

    subWeather: '☁️ हवामान व फवारणी सल्ला',
    subPump: '⚡ स्मार्ट पंप 220V',
    subInsurance: '🛡️ 72 तास पीक विमा व कोल्ड स्टोरेज',
    subSchemes: '🏛️ सरकारी योजना व सबसिडी',

    bannerWeather: 'आजचे हवामान',
    bannerGreeting: 'नमस्कार शेतकरी मित्र!',
    bannerQuestion: 'आज शेतात काय करायचे आहे?',
    bannerDesc: 'थेट हवामान, बाजार भाव, अचूक खत प्रमाण, पीक रोग आणि खर्चाचा ताळेबंद — सर्व काही एका क्लिकवर.',
    bannerSpraySafe: 'फवारणीसाठी अनुकूल वेळ (सुरक्षित)',
    bannerSprayCaution: 'सावधान: वादळ किंवा पावसाची शक्यता',
    mandiActive: 'पिके थेट',
    tempLive: 'तापमान',
    wind: 'वारा',
    humidity: 'आर्द्रता',
    tubewellMotor: 'मोटर पंप',
    motorOn: 'मोटर सुरू आहे',
    motorOff: 'मोटर बंद आहे',

    voiceChipTitle: 'एका क्लिकवर प्रश्न विचारा (Tap to Ask):',
    voiceNoType: 'न लिहिता विचारा',
    voicePrompt1: '🌧️ आज औषध फवारणीसाठी योग्य वेळ आहे का?',
    voicePrompt2: '🌾 धानाला युरिया आणि डीएपी किती टाकावे?',
    voicePrompt3: '🍅 आजचा टोमॅटोचा बाजार भाव काय आहे?',
    voicePrompt4: '🍃 पानांवर पिवळे काळे डाग आहेत, कोणते औषध फवारावे?',
    voicePrompt5: '🚜 ड्रोन फवारणी यंत्राचे भाडे किती आहे?',
    askPlaceholder: 'कोणताही प्रश्न विचारा (उदा: कापूस बोंडअळी उपाय, सोयाबीन भाव, पंप व्होल्टेज)...',
    askBtn: 'विचारा',
    thinking: 'विचार करत आहे...',

    tileLeafTitle: 'पान डॉक्टर • Leaf Scanner',
    tileLeafDesc: 'पानाचा फोटो काढा. 5 सेकंदात रोग, कारण आणि योग्य कीटकनाशक व सेंद्रिय उपाय जाणून घ्या.',
    tileLeafBtn: 'फोटो काढा (Scan)',

    tileMandiTitle: 'आजचे मंडी भाव • Mandi Rates',
    tileMandiDesc: 'लासलगाव, नाशिक, कोल्हापूर बाजारांचे ताजे दर आणि थेट नफा कॅल्क्युलेटर.',
    tileMandiBtn: 'दर तपासा (View Rates)',

    tileFertTitle: 'खत कॅल्क्युलेटर • NPK Fertilizer',
    tileFertDesc: 'जमिनीनुसार युरिया, डीएपी आणि पोटॅशची अचूक पोती काढा. खर्च वाचवा.',
    tileFertBtn: 'खत काढा (Calculate)',

    tileKhataTitle: 'किसान खाते • Farm Expense Ledger',
    tileKhataDesc: 'मशागत, बियाणे, खते आणि मजुरीचा हिशोब ठेवा. प्रति क्विंटल उत्पादन खर्च जाणून घ्या.',
    tileKhataBtn: 'खाते उघडा (Open Ledger)',

    tileMachTitle: 'ट्रॅक्टर व ड्रोन भाडे • Machinery CHC',
    tileMachDesc: 'हार्वेस्टर, रोटाव्हेटर आणि 40 लिटर ड्रोन फवारणी यंत्र तासावर किंवा एकरावर बुक करा.',
    tileMachBtn: 'यंत्र बुक करा',

    tilePumpTitle: 'मोटर रिमोट • Smart Pump 220V',
    tilePumpDesc: 'शेतातील विजेचे व्होल्टेज तपासा. विजेच्या चढ-उतारात मोटर जळण्यापासून वाचवा.',
    tilePumpBtn: 'पंप व्यवस्थापन',

    secInsurance: '72 तास पीक विमा (PMFBY)',
    secSchemes: 'सरकारी सबसिडी (KUSUM, KISAN)',
    secMarket: 'थेट शेतमाल विक्री (Direct Sell)',
    secOrganic: 'जीवामृत व सेंद्रिय पद्धती',

    guideTitle: 'शेतकरी मार्गदर्शक: 3 सोप्या पायऱ्या',
    guideStep1Title: '१. फोटो काढा किंवा बोला',
    guideStep1Desc: 'खराब पानाचा फोटो काढा किंवा माइक दाबून मराठीत तुमची समस्या सांगा.',
    guideStep2Title: '२. योग्य खत व फवारणी प्रमाण जाणून घ्या',
    guideStep2Desc: 'कॅल्क्युलेटरद्वारे जमिनीनुसार योग्य खताची मात्रा आणि वेळ जाणून घ्या.',
    guideStep3Title: '३. बाजारात चांगल्या भावाने विका',
    guideStep3Desc: 'बाजार भाव आणि आपला प्रति क्विंटल खर्च तपासून योग्य नफ्यात थेट विक्री करा.'
  },

  'te-IN': {
    appName: 'కృషి మిత్ర AI',
    tagline: 'స్మార్ట్ వ్యవసాయం • లైవ్ వాతావరణం • మార్కెట్ ధరలు • AI డాక్టర్',
    backendActive: 'లైవ్ బ్యాకెండ్ యాక్టివ్',

    navHome: 'హోమ్',
    navCrops: 'పంట & ఎరువులు',
    navMarket: 'మండీ & లెడ్జర్',
    navWater: 'నీటిపారుదల & పథకాలు',
    navVoice: 'వాయిస్ AI',
    navPages: 'అన్ని 14 మాడ్యూల్స్',
    backToHome: '← హోమ్‌కు తిరిగి వెళ్ళండి',

    subLeafDoctor: '📸 ఆకు వ్యాధి స్కానర్',
    subFertilizer: '🧪 ఎరువుల కాలిక్యులేటర్',
    subCropMatch: '🌱 పంట ఎంపిక సిఫార్సు',
    subOrganic: '🌿 సేంద్రీయ వ్యవసాయం',

    subMandi: '📈 నేటి మార్కెట్ ధరలు',
    subKhata: '📒 కిసాన్ ఖాతా (ఖర్చు & లాభం)',
    subSell: '🛒 నేరుగా పంట అమ్మకం',
    subMachinery: '🚜 యంత్రాలు అద్దెకు (CHC)',
    subStore: '🛍️ రాయితీ వ్యవసాయ స్టోర్',

    subWeather: '☁️ వాతావరణం & మందు పిచికారీ',
    subPump: '⚡ స్మార్ట్ మోటార్ పంప్ 220V',
    subInsurance: '🛡️ 72 గంటల పంట భీమా & కోల్డ్ స్టోరేజ్',
    subSchemes: '🏛️ ప్రభుత్వ సబ్సిడీ పథకాలు',

    bannerWeather: 'నేటి వాతావరణం',
    bannerGreeting: 'నమస్కారం రైతు మిత్రమా!',
    bannerQuestion: 'ఈరోజు పొలంలో ఏమి చేయాలి?',
    bannerDesc: 'లైవ్ వాతావరణం, మండీ ధరలు, సరైన ఎరువుల మోతాదు మరియు ఖర్చుల లెక్క — అన్నీ ఒకే క్లిక్‌లో.',
    bannerSpraySafe: 'మందు పిచికారీకి అనుకూల సమయం',
    bannerSprayCaution: 'హెచ్చరిక: గాలి లేదా వర్షం ప్రమాదం',
    mandiActive: 'పంటలు లైవ్',
    tempLive: 'ఉష్ణోగ్రత',
    wind: 'గాలి',
    humidity: 'తేమ',
    tubewellMotor: 'బోరుబావి మోటార్',
    motorOn: 'మోటార్ రన్ అవుతోంది',
    motorOff: 'మోటార్ ఆఫ్ అయింది',

    voiceChipTitle: 'ఒకే క్లిక్‌తో వాయిస్‌తో అడగండి (Tap to Ask):',
    voiceNoType: 'రాయకుండా మాట్లాడండి',
    voicePrompt1: '🌧️ ఈరోజు పురుగుమందు పిచికారీ చేయడానికి సరైన సమయమేనా?',
    voicePrompt2: '🌾 వరికి యూరియా మరియు డీఏపీ ఎంత వేయాలి?',
    voicePrompt3: '🍅 ఈరోజు టమోటా మండీ ధర ఎంత ఉంది?',
    voicePrompt4: '🍃 ఆకులపై నల్లటి మచ్చలు ఉన్నాయి, ఏ మందు కొట్టాలి?',
    voicePrompt5: '🚜 డ్రోన్ స్ప్రేయర్ అద్దె ధర ఎంత?',
    askPlaceholder: 'ఏదైనా ప్రశ్న అడగండి (ఉదా: పత్తిలో పురుగుల నివారణ, మిర్చి ధర, పంప్ వోల్టేజ్)...',
    askBtn: 'అడగండి',
    thinking: 'ఆలోచిస్తోంది...',

    tileLeafTitle: 'ఆకు డాక్టర్ • Leaf Scanner',
    tileLeafDesc: 'ఆకు ఫోటో తీయండి. 5 సెకన్లలో వ్యాధి, కారణం మరియు సరైన ఔషధం తెలుసుకోండి.',
    tileLeafBtn: 'ఫోటో తీయండి (Scan)',

    tileMandiTitle: 'నేటి మార్కెట్ ధరలు • Mandi Rates',
    tileMandiDesc: 'గుంటూరు, నిజామాబాద్, రాయచూరు మార్కెట్ల తాజా ధరలు మరియు లాభాల కాలిక్యులేటర్.',
    tileMandiBtn: 'ధరలు చూడండి',

    tileFertTitle: 'ఎరువుల కాలిక్యులేటర్ • NPK Fertilizer',
    tileFertDesc: 'మీ భూమి విస్తీర్ణానికి ఎన్ని బస్తాల యూరియా, డీఏపీ, పొటాష్ కావాలో సరిగ్గా లెక్కించండి.',
    tileFertBtn: 'ఎరువులు లెక్కించండి',

    tileKhataTitle: 'కిసాన్ ఖాతా • Farm Expense Ledger',
    tileKhataDesc: 'దుక్కి, విత్తనాలు, కూలీ ఖర్చులు నమోదు చేయండి. క్వింటాలుకు ఖర్చు తెలుసుకోండి.',
    tileKhataBtn: 'ఖాతా తెరవండి',

    tileMachTitle: 'ట్రాక్టర్ & డ్రోన్ అద్దె • Machinery CHC',
    tileMachDesc: 'హార్వెస్టర్లు, రోటవేటర్లు మరియు 40L డ్రోన్ స్ప్రేయర్లను గంటల లేదా ఎకరాల చొప్పున బుక్ చేయండి.',
    tileMachBtn: 'యంత్రం బుక్ చేయండి',

    tilePumpTitle: 'మోటార్ రిమోట్ • Smart Pump 220V',
    tilePumpDesc: 'వోల్టేజ్ 220V ని పర్యవేక్షించండి. హై-వోల్టేజ్ ఉన్నప్పుడు మోటార్ కాలిపోకుండా ఆటో-ఆఫ్.',
    tilePumpBtn: 'పంప్ నిర్వహణ',

    secInsurance: '72 గంటల పంట భీమా (PMFBY)',
    secSchemes: 'ప్రభుత్వ సబ్సిడీలు (KUSUM, KISAN)',
    secMarket: 'దళారులు లేని మార్కెట్',
    secOrganic: 'జీవామృతం & సేంద్రీయ పద్ధతులు',

    guideTitle: 'రైతు గైడ్: గరిష్ట లాభానికి 3 సులభమైన దశలు',
    guideStep1Title: '౧. ఫోటో తీయండి లేదా మాట్లాడండి',
    guideStep1Desc: 'ఆకు ఫోటో తీయండి లేదా మైక్ నొక్కి తెలుగులో మీ సమస్యను చెప్పండి.',
    guideStep2Title: '౨. సరైన ఎరువులు & మందుల మోతాదు తెలుసుకోండి',
    guideStep2Desc: 'శాస్త్రీయ పద్ధతిలో సరైన సమయంలో ఎరువులు వేసి ఖర్చులు తగ్గించుకోండి.',
    guideStep3Title: '౩. మార్కెట్లో అత్యధిక ధరకు అమ్మండి',
    guideStep3Desc: 'మార్కెట్ ధర మరియు మీ ఉత్పత్తి ఖర్చును పరిశీలించి మంచి లాభానికి నేరుగా అమ్మండి.'
  }
};
