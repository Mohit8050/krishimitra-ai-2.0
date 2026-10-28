import React, { useState, useEffect, useRef } from 'react';
import {
  Sprout,
  ShieldAlert,
  Mic,
  MicOff,
  TrendingUp,
  Activity,
  ShoppingCart,
  Store,
  Landmark,
  BookOpen,
  CloudSun,
  Send,
  Camera,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Droplets,
  Search,
  Filter,
  Trash2,
  PlusCircle,
  Clock,
  Sparkles,
  Leaf,
  Layers,
  MapPin,
  Wind,
  Compass,
  Gauge,
  PhoneCall,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  X,
  HelpCircle,
  Calculator,
  Coins,
  Tractor,
  ThermometerSnowflake,
  Home,
  ArrowLeft
} from 'lucide-react';
import { FertilizerCalculator } from './components/FertilizerCalculator.tsx';
import { KisanKhata } from './components/KisanKhata.tsx';
import { MachineryRental } from './components/MachineryRental.tsx';
import { CropInsuranceColdStorage } from './components/CropInsuranceColdStorage.tsx';
import { BuyFarmInputs } from './components/BuyFarmInputs.tsx';
import { SupportedLanguage, LANGUAGES, TRANSLATIONS } from './utils/translations.ts';

// Types
type TabType =
  | 'dashboard'
  | 'weather'
  | 'mandi'
  | 'fertilizer'
  | 'khata'
  | 'machinery'
  | 'insurance'
  | 'disease'
  | 'voice'
  | 'crop'
  | 'pump'
  | 'buy'
  | 'sell'
  | 'schemes'
  | 'guides'
  | 'standalone'
  | 'directory';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export interface SafeUser {
  id: string;
  fullName: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  landholdingAcres: number;
  primaryCrops: string[];
  preferredLang: string;
  createdAt: string;
}

interface DiseaseResult {
  title: string;
  cropIdentified?: string;
  diseaseOrCondition?: string;
  confidence?: 'Confirmed' | 'Probable' | 'Inconclusive';
  confidenceScore?: number;
  urgency?: string;
  summary: string;
  symptoms?: string[];
  causes: string[];
  prevention: string[];
  organicTreatment?: string[];
  chemicalTreatment?: string[];
  treatment: string[];
  recoveryRate: string;
  source?: string;
}

interface DiseaseScanLog {
  id: string;
  cropName: string;
  title: string;
  summary: string;
  causes: string[];
  treatment: string[];
  prevention: string[];
  recoveryRate: string;
  thumbnail: string;
  scannedAt: string;
}

interface MandiItem {
  id: string;
  name: string;
  hindiName: string;
  category: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  change: number;
  changePercent: number;
  arrivalQtyQuintals: number;
  mandiHub: string;
  state: string;
  imageUrl: string;
  grade: string;
}

interface ProduceListing {
  id: string;
  farmerName: string;
  phone: string;
  crop: string;
  category: string;
  quantity: number;
  pricePerKg: number;
  location: string;
  state: string;
  imageUrl: string;
  harvestDate: string;
  status: string;
  createdAt: string;
}

interface SchemeApp {
  id: string;
  scheme: string;
  farmer: string;
  aadhaar: string;
  mobile: string;
  village: string;
  date: string;
  status: string;
}

interface WeatherData {
  location: string;
  current: {
    temp: number;
    apparentTemp: number;
    humidity: number;
    windSpeed: number;
    pressure: number;
    precipitation: number;
    rainProbability: number;
    condition: string;
    icon: string;
  };
  sprayingAdvisory: {
    status: string;
    badge: string;
    color: string;
    advice: string;
  };
  dailyForecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    rainProb: number;
    maxWind: number;
    condition: string;
    icon: string;
  }>;
  dataSource?: string;
  observedAt?: string;
  isLive?: boolean;
}

// Authoritative Module Identifiers Registry
export const VALID_MODULE_TABS: Record<string, { id: TabType; title: string }> = {
  dashboard: { id: 'dashboard', title: 'Dashboard' },
  weather: { id: 'weather', title: 'Agro Weather' },
  mandi: { id: 'mandi', title: 'APMC Mandi' },
  disease: { id: 'disease', title: 'Disease Detection' },
  buy: { id: 'buy', title: 'Buy Farm Inputs' },
  sell: { id: 'sell', title: 'Direct Marketplace' },
  crop: { id: 'crop', title: 'Crop Recommendation' },
  fertilizer: { id: 'fertilizer', title: 'NPK Calculator' },
  khata: { id: 'khata', title: 'Kisan Khata' },
  pump: { id: 'pump', title: 'Smart Pump Controller' },
  machinery: { id: 'machinery', title: 'Machinery CHC' },
  insurance: { id: 'insurance', title: 'PMFBY Loss & Cold Storage' },
  schemes: { id: 'schemes', title: 'Government Schemes' },
  guides: { id: 'guides', title: 'Crop Production Guides' },
  voice: { id: 'voice', title: 'AI Assistant & Voice' },
  standalone: { id: 'standalone', title: 'All Modules Directory' },
  directory: { id: 'standalone', title: 'All Modules Directory' }
};

export function parseTabFromUrl(): TabType {
  try {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (!tabParam) return 'dashboard';
    if (tabParam === 'directory' || tabParam === 'standalone') return 'standalone';
    if (VALID_MODULE_TABS[tabParam]) {
      return VALID_MODULE_TABS[tabParam].id;
    }
  } catch {}
  return 'dashboard';
}

export default function App() {
  const [activeTab, setActiveTabState] = useState<TabType>(parseTabFromUrl);

  const setActiveTab = (tab: TabType) => {
    const target = (tab === 'directory' ? 'standalone' : tab);
    const validTarget = VALID_MODULE_TABS[target]?.id || 'dashboard';
    setActiveTabState(validTarget);
    try {
      const currentParams = new URLSearchParams(window.location.search);
      if (validTarget === 'dashboard') {
        currentParams.delete('tab');
      } else {
        currentParams.set('tab', validTarget);
      }
      const qs = currentParams.toString();
      const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.pushState({ tab: validTarget }, '', newUrl);
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    try {
      return (localStorage.getItem('km_language') as SupportedLanguage) || 'kn-IN';
    } catch {
      return 'kn-IN';
    }
  });

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS['en-IN']?.[key] || key;
  };

  const [ttsEnabled, setTtsEnabled] = useState(true);

  // Weather State
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherCity, setWeatherCity] = useState('davangere');
  const [weatherSearchInput, setWeatherSearchInput] = useState('');
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);

  // Mandi State
  const [mandiItems, setMandiItems] = useState<MandiItem[]>([]);
  const [mandiCategory, setMandiCategory] = useState('All');
  const [mandiSearch, setMandiSearch] = useState('');
  const [mandiHubFilter, setMandiHubFilter] = useState('All');
  const [calcHarvestQty, setCalcHarvestQty] = useState(100); // in kg
  const [selectedMandiCrop, setSelectedMandiCrop] = useState<MandiItem | null>(null);
  const [mandiDataSource, setMandiDataSource] = useState('APMC Directorate & Mandi Intelligence');
  const [mandiUpdatedAt, setMandiUpdatedAt] = useState('');

  // Farmer Authentication State
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({
    fullName: '',
    phone: '',
    password: '',
    village: '',
    district: 'Davangere',
    state: 'Karnataka',
    landholdingAcres: '3.0'
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Disease Scanner State
  const [previewImage, setPreviewImage] = useState<string>('');
  const [cropLeafName, setCropLeafName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diseaseResult, setDiseaseResult] = useState<DiseaseResult | null>(null);
  const [diseaseError, setDiseaseError] = useState<string | null>(null);
  const [diseaseErrorType, setDiseaseErrorType] = useState<'quota' | 'auth' | 'surge' | 'timeout' | 'general' | null>(null);
  const [diseaseRejection, setDiseaseRejection] = useState<{ reason: string; guidance: string } | null>(null);
  const [diseaseDiary, setDiseaseDiary] = useState<DiseaseScanLog[]>([]);

  // Live Camera & Capture State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Voice & Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'ai',
      text: '🌱 **Namaste!** I am your KrishiMitra AI Assistant. Ask me anything about crop varieties, soil preparation, urea dosage, pest cure, live mandi rates, or weather in English or हिन्दी!'
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Smart Pump State
  const [pumpRunning, setPumpRunning] = useState(true);
  const [voltage, setVoltage] = useState(220);
  const [voltageHistory, setVoltageHistory] = useState<number[]>([218, 220, 221, 219, 222, 220]);
  const [isSurgeDanger, setIsSurgeDanger] = useState(false);
  const [pumpTrips, setPumpTrips] = useState(0);

  // Marketplace Sell State
  const [produceListings, setProduceListings] = useState<ProduceListing[]>([]);
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [newListingForm, setNewListingForm] = useState({
    farmerName: '',
    phone: '',
    crop: '',
    category: 'Cereals',
    quantity: '',
    pricePerKg: '',
    location: '',
    imageUrl: ''
  });
  const [selectedProduceForInquiry, setSelectedProduceForInquiry] = useState<ProduceListing | null>(null);
  const [inquiryForm, setInquiryForm] = useState({
    buyerName: '',
    buyerPhone: '',
    offeredPrice: '',
    quantityRequested: '',
    message: ''
  });

  // Store Buy State
  const [cart, setCart] = useState<Array<{ id: string; name: string; price: number; qty: number; img: string }>>(() => {
    try {
      return JSON.parse(localStorage.getItem('km_cart') || '[]');
    } catch {
      return [];
    }
  });
  const [selectedBuyCat, setSelectedBuyCat] = useState('All');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: '', phone: '', village: '' });

  // Govt Schemes State
  const [applications, setApplications] = useState<SchemeApp[]>([]);
  const [selectedSchemeToApply, setSelectedSchemeToApply] = useState('');
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [schemeForm, setSchemeForm] = useState({ farmer: '', aadhaar: '', mobile: '', village: '' });
  const [schemesTab, setSchemesTab] = useState<'catalog' | 'myApps'>('catalog');

  // Crop Recommendation State
  const [recState, setRecState] = useState('Karnataka');
  const [recSoil, setRecSoil] = useState('Black Soil (Regur)');
  const [recSeason, setRecSeason] = useState('Monsoon (Kharif)');
  const [recTemp, setRecTemp] = useState(28);

  // Dynamic Agro-Climatic Crop Recommendation Engine
  const computedCropMatches = React.useMemo(() => {
    const list = [
      { name: 'Sona Masuri / IR-64 Rice 🍚', base: 'Rice', score: 0, water: 'High (1200mm)', duration: '120-135 Days', tip: 'Optimal for alluvial clay loam with shallow standing water during tillering.' },
      { name: 'Finger Millet (Ragi) 🌾', base: 'Ragi', score: 0, water: 'Low (350mm)', duration: '90-100 Days', tip: 'Drought-hardy native superfood, ideal for red loamy soils.' },
      { name: 'Bt Cotton (Bollgard II) 🌿', base: 'Cotton', score: 0, water: 'Medium (550mm)', duration: '150-170 Days', tip: 'Exceptional performance in deep black soils with drip irrigation.' },
      { name: 'Sugarcane (Co 86032) 🍬', base: 'Sugarcane', score: 0, water: 'High (1500mm)', duration: '12-14 Months', tip: 'Requires rich loam and reliable perennial irrigation.' },
      { name: 'Hybrid Maize (Corn) 🌽', base: 'Maize', score: 0, water: 'Medium (550mm)', duration: '95-115 Days', tip: 'Fast turnaround grain with strong industrial and poultry feed demand.' },
      { name: 'Pearl Millet (Bajra) 🌾', base: 'Bajra', score: 0, water: 'Very Low (300mm)', duration: '80-85 Days', tip: 'Exceptional heat tolerance, perfect for sandy or dry soils.' },
      { name: 'Sharbati Wheat 🌾', base: 'Wheat', score: 0, water: 'Medium (450mm)', duration: '120-130 Days', tip: 'Requires cool winter temperatures and well-drained loams.' }
    ];

    list.forEach(crop => {
      // State preferences
      if (recState === 'Karnataka' && (crop.base === 'Ragi' || crop.base === 'Maize')) crop.score += 4;
      if (recState === 'Maharashtra' && (crop.base === 'Sugarcane' || crop.base === 'Cotton')) crop.score += 4;
      if (recState === 'Telangana' && (crop.base === 'Rice' || crop.base === 'Cotton')) crop.score += 4;
      if (recState === 'Punjab' && (crop.base === 'Wheat' || crop.base === 'Rice')) crop.score += 5;
      if (recState === 'Madhya Pradesh' && crop.base === 'Wheat') crop.score += 4;

      // Soil preferences
      if (recSoil.includes('Black') && crop.base === 'Cotton') crop.score += 5;
      if (recSoil.includes('Red') && crop.base === 'Ragi') crop.score += 5;
      if (recSoil.includes('Alluvial') && (crop.base === 'Rice' || crop.base === 'Wheat')) crop.score += 5;
      if (recSoil.includes('Sandy') && crop.base === 'Bajra') crop.score += 6;

      // Season preferences
      if (recSeason.includes('Monsoon') && (crop.base === 'Rice' || crop.base === 'Cotton' || crop.base === 'Maize')) crop.score += 4;
      if (recSeason.includes('Winter') && crop.base === 'Wheat') crop.score += 6;
      if (recSeason.includes('Summer') && (crop.base === 'Bajra' || crop.base === 'Ragi')) crop.score += 4;

      // Temperature preferences
      if (recTemp > 35 && (crop.base === 'Bajra' || crop.base === 'Ragi')) crop.score += 4;
      if (recTemp < 25 && crop.base === 'Wheat') crop.score += 4;
      if (recTemp >= 24 && recTemp <= 32 && crop.base === 'Maize') crop.score += 3;
    });

    list.sort((a, b) => b.score - a.score);
    return list.slice(0, 3).map(c => ({
      ...c,
      conf: Math.min(97, Math.max(72, 70 + c.score * 3))
    }));
  }, [recState, recSoil, recSeason, recTemp]);

  // -------------------------------------------------------------
  // INITIAL DATA FETCHING & BROWSER URL SYNC
  // -------------------------------------------------------------
  useEffect(() => {
    fetchWeather(weatherCity);
    fetchMandiData();
    fetchProduceListings();
    fetchDiseaseDiary();
    fetchSchemeApplications();

    // Browser back/forward navigation sync
    const handlePopState = () => {
      setActiveTabState(parseTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);

    // Check if ?auth=login or register was passed
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('auth') === 'login') {
        setAuthMode('login');
        setAuthModalOpen(true);
      } else if (params.get('auth') === 'register') {
        setAuthMode('register');
        setAuthModalOpen(true);
      }
    } catch {}

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync Cart
  useEffect(() => {
    localStorage.setItem('km_cart', JSON.stringify(cart));
  }, [cart]);

  // Pump Simulation Loop
  useEffect(() => {
    if (!pumpRunning) return;
    const interval = setInterval(() => {
      const v = 215 + Math.floor(Math.random() * 18);
      setVoltage(v);
      setVoltageHistory(prev => [...prev.slice(1), v]);
      if (v > 228) {
        setIsSurgeDanger(true);
        setPumpTrips(t => t + 1);
        setTimeout(() => setIsSurgeDanger(false), 2600);
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [pumpRunning]);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  // Update AI Chat welcome greeting when language changes if only the initial greeting is present
  useEffect(() => {
    setChatMessages(prev => {
      if (prev.length <= 1) {
        let welcome = '🌱 **Namaste!** I am your KrishiMitra AI Assistant. Ask me anything about crop varieties, soil nutrition, fertilizer dosage, pest cure, live mandi rates, or weather!';
        if (language === 'kn-IN') {
          welcome = '🌱 **ನಮಸ್ಕಾರ!** ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಮಿತ್ರ AI ಸಹಾಯಕ. ಬೆಳೆ ರೋಗ, ರಸಗೊಬ್ಬರ ಪ್ರಮಾಣ, ಮಂಡಿ ದರ ಅಥವಾ ಹವಾಮಾನದ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ!';
        } else if (language === 'hi-IN') {
          welcome = '🌱 **नमस्ते किसान साथी!** मैं आपका कृषि मित्र AI सहायक हूँ। फसल रोग, खाद की मात्रा, मंडी भाव या मौसम के बारे में कुछ भी पूछें!';
        } else if (language === 'mr-IN') {
          welcome = '🌱 **नमस्कार शेतकरी मित्र!** मी आपला कृषी मित्र AI सहाय्यक आहे. पीक रोग, खत प्रमाण, बाजार भाव किंवा हवामानाबद्दल विचारा!';
        } else if (language === 'te-IN') {
          welcome = '🌱 **నమస్కారం రైతు మిత్రమా!** నేను మీ కృషి మిత్ర AI సహాయకుడిని. పంట వ్యాధులు, ఎరువుల మోతాదు, మార్కెట్ ధరలు లేదా వాతావరణం గురించి అడగండి!';
        }
        return [{ role: 'ai', text: welcome }];
      }
      return prev;
    });
  }, [language]);


  // -------------------------------------------------------------
  // API FETCHERS
  // -------------------------------------------------------------
  const fetchWeather = async (cityOrQuery?: string, lat?: number, lon?: number) => {
    setIsLoadingWeather(true);
    try {
      let url = '/api/weather';
      if (lat && lon) {
        url += `?lat=${lat}&lon=${lon}`;
      } else if (cityOrQuery) {
        url += `?city=${encodeURIComponent(cityOrQuery)}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.current) {
        setWeatherData(data);
      }
    } catch (e) {
      console.error('Weather error:', e);
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const useDeviceLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        fetchWeather(undefined, pos.coords.latitude, pos.coords.longitude);
      },
      err => {
        console.warn('Geolocation denied:', err);
        alert('Could not access GPS location. Switched to Davangere APMC.');
        fetchWeather('davangere');
      }
    );
  };

  const fetchMandiData = async () => {
    try {
      const res = await fetch('/api/mandi');
      const data = await res.json();
      if (data && data.commodities) {
        setMandiItems(data.commodities);
        if (data.dataSource) setMandiDataSource(data.dataSource);
        if (data.updatedAt) setMandiUpdatedAt(data.updatedAt);
        if (data.commodities.length > 0) {
          setSelectedMandiCrop(data.commodities[0]);
        }
      }
    } catch (e) {
      console.error('Mandi fetch error:', e);
    }
  };

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('km_auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchProduceListings = async () => {
    try {
      const res = await fetch('/api/marketplace/produce', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (Array.isArray(data)) setProduceListings(data);
    } catch (e) {
      console.error('Produce fetch error:', e);
    }
  };

  const fetchDiseaseDiary = async () => {
    try {
      const res = await fetch('/api/disease/history', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (Array.isArray(data)) setDiseaseDiary(data);
    } catch (e) {
      console.error('Disease diary fetch error:', e);
    }
  };

  const fetchSchemeApplications = async () => {
    try {
      const res = await fetch('/api/schemes/applications', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (Array.isArray(data)) setApplications(data);
    } catch (e) {
      console.error('Applications fetch error:', e);
    }
  };

  // -------------------------------------------------------------
  // VOICE & SPEECH
  // -------------------------------------------------------------
  const speakText = (text: string) => {
    if (!ttsEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[*_#`]/g, '').replace(/[🌾🌱🥬💧🐛🇮🇳💡✅⚠️]/g, '');
    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = language;
    utter.rate = 1.0;
    window.speechSynthesis.speak(utter);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputPrompt.trim();
    if (!q) return;

    const userMsg: ChatMessage = { role: 'user', text: q };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsAiThinking(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: q,
          language,
          history: chatMessages.slice(-6)
        })
      });
      const data = await res.json();
      const reply = data.reply || '🌾 Inspect root zones, maintain balanced NPK, and calibrate irrigation schedules.';
      const aiMsg: ChatMessage = { role: 'ai', text: reply };
      setChatMessages(prev => [...prev, aiMsg]);
      speakText(reply);
    } catch {
      const fallback =
        language === 'kn-IN'
          ? '🌾 **ಕೃಷಿ ಮಿತ್ರ ಸಲಹೆ:** ಉತ್ತಮ ಇಳುವರಿಗೆ ಸಕಾಲದಲ್ಲಿ ನೀರು ಹಾಯಿಸಿ ಹಾಗೂ ಶಿಫಾರಸು ಮಾಡಿದ ರಸಗೊಬ್ಬರವನ್ನು 2-3 ಹಂತಗಳಲ್ಲಿ ವಿಭಜಿಸಿ ಕೊಡಿ.'
          : language === 'hi-IN'
          ? '🌾 **कृषि मित्र सलाह:** फसल की अच्छी पैदावार के लिए नियमित सिंचाई करें और संतुलित खाद डालें।'
          : language === 'mr-IN'
          ? '🌾 **कृषी मित्र सल्ला:** चांगल्या उत्पादनासाठी वेळेवर पाणी द्या आणि संतुलित खतांचा वापर करा.'
          : language === 'te-IN'
          ? '🌾 **కృషి మిత్ర సలహా:** మంచి దిగుబడి కోసం సకాలంలో నీటిపారుదల మరియు సమతుల్య ఎరువులను వాడండి.'
          : '🌾 **KrishiMitra Advisory:** Ensure uniform irrigation, check soil moisture, and split nitrogen fertilizer into 2-3 stages.';
      setChatMessages(prev => [...prev, { role: 'ai', text: fallback }]);
      speakText(fallback);
    } finally {
      setIsAiThinking(false);
    }
  };

  const toggleSpeechRecognition = () => {
    const Speech = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!Speech) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    try {
      const rec = new Speech();
      rec.lang = language;
      rec.start();
      setIsListening(true);
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInputPrompt(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
    } catch {
      setIsListening(false);
    }
  };

  // -------------------------------------------------------------
  // FARMER AUTHENTICATION LOGIC
  // -------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem('km_auth_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (data && data.user) {
            setCurrentUser(data.user);
          } else {
            localStorage.removeItem('km_auth_token');
          }
        })
        .catch(() => {
          localStorage.removeItem('km_auth_token');
        });
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = authMode === 'login'
        ? { phone: authForm.phone, password: authForm.password }
        : authForm;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('km_auth_token', data.token);
        setCurrentUser(data.user);
        setAuthModalOpen(false);
      } else {
        setAuthError(data.error || 'Authentication failed. Please check details.');
      }
    } catch {
      setAuthError('Network communication error with server.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('km_auth_token');
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
      localStorage.removeItem('km_auth_token');
    }
    setCurrentUser(null);
  };

  // -------------------------------------------------------------
  // LEAF DISEASE SCANNER & CAMERA CAPTURE (AUTHENTIC GEMINI VISION)
  // -------------------------------------------------------------
  // Ensure live video stream attaches to the video element as soon as viewfinder mounts
  useEffect(() => {
    if (isCameraOpen && cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(err => {
        console.warn('Live camera play error:', err);
      });
    }
  }, [isCameraOpen, cameraStream]);

  const startCamera = async (facing: 'environment' | 'user' = cameraFacingMode) => {
    setCameraError(null);
    setIsCameraOpen(true);

    // Stop previous stream if active
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('In-browser camera stream is not supported in this environment. Please tap "Use Native Camera" below.');
        return;
      }

      let stream: MediaStream | null = null;
      // 1. Try with preferred facing mode
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facing },
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        });
      } catch (err1) {
        console.warn('Initial facingMode camera request failed, trying simple video constraint:', err1);
        // 2. Fallback to basic video constraint
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        } catch (err2) {
          throw err2;
        }
      }

      if (!stream) {
        throw new Error('No camera stream received');
      }

      setCameraStream(stream);
      setCameraFacingMode(facing);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera stream could not be started:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera access was blocked or denied by browser permissions. Tap "Use Native Camera" below to capture directly.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No physical camera device was detected. Tap "Use Native Camera" or choose an existing photo.');
      } else {
        setCameraError(`Camera initialisation failed (${err.name || 'Unavailable'}). Tap "Use Native Camera" below to take a photo.`);
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(t => t.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCameraError(null);
  };

  const switchCamera = () => {
    const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextFacing);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setPreviewImage(dataUrl);
      setDiseaseError(null);
      setDiseaseRejection(null);
      setDiseaseResult(null);
    }
    stopCamera();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setDiseaseError('Please upload a valid photo file (JPG, PNG, or WEBP).');
      return;
    }

    // Validate size (< 15MB)
    if (file.size > 15 * 1024 * 1024) {
      setDiseaseError(`File size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed photo size is 15MB.`);
      return;
    }

    setDiseaseError(null);
    setDiseaseRejection(null);
    setDiseaseResult(null);

    const reader = new FileReader();
    reader.onload = ev => {
      setPreviewImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScanDisease = async () => {
    if (isAnalyzing) return; // Prevent duplicate concurrent requests
    if (!previewImage) {
      setDiseaseError('Please select or capture a crop leaf photo first.');
      setDiseaseErrorType('general');
      return;
    }
    setIsAnalyzing(true);
    setDiseaseResult(null);
    setDiseaseError(null);
    setDiseaseErrorType(null);
    setDiseaseRejection(null);

    // Dynamic MIME type detection from base64 data URI
    let detectedMime = 'image/jpeg';
    const mimeMatch = previewImage.match(/^data:([^;]+);base64,/i);
    if (mimeMatch && mimeMatch[1]) {
      detectedMime = mimeMatch[1].toLowerCase();
    }
    if (detectedMime === 'image/jpg') detectedMime = 'image/jpeg';

    try {
      const res = await fetch('/api/gemini/analyze-disease', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          imageBase64: previewImage,
          mimeType: detectedMime,
          cropName: cropLeafName.trim() || 'Crop Foliage'
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setDiseaseError(data.error || 'Diagnostic server error. Please tap Retry.');
        setDiseaseErrorType(data.errorType || (res.status === 429 ? 'quota' : res.status === 401 ? 'auth' : res.status === 503 ? 'surge' : 'general'));
        return;
      }

      // Rejection of non-plant or unreadable image
      if (data.isPlant === false) {
        setDiseaseRejection({
          reason: data.rejectionReason || 'Uploaded photograph does not clearly show plant leaves, crop foliage, or agricultural tissue.',
          guidance: data.guidance || 'Please capture a clear, well-lit photo focusing directly on the infected leaves or stems in daylight.'
        });
        return;
      }

      if (data && data.result) {
        const resObj: DiseaseResult = {
          title: data.result.diseaseOrCondition || data.result.title || 'Plant Pathology Report',
          cropIdentified: data.result.cropIdentified,
          diseaseOrCondition: data.result.diseaseOrCondition,
          confidence: data.result.confidence || 'Probable',
          confidenceScore: data.result.confidenceScore || 75,
          urgency: data.result.urgency || 'Moderate',
          summary: data.result.summary || (data.result.symptoms && data.result.symptoms[0]) || 'Analysis complete.',
          symptoms: data.result.symptoms || [],
          causes: data.result.causes || [],
          organicTreatment: data.result.organicTreatment || [],
          chemicalTreatment: data.result.chemicalTreatment || [],
          treatment: [
            ...(data.result.organicTreatment || []).map((o: string) => `🌿 [Organic] ${o}`),
            ...(data.result.chemicalTreatment || []).map((c: string) => `🧪 [Chemical] ${c}`)
          ],
          prevention: data.result.prevention || [],
          recoveryRate: data.result.recoveryRate || '75%',
          source: data.source || 'gemini-flash-latest (Gemini Free Model)'
        };

        setDiseaseResult(resObj);
        speakText(`Diagnosis: ${resObj.title}. Confidence: ${resObj.confidence}.`);
        fetchDiseaseDiary();
      } else {
        setDiseaseError('Incomplete diagnostic data received from vision model. Please retry with a clearer photo.');
        setDiseaseErrorType('general');
      }
    } catch (err: any) {
      console.error('Diagnostic scan error:', err);
      setDiseaseError('Unable to connect to diagnostic server. Upstream network issue or timeout occurred. Please check connection and tap "Retry Scan".');
      setDiseaseErrorType('timeout');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // -------------------------------------------------------------
  // DIRECT HARVEST MARKETPLACE
  // -------------------------------------------------------------
  const handleAddProduceListing = async () => {
    const { farmerName, phone, crop, category, quantity, pricePerKg, location, imageUrl } = newListingForm;
    if (!farmerName || !crop || !quantity || !pricePerKg) {
      alert('Please fill farmer name, crop name, quantity, and price per kg!');
      return;
    }

    const cleanQty = parseFloat(quantity);
    const cleanPrice = parseFloat(pricePerKg);
    if (isNaN(cleanQty) || cleanQty <= 0 || isNaN(cleanPrice) || cleanPrice <= 0) {
      alert('Please enter valid positive numbers for quantity and price per kg.');
      return;
    }

    try {
      const res = await fetch('/api/marketplace/produce', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          farmerName,
          phone,
          crop,
          category,
          quantity: cleanQty,
          pricePerKg: cleanPrice,
          location: location || 'Karnataka',
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('🎉 Produce lot published directly to buyers across mandis!');
        setShowAddListingModal(false);
        setNewListingForm({ farmerName: '', phone: '', crop: '', category: 'Cereals', quantity: '', pricePerKg: '', location: '', imageUrl: '' });
        fetchProduceListings();
      } else {
        alert(data.error || 'Failed to publish produce lot.');
      }
    } catch (e) {
      console.error(e);
      alert('Error creating produce listing');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Remove this harvest lot listing?')) return;
    try {
      const res = await fetch(`/api/marketplace/produce/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        alert(data.error || 'Cannot delete this listing.');
        return;
      }
      fetchProduceListings();
    } catch (e) {
      console.error(e);
      alert('Network error while deleting listing.');
    }
  };

  const handleSendInquiry = async () => {
    if (!selectedProduceForInquiry) return;
    const { buyerName, buyerPhone, offeredPrice, quantityRequested, message } = inquiryForm;
    if (!buyerName || !buyerPhone) {
      alert('Please enter your Name and Mobile Number!');
      return;
    }

    try {
      const res = await fetch('/api/marketplace/inquire', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          produceId: selectedProduceForInquiry.id,
          cropName: selectedProduceForInquiry.crop,
          buyerName,
          buyerPhone,
          offeredPrice: parseFloat(offeredPrice) || 0,
          quantityRequested: parseFloat(quantityRequested) || 0,
          message
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Purchase inquiry dispatched to farmer ${selectedProduceForInquiry.farmerName}! Their direct desk will contact ${buyerPhone}.`);
        setSelectedProduceForInquiry(null);
        setInquiryForm({ buyerName: '', buyerPhone: '', offeredPrice: '', quantityRequested: '', message: '' });
      }
    } catch (e) {
      console.error(e);
      alert('Error sending inquiry');
    }
  };

  // -------------------------------------------------------------
  // SUBSIDIES (HONEST PRE-FILING APPLICATION RECORD)
  // -------------------------------------------------------------
  const handleSubmitApplication = async () => {
    const { farmer, aadhaar, mobile, village } = schemeForm;
    if (!farmer || !aadhaar) {
      alert('Enter Farmer Name and 12-digit Aadhaar Number!');
      return;
    }

    try {
      const res = await fetch('/api/schemes/apply', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          scheme: selectedSchemeToApply,
          farmer,
          aadhaar,
          mobile,
          village
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`🎉 Pre-Filing Application Draft Saved! Reference ID: ${data.application.id}\n\nNotice: This is a verified local pre-registration record. To complete statutory processing, please present this reference along with your Aadhaar and RTC land records at your local Raitha Samparka Kendra (RSK) or CSC Center for biometric authentication.`);
        setShowSchemeModal(false);
        setSchemeForm({ farmer: '', aadhaar: '', mobile: '', village: '' });
        fetchSchemeApplications();
        setSchemesTab('myApps');
      } else {
        alert(data.error || 'Failed to submit scheme application.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while saving scheme draft.');
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!confirm('Cancel this scheme application draft?')) return;
    try {
      const res = await fetch(`/api/schemes/applications/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        alert(data.error || 'Cannot delete this draft.');
        return;
      }
      fetchSchemeApplications();
    } catch (e) {
      console.error(e);
      alert('Network error while deleting application.');
    }
  };

  // Cart operations
  const addToCart = (prod: { id: string; name: string; price: number; img: string }) => {
    setCart(prev => {
      const exist = prev.find(p => p.id === prod.id);
      if (exist) {
        return prev.map(p => (p.id === prod.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...prod, qty: 1 }];
    });
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev =>
      prev
        .map(p => (p.id === id ? { ...p, qty: p.qty + delta } : p))
        .filter(p => p.qty > 0)
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // Integrated Modules Registry (Unified Single-SPA Directory)
  const allFeatureModules: Array<{
    name: string;
    category: string;
    icon: string;
    desc: string;
    tabTarget: TabType;
  }> = [
    { name: 'Crop Disease Scanner', category: 'Crops & Health', icon: '🔬', desc: 'Gemini Vision leaf diagnostics, chemical & organic remedies, and scan diary', tabTarget: 'disease' },
    { name: 'Live Mandi Market Intelligence', category: 'Markets & Sales', icon: '📈', desc: '16+ APMC commodities, modal rates, volume arrivals & lot profit calculator', tabTarget: 'mandi' },
    { name: 'Live Farm Weather', category: 'Water & Climate', icon: '☁️', desc: 'Open-Meteo microclimate telemetry, 5-day forecast & spraying safety index', tabTarget: 'weather' },
    { name: 'NPK Fertilizer Calculator', category: 'Crops & Health', icon: '🧪', desc: 'Precision soil-specific chemical & organic dosage planner by acreage', tabTarget: 'fertilizer' },
    { name: 'Kisan Khata (Farm Ledger)', category: 'Finance & Records', icon: '📒', desc: 'Crop-wise expense bookkeeping, breakeven selling price & net P&L intelligence', tabTarget: 'khata' },
    { name: 'Smart Pump IoT Controller', category: 'Water & Climate', icon: '📡', desc: 'Real-time 220V line voltage telemetry, dry-run trip & surge protection', tabTarget: 'pump' },
    { name: 'Direct Harvest Marketplace', category: 'Markets & Sales', icon: '🛒', desc: 'Direct farmer produce lot listings and verified buyer purchase inquiries', tabTarget: 'sell' },
    { name: 'Machinery & Drone CHC', category: 'Machinery & Tools', icon: '🚜', desc: 'Custom Hiring Center tractor, harvester and precision drone spraying booking', tabTarget: 'machinery' },
    { name: 'Buy Farm Inputs Store', category: 'Farm Supplies', icon: '🛍️', desc: 'Certified seeds, bio-fertilizers, organic nutrients and drip kits with cart', tabTarget: 'buy' },
    { name: 'Smart Crop Recommendation', category: 'Crops & Health', icon: '🌱', desc: 'Agro-climatic crop matching by soil type, ambient temperature, season & state', tabTarget: 'crop' },
    { name: 'Voice & Speech Assistant', category: 'AI Assistant', icon: '🎙️', desc: 'Multilingual hands-free voice AI with speech recognition & text-to-speech', tabTarget: 'voice' },
    { name: 'Government Farmer Subsidies', category: 'Subsidies & Welfare', icon: '🏛️', desc: 'PM-KISAN, PMFBY, Solar Pump KUSUM and Tractor grants with tracker', tabTarget: 'schemes' },
    { name: 'PMFBY Crop Loss & Cold Storage', category: 'Subsidies & Welfare', icon: '🛡️', desc: '72-hour formal crop loss intimation dossier and perishable cold chain directory', tabTarget: 'insurance' },
    { name: 'Crop Production & Organic Guides', category: 'Crops & Health', icon: '🌾', desc: 'High-yield agronomic manuals for Rice, Wheat, Sugarcane and Jeevamrutha recipes', tabTarget: 'guides' }
  ];

  return (
    <div className="min-h-screen bg-[#07140d] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-[#071a10]/95 backdrop-blur-md border-b border-emerald-900/40 px-4 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h1 className="font-bold text-lg lg:text-xl text-white tracking-tight flex items-center gap-2">
              {t('appName')}
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {t('backendActive')}
              </span>
            </h1>
            <p className="text-xs text-emerald-400/80">{t('tagline')}</p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2 lg:gap-3 flex-wrap justify-end">
          {/* Language Switch */}
          <div className="bg-emerald-950/80 backdrop-blur-md p-1 rounded-2xl border border-emerald-600/50 flex items-center gap-1 shadow-inner overflow-x-auto max-w-[280px] sm:max-w-none no-scrollbar">
            {LANGUAGES.map(lang => {
              const isSelected = language === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    try {
                      localStorage.setItem('km_language', lang.code);
                    } catch {}
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500 to-green-400 text-slate-950 shadow-md shadow-emerald-500/30 scale-100 ring-1 ring-white/30'
                      : 'text-emerald-300/80 hover:text-white hover:bg-emerald-900/40'
                  }`}
                  title={`${lang.name} (${lang.nativeName})`}
                >
                  <span className="text-[11px]">{lang.flag}</span>
                  <span className="leading-relaxed">{lang.nativeName}</span>
                </button>
              );
            })}
          </div>

          {/* Farmer Account Badge / Login Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 bg-emerald-950/90 border border-emerald-600/50 px-3 py-1.5 rounded-xl text-xs shadow-md">
              <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[11px] shrink-0">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <div className="font-bold text-white leading-tight">{currentUser.fullName}</div>
                <div className="text-[10px] text-emerald-400 leading-tight">{currentUser.village}, {currentUser.district}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-1 text-[11px] text-rose-300 hover:text-rose-100 font-semibold underline decoration-rose-500/50"
                title="Sign out of farmer account"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthError(null);
                setAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 px-3 py-2 rounded-xl transition shadow-md shadow-emerald-500/20 shrink-0"
              title="Secure server-side farmer registration and login"
            >
              <span>👤</span>
              <span className="hidden sm:inline">Farmer Sign In</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

          {/* TTS Toggle */}
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 hover:text-white transition shrink-0"
            title={ttsEnabled ? 'Mute AI Voice' : 'Unmute AI Voice'}
          >
            {ttsEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rose-400" />}
          </button>

          {/* All 14 Modules Launcher */}
          <button
            onClick={() => setActiveTab('standalone')}
            className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white px-3 py-2 rounded-xl transition shadow-md shadow-emerald-700/20 shrink-0"
            title="Browse all 14 integrated agricultural modules in one place"
          >
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">All 14 Modules</span>
          </button>
        </div>
      </header>

      {/* Clean 5-Pillar Navigation Hubs */}
      <nav className="bg-[#0b2316]/90 border-b border-emerald-900/40 px-3 lg:px-8 py-2 overflow-x-auto flex gap-2 text-xs font-medium no-scrollbar">
        {[
          { id: 'dashboard', hub: 'home', labelKey: 'navHome', icon: Home, targetTab: 'dashboard' as TabType },
          { id: 'crops', hub: 'crops', labelKey: 'navCrops', icon: Sprout, targetTab: 'disease' as TabType },
          { id: 'market', hub: 'market', labelKey: 'navMarket', icon: TrendingUp, targetTab: 'mandi' as TabType },
          { id: 'water', hub: 'water', labelKey: 'navWater', icon: CloudSun, targetTab: 'weather' as TabType },
          { id: 'voice', hub: 'voice', labelKey: 'navVoice', icon: Mic, targetTab: 'voice' as TabType },
          { id: 'standalone', hub: 'standalone', labelKey: 'navPages', icon: Layers, targetTab: 'standalone' as TabType }
        ].map(hub => {
          const Icon = hub.icon;
          const isCurrent =
            (hub.hub === 'home' && activeTab === 'dashboard') ||
            (hub.hub === 'crops' && ['disease', 'fertilizer', 'crop', 'guides'].includes(activeTab)) ||
            (hub.hub === 'market' && ['mandi', 'khata', 'sell', 'machinery', 'buy'].includes(activeTab)) ||
            (hub.hub === 'water' && ['weather', 'pump', 'insurance', 'schemes'].includes(activeTab)) ||
            (hub.hub === 'voice' && activeTab === 'voice') ||
            (hub.hub === 'standalone' && activeTab === 'standalone');

          return (
            <button
              key={hub.id}
              onClick={() => setActiveTab(hub.targetTab)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                isCurrent
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-emerald-300 hover:bg-emerald-950/60 hover:text-white bg-black/20 border border-emerald-900/30'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t(hub.labelKey)}</span>
            </button>
          );
        })}
      </nav>

      {/* Contextual Sub-Nav Bar for Active Tool Hub with Universal Back Navigation */}
      {activeTab !== 'dashboard' && (
        <div className="bg-[#071a10]/95 backdrop-blur-md border-b border-emerald-900/50 px-4 lg:px-8 py-2.5 flex items-center justify-between gap-3 overflow-x-auto text-xs sticky top-[61px] z-40">
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-500/30 transition font-bold shadow-sm"
              title="Return to the main home dashboard"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('backToHome')}</span>
            </button>
            <span className="text-emerald-500/40 hidden sm:inline">•</span>
            <span className="font-semibold text-emerald-200/90 hidden sm:inline capitalize">
              {activeTab === 'disease' && 'Crop Leaf Pathology'}
              {activeTab === 'fertilizer' && 'Precision NPK'}
              {activeTab === 'crop' && 'Crop Recommendation'}
              {activeTab === 'guides' && 'Cultivation & Organic Manuals'}
              {activeTab === 'mandi' && 'APMC Mandi Intelligence'}
              {activeTab === 'khata' && 'Kisan Khata P&L'}
              {activeTab === 'sell' && 'Direct Produce Market'}
              {activeTab === 'machinery' && 'Machinery Rental'}
              {activeTab === 'buy' && 'Farm Inputs Store'}
              {activeTab === 'weather' && 'Live Weather & Spray Index'}
              {activeTab === 'pump' && 'Smart Pump Controller'}
              {activeTab === 'insurance' && 'PMFBY Loss Intimation'}
              {activeTab === 'schemes' && 'Government Subsidies'}
              {activeTab === 'voice' && 'KrishiMitra Voice AI'}
              {activeTab === 'standalone' && 'All 14 Modules Index'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {/* Crops Hub Sibling Tools */}
            {['disease', 'fertilizer', 'crop', 'guides'].includes(activeTab) && (
              <>
                <button
                  onClick={() => setActiveTab('disease')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'disease' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subLeafDoctor')}
                </button>
                <button
                  onClick={() => setActiveTab('fertilizer')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'fertilizer' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subFertilizer')}
                </button>
                <button
                  onClick={() => setActiveTab('crop')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'crop' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subCropMatch')}
                </button>
                <button
                  onClick={() => setActiveTab('guides')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'guides' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subOrganic')}
                </button>
              </>
            )}

            {/* Market Hub Sibling Tools */}
            {['mandi', 'khata', 'sell', 'machinery', 'buy'].includes(activeTab) && (
              <>
                <button
                  onClick={() => setActiveTab('mandi')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'mandi' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subMandi')}
                </button>
                <button
                  onClick={() => setActiveTab('khata')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'khata' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subKhata')}
                </button>
                <button
                  onClick={() => setActiveTab('sell')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'sell' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subSell')}
                </button>
                <button
                  onClick={() => setActiveTab('machinery')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'machinery' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subMachinery')}
                </button>
                <button
                  onClick={() => setActiveTab('buy')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'buy' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subStore')}
                </button>
              </>
            )}

            {/* Water & Govt Hub Sibling Tools */}
            {['weather', 'pump', 'insurance', 'schemes'].includes(activeTab) && (
              <>
                <button
                  onClick={() => setActiveTab('weather')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'weather' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subWeather')}
                </button>
                <button
                  onClick={() => setActiveTab('pump')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'pump' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subPump')}
                </button>
                <button
                  onClick={() => setActiveTab('insurance')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'insurance' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subInsurance')}
                </button>
                <button
                  onClick={() => setActiveTab('schemes')}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
                    activeTab === 'schemes' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300 hover:bg-emerald-950/40'
                  }`}
                >
                  {t('subSchemes')}
                </button>
              </>
            )}

            {/* Voice & Standalone Directory Labels */}
            {activeTab === 'voice' && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 text-[11px] font-semibold">
                🎙️ Multilingual AI Voice & Chatbot
              </span>
            )}
            {activeTab === 'standalone' && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 text-[11px] font-semibold">
                📚 Complete Feature Index (14 Modules)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto">
        {/* ================= 1. DASHBOARD TAB (EASY TO USE KISAN PORTAL) ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Daily Farm Status & Spray Window Alert Banner */}
            <div className="bg-gradient-to-r from-emerald-950/80 via-[#0a2718] to-emerald-900/60 border border-emerald-500/40 rounded-3xl p-5 lg:p-7 relative overflow-hidden shadow-xl">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2.5">
                    <CloudSun className="w-4 h-4 text-amber-400" />
                    <span>{t('bannerWeather')}: {weatherData?.location || (language === 'kn-IN' ? 'ದಾವಣಗೆರೆ APMC, ಕರ್ನಾಟಕ' : 'Davangere APMC, Karnataka')}</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                    {t('bannerGreeting')} <span className="text-emerald-400">{t('bannerQuestion')}</span>
                  </h2>
                  <p className="text-xs text-emerald-200/90 mt-1 max-w-2xl leading-relaxed">
                    {t('bannerDesc')}
                  </p>

                  <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
                    <button
                      onClick={() => setActiveTab('weather')}
                      className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl hover:bg-emerald-500/30 transition flex items-center gap-1.5 font-semibold"
                    >
                      <Wind className="w-3.5 h-3.5" />
                      {t('subWeather')}:{' '}
                      <b className="text-white">{weatherData?.sprayingAdvisory?.badge || t('bannerSpraySafe')}</b>
                    </button>
                    <button
                      onClick={() => setActiveTab('mandi')}
                      className="px-3.5 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl hover:bg-amber-500/30 transition flex items-center gap-1.5 font-semibold"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      {t('subMandi')}: <b className="text-white">{mandiItems.length} {t('mandiActive')}</b>
                    </button>
                  </div>
                </div>

                {/* Quick Real-Time Telemetry Gauges */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <div
                    onClick={() => setActiveTab('weather')}
                    className="bg-black/50 border border-emerald-800/50 hover:border-emerald-400/60 p-3 rounded-2xl text-center min-w-[105px] cursor-pointer transition"
                  >
                    <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">{t('tempLive')}</div>
                    <div className="text-2xl font-bold font-mono text-white mt-0.5">
                      {weatherData?.current?.temp ?? 29}°C
                    </div>
                    <div className="text-[10px] text-emerald-300/70">{t('wind')}: {weatherData?.current?.windSpeed ?? 9} km/h</div>
                  </div>

                  <div
                    onClick={() => setActiveTab('pump')}
                    className="bg-black/50 border border-emerald-800/50 hover:border-emerald-400/60 p-3 rounded-2xl text-center min-w-[105px] cursor-pointer transition"
                  >
                    <div className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold">{t('tubewellMotor')}</div>
                    <div className="text-2xl font-bold font-mono text-emerald-300 mt-0.5">
                      {pumpRunning ? `${voltage}V` : (language === 'kn-IN' ? 'ಆಫ್' : 'OFF')}
                    </div>
                    <div className="text-[10px] text-emerald-300/70">{pumpRunning ? t('motorOn') : t('motorOff')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick 1-Tap Voice Questions Strip */}
            <div className="bg-[#0a1e13] border border-emerald-800/40 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {t('voiceChipTitle')}
                </span>
                <span className="text-[11px] text-emerald-400/80">{t('voiceNoType')}</span>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { text: t('voicePrompt1'), query: t('voicePrompt1') },
                  { text: t('voicePrompt2'), query: t('voicePrompt2') },
                  { text: t('voicePrompt3'), query: t('voicePrompt3') },
                  { text: t('voicePrompt4'), query: t('voicePrompt4') },
                  { text: t('voicePrompt5'), query: t('voicePrompt5') }
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputPrompt(chip.query);
                      handleSendMessage(chip.query);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-emerald-950/60 border border-emerald-800/60 hover:border-emerald-500/60 text-emerald-200 hover:text-white transition text-xs flex items-center gap-1.5"
                  >
                    <span>{chip.text}</span>
                  </button>
                ))}
              </div>

              {/* Text Search & Speech Input */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 items-center">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3.5 top-3 text-emerald-400" />
                  <input
                    type="text"
                    placeholder={t('askPlaceholder')}
                    value={inputPrompt}
                    onChange={e => setInputPrompt(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-emerald-800/60 text-white placeholder-emerald-500/60 focus:outline-none focus:border-emerald-400 text-xs"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={toggleSpeechRecognition}
                    className={`p-2.5 rounded-xl border transition ${
                      isListening
                        ? 'bg-rose-500 border-rose-400 text-white animate-pulse'
                        : 'bg-emerald-900/60 border-emerald-700/50 text-emerald-300 hover:text-white'
                    }`}
                    title={t('voiceChipTitle')}
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={isAiThinking}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isAiThinking ? t('thinking') : t('askBtn')}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 6 Giant Kisan Power Action Tiles (Super Easy to Understand) */}
            <div>
              <div className="flex justify-between items-center mb-3.5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  {t('appName')} • Quick Actions
                </h3>
                <span className="text-xs text-emerald-400/80">{t('bannerQuestion')}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* 1. Leaf Disease Scanner */}
                <div
                  onClick={() => setActiveTab('disease')}
                  className="bg-gradient-to-br from-[#0c2e1c] to-[#07190f] border border-emerald-600/40 hover:border-emerald-400 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition">
                        🔬
                      </div>
                      <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        AI Doctor
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition">
                      {t('tileLeafTitle')}
                    </h4>
                    <p className="text-xs text-emerald-200/80 mt-1.5 leading-relaxed">
                      {t('tileLeafDesc')}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                    <span>{t('tileLeafBtn')}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* 2. Live Mandi Prices */}
                <div
                  onClick={() => setActiveTab('mandi')}
                  className="bg-gradient-to-br from-[#1e2a0f] to-[#0f1807] border border-amber-600/40 hover:border-amber-400 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center text-2xl group-hover:bg-amber-500 group-hover:text-slate-950 transition">
                        📈
                      </div>
                      <span className="text-[11px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                        16 {t('mandiActive')}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition">
                      {t('tileMandiTitle')}
                    </h4>
                    <p className="text-xs text-amber-200/80 mt-1.5 leading-relaxed">
                      {t('tileMandiDesc')}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-amber-900/40 flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300">
                    <span>{t('tileMandiBtn')}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* 3. NPK Fertilizer Calculator */}
                <div
                  onClick={() => setActiveTab('fertilizer')}
                  className="bg-gradient-to-br from-[#0c2730] to-[#07151a] border border-cyan-600/40 hover:border-cyan-400 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-2xl group-hover:bg-cyan-500 group-hover:text-slate-950 transition">
                        🧪
                      </div>
                      <span className="text-[11px] font-bold bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                        NPK Calc
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                      {t('tileFertTitle')}
                    </h4>
                    <p className="text-xs text-cyan-200/80 mt-1.5 leading-relaxed">
                      {t('tileFertDesc')}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-cyan-900/40 flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300">
                    <span>{t('tileFertBtn')}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* 4. Kisan Khata (Farm Ledger) */}
                <div
                  onClick={() => setActiveTab('khata')}
                  className="bg-gradient-to-br from-[#2a170c] to-[#150a05] border border-orange-600/40 hover:border-orange-400 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center justify-center text-2xl group-hover:bg-orange-500 group-hover:text-slate-950 transition">
                        📒
                      </div>
                      <span className="text-[11px] font-bold bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                        P&L
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-orange-300 transition">
                      {t('tileKhataTitle')}
                    </h4>
                    <p className="text-xs text-orange-200/80 mt-1.5 leading-relaxed">
                      {t('tileKhataDesc')}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-orange-900/40 flex items-center justify-between text-xs font-bold text-orange-400 group-hover:text-orange-300">
                    <span>{t('tileKhataBtn')}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* 5. Machinery & Drone Rental Hub */}
                <div
                  onClick={() => setActiveTab('machinery')}
                  className="bg-gradient-to-br from-[#122a1a] to-[#0a180f] border border-teal-600/40 hover:border-teal-400 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center text-2xl group-hover:bg-teal-500 group-hover:text-slate-950 transition">
                        🚜
                      </div>
                      <span className="text-[11px] font-bold bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-500/30">
                        CHC
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-teal-300 transition">
                      {t('tileMachTitle')}
                    </h4>
                    <p className="text-xs text-teal-200/80 mt-1.5 leading-relaxed">
                      {t('tileMachDesc')}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-teal-900/40 flex items-center justify-between text-xs font-bold text-teal-400 group-hover:text-teal-300">
                    <span>{t('tileMachBtn')}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>

                {/* 6. Smart Pump Controller */}
                <div
                  onClick={() => setActiveTab('pump')}
                  className="bg-gradient-to-br from-[#151c2f] to-[#080d19] border border-indigo-600/40 hover:border-indigo-400 rounded-3xl p-5 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-lg flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 flex items-center justify-center text-2xl group-hover:bg-indigo-500 group-hover:text-slate-950 transition">
                        ⚡
                      </div>
                      <span className="text-[11px] font-bold bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                        220V Core
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                      {t('tilePumpTitle')}
                    </h4>
                    <p className="text-xs text-indigo-200/80 mt-1.5 leading-relaxed">
                      {t('tilePumpDesc')}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-indigo-900/40 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                    <span>{t('tilePumpBtn')}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Services Strip (Insurance, Schemes, Store, Organic) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => setActiveTab('insurance')}
                className="bg-[#0b2416] hover:bg-[#0f2e1c] border border-rose-800/40 hover:border-rose-500/60 p-3.5 rounded-2xl text-left transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">{t('secInsurance')}</div>
                  <div className="text-[11px] text-rose-300/80">PMFBY Loss Dossier</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('schemes')}
                className="bg-[#0b2416] hover:bg-[#0f2e1c] border border-emerald-800/40 hover:border-emerald-500/60 p-3.5 rounded-2xl text-left transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">{t('secSchemes')}</div>
                  <div className="text-[11px] text-emerald-300/80">KUSUM, KISAN, Tractor</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('sell')}
                className="bg-[#0b2416] hover:bg-[#0f2e1c] border border-amber-800/40 hover:border-amber-500/60 p-3.5 rounded-2xl text-left transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">{t('secMarket')}</div>
                  <div className="text-[11px] text-amber-300/80">Zero Middlemen Market</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('guides')}
                className="bg-[#0b2416] hover:bg-[#0f2e1c] border border-cyan-800/40 hover:border-cyan-500/60 p-3.5 rounded-2xl text-left transition flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white">{t('secOrganic')}</div>
                  <div className="text-[11px] text-cyan-300/80">Zero Budget Recipes</div>
                </div>
              </button>
            </div>

            {/* Featured Mandi Ticker Strip with Real Images */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> {t('subMandi')}
                </h3>
                <button
                  onClick={() => setActiveTab('mandi')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                >
                  {language === 'kn-IN' ? 'ಎಲ್ಲಾ 16 ಬೆಳೆಗಳ ದರ ವೀಕ್ಷಿಸಿ' : 'View all 16 Mandi Crops'} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {mandiItems.slice(0, 4).map(item => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedMandiCrop(item);
                      setActiveTab('mandi');
                    }}
                    className="bg-[#0b2416] border border-emerald-900/40 hover:border-emerald-500/50 rounded-2xl p-3 cursor-pointer transition flex flex-col justify-between group"
                  >
                    <div>
                      <div className="relative h-28 rounded-xl overflow-hidden mb-2">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-emerald-300 backdrop-blur-sm">
                          {item.state}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-white group-hover:text-emerald-400 transition line-clamp-1">{item.name}</h4>
                      <div className="text-[11px] text-emerald-300/70">{item.hindiName}</div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-emerald-900/30 flex items-baseline justify-between">
                      <div className="font-mono text-base font-bold text-emerald-400">
                        ₹{item.modalPrice}
                        <span className="text-[10px] font-sans font-normal text-emerald-300/60">/Q</span>
                      </div>
                      <div className={`text-[11px] font-mono font-bold flex items-center ${item.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {item.change >= 0 ? '+' : ''}{item.changePercent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Simple Step-by-Step Kisan Guide (3 Easy Steps) */}
            <div className="bg-[#0a1e13] border border-emerald-900/50 rounded-3xl p-5 lg:p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                {t('guideTitle')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-black/30 border border-emerald-900/40 p-4 rounded-2xl space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">1</div>
                  <h4 className="font-bold text-white text-sm">{t('guideStep1Title')}</h4>
                  <p className="text-emerald-200/80 leading-relaxed">
                    {t('guideStep1Desc')}
                  </p>
                </div>
                <div className="bg-black/30 border border-emerald-900/40 p-4 rounded-2xl space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">2</div>
                  <h4 className="font-bold text-white text-sm">{t('guideStep2Title')}</h4>
                  <p className="text-emerald-200/80 leading-relaxed">
                    {t('guideStep2Desc')}
                  </p>
                </div>
                <div className="bg-black/30 border border-emerald-900/40 p-4 rounded-2xl space-y-1.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">3</div>
                  <h4 className="font-bold text-white text-sm">{t('guideStep3Title')}</h4>
                  <p className="text-emerald-200/80 leading-relaxed">
                    {t('guideStep3Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. LIVE REAL WEATHER TAB ================= */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <CloudSun className="w-6 h-6 text-amber-400" />
                  Live Agro-Meteorological Weather
                </h2>
                <p className="text-xs text-emerald-300/80">
                  Real live data from Open-Meteo API with agricultural spraying safety advisory.
                </p>
              </div>

              {/* Location Controls */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={useDeviceLocation}
                  className="px-3.5 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow hover:bg-emerald-400 transition"
                  title="Detect GPS coordinates of your farm"
                >
                  <Compass className="w-4 h-4" /> Use My GPS
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-3.5 py-2 bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs hover:text-white flex items-center gap-1.5 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {t('backToHome')}
                </button>
              </div>
            </div>

            {/* District Quick Switcher & Search Bar */}
            <div className="bg-[#0a1e13] border border-emerald-900/40 rounded-2xl p-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-emerald-400" />
                  <input
                    type="text"
                    placeholder="Search any Indian agricultural district (e.g. Pune, Karnal, Indore, Guntur)..."
                    value={weatherSearchInput}
                    onChange={e => setWeatherSearchInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && weatherSearchInput.trim()) {
                        fetchWeather(weatherSearchInput.trim());
                      }
                    }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-emerald-800/50 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400 text-xs"
                  />
                </div>
                <button
                  onClick={() => weatherSearchInput.trim() && fetchWeather(weatherSearchInput.trim())}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs"
                >
                  Fetch Weather
                </button>
              </div>

              {/* Quick Hub Chips */}
              <div className="flex gap-1.5 overflow-x-auto text-[11px] font-semibold no-scrollbar pt-1">
                {[
                  { name: 'Davangere (KA)', key: 'davangere' },
                  { name: 'Kalaburagi (KA)', key: 'gulbarga' },
                  { name: 'Raichur (KA)', key: 'raichur' },
                  { name: 'Bidar (KA)', key: 'bidar' },
                  { name: 'Karnal (HR)', key: 'karnal' },
                  { name: 'Pune (MH)', key: 'pune' },
                  { name: 'Lasalgaon (MH)', key: 'lasalgaon' },
                  { name: 'Indore (MP)', key: 'indore' },
                  { name: 'Guntur (AP)', key: 'guntur' },
                  { name: 'Hyderabad (TG)', key: 'hyderabad' }
                ].map(hub => (
                  <button
                    key={hub.key}
                    onClick={() => {
                      setWeatherCity(hub.key);
                      fetchWeather(hub.key);
                    }}
                    className="px-3 py-1 rounded-lg bg-black/30 border border-emerald-900/60 text-emerald-300 hover:bg-emerald-500/20 whitespace-nowrap transition"
                  >
                    {hub.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Weather Display */}
            {isLoadingWeather ? (
              <div className="py-20 text-center space-y-3">
                <RotateCcw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                <p className="text-xs text-emerald-300">Connecting to Open-Meteo satellite feed...</p>
              </div>
            ) : weatherData ? (
              <div className="space-y-6">
                {/* Primary Card */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Atmospheric Snapshot */}
                  <div className="bg-[#0b2416] border border-emerald-900/40 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-xs text-emerald-300/80">
                        <span className="flex items-center gap-1 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {weatherData.location}
                        </span>
                        <span className="font-mono text-[10px]">Open-Meteo Live</span>
                      </div>

                      <div className="flex items-center gap-4 my-6">
                        <span className="text-6xl">{weatherData.current.icon}</span>
                        <div>
                          <div className="text-5xl font-extrabold font-mono text-white tracking-tight">
                            {weatherData.current.temp}°C
                          </div>
                          <div className="text-xs text-emerald-300 font-semibold mt-0.5">
                            Feels like {weatherData.current.apparentTemp}°C
                          </div>
                        </div>
                      </div>

                      <div className="text-sm font-semibold text-emerald-100">{weatherData.current.condition}</div>
                    </div>

                    <div className="pt-4 border-t border-emerald-900/30 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-emerald-400/80 block">Relative Humidity</span>
                        <span className="font-mono font-bold text-white text-sm">{weatherData.current.humidity}%</span>
                      </div>
                      <div>
                        <span className="text-emerald-400/80 block">Wind Velocity</span>
                        <span className="font-mono font-bold text-white text-sm">{weatherData.current.windSpeed} km/h</span>
                      </div>
                    </div>
                  </div>

                  {/* Agricultural Spraying Safety Meter */}
                  <div className="lg:col-span-2 bg-[#0b2416] border border-emerald-900/40 rounded-3xl p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                          <Wind className="w-4 h-4 text-emerald-400" /> Pesticide & Foliar Spraying Window Index
                        </h3>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full ${
                            weatherData.sprayingAdvisory.color === 'emerald'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : weatherData.sprayingAdvisory.color === 'amber'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {weatherData.sprayingAdvisory.badge}
                        </span>
                      </div>

                      <p className="text-xs text-emerald-100/90 mt-3 leading-relaxed bg-black/30 p-4 rounded-2xl border border-emerald-900/40">
                        {weatherData.sprayingAdvisory.advice}
                      </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-emerald-900/30 text-xs">
                      <div className="bg-black/20 p-3 rounded-xl border border-emerald-900/30 text-center">
                        <span className="text-emerald-400/80 text-[10px] block">Rain Probability</span>
                        <span className="font-mono font-bold text-sm text-white">{weatherData.current.rainProbability}%</span>
                      </div>
                      <div className="bg-black/20 p-3 rounded-xl border border-emerald-900/30 text-center">
                        <span className="text-emerald-400/80 text-[10px] block">Barometric Pressure</span>
                        <span className="font-mono font-bold text-sm text-white">{weatherData.current.pressure} hPa</span>
                      </div>
                      <div className="bg-black/20 p-3 rounded-xl border border-emerald-900/30 text-center">
                        <span className="text-emerald-400/80 text-[10px] block">Dew Risk</span>
                        <span className="font-mono font-bold text-sm text-emerald-300">
                          {weatherData.current.humidity > 80 ? 'Heavy Morning Dew' : 'Low Dew Risk'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 7-Day Agricultural Forecast Strip */}
                <div>
                  <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider mb-3">
                    7-Day Agricultural Field Forecast
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    {weatherData.dailyForecast.map((day, idx) => (
                      <div key={idx} className="bg-[#0a1e13] border border-emerald-900/40 rounded-2xl p-3 text-center space-y-1 text-xs">
                        <div className="font-semibold text-emerald-300 text-[11px]">{day.date}</div>
                        <div className="text-3xl my-1">{day.icon}</div>
                        <div className="font-mono font-bold text-white text-sm">
                          {day.maxTemp}° <span className="text-emerald-400/60 text-xs font-normal">{day.minTemp}°</span>
                        </div>
                        <div className="text-[10px] text-emerald-400/80">🌧️ {day.rainProb}% rain</div>
                        <div className="text-[10px] text-cyan-400/80">💨 {day.maxWind} km/h</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* ================= 3. APMC MANDI BENCHMARK TAB ================= */}
        {activeTab === 'mandi' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                    APMC Mandi Price Intelligence
                  </h2>
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    Verified APMC Benchmark Rates
                  </span>
                </div>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  Official APMC yard closing modal prices • Source: <span className="text-emerald-300 font-semibold">{mandiDataSource}</span> (24 October 2026 Closing Session). <span className="text-amber-300/90 italic">Physical gate bids vary by moisture & grading.</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('sell')}
                  className="px-3.5 py-1.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl text-xs hover:bg-amber-500/30 flex items-center gap-1.5 font-semibold"
                >
                  <Store className="w-3.5 h-3.5" /> Sell Harvest Lot
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-3.5 py-1.5 bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs hover:text-white flex items-center gap-1.5 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {t('backToHome')}
                </button>
              </div>
            </div>

            {/* Harvest Lot Profit Calculator Banner */}
            <div className="bg-gradient-to-r from-amber-950/40 via-emerald-950/40 to-teal-950/30 border border-amber-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
                  ₹
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Harvest Lot Returns & Net Profit Calculator</h4>
                  <p className="text-xs text-emerald-300/80">
                    Selected:{' '}
                    <b className="text-amber-300">{selectedMandiCrop?.name || 'Sona Masuri Rice'}</b> @ ₹
                    {selectedMandiCrop?.modalPrice ?? 3850}/Quintal
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-xl border border-emerald-800/50">
                  <input
                    type="number"
                    min="10"
                    step="50"
                    value={calcHarvestQty}
                    onChange={e => setCalcHarvestQty(Math.max(1, Number(e.target.value)))}
                    className="w-24 bg-transparent text-white font-mono text-center text-sm font-bold outline-none"
                  />
                  <span className="text-xs text-emerald-300 font-semibold">kg</span>
                </div>

                {selectedMandiCrop && (
                  <div className="bg-emerald-950/80 px-4 py-2 rounded-xl border border-emerald-700/50 text-right">
                    <div className="text-[10px] text-emerald-400 uppercase font-semibold">Est. Net Profit (35% margin)</div>
                    <div className="text-sm font-bold font-mono text-white">
                      ₹{Math.round(((selectedMandiCrop.modalPrice / 100) * calcHarvestQty) * 0.35).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Category Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              {/* Category Chips */}
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-semibold no-scrollbar">
                {['All', 'Cereals', 'Pulses', 'Oilseeds', 'Cash Crops', 'Horticulture'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setMandiCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl border transition whitespace-nowrap ${
                      mandiCategory === cat
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-[#0a1f13] border-emerald-900/50 text-emerald-300 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Filter crop or APMC hub..."
                  value={mandiSearch}
                  onChange={e => setMandiSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-emerald-800/50 text-white text-xs placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Mandi Commodity Grid with Verified Real Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mandiItems
                .filter(item => mandiCategory === 'All' || item.category === mandiCategory)
                .filter(
                  item =>
                    !mandiSearch ||
                    item.name.toLowerCase().includes(mandiSearch.toLowerCase()) ||
                    item.hindiName.toLowerCase().includes(mandiSearch.toLowerCase()) ||
                    item.mandiHub.toLowerCase().includes(mandiSearch.toLowerCase())
                )
                .map(item => {
                  const ratePerKg = (item.modalPrice / 100).toFixed(1);
                  const totalLotGross = Math.round((item.modalPrice / 100) * calcHarvestQty);
                  const isSelected = selectedMandiCrop?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedMandiCrop(item)}
                      className={`bg-[#0b2416] border rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer transition group ${
                        isSelected
                          ? 'border-emerald-400 shadow-lg shadow-emerald-500/20 bg-[#0e2c1c]'
                          : 'border-emerald-900/40 hover:border-emerald-600'
                      }`}
                    >
                      <div>
                        {/* Authentic Commodity Image */}
                        <div className="relative h-36 rounded-xl overflow-hidden mb-3">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                            loading="lazy"
                          />
                          <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/75 text-emerald-300 backdrop-blur-sm">
                            {item.category}
                          </span>
                          <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/75 text-amber-300 backdrop-blur-sm">
                            {item.grade}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-white group-hover:text-emerald-400 transition line-clamp-1">
                          {item.name}
                        </h4>
                        <div className="text-xs text-emerald-300/80 mt-0.5">{item.hindiName}</div>
                        <div className="text-[11px] text-emerald-400/60 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-500" /> {item.mandiHub}, {item.state}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-emerald-900/40 space-y-2">
                        <div className="flex justify-between items-baseline">
                          <div>
                            <div className="text-[10px] text-emerald-400 uppercase font-semibold">APMC Modal Rate</div>
                            <div className="text-xl font-bold font-mono text-white">
                              ₹{item.modalPrice.toLocaleString()}{' '}
                              <span className="text-xs font-sans font-normal text-emerald-300/60">/Q</span>
                            </div>
                          </div>
                          <div
                            className={`text-xs font-mono font-bold flex items-center gap-0.5 px-2 py-0.5 rounded ${
                              item.change >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                            }`}
                          >
                            {item.change >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            {item.change >= 0 ? '+' : ''}₹{item.change}
                          </div>
                        </div>

                        <div className="bg-black/30 p-2 rounded-xl text-[11px] flex justify-between text-emerald-200/90 font-mono">
                          <span>{calcHarvestQty} kg Gross Lot:</span>
                          <span className="font-bold text-emerald-300">₹{totalLotGross.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ================= 4. LEAF DISEASE SCANNER TAB ================= */}
        {activeTab === 'disease' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Camera className="w-6 h-6 text-emerald-400" />
                  AI Crop Leaf Disease Scanner & Farm Diary
                </h2>
                <p className="text-xs text-emerald-300/80">
                  Upload an infected leaf image. Gemini Free Model Vision API (gemini-flash-latest) analyzes pathogen symptoms and generates exact treatment recipes.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 px-3.5 py-2 rounded-xl hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {t('backToHome')}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload Card */}
              <div className="bg-[#0b2416]/70 border border-emerald-900/40 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                      <Camera className="w-4 h-4 text-emerald-400" />
                      1. Upload or Capture Leaf Photo
                    </h3>
                    <span className="text-[10px] text-emerald-400/80 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/40">
                      Mobile & Desktop Ready
                    </span>
                  </div>

                  {/* Dual Hidden Inputs: Native Camera and Gallery Picker */}
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />

                  {previewImage ? (
                    <div className="space-y-3">
                      <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/60 bg-black/40 p-2 text-center shadow-lg">
                        <img
                          src={previewImage}
                          alt="Crop Leaf Preview"
                          className="max-h-64 mx-auto rounded-xl object-contain shadow-md"
                        />
                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                          <span className="bg-black/75 backdrop-blur-md text-emerald-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-700/50">
                            Photo Ready for Diagnosis
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => startCamera('environment')}
                          className="py-2.5 px-3 bg-emerald-900/60 hover:bg-emerald-800/70 border border-emerald-600/50 text-emerald-200 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <Camera className="w-4 h-4 text-emerald-400" />
                          <span>Retake (Camera)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="py-2.5 px-3 bg-emerald-950 border border-emerald-700/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Native App</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="py-2.5 px-3 bg-black/40 hover:bg-black/60 border border-emerald-800/40 text-emerald-300 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Change File</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Interactive Drop / Upload Area */}
                      <div
                        onClick={() => startCamera('environment')}
                        className="border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center bg-black/20 hover:bg-emerald-950/40 transition group"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-green-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-105 transition">
                          📸
                        </div>
                        <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition">
                          Take Leaf Photo by Camera
                        </span>
                        <span className="text-xs text-emerald-300/80 mt-1 max-w-xs">
                          Opens in-app viewfinder or mobile hardware camera. Hold steady at 15-20cm distance.
                        </span>
                      </div>

                      {/* Explicit Action Buttons for Complete Accessibility */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <button
                          type="button"
                          onClick={() => startCamera('environment')}
                          className="py-3 px-4 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
                        >
                          <Camera className="w-4 h-4" />
                          <span>Open Live Camera Viewfinder</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => cameraInputRef.current?.click()}
                          className="py-3 px-4 bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/50 text-emerald-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition active:scale-95"
                          title="Direct mobile camera hardware app"
                        >
                          <span>📱</span>
                          <span>Fast Mobile Camera Snap</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-center pt-1">
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          className="text-xs text-emerald-400 hover:text-emerald-200 underline underline-offset-4 flex items-center gap-1.5 transition font-semibold"
                        >
                          <span>📁 Or choose an existing photo from Gallery / Files</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="text-xs text-emerald-300/80 font-semibold block mb-1">
                      Crop Variety (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Tomato, Rice, Cotton, Wheat, Chili..."
                      value={cropLeafName}
                      onChange={e => setCropLeafName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-emerald-800/40 text-white text-xs placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleScanDisease}
                    disabled={isAnalyzing || !previewImage}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    {isAnalyzing ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" /> Analyzing with Gemini Vision...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Scan with KrishiMitra AI
                      </>
                    )}
                  </button>
                  {previewImage && (
                    <button
                      onClick={() => {
                        setPreviewImage('');
                        setDiseaseResult(null);
                      }}
                      className="p-3 bg-rose-950/40 border border-rose-800/40 text-rose-300 hover:text-white rounded-xl"
                      title="Clear image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Diagnostic Results Card */}
              <div className="bg-[#0b2416]/70 border border-emerald-900/40 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-emerald-400" /> 2. AI Pathology Diagnostic Report
                    </h3>
                    {diseaseResult && (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 ${
                        diseaseResult.confidence === 'Confirmed'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : diseaseResult.confidence === 'Probable'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                      }`}>
                        <span>{diseaseResult.confidence === 'Confirmed' ? '✅' : '⚠️'}</span>
                        <span>{diseaseResult.confidence || 'Probable'} Confidence ({diseaseResult.confidenceScore || 75}%)</span>
                      </span>
                    )}
                  </div>

                  {isAnalyzing ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="text-4xl animate-bounce">🔬</div>
                      <p className="text-sm font-semibold text-emerald-300">Examining leaf lesions & cellular chlorosis...</p>
                      <p className="text-xs text-emerald-400 font-mono">Running Gemini Free Model Vision API (gemini-flash-latest)</p>
                    </div>
                  ) : diseaseError ? (
                    <div className="bg-rose-950/40 border border-rose-800/60 rounded-2xl p-5 text-xs space-y-3">
                      <div className="flex items-start gap-2.5 text-rose-300">
                        <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-white text-sm flex items-center gap-1.5">
                              Diagnostic Vision Advisory
                              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-normal">
                                Gemini Free Model API
                              </span>
                            </span>
                            {diseaseErrorType && (
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                diseaseErrorType === 'quota'
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                  : diseaseErrorType === 'surge'
                                  ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                                  : diseaseErrorType === 'auth'
                                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                              }`}>
                                {diseaseErrorType === 'quota' ? 'Free API Quota Limit' : diseaseErrorType === 'surge' ? 'Temporary High Demand' : diseaseErrorType === 'auth' ? 'Auth Key Required' : 'Network Alert'}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-rose-200/90 leading-relaxed">{diseaseError}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-rose-900/40 flex justify-end gap-2">
                        <button
                          onClick={handleScanDisease}
                          disabled={isAnalyzing || !previewImage}
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 transition text-xs shadow-md disabled:opacity-50"
                        >
                          <RotateCcw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                          <span>{isAnalyzing ? 'Retrying...' : 'Retry Scan with Same Image'}</span>
                        </button>
                      </div>
                    </div>
                  ) : diseaseRejection ? (
                    <div className="bg-amber-950/40 border border-amber-700/60 rounded-2xl p-5 text-xs space-y-3">
                      <div className="flex items-start gap-2.5 text-amber-300">
                        <HelpCircle className="w-5 h-5 shrink-0 text-amber-400 mt-0.5" />
                        <div>
                          <div className="font-bold text-white text-sm">Non-Plant or Unclear Photo Detected</div>
                          <p className="mt-1 text-amber-200/90 leading-relaxed">{diseaseRejection.reason}</p>
                        </div>
                      </div>
                      <div className="bg-black/30 border border-amber-800/40 rounded-xl p-3 text-amber-100/90 space-y-1">
                        <span className="font-bold text-amber-300 block">💡 Tips for an Accurate Leaf Scan:</span>
                        <p>{diseaseRejection.guidance}</p>
                        <ul className="list-disc pl-4 space-y-0.5 text-amber-200/70 text-[11px] mt-1">
                          <li>Hold the camera 15-20 cm away from the affected foliage.</li>
                          <li>Ensure bright, natural morning daylight (avoid heavy shadows).</li>
                          <li>Keep the yellowing, spot, or wilted area directly in focus.</li>
                        </ul>
                      </div>
                    </div>
                  ) : diseaseResult ? (
                    <div className="space-y-4 text-xs">
                      {/* Diagnostic Summary Header */}
                      <div className="bg-emerald-950/60 border border-emerald-700/50 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                            {diseaseResult.cropIdentified || cropLeafName || 'Agricultural Crop'}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                              ⚡ {diseaseResult.source || 'gemini-flash-latest (Free Model)'}
                            </span>
                            {diseaseResult.urgency && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                Urgency: {diseaseResult.urgency}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-white font-bold text-base mt-1 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                          {diseaseResult.title}
                        </div>
                        <p className="text-emerald-200/90 mt-1.5 leading-relaxed text-xs">{diseaseResult.summary}</p>
                      </div>

                      {/* Primary Causes */}
                      {diseaseResult.causes && diseaseResult.causes.length > 0 && (
                        <div className="bg-black/30 border border-emerald-800/30 rounded-xl p-3.5">
                          <span className="font-bold text-emerald-300 block mb-1">Fungal / Environmental Causes:</span>
                          <ul className="list-disc pl-4 space-y-1 text-emerald-100/80">
                            {diseaseResult.causes.map((c, i) => (
                              <li key={i}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Organic Treatments */}
                      {diseaseResult.organicTreatment && diseaseResult.organicTreatment.length > 0 && (
                        <div className="bg-emerald-950/40 border border-emerald-600/30 rounded-xl p-3.5">
                          <span className="font-bold text-emerald-300 block mb-1 flex items-center gap-1.5">
                            <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Organic & Bio-Pesticide Solutions:
                          </span>
                          <ul className="list-disc pl-4 space-y-1 text-emerald-100/90">
                            {diseaseResult.organicTreatment.map((ot, i) => (
                              <li key={i}>{ot}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Chemical Treatment & PHI */}
                      {diseaseResult.chemicalTreatment && diseaseResult.chemicalTreatment.length > 0 && (
                        <div className="bg-black/30 border border-emerald-800/30 rounded-xl p-3.5">
                          <span className="font-bold text-emerald-300 block mb-1 flex items-center gap-1.5">
                            <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Chemical Formulations & Safe Dosages:
                          </span>
                          <ul className="list-disc pl-4 space-y-1 text-emerald-100/80">
                            {diseaseResult.chemicalTreatment.map((ct, i) => (
                              <li key={i}>{ct}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* General Treatment fallback if arrays were combined */}
                      {(!diseaseResult.organicTreatment || diseaseResult.organicTreatment.length === 0) &&
                       (!diseaseResult.chemicalTreatment || diseaseResult.chemicalTreatment.length === 0) &&
                       diseaseResult.treatment && diseaseResult.treatment.length > 0 && (
                        <div className="bg-black/30 border border-emerald-800/30 rounded-xl p-3.5">
                          <span className="font-bold text-emerald-300 block mb-1">Recommended Treatments:</span>
                          <ul className="list-disc pl-4 space-y-1 text-emerald-100/80">
                            {diseaseResult.treatment.map((t, i) => (
                              <li key={i}>{t}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Preventive Hygiene Protocols */}
                      {diseaseResult.prevention && diseaseResult.prevention.length > 0 && (
                        <div className="bg-black/20 border border-emerald-900/40 rounded-xl p-3">
                          <span className="font-bold text-emerald-400 block mb-1">Field Hygiene & Prevention:</span>
                          <ul className="list-disc pl-4 space-y-0.5 text-emerald-200/70 text-[11px]">
                            {diseaseResult.prevention.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="bg-emerald-900/30 border border-emerald-700/40 rounded-xl p-3 flex justify-between items-center">
                        <span className="font-semibold text-emerald-200">Estimated Crop Recovery Chance:</span>
                        <span className="font-bold text-emerald-400 text-sm">{diseaseResult.recoveryRate}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-24 text-center text-emerald-400/60 text-xs space-y-2">
                      <div className="text-3xl">🌾</div>
                      <p>Upload or snap a photo of an affected leaf, stem, or fruit.</p>
                      <p className="text-[11px] text-emerald-500/70">Our Gemini multimodal vision model will inspect visible symptoms, diagnose probable pathogens, and generate dosage-controlled organic and chemical prescriptions.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Farm Diagnostic Diary */}
            {diseaseDiary.length > 0 && (
              <div className="bg-[#0a1e13] border border-emerald-900/40 rounded-3xl p-5 space-y-3">
                <h3 className="font-bold text-sm text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" /> My Farm Scan Diary ({diseaseDiary.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {diseaseDiary.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="bg-black/30 border border-emerald-900/40 rounded-xl p-3 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-emerald-400">{item.cropName}</span>
                        <span className="text-[10px] text-emerald-500/70 font-mono">
                          {new Date(item.scannedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="font-semibold text-white">{item.title}</div>
                      <p className="text-emerald-200/70 text-[11px] line-clamp-2">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Camera Viewfinder Modal */}
            {isCameraOpen && (
              <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6">
                {/* Modal Top Bar */}
                <div className="w-full max-w-lg flex items-center justify-between text-white pb-3 border-b border-emerald-900/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                      <Camera className="w-4 h-4 text-emerald-400" /> Live Field Camera
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={switchCamera}
                      className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 hover:text-white transition flex items-center gap-1 text-xs"
                      title="Switch between front and back camera"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="hidden sm:inline">Flip</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="p-2 rounded-xl bg-black/50 border border-rose-800/50 text-rose-300 hover:text-white transition"
                      title="Close Camera"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Video Viewfinder with Target Reticle Overlay */}
                <div className="relative w-full max-w-lg flex-1 max-h-[65vh] flex items-center justify-center my-auto rounded-3xl overflow-hidden border-2 border-emerald-500/40 bg-black shadow-2xl">
                  {cameraError ? (
                    <div className="p-6 text-center text-rose-300 space-y-3">
                      <AlertTriangle className="w-10 h-10 mx-auto text-rose-400" />
                      <p className="text-xs">{cameraError}</p>
                      <button
                        type="button"
                        onClick={() => {
                          stopCamera();
                          cameraInputRef.current?.click();
                        }}
                        className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
                      >
                        Use Device Camera App
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        playsInline
                        autoPlay
                        muted
                        className="w-full h-full object-cover"
                      />
                      {/* Leaf Guidance Reticle Box */}
                      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                        <div className="w-52 h-52 sm:w-64 sm:h-64 border-2 border-dashed border-emerald-400 rounded-3xl relative flex items-center justify-center shadow-lg shadow-emerald-500/20">
                          <span className="absolute -top-3 bg-black/80 px-3 py-0.5 rounded-full text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                            🌿 ALIGN INFECTED LEAF HERE
                          </span>
                          <div className="w-3.5 h-3.5 border-t-2 border-l-2 border-emerald-400 absolute top-0 left-0" />
                          <div className="w-3.5 h-3.5 border-t-2 border-r-2 border-emerald-400 absolute top-0 right-0" />
                          <div className="w-3.5 h-3.5 border-b-2 border-l-2 border-emerald-400 absolute bottom-0 left-0" />
                          <div className="w-3.5 h-3.5 border-b-2 border-r-2 border-emerald-400 absolute bottom-0 right-0" />
                        </div>
                        <p className="mt-4 text-[11px] font-medium text-emerald-200/90 bg-black/70 px-3 py-1 rounded-full backdrop-blur-sm border border-emerald-900/50">
                          Hold camera steady • Natural morning daylight recommended
                        </p>
                      </div>
                    </>
                  )}
                  {/* Hidden Canvas for High-Res Capture */}
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Bottom Camera Controls Bar */}
                <div className="w-full max-w-lg flex items-center justify-center gap-6 pt-4 border-t border-emerald-900/40">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="px-4 py-2.5 rounded-xl bg-black/40 text-emerald-300 text-xs font-semibold hover:text-white"
                  >
                    Cancel
                  </button>

                  {/* Circular Shutter Button */}
                  <button
                    type="button"
                    onClick={capturePhotoFromCamera}
                    disabled={!!cameraError}
                    className="w-20 h-20 rounded-full border-4 border-white bg-gradient-to-tr from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 active:scale-90 transition-all flex items-center justify-center shadow-2xl shadow-emerald-500/50 disabled:opacity-50"
                    title="Capture Leaf Photo"
                  >
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-slate-950 shadow-inner">
                      <Camera className="w-7 h-7" />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      cameraInputRef.current?.click();
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 text-xs hover:text-white"
                    title="Switch to device camera application"
                  >
                    Native App
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 5. DIRECT MARKETPLACE TAB ================= */}
        {activeTab === 'sell' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Store className="w-6 h-6 text-emerald-400" />
                  Direct Farmer Marketplace
                </h2>
                <p className="text-xs text-emerald-300/80">
                  List harvest lots directly to millers and bulk buyers with zero middlemen commission.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddListingModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <PlusCircle className="w-4 h-4" /> Add Produce Lot
                </button>
                <button
                  onClick={() => setActiveTab('mandi')}
                  className="px-3 py-2 bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 rounded-xl text-xs hover:text-white flex items-center gap-1 font-semibold"
                >
                  <TrendingUp className="w-3.5 h-3.5" /> Mandi Rates
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-3 py-2 bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs hover:text-white flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {t('backToHome')}
                </button>
              </div>
            </div>

            {/* Produce Listings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {produceListings.map(lot => {
                const totalVal = lot.quantity * lot.pricePerKg;
                return (
                  <div key={lot.id} className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl p-4 flex flex-col justify-between group">
                    <div>
                      <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                        <img src={lot.imageUrl} alt={lot.crop} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-emerald-300">
                          {lot.category}
                        </span>
                        <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {lot.status}
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-white">{lot.crop}</h3>
                      <div className="text-xs text-emerald-300/80 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-500" /> {lot.location}
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-emerald-200/90 font-mono">
                        <div>👤 Farmer: <b className="text-white font-sans">{lot.farmerName}</b></div>
                        <div>⚖️ Quantity: <b className="text-white">{lot.quantity.toLocaleString()} kg</b></div>
                        <div>💰 Price: <b className="text-emerald-400">₹{lot.pricePerKg} / kg</b></div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-emerald-900/40 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-emerald-400 uppercase font-semibold">Total Lot Value</div>
                        <div className="text-base font-bold font-mono text-white">₹{totalVal.toLocaleString()}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduceForInquiry(lot);
                            setInquiryForm({
                              ...inquiryForm,
                              quantityRequested: String(lot.quantity),
                              offeredPrice: String(lot.pricePerKg)
                            });
                          }}
                          className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg hover:bg-emerald-400 transition"
                        >
                          Make Offer
                        </button>
                        <button
                          onClick={() => handleDeleteListing(lot.id)}
                          className="p-1.5 bg-rose-950/40 text-rose-300 rounded-lg hover:text-white"
                          title="Delete Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Produce Listing Modal */}
            {showAddListingModal && (
              <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
                <div className="bg-[#0c2417] border border-emerald-700/60 rounded-3xl p-6 max-w-lg w-full space-y-4">
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-emerald-400" /> Add Harvest Produce Lot
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-emerald-300 font-semibold block mb-1">Farmer / Producer Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Patil"
                        value={newListingForm.farmerName}
                        onChange={e => setNewListingForm({ ...newListingForm, farmerName: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-emerald-300 font-semibold block mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        placeholder="10-digit Mobile"
                        value={newListingForm.phone}
                        onChange={e => setNewListingForm({ ...newListingForm, phone: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-emerald-300 font-semibold block mb-1">Crop Commodity</label>
                      <input
                        type="text"
                        placeholder="e.g. Sona Masuri Rice (Clean)"
                        value={newListingForm.crop}
                        onChange={e => setNewListingForm({ ...newListingForm, crop: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-emerald-300 font-semibold block mb-1">Category</label>
                      <select
                        value={newListingForm.category}
                        onChange={e => setNewListingForm({ ...newListingForm, category: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                      >
                        <option>Cereals</option>
                        <option>Pulses</option>
                        <option>Oilseeds</option>
                        <option>Cash Crops</option>
                        <option>Horticulture</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-emerald-300 font-semibold block mb-1">Quantity (kg)</label>
                      <input
                        type="number"
                        placeholder="e.g. 1500"
                        value={newListingForm.quantity}
                        onChange={e => setNewListingForm({ ...newListingForm, quantity: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-emerald-300 font-semibold block mb-1">Expected Price per kg (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g. 45"
                        value={newListingForm.pricePerKg}
                        onChange={e => setNewListingForm({ ...newListingForm, pricePerKg: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-emerald-300 font-semibold block mb-1">Location / District</label>
                      <input
                        type="text"
                        placeholder="e.g. Davangere, Karnataka"
                        value={newListingForm.location}
                        onChange={e => setNewListingForm({ ...newListingForm, location: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleAddProduceListing}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Publish to Marketplace
                    </button>
                    <button
                      onClick={() => setShowAddListingModal(false)}
                      className="px-4 py-2.5 bg-black/40 text-emerald-300 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Buyer Inquiry Modal */}
            {selectedProduceForInquiry && (
              <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
                <div className="bg-[#0c2417] border border-emerald-700/60 rounded-3xl p-6 max-w-md w-full space-y-4">
                  <h3 className="font-bold text-base text-white">
                    Submit Purchase Offer: {selectedProduceForInquiry.crop}
                  </h3>
                  <p className="text-xs text-emerald-300/80">
                    Farmer: <b>{selectedProduceForInquiry.farmerName}</b> ({selectedProduceForInquiry.location})
                  </p>

                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      placeholder="Buyer / Trader Name"
                      value={inquiryForm.buyerName}
                      onChange={e => setInquiryForm({ ...inquiryForm, buyerName: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Buyer Phone Number"
                      value={inquiryForm.buyerPhone}
                      onChange={e => setInquiryForm({ ...inquiryForm, buyerPhone: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Offered ₹/kg"
                        value={inquiryForm.offeredPrice}
                        onChange={e => setInquiryForm({ ...inquiryForm, offeredPrice: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                      />
                      <input
                        type="number"
                        placeholder="Qty Wanted (kg)"
                        value={inquiryForm.quantityRequested}
                        onChange={e => setInquiryForm({ ...inquiryForm, quantityRequested: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white"
                      />
                    </div>
                    <textarea
                      placeholder="Logistics or pickup notes..."
                      value={inquiryForm.message}
                      onChange={e => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white h-20"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSendInquiry}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Send Offer to Farmer
                    </button>
                    <button
                      onClick={() => setSelectedProduceForInquiry(null)}
                      className="px-4 py-2.5 bg-black/40 text-emerald-300 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 6. SMART PUMP IOT TAB ================= */}
        {activeTab === 'pump' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Activity className="w-6 h-6 text-cyan-400" />
                  Smart Pump Core & Telemetry
                </h2>
                <p className="text-xs text-emerald-300/80">
                  Real-time 220V motor telemetry, automatic dry-run trip, and surge protection.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs text-emerald-300 hover:text-white flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800/60 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {t('backToHome')}
              </button>
            </div>

            {/* Danger Popup */}
            {isSurgeDanger && (
              <div className="bg-rose-950/90 border border-rose-500 rounded-2xl p-4 flex items-center gap-3 text-rose-200 animate-pulse">
                <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">SURGE TRIGGER DETECTED: {voltage}V</h4>
                  <p className="text-xs">Automatic surge suppressor engaged. Motor load buffered.</p>
                </div>
              </div>
            )}

            {/* Core Display Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Telemetry Logs */}
              <div className="bg-[#0a1e13] border border-emerald-900/40 rounded-3xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                  [SYSTEM TELEMETRY LOGS]
                </h3>
                <div className="space-y-2 font-mono text-xs">
                  <div className="bg-black/30 p-2.5 rounded-lg text-emerald-300 border-l-2 border-emerald-500">
                    [AI] 3-Phase line voltage balanced at {voltage}V
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-lg text-emerald-300 border-l-2 border-emerald-500">
                    [AI] Leakage current: 0.02 mA (Safe threshold)
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-lg text-emerald-300 border-l-2 border-emerald-500">
                    [AI] Ultrasonic water flow: 420 L/min active
                  </div>
                  <div className="bg-black/30 p-2.5 rounded-lg text-cyan-300 border-l-2 border-cyan-500">
                    [STATUS] Winding core temperature: 38°C
                  </div>
                  {pumpTrips > 0 && (
                    <div className="bg-rose-950/40 p-2.5 rounded-lg text-rose-300 border-l-2 border-rose-500">
                      [ALERT] Auto-trip triggered {pumpTrips} times (Protected)
                    </div>
                  )}
                </div>
              </div>

              {/* Big Core Ring */}
              <div className="bg-[#050f16] border border-cyan-900/40 rounded-3xl p-6 flex flex-col items-center justify-center text-center">
                <div
                  className={`w-44 h-44 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 ${
                    isSurgeDanger
                      ? 'border-rose-500 bg-rose-950/30 shadow-2xl shadow-rose-500/50'
                      : 'border-cyan-500/40 bg-cyan-950/20 shadow-2xl shadow-cyan-500/20'
                  }`}
                >
                  <span className={`text-4xl font-extrabold font-mono ${isSurgeDanger ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {pumpRunning ? `${voltage}V` : '0V'}
                  </span>
                  <span className="text-[10px] tracking-widest text-cyan-300/80 uppercase font-mono mt-1">
                    {pumpRunning ? 'PUMP RUNNING' : 'PUMP STOPPED'}
                  </span>
                </div>

                <button
                  onClick={() => setPumpRunning(!pumpRunning)}
                  className={`mt-6 px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition ${
                    pumpRunning
                      ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  }`}
                >
                  {pumpRunning ? 'Power Cutoff' : 'Start Pump Motor'}
                </button>
              </div>

              {/* Sensor Metrics & Graph */}
              <div className="bg-[#0a1e13] border border-emerald-900/40 rounded-3xl p-5 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono mb-3">
                    [LIVE VOLTAGE TRACE]
                  </h3>
                  {/* SVG Chart */}
                  <div className="h-28 w-full bg-black/40 rounded-xl p-2 flex items-end gap-2 border border-cyan-900/30">
                    {voltageHistory.map((v, i) => {
                      const h = Math.min(100, Math.max(20, (v - 200) * 3));
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            style={{ height: `${h}%` }}
                            className={`w-full rounded-t transition-all duration-300 ${
                              v > 228 ? 'bg-rose-500' : 'bg-cyan-400'
                            }`}
                          />
                          <span className="text-[9px] font-mono text-cyan-300/70">{v}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-900/30">
                    <div className="text-[10px] text-cyan-400">Motor Health</div>
                    <div className="font-bold text-white text-base">98%</div>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-900/30">
                    <div className="text-[10px] text-cyan-400">Risk Factor</div>
                    <div className="font-bold text-white text-base">4% Safe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. GOVT SCHEMES TAB ================= */}
        {activeTab === 'schemes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Landmark className="w-6 h-6 text-emerald-400" />
                  Government Farming Subsidies & Benefits
                </h2>
                <p className="text-xs text-emerald-300/80">Apply for DBT income transfers, insurance, and solar pump grants.</p>
              </div>

              <div className="flex gap-2 text-xs font-semibold">
                <button
                  onClick={() => setSchemesTab('catalog')}
                  className={`px-3 py-1.5 rounded-xl border ${
                    schemesTab === 'catalog' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300'
                  }`}
                >
                  All Schemes (6)
                </button>
                <button
                  onClick={() => setSchemesTab('myApps')}
                  className={`px-3 py-1.5 rounded-xl border ${
                    schemesTab === 'myApps' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-emerald-300'
                  }`}
                >
                  My Applications ({applications.length})
                </button>
              </div>
            </div>

            {schemesTab === 'catalog' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: 'PM-KISAN Samman Nidhi',
                    benefit: '₹6,000 / year in 3 direct bank installments',
                    desc: 'Direct income support for landholding farming families via Aadhaar DBT.',
                    tag: 'Income Support'
                  },
                  {
                    title: 'PM Fasal Bima Yojana (PMFBY)',
                    benefit: 'Comprehensive crop insurance against droughts and floods',
                    desc: 'Nominal 1.5% premium rate for Rabi and 2% for Kharif crops.',
                    tag: 'Risk Insurance'
                  },
                  {
                    title: 'PM KUSUM Solar Pump Subsidy',
                    benefit: 'Up to 60% grant on 3HP to 7.5HP solar pumps',
                    desc: 'Free daytime irrigation without diesel or electric power bills.',
                    tag: 'Solar Energy'
                  },
                  {
                    title: 'SMAM Tractor & Implements Grant',
                    benefit: '40% to 50% subsidy on tractors and tillers',
                    desc: 'Mechanization support for small and marginal landholders.',
                    tag: 'Machinery'
                  },
                  {
                    title: 'Paramparagat Krishi Vikas (PKVY)',
                    benefit: '₹50,000 / ha financial assistance for organic certification',
                    desc: 'Zero budget natural farming cluster promotion with free PGS tags.',
                    tag: 'Organic Grant'
                  },
                  {
                    title: 'PM Krishi Sinchayee Yojana (PMKSY)',
                    benefit: 'Up to 55% subsidy for drip and micro-sprinklers',
                    desc: 'Per Drop More Crop water-saving precision equipment.',
                    tag: 'Irrigation'
                  }
                ].map((s, i) => (
                  <div key={i} className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-950 border border-emerald-700/50 text-emerald-300 px-2.5 py-0.5 rounded-full">
                        {s.tag}
                      </span>
                      <h4 className="font-bold text-white text-base mt-2">{s.title}</h4>
                      <p className="text-xs text-emerald-300 font-semibold mt-1">✅ {s.benefit}</p>
                      <p className="text-xs text-emerald-200/70 mt-2 leading-relaxed">{s.desc}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSchemeToApply(s.title);
                        setShowSchemeModal(true);
                      }}
                      className="mt-4 w-full py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {applications.length === 0 ? (
                  <div className="text-center py-16 text-emerald-400/60 text-xs">
                    📭 No applications submitted yet. Apply from the All Schemes tab.
                  </div>
                ) : (
                  applications.map(app => (
                    <div key={app.id} className="bg-[#0b2416] border border-emerald-900/40 rounded-xl p-4 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-white text-sm">{app.scheme}</h4>
                        <div className="text-emerald-300 mt-1">
                          Ref: <b className="font-mono">{app.id}</b> • Date: {app.date}
                        </div>
                        <div className="text-emerald-200/80">Farmer: {app.farmer} ({app.village})</div>
                        <div className="text-emerald-400 font-semibold mt-1">⏳ Status: {app.status}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteApplication(app.id)}
                        className="text-rose-400 p-2 hover:text-rose-300"
                        title="Cancel Application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Scheme Modal */}
            {showSchemeModal && (
              <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
                <div className="bg-[#0d2a1b] border border-emerald-700/60 rounded-3xl p-6 max-w-md w-full space-y-4">
                  <h3 className="font-bold text-base text-white">Apply for {selectedSchemeToApply}</h3>
                  <div className="space-y-2 text-xs">
                    <input
                      type="text"
                      placeholder="Farmer Full Name (as on Aadhaar)"
                      value={schemeForm.farmer}
                      onChange={e => setSchemeForm({ ...schemeForm, farmer: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/30 border border-emerald-800 text-white"
                    />
                    <input
                      type="text"
                      placeholder="12-digit Aadhaar Number"
                      value={schemeForm.aadhaar}
                      onChange={e => setSchemeForm({ ...schemeForm, aadhaar: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/30 border border-emerald-800 text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Registered Mobile Number"
                      value={schemeForm.mobile}
                      onChange={e => setSchemeForm({ ...schemeForm, mobile: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/30 border border-emerald-800 text-white"
                    />
                    <input
                      type="text"
                      placeholder="Village / Gram Panchayat"
                      value={schemeForm.village}
                      onChange={e => setSchemeForm({ ...schemeForm, village: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-black/30 border border-emerald-800 text-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmitApplication}
                      className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold rounded-xl text-xs"
                    >
                      Submit Application
                    </button>
                    <button
                      onClick={() => setShowSchemeModal(false)}
                      className="px-4 py-2.5 bg-black/40 text-emerald-300 rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 8. CROP RECOMMENDATION TAB ================= */}
        {activeTab === 'crop' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Leaf className="w-6 h-6 text-emerald-400" />
                  Agro-Climatic Crop Recommendation
                </h2>
                <p className="text-xs text-emerald-300/80">
                  Scientific agro-climatic matching based on soil chemistry, state climate, season, and temperature.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('guides')}
                  className="px-3.5 py-2 bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs hover:text-white flex items-center gap-1.5 font-semibold"
                >
                  <BookOpen className="w-3.5 h-3.5" /> Production Guides
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-3.5 py-2 bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs hover:text-white flex items-center gap-1.5 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {t('backToHome')}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0a1f13] border border-emerald-900/40 p-5 rounded-2xl">
              <div>
                <label className="text-xs font-semibold text-emerald-300 block mb-1">State / Region</label>
                <select
                  value={recState}
                  onChange={e => setRecState(e.target.value)}
                  className="w-full bg-black/40 border border-emerald-700/50 text-white text-xs p-2.5 rounded-xl outline-none"
                >
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                  <option>Punjab</option>
                  <option>Telangana</option>
                  <option>Madhya Pradesh</option>
                  <option>Uttar Pradesh</option>
                  <option>Tamil Nadu</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-300 block mb-1">Soil Type</label>
                <select
                  value={recSoil}
                  onChange={e => setRecSoil(e.target.value)}
                  className="w-full bg-black/40 border border-emerald-700/50 text-white text-xs p-2.5 rounded-xl outline-none"
                >
                  <option>Black Soil (Regur)</option>
                  <option>Red & Laterite Soil</option>
                  <option>Alluvial Loamy Soil</option>
                  <option>Sandy Loam</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-300 block mb-1">Cultivation Season</label>
                <select
                  value={recSeason}
                  onChange={e => setRecSeason(e.target.value)}
                  className="w-full bg-black/40 border border-emerald-700/50 text-white text-xs p-2.5 rounded-xl outline-none"
                >
                  <option>Monsoon (Kharif)</option>
                  <option>Winter (Rabi)</option>
                  <option>Summer (Zaid)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-emerald-300 block mb-1">
                  Ambient Temperature: {recTemp}°C
                </label>
                <input
                  type="range"
                  min="10"
                  max="45"
                  value={recTemp}
                  onChange={e => setRecTemp(Number(e.target.value))}
                  className="w-full accent-emerald-500 mt-2"
                />
              </div>
            </div>

            {/* Dynamic Recommendations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {computedCropMatches.map((c, i) => (
                <div key={i} className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                      {i === 0 ? '🥇 Primary Match' : i === 1 ? '🥈 Secondary Match' : '🥉 Alternative Option'}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">{c.name}</h3>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-emerald-200 mb-1">
                        <span>Match Confidence:</span>
                        <span className="font-bold">{c.conf}%</span>
                      </div>
                      <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                        <div style={{ width: `${c.conf}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-green-400" />
                      </div>
                    </div>
                    <div className="mt-4 space-y-1.5 text-xs text-emerald-200/80">
                      <div>💧 <b>Water Need:</b> {c.water}</div>
                      <div>⏳ <b>Duration:</b> {c.duration}</div>
                      <p className="text-[11px] text-emerald-400/80 mt-2 italic">{c.tip}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Agronomist Analysis Banner */}
            <div className="bg-[#0b2416]/80 border-l-4 border-emerald-500 rounded-2xl p-4 text-xs text-emerald-200/90 leading-relaxed">
              🧠 <b>Agronomist Analysis:</b> For <b>{recState}</b> with <b>{recSoil}</b> during <b>{recSeason}</b> at <b>{recTemp}°C</b>, <b>{computedCropMatches[0]?.name.split(' ')[0]}</b> demonstrates peak agro-climatic thermal efficiency. Ensure seed treatment with Trichoderma or bio-fungicides prior to sowing.
            </div>

            {/* Heatwave Advisory */}
            {recTemp > 38 && (
              <div className="bg-rose-950/60 border-l-4 border-rose-500 rounded-2xl p-4 text-xs text-rose-200 leading-relaxed flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <b>High Thermal Stress Warning ({recTemp}°C):</b> Ambient temperature exceeds 38°C. Adopt organic straw mulching, prioritize night irrigation cycles, and favor heat-tolerant cultivars like Bajra or Ragi to prevent evapotranspirative moisture stress.
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 9. VOICE ASSISTANT TAB ================= */}
        {activeTab === 'voice' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Mic className="w-6 h-6 text-emerald-400" />
                  KrishiMitra Voice & Chat Assistant
                </h2>
                <p className="text-xs text-emerald-300/80">
                  Multilingual AI with SpeechRecognition & SpeechSynthesis for hands-free field Q&A.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs text-emerald-300 hover:text-white flex items-center gap-1.5 bg-emerald-950/80 px-3 py-1.5 rounded-xl border border-emerald-800/60 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> {t('backToHome')}
              </button>
            </div>

            {/* Quick Chips */}
            <div className="flex gap-2 overflow-x-auto py-1 no-scrollbar text-xs">
              {[
                t('voicePrompt1'),
                t('voicePrompt2'),
                t('voicePrompt3'),
                t('voicePrompt4'),
                t('voicePrompt5')
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 hover:border-emerald-400 text-emerald-300 hover:text-white whitespace-nowrap transition"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Box */}
            <div className="bg-[#0a1e13] border border-emerald-900/40 rounded-3xl p-4 lg:p-6 h-[460px] flex flex-col justify-between">
              <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs lg:text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-medium rounded-br-none'
                          : 'bg-emerald-950/80 border border-emerald-800/40 text-emerald-100 rounded-bl-none'
                      }`}
                    >
                      {msg.role === 'ai' && (
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <Sprout className="w-3 h-3" /> KrishiMitra AI
                        </div>
                      )}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br/>')
                        }}
                      />
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex justify-start">
                    <div className="bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 rounded-2xl rounded-bl-none px-4 py-2 text-xs flex items-center gap-2">
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" /> {t('thinking')}
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Input Area */}
              <div className="pt-3 border-t border-emerald-900/30 flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={t('askPlaceholder')}
                  value={inputPrompt}
                  onChange={e => setInputPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 px-4 py-3 rounded-2xl bg-black/40 border border-emerald-800/50 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400 text-xs lg:text-sm"
                />
                <button
                  onClick={toggleSpeechRecognition}
                  className={`p-3 rounded-2xl border transition ${
                    isListening
                      ? 'bg-rose-500 border-rose-400 text-white animate-pulse'
                      : 'bg-emerald-900/60 border-emerald-700/50 text-emerald-300 hover:text-white'
                  }`}
                  title="Voice input"
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => handleSendMessage()}
                  className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-2xl transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= 10. GUIDES & ORGANIC TAB ================= */}
        {activeTab === 'guides' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-emerald-400" />
                  Crop Production & Organic Farming Manuals
                </h2>
                <p className="text-xs text-emerald-300/80">
                  Field manuals for Rice, Wheat, Sugarcane, Maize, Cotton and natural bio-input recipes.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('crop')}
                  className="text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-800/50 px-3 py-1.5 rounded-xl hover:text-white flex items-center gap-1 font-semibold"
                >
                  <Sprout className="w-3.5 h-3.5" /> Crop Matcher
                </button>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-800/50 px-3 py-1.5 rounded-xl hover:text-white flex items-center gap-1 font-semibold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> {t('backToHome')}
                </button>
              </div>
            </div>

            {/* Organic Formulations Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <Leaf className="w-4 h-4" /> Proven Natural Bio-Input Formulations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl p-5 text-xs space-y-2">
                  <h4 className="font-bold text-sm text-emerald-400">1. Jeevamrutha Microbial Starter</h4>
                  <p className="text-emerald-200/80 leading-relaxed">
                    <b>Ingredients:</b> 10 kg desi cow dung, 5-10 L cow urine, 2 kg jaggery, 2 kg gram flour (besan), 1 handful virgin forest soil in 200L water drum.<br />
                    <b>Application:</b> Ferment for 4-7 days in shade, stirring twice daily. Apply 200L/acre via irrigation channel.
                  </p>
                </div>
                <div className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl p-5 text-xs space-y-2">
                  <h4 className="font-bold text-sm text-emerald-400">2. Neemastram Bio-Insecticide</h4>
                  <p className="text-emerald-200/80 leading-relaxed">
                    <b>Ingredients:</b> 5 kg crushed neem leaves with twigs, 5 L desi cow urine, 2 kg cow dung in 100 L water.<br />
                    <b>Application:</b> Steep for 48 hours. Filter and spray 1:10 dilution to control sucking pests like whiteflies and aphids.
                  </p>
                </div>
              </div>
            </div>

            {/* High-Yield Cultivation Protocols */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                <Sprout className="w-4 h-4" /> High-Yield Scientific Cultivation Protocols
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Rice (Paddy)',
                    yield: '55-65 Q/ha',
                    spacing: '20x15 cm',
                    npk: '120:60:40 kg/ha',
                    tip: 'Maintain 3-5 cm shallow standing water during tillering to panicle initiation.'
                  },
                  {
                    name: 'Wheat',
                    yield: '50-60 Q/ha',
                    spacing: '20-22 cm rows',
                    npk: '120:60:40 kg/ha',
                    tip: 'Critical irrigation at CRI (21 days) and tillering prevents 30% yield loss.'
                  },
                  {
                    name: 'Sugarcane',
                    yield: '90-110 Tons/ha',
                    spacing: '90-120 cm trench',
                    npk: '250:115:115 kg/ha',
                    tip: 'Trash mulching in ratoon crop saves 30% water and accelerates soil humus.'
                  }
                ].map((c, i) => (
                  <div key={i} className="bg-[#0a1e13] border border-emerald-900/40 rounded-2xl p-4 text-xs space-y-2">
                    <h4 className="font-bold text-sm text-white">{c.name}</h4>
                    <div className="text-emerald-300 font-semibold">Expected Yield: {c.yield}</div>
                    <div className="text-emerald-200/80">Spacing: {c.spacing}</div>
                    <div className="text-emerald-200/80">NPK: {c.npk}</div>
                    <p className="text-emerald-400/80 italic mt-1">{c.tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= FERTILIZER CALCULATOR TAB ================= */}
        {activeTab === 'fertilizer' && (
          <FertilizerCalculator />
        )}

        {/* ================= KISAN KHATA TAB ================= */}
        {activeTab === 'khata' && (
          <KisanKhata currentMandiPrice={mandiItems[0]?.modalPrice || 3850} />
        )}

        {/* ================= MACHINERY RENTAL HUB TAB ================= */}
        {activeTab === 'machinery' && (
          <MachineryRental />
        )}

        {/* ================= PMFBY & COLD STORAGE TAB ================= */}
        {activeTab === 'insurance' && (
          <CropInsuranceColdStorage currentTemp={weatherData?.current?.temp ?? 29} />
        )}

        {/* ================= BUY FARM INPUTS STORE TAB ================= */}
        {activeTab === 'buy' && (
          <BuyFarmInputs
            cart={cart}
            onAddToCart={addToCart}
            onUpdateQty={updateCartQty}
            onClearCart={() => setCart([])}
            onNavigateHome={() => setActiveTab('dashboard')}
            currentUser={currentUser}
          />
        )}

        {/* ================= 11. ALL 14 MODULES INTEGRATED DIRECTORY ================= */}
        {activeTab === 'standalone' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Layers className="w-6 h-6 text-emerald-400" />
                  All 14 Integrated KrishiMitra Modules
                </h2>
                <p className="text-xs text-emerald-300/80">
                  Every agricultural tool, pathology diagnostic, mandi ledger, and subsidy tracker operates seamlessly within this single dashboard.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Home className="w-4 h-4" /> {t('backToHome')}
              </button>
            </div>

            {/* Master Home Hub Summary Card */}
            <div className="bg-gradient-to-br from-[#0c371d] via-[#082413] to-[#04120a] border-2 border-emerald-400 shadow-xl rounded-3xl p-6 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2.5 bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-teal-500/20 border border-emerald-400/80 rounded-2xl p-3 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl p-2 rounded-xl bg-emerald-500/30 border border-emerald-400/50 shadow-inner">
                    🏠
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-white tracking-wide uppercase">
                        Master Home Page & Unified Command Hub
                      </span>
                      <span className="font-mono text-[10px] text-amber-300 bg-black/60 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
                        Single Entry Point
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-300/90 font-medium">
                      Seamless single-click access to every single tool, calculator, and ledger without opening new tabs.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1"
                >
                  <Home className="w-3.5 h-3.5" /> Return to Dashboard
                </button>
              </div>

              {/* Quick Tab Jump Grid */}
              <div className="mt-4 pt-3 border-t border-emerald-900/40">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Direct 1-Tap Access to Every Feature:</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
                  {[
                    { title: 'Dashboard', icon: '🌾', tab: 'dashboard' as TabType },
                    { title: 'Disease Scan', icon: '🔬', tab: 'disease' as TabType },
                    { title: 'Mandi Rates', icon: '📈', tab: 'mandi' as TabType },
                    { title: 'Live Weather', icon: '☁️', tab: 'weather' as TabType },
                    { title: 'NPK Planner', icon: '🧪', tab: 'fertilizer' as TabType },
                    { title: 'Kisan Khata', icon: '📒', tab: 'khata' as TabType },
                    { title: 'Machinery', icon: '🚜', tab: 'machinery' as TabType },
                    { title: 'Crop Loss PMFBY', icon: '🛡️', tab: 'insurance' as TabType },
                    { title: 'Smart Pump', icon: '⚡', tab: 'pump' as TabType },
                    { title: 'Sell Harvest', icon: '🛒', tab: 'sell' as TabType },
                    { title: 'Buy Inputs', icon: '🛍️', tab: 'buy' as TabType },
                    { title: 'Govt Schemes', icon: '🏛️', tab: 'schemes' as TabType },
                    { title: 'Crop Match', icon: '🌱', tab: 'crop' as TabType },
                    { title: 'Voice AI', icon: '🎙️', tab: 'voice' as TabType }
                  ].map((btn, bidx) => (
                    <button
                      key={bidx}
                      onClick={() => setActiveTab(btn.tab)}
                      className="p-2.5 bg-black/40 hover:bg-emerald-500/20 border border-emerald-800/60 hover:border-emerald-400 rounded-xl text-left transition flex flex-col justify-between group"
                    >
                      <div className="text-lg mb-1">{btn.icon}</div>
                      <div className="font-bold text-white group-hover:text-emerald-300 text-[11px] line-clamp-1">{btn.title}</div>
                      <div className="text-[9px] text-emerald-400/70">Open in App</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 14 Modules Comprehensive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allFeatureModules.map((module, idx) => (
                <div
                  key={idx}
                  className="bg-[#0b2416] border border-emerald-900/40 hover:border-emerald-600/60 rounded-2xl p-5 flex flex-col justify-between transition group shadow-sm hover:shadow-emerald-900/20"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-3xl">{module.icon}</span>
                      <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-700/50">
                        {module.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-white group-hover:text-emerald-300 transition">
                      {module.name}
                    </h3>
                    <p className="text-xs text-emerald-200/75 mt-1 leading-relaxed">
                      {module.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-emerald-900/30">
                    <button
                      onClick={() => setActiveTab(module.tabTarget)}
                      className="w-full py-2.5 text-center text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 rounded-xl transition shadow flex items-center justify-center gap-1.5"
                    >
                      <span>Launch Module</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Floating KRISH AI Quick Launcher */}
      <div
        onClick={() => setActiveTab('voice')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-green-400 text-slate-950 flex items-center justify-center text-2xl shadow-xl shadow-emerald-500/30 cursor-pointer float-bob z-40"
        title="Chat with KRISH AI"
      >
        🤖
      </div>

      {/* ================= FARMER AUTHENTICATION MODAL ================= */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b2416] border border-emerald-600/50 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl relative animate-in fade-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => {
                setAuthModalOpen(false);
                setAuthError(null);
              }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/40 text-emerald-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Title & Toggle */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🌾</span>
                <h3 className="font-bold text-lg text-white">
                  {authMode === 'login' ? 'Farmer Sign In' : 'Register New Farmer Account'}
                </h3>
              </div>
              <p className="text-xs text-emerald-300/80">
                {authMode === 'login'
                  ? 'Access your saved farm records, precision fertilizer plans, and scan history.'
                  : 'Join KrishiMitra to manage your farm inputs, listings, and crop insurance.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-xl border border-emerald-900/50 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                }}
                className={`py-2 rounded-lg transition ${
                  authMode === 'login'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError(null);
                }}
                className={`py-2 rounded-lg transition ${
                  authMode === 'register'
                    ? 'bg-emerald-500 text-slate-950 shadow'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Register New
              </button>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="bg-rose-950/50 border border-rose-700/60 rounded-xl p-3 text-xs text-rose-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Secure Farmer Account Notice */}
            <div className="bg-emerald-950/60 border border-emerald-700/40 rounded-xl p-2.5 text-xs flex items-center gap-2">
              <span className="text-emerald-400 text-sm">🔒</span>
              <div className="text-[11px] text-emerald-300/90 leading-tight">
                <strong>Data Isolation Active:</strong> Your Kisan Khata ledgers, diagnostic scans, and produce listings are strictly isolated to your registered farmer profile.
              </div>
            </div>

            {/* Auth Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
              {authMode === 'register' && (
                <div>
                  <label className="block text-emerald-300 font-semibold mb-1">Farmer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar Patel"
                    value={authForm.fullName}
                    onChange={e => setAuthForm({ ...authForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-emerald-800 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                  />
                </div>
              )}

              <div>
                <label className="block text-emerald-300 font-semibold mb-1">Mobile Number (10 Digits) *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9845112233"
                  value={authForm.phone}
                  onChange={e => setAuthForm({ ...authForm, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-emerald-800 text-white font-mono placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="block text-emerald-300 font-semibold mb-1">Password (Min 6 Characters) *</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authForm.password}
                  onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-emerald-800 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                />
              </div>

              {authMode === 'register' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-emerald-300 font-semibold mb-1">Village / GP</label>
                      <input
                        type="text"
                        placeholder="e.g. Hadadi"
                        value={authForm.village}
                        onChange={e => setAuthForm({ ...authForm, village: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-emerald-800 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-emerald-300 font-semibold mb-1">District</label>
                      <input
                        type="text"
                        placeholder="e.g. Davangere"
                        value={authForm.district}
                        onChange={e => setAuthForm({ ...authForm, district: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-emerald-800 text-white placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-emerald-300 font-semibold mb-1">State</label>
                      <select
                        value={authForm.state}
                        onChange={e => setAuthForm({ ...authForm, state: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-emerald-800 text-white focus:outline-none focus:border-emerald-400"
                      >
                        <option value="Karnataka">Karnataka</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-emerald-300 font-semibold mb-1">Land (Acres)</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="3.0"
                        value={authForm.landholdingAcres}
                        onChange={e => setAuthForm({ ...authForm, landholdingAcres: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-black/40 border border-emerald-800 text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-xl transition text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50 mt-4"
              >
                {authLoading ? (
                  <>
                    <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>{authMode === 'login' ? 'Sign In to KrishiMitra' : 'Complete Registration'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
