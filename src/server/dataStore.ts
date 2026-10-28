import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  passwordHash: string;
  salt: string;
  village: string;
  district: string;
  state: string;
  landholdingAcres: number;
  primaryCrops: string[];
  preferredLang: 'en-IN' | 'kn-IN' | 'hi-IN' | 'mr-IN' | 'te-IN';
  createdAt: string;
}

export type SafeUser = Omit<UserProfile, 'passwordHash' | 'salt'>;

export interface AuthSession {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const computed = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
  } catch {
    return false;
  }
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function maskAadhaar(aadhaar: string): string {
  if (!aadhaar) return 'XXXX-XXXX-0000';
  const clean = aadhaar.replace(/\D/g, '');
  if (clean.length >= 4) {
    return `XXXX-XXXX-${clean.slice(-4)}`;
  }
  return 'XXXX-XXXX-0000';
}

export interface ProduceListing {
  id: string;
  userId?: string;
  farmerName: string;
  phone: string;
  crop: string;
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Cash Crops' | 'Horticulture';
  quantity: number; // in kg
  pricePerKg: number; // in INR
  location: string;
  state: string;
  imageUrl: string;
  harvestDate: string;
  status: 'Available' | 'Sold';
  createdAt: string;
}

export interface BuyerInquiry {
  id: string;
  userId?: string;
  produceId: string;
  cropName: string;
  buyerName: string;
  buyerPhone: string;
  offeredPrice: number;
  quantityRequested: number;
  message: string;
  createdAt: string;
  status: 'Pending' | 'Accepted' | 'Declined';
}

export interface DiseaseScanLog {
  id: string;
  userId?: string;
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

export interface SchemeApplication {
  id: string;
  userId?: string;
  scheme: string;
  farmer: string;
  aadhaar: string;
  mobile: string;
  village: string;
  date: string;
  status: string;
  createdAt: string;
}

export interface MandiItem {
  id: string;
  name: string;
  hindiName: string;
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Cash Crops' | 'Horticulture';
  modalPrice: number; // ₹ per quintal (100 kg)
  minPrice: number;
  maxPrice: number;
  change: number; // daily change in ₹
  changePercent: number;
  arrivalQtyQuintals: number;
  mandiHub: string;
  state: string;
  imageUrl: string;
  grade: string;
}

// ---------------- NEW REAL PROBLEM-SOLVING SCHEMAS ----------------

// 1. Kisan Khata - Farm Expense & Cultivation Ledger
export interface KhataEntry {
  id: string;
  userId?: string;
  cropName: string;
  season: string;
  category: 'Land Preparation & Tractor' | 'Seeds & Nursery' | 'Fertilizer & Nutrition' | 'Pesticides & Spraying' | 'Labor & Weeding' | 'Irrigation & Electricity' | 'Harvesting & Threshing' | 'Transport & Mandi Cess';
  description: string;
  amount: number;
  date: string;
  paymentMode: 'Cash' | 'UPI' | 'Kisan Credit Card (KCC)' | 'Dealer Credit';
}

// 2. Custom Hiring Center (CHC) Equipment Sharing
export interface MachineryListing {
  id: string;
  name: string;
  category: 'Tractor' | 'Rotavator' | 'Harvester' | 'Drone Sprayer' | 'Laser Leveler' | 'Seed Drill' | 'Baler';
  hpOrCapacity: string;
  ownerName: string;
  phone: string;
  location: string;
  state: string;
  rateType: 'hourly' | 'per_acre';
  rateAmount: number; // in ₹
  operatorIncluded: boolean;
  fuelIncluded: boolean;
  imageUrl: string;
  available: boolean;
}

export interface MachineryBooking {
  id: string;
  userId?: string;
  machineryId: string;
  machineryName: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  bookingDate: string;
  unitsRequired: number; // hours or acres
  totalEstimatedCost: number;
  status: 'Confirmed' | 'Pending Owner Call' | 'Completed';
  createdAt: string;
}

// 3. Saved Precision Fertilizer Schedules
export interface FertilizerPlan {
  id: string;
  userId?: string;
  cropName: string;
  acreage: number;
  unit: string;
  targetYieldQtl: number;
  soilHealthLevel: 'Low' | 'Medium' | 'High';
  pureNkg: number;
  purePkg: number;
  pureKkg: number;
  ureaBags: number;
  dapBags: number;
  mopBags: number;
  zincSulfateKg: number;
  estimatedCost: number;
  createdAt: string;
}

// 4. PMFBY 72-Hour Rapid Crop Loss Intimations
export interface InsuranceClaim {
  id: string;
  userId?: string;
  claimRef: string;
  farmerName: string;
  mobile: string;
  aadhaar: string;
  policyOrKCC: string;
  crop: string;
  affectedAcres: number;
  totalAcres: number;
  disasterType: 'Inundation / Flooding' | 'Hailstorm' | 'Unseasonal Heavy Rain' | 'Post-Harvest Rain Damage' | 'Severe Drought / Moisture Deficit' | 'Pest Outbreak';
  incidentDate: string;
  estimatedLossPercent: number;
  village: string;
  district: string;
  status: 'Intimation Submitted (72h Compliant)' | 'Surveyor Assigned' | 'Compensation Processing';
  createdAt: string;
}

// 5. Perishable Cold Storage & Warehouse
export interface ColdStorage {
  id: string;
  name: string;
  district: string;
  state: string;
  capacityMT: number;
  availableCapacityMT: number;
  temperatureRange: string;
  suitableCrops: string[];
  monthlyRatePerQuintal: number;
  enwrRegistered: boolean;
  phone: string;
  distanceKm: number;
}

interface DataStoreSchema {
  users: UserProfile[];
  sessions: Record<string, AuthSession>;
  produce: ProduceListing[];
  inquiries: BuyerInquiry[];
  scans: DiseaseScanLog[];
  applications: SchemeApplication[];
  pumpTelemetry: {
    isRunning: boolean;
    surgeTripCount: number;
    lastTripAt: string | null;
  };
  khata: KhataEntry[];
  machinery: MachineryListing[];
  machineryBookings: MachineryBooking[];
  fertilizerPlans: FertilizerPlan[];
  insuranceClaims: InsuranceClaim[];
  coldStorages: ColdStorage[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'krishimitra-store.json');

// Initial seed commodities with verified authentic photography
export const SEED_MANDI_ITEMS: MandiItem[] = [
  {
    id: 'm-1',
    name: 'Sona Masuri Rice (Paddy)',
    hindiName: 'सोना मसूरी धान',
    category: 'Cereals',
    modalPrice: 3850,
    minPrice: 3600,
    maxPrice: 4100,
    change: 60,
    changePercent: 1.58,
    arrivalQtyQuintals: 1240,
    mandiHub: 'Davangere APMC',
    state: 'Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    grade: 'FAQ Grade-A'
  },
  {
    id: 'm-2',
    name: 'Sharbati Milling Wheat',
    hindiName: 'शरबती गेहूं',
    category: 'Cereals',
    modalPrice: 2680,
    minPrice: 2520,
    maxPrice: 2840,
    change: -25,
    changePercent: -0.92,
    arrivalQtyQuintals: 2150,
    mandiHub: 'Karnal Grain Market',
    state: 'Haryana',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    grade: 'Premium Milling'
  },
  {
    id: 'm-3',
    name: 'Hybrid Yellow Maize',
    hindiName: 'संकर पीला मक्का',
    category: 'Cereals',
    modalPrice: 2240,
    minPrice: 2100,
    maxPrice: 2360,
    change: 45,
    changePercent: 2.05,
    arrivalQtyQuintals: 1890,
    mandiHub: 'Davangere APMC',
    state: 'Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    grade: 'Industrial Starch Grade'
  },
  {
    id: 'm-4',
    name: 'Bt Cotton (Medium Staple)',
    hindiName: 'बीटी कपास',
    category: 'Cash Crops',
    modalPrice: 7450,
    minPrice: 7100,
    maxPrice: 7780,
    change: 120,
    changePercent: 1.63,
    arrivalQtyQuintals: 870,
    mandiHub: 'Raichur Cotton Market',
    state: 'Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&w=600&q=80',
    grade: '29mm Staple Clean'
  },
  {
    id: 'm-5',
    name: 'Red Gram / Toor Dal (Pigeon Pea)',
    hindiName: 'तूर / अरहर दाल',
    category: 'Pulses',
    modalPrice: 10450,
    minPrice: 9900,
    maxPrice: 10900,
    change: 180,
    changePercent: 1.75,
    arrivalQtyQuintals: 620,
    mandiHub: 'Kalaburagi (Gulbarga) APMC',
    state: 'Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
    grade: 'G.I. Kalaburagi Red'
  },
  {
    id: 'm-6',
    name: 'Finger Millet (Ragi)',
    hindiName: 'रागी / मडुआ',
    category: 'Cereals',
    modalPrice: 3950,
    minPrice: 3750,
    maxPrice: 4200,
    change: 85,
    changePercent: 2.2,
    arrivalQtyQuintals: 450,
    mandiHub: 'Mysuru Bandipalya Market',
    state: 'Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
    grade: 'Organic Brown Native'
  },
  {
    id: 'm-7',
    name: 'Yellow Soybean',
    hindiName: 'पीली सोयाबीन',
    category: 'Oilseeds',
    modalPrice: 4860,
    minPrice: 4620,
    maxPrice: 5080,
    change: 50,
    changePercent: 1.04,
    arrivalQtyQuintals: 1680,
    mandiHub: 'Indore Mandi',
    state: 'Madhya Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?auto=format&fit=crop&w=600&q=80',
    grade: 'Oil Recovery 18.5%'
  },
  {
    id: 'm-8',
    name: 'Black Mustard Seed (Sarson)',
    hindiName: 'काली सरसों',
    category: 'Oilseeds',
    modalPrice: 5620,
    minPrice: 5400,
    maxPrice: 5880,
    change: 90,
    changePercent: 1.62,
    arrivalQtyQuintals: 920,
    mandiHub: 'Alwar APMC',
    state: 'Rajasthan',
    imageUrl: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=600&q=80',
    grade: 'Bold Pungent Seed'
  },
  {
    id: 'm-9',
    name: 'Commercial Sugarcane',
    hindiName: 'गन्ना (मिल आपूर्ति)',
    category: 'Cash Crops',
    modalPrice: 3450,
    minPrice: 3250,
    maxPrice: 3600,
    change: 0,
    changePercent: 0,
    arrivalQtyQuintals: 4800,
    mandiHub: 'Kolhapur Sugar Yard',
    state: 'Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80',
    grade: 'Co-0238 High Sucrose'
  },
  {
    id: 'm-10',
    name: 'Red Hybrid Tomato',
    hindiName: 'लाल संकर टमाटर',
    category: 'Horticulture',
    modalPrice: 2150,
    minPrice: 1800,
    maxPrice: 2450,
    change: -110,
    changePercent: -4.86,
    arrivalQtyQuintals: 3100,
    mandiHub: 'Kolar APMC Market',
    state: 'Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    grade: 'Firm Table Grade'
  },
  {
    id: 'm-11',
    name: 'Nashik Red Onion',
    hindiName: 'नासिक लाल प्याज',
    category: 'Horticulture',
    modalPrice: 2480,
    minPrice: 2200,
    maxPrice: 2750,
    change: 140,
    changePercent: 5.98,
    arrivalQtyQuintals: 4200,
    mandiHub: 'Lasalgaon APMC',
    state: 'Maharashtra',
    imageUrl: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?auto=format&fit=crop&w=600&q=80',
    grade: 'Medium Dry Outer Skin'
  },
  {
    id: 'm-12',
    name: 'Guntur Dry Red Chilli',
    hindiName: 'गुंटूर लाल मिर्च',
    category: 'Horticulture',
    modalPrice: 18900,
    minPrice: 17500,
    maxPrice: 20400,
    change: 450,
    changePercent: 2.44,
    arrivalQtyQuintals: 740,
    mandiHub: 'Guntur Yard',
    state: 'Andhra Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
    grade: 'Teja S17 Grade'
  },
  {
    id: 'm-13',
    name: 'Salem Nizamabad Turmeric (Haldi)',
    hindiName: 'हल्दी गांठ',
    category: 'Horticulture',
    modalPrice: 13800,
    minPrice: 12900,
    maxPrice: 14750,
    change: 220,
    changePercent: 1.62,
    arrivalQtyQuintals: 580,
    mandiHub: 'Nizamabad Mandi',
    state: 'Telangana',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    grade: 'Double Polished Finger'
  },
  {
    id: 'm-14',
    name: 'Jyoti Table Potato',
    hindiName: 'आलू (ज्योति)',
    category: 'Horticulture',
    modalPrice: 1640,
    minPrice: 1450,
    maxPrice: 1820,
    change: -30,
    changePercent: -1.79,
    arrivalQtyQuintals: 3600,
    mandiHub: 'Agra Mandi',
    state: 'Uttar Pradesh',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    grade: 'Cold Storage Fresh'
  },
  {
    id: 'm-15',
    name: 'Spanish Bold Groundnut (Peanut)',
    hindiName: 'मूंगफली दाना',
    category: 'Oilseeds',
    modalPrice: 6850,
    minPrice: 6500,
    maxPrice: 7200,
    change: 110,
    changePercent: 1.63,
    arrivalQtyQuintals: 890,
    mandiHub: 'Rajkot APMC',
    state: 'Gujarat',
    imageUrl: 'https://images.unsplash.com/photo-1567892328224-e1b9b183ce52?auto=format&fit=crop&w=600&q=80',
    grade: 'Count 40/50 Bold'
  },
  {
    id: 'm-16',
    name: 'Arabica Plantation Coffee Beans',
    hindiName: 'कॉफी बीज (अरेबिका)',
    category: 'Cash Crops',
    modalPrice: 32500,
    minPrice: 31000,
    maxPrice: 34200,
    change: 600,
    changePercent: 1.88,
    arrivalQtyQuintals: 210,
    mandiHub: 'Chikkamagaluru Market',
    state: 'Karnataka',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=600&q=80',
    grade: 'Plantation-A Washed'
  }
];

export const SEED_MACHINERY: MachineryListing[] = [
  {
    id: 'mach-1',
    name: 'Mahindra 575 DI (45 HP) Tractor + Heavy Trolley',
    category: 'Tractor',
    hpOrCapacity: '45 HP / 4WD',
    ownerName: 'Gurudas Gowda',
    phone: '9845199201',
    location: 'Davangere Rural',
    state: 'Karnataka',
    rateType: 'hourly',
    rateAmount: 650,
    operatorIncluded: true,
    fuelIncluded: false,
    imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'mach-2',
    name: 'Shaktiman 7-Feet Rotary Tiller (Rotavator)',
    category: 'Rotavator',
    hpOrCapacity: '7 Feet / 48 Blades',
    ownerName: 'Manjunath Reddy',
    phone: '9740112233',
    location: 'Raichur Sindhanur',
    state: 'Karnataka',
    rateType: 'per_acre',
    rateAmount: 950,
    operatorIncluded: true,
    fuelIncluded: true,
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'mach-3',
    name: 'DJI Agras T40 Smart Agriculture Drone Sprayer',
    category: 'Drone Sprayer',
    hpOrCapacity: '40L Payload / 10 min per acre',
    ownerName: 'Praveen Kulkarni (Certified Pilot)',
    phone: '9448822334',
    location: 'Kalaburagi (Gulbarga)',
    state: 'Karnataka',
    rateType: 'per_acre',
    rateAmount: 480,
    operatorIncluded: true,
    fuelIncluded: true,
    imageUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'mach-4',
    name: 'Preet 987 Self-Propelled Multi-Crop Combine Harvester',
    category: 'Harvester',
    hpOrCapacity: '101 HP / Paddy & Wheat Cutter Bar',
    ownerName: 'Jagjit Singh',
    phone: '9876543210',
    location: 'Karnal Nilokheri',
    state: 'Haryana',
    rateType: 'per_acre',
    rateAmount: 1850,
    operatorIncluded: true,
    fuelIncluded: true,
    imageUrl: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=600&q=80',
    available: true
  },
  {
    id: 'mach-5',
    name: 'Trimble Laser Land Leveler with GPS Mast',
    category: 'Laser Leveler',
    hpOrCapacity: '300m Precision Range',
    ownerName: 'Sanjay Deshmukh',
    phone: '9822334455',
    location: 'Baramati, Pune',
    state: 'Maharashtra',
    rateType: 'hourly',
    rateAmount: 1200,
    operatorIncluded: true,
    fuelIncluded: false,
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80',
    available: true
  }
];

export const SEED_COLD_STORAGES: ColdStorage[] = [
  {
    id: 'cs-1',
    name: 'Kolar Agro Multi-Chamber Cold Storage',
    district: 'Kolar',
    state: 'Karnataka',
    capacityMT: 5000,
    availableCapacityMT: 1400,
    temperatureRange: '2°C to 8°C (Humidity 90%)',
    suitableCrops: ['Tomatoes', 'Capsicum', 'Carrots', 'Cabbage', 'Grapes'],
    monthlyRatePerQuintal: 85,
    enwrRegistered: true,
    phone: '08152-245678',
    distanceKm: 12
  },
  {
    id: 'cs-2',
    name: 'Lasalgaon Mandi Onion Dehydration & Solar Sheds',
    district: 'Nashik',
    state: 'Maharashtra',
    capacityMT: 8500,
    availableCapacityMT: 2200,
    temperatureRange: 'Ventilated 24°C-28°C / Dry Air',
    suitableCrops: ['Red Onions', 'Garlic', 'Dry Chillies'],
    monthlyRatePerQuintal: 60,
    enwrRegistered: true,
    phone: '02550-266123',
    distanceKm: 8
  },
  {
    id: 'cs-3',
    name: 'Agra Potato & Seed Tuber Climate Depot',
    district: 'Agra',
    state: 'Uttar Pradesh',
    capacityMT: 12000,
    availableCapacityMT: 3100,
    temperatureRange: '3°C to 4°C with CIPC sprout suppression',
    suitableCrops: ['Potatoes', 'Seed Tubers'],
    monthlyRatePerQuintal: 70,
    enwrRegistered: true,
    phone: '0562-239841',
    distanceKm: 15
  },
  {
    id: 'cs-4',
    name: 'Davangere Maize & Grain Silo Complex',
    district: 'Davangere',
    state: 'Karnataka',
    capacityMT: 6000,
    availableCapacityMT: 1850,
    temperatureRange: 'Moisture Controlled Ambient Silo',
    suitableCrops: ['Maize', 'Paddy', 'Pulses', 'Oilseeds'],
    monthlyRatePerQuintal: 50,
    enwrRegistered: true,
    phone: '08192-221199',
    distanceKm: 6
  }
];

const DEMO_SALT = 'e9c8f2a1b4d3e5f60718293a4b5c6d7e';
const DEMO_PASSWORD_HASH = hashPassword('Farmer@123', DEMO_SALT).hash;

export const SEED_USERS: UserProfile[] = [
  {
    id: 'usr-kisan-101',
    fullName: 'Ramesh Patel',
    phone: '9845112233',
    passwordHash: DEMO_PASSWORD_HASH,
    salt: DEMO_SALT,
    village: 'Hadadi Village',
    district: 'Davangere',
    state: 'Karnataka',
    landholdingAcres: 4.5,
    primaryCrops: ['Paddy (Sona Masuri)', 'Yellow Maize', 'Arecanut'],
    preferredLang: 'kn-IN',
    createdAt: '2026-10-01T08:00:00Z'
  }
];

const INITIAL_DATA: DataStoreSchema = {
  users: SEED_USERS,
  sessions: {},
  produce: [
    {
      id: 'p-1',
      farmerName: 'Ramesh Patil',
      phone: '9845123456',
      crop: 'Premium Basmati Rice (Pusa 1121)',
      category: 'Cereals',
      quantity: 1500,
      pricePerKg: 68,
      location: 'Karnal, Haryana',
      state: 'Haryana',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      harvestDate: '2026-10-18',
      status: 'Available',
      createdAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 'p-2',
      farmerName: 'Anand Biradar',
      phone: '9448198765',
      crop: 'Organic Sharbati Milling Wheat',
      category: 'Cereals',
      quantity: 1200,
      pricePerKg: 34,
      location: 'Bidar, Karnataka',
      state: 'Karnataka',
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
      harvestDate: '2026-10-15',
      status: 'Available',
      createdAt: '2026-10-21T08:30:00Z'
    },
    {
      id: 'p-3',
      farmerName: 'Vikas Patil',
      phone: '9765432109',
      crop: 'Bt Cotton (Bollgard II Clean)',
      category: 'Cash Crops',
      quantity: 2800,
      pricePerKg: 76,
      location: 'Yavatmal, Maharashtra',
      state: 'Maharashtra',
      imageUrl: 'https://images.unsplash.com/photo-1594489428504-5c0c480a15fd?auto=format&fit=crop&w=600&q=80',
      harvestDate: '2026-10-22',
      status: 'Available',
      createdAt: '2026-10-22T14:15:00Z'
    },
    {
      id: 'p-4',
      farmerName: 'Basavarajappa',
      phone: '9988776655',
      crop: 'Yellow Feed Maize (Dry)',
      category: 'Cereals',
      quantity: 3500,
      pricePerKg: 24,
      location: 'Davangere, Karnataka',
      state: 'Karnataka',
      imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
      harvestDate: '2026-10-19',
      status: 'Available',
      createdAt: '2026-10-23T11:00:00Z'
    }
  ],
  inquiries: [],
  scans: [
    {
      id: 'scan-1',
      cropName: 'Tomato',
      title: 'Early Blight (Alternaria solani)',
      summary: 'Target-like brown spots with concentric rings detected on lower foliage with chlorotic yellow halo.',
      causes: ['Warm temperature alternating with rainy periods', 'Overhead watering splashing soil onto foliage'],
      treatment: ['Foliar spray of Chlorothalonil 75% WP @ 2g/L or Mancozeb 75% WP @ 2.5g/L', 'Organic: 5% Neem seed oil extract'],
      prevention: ['Crop rotation away from nightshade crops', 'Mulching around root zones'],
      recoveryRate: 'High (85%) with prompt care',
      thumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=200&q=80',
      scannedAt: '2026-10-24T09:15:00Z'
    }
  ],
  applications: [
    {
      id: 'KM-748291',
      scheme: 'PM-KISAN Samman Nidhi',
      farmer: 'Kisan Mitra',
      aadhaar: 'XXXX-XXXX-8492',
      mobile: '9845112233',
      village: 'Davangere Gram Panchayat',
      date: '2026-10-24',
      status: 'Verified by Taluk Agriculture Officer (Disbursement Pending)',
      createdAt: '2026-10-24T12:00:00Z'
    }
  ],
  pumpTelemetry: {
    isRunning: true,
    surgeTripCount: 0,
    lastTripAt: null
  },
  khata: [
    {
      id: 'kh-1',
      cropName: 'Basmati Rice (Pusa 1121)',
      season: 'Kharif 2026',
      category: 'Land Preparation & Tractor',
      description: 'Primary disc ploughing & puddling (2 passes with tractor)',
      amount: 4800,
      date: '2026-06-12',
      paymentMode: 'Cash'
    },
    {
      id: 'kh-2',
      cropName: 'Basmati Rice (Pusa 1121)',
      season: 'Kharif 2026',
      category: 'Seeds & Nursery',
      description: 'Certified Pusa 1121 seed bags (25 kg) + Trichoderma seed treatment',
      amount: 2350,
      date: '2026-06-18',
      paymentMode: 'UPI'
    },
    {
      id: 'kh-3',
      cropName: 'Basmati Rice (Pusa 1121)',
      season: 'Kharif 2026',
      category: 'Fertilizer & Nutrition',
      description: 'DAP 2 bags (Basal) + Zinc Sulfate 21% (10 kg) from IFFCO Society',
      amount: 3150,
      date: '2026-06-25',
      paymentMode: 'Kisan Credit Card (KCC)'
    },
    {
      id: 'kh-4',
      cropName: 'Basmati Rice (Pusa 1121)',
      season: 'Kharif 2026',
      category: 'Labor & Weeding',
      description: 'Manual transplanting labor (6 workers for 1.5 days)',
      amount: 5400,
      date: '2026-07-02',
      paymentMode: 'Cash'
    },
    {
      id: 'kh-5',
      cropName: 'Basmati Rice (Pusa 1121)',
      season: 'Kharif 2026',
      category: 'Harvesting & Threshing',
      description: 'Combine harvester hiring (2.5 acres @ ₹1,800/acre)',
      amount: 4500,
      date: '2026-10-18',
      paymentMode: 'UPI'
    }
  ],
  machinery: SEED_MACHINERY,
  machineryBookings: [
    {
      id: 'bk-101',
      machineryId: 'mach-3',
      machineryName: 'DJI Agras T40 Drone Sprayer',
      farmerName: 'Basavarajappa',
      farmerPhone: '9988776655',
      village: 'Hadadi Village, Davangere',
      bookingDate: '2026-10-27',
      unitsRequired: 3,
      totalEstimatedCost: 1440,
      status: 'Confirmed',
      createdAt: '2026-10-24T15:00:00Z'
    }
  ],
  fertilizerPlans: [],
  insuranceClaims: [
    {
      id: 'ins-1',
      claimRef: 'PMFBY-2026-88192',
      farmerName: 'Ramesh Patil',
      mobile: '9845123456',
      aadhaar: 'XXXX-XXXX-4812',
      policyOrKCC: 'KCC-SBIN-0091823',
      crop: 'Basmati Rice',
      affectedAcres: 1.5,
      totalAcres: 3,
      disasterType: 'Unseasonal Heavy Rain',
      incidentDate: '2026-10-23',
      estimatedLossPercent: 40,
      village: 'Nilokheri, Karnal',
      district: 'Karnal',
      status: 'Intimation Submitted (72h Compliant)',
      createdAt: '2026-10-24T08:00:00Z'
    }
  ],
  coldStorages: SEED_COLD_STORAGES
};

class DataStore {
  private data: DataStoreSchema;

  constructor() {
    this.ensureDirectory();
    this.data = this.loadData();
  }

  private ensureDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private loadData(): DataStoreSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Merge with any new schema fields if missing
        return {
          ...INITIAL_DATA,
          ...parsed,
          users: parsed.users && parsed.users.length > 0 ? parsed.users : INITIAL_DATA.users,
          sessions: parsed.sessions || {},
          khata: parsed.khata || INITIAL_DATA.khata,
          machinery: parsed.machinery || INITIAL_DATA.machinery,
          machineryBookings: parsed.machineryBookings || INITIAL_DATA.machineryBookings,
          fertilizerPlans: parsed.fertilizerPlans || INITIAL_DATA.fertilizerPlans,
          insuranceClaims: parsed.insuranceClaims || INITIAL_DATA.insuranceClaims,
          coldStorages: parsed.coldStorages || INITIAL_DATA.coldStorages
        };
      }
    } catch (e) {
      console.error('Error reading data store, resetting to initial data:', e);
    }
    this.saveData(INITIAL_DATA);
    return INITIAL_DATA;
  }

  private saveData(data: DataStoreSchema) {
    try {
      this.ensureDirectory();
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error writing data store:', e);
    }
  }

  // 0. User Authentication & Session Management
  public findUserByPhone(phone: string): UserProfile | undefined {
    const cleanPhone = phone.trim().replace(/\D/g, '');
    return (this.data.users || []).find(u => u.phone.replace(/\D/g, '') === cleanPhone);
  }

  public findUserById(id: string): UserProfile | undefined {
    return (this.data.users || []).find(u => u.id === id);
  }

  public registerUser(profile: {
    fullName: string;
    phone: string;
    password: string;
    village?: string;
    district?: string;
    state?: string;
    landholdingAcres?: number;
    primaryCrops?: string[];
    preferredLang?: 'en-IN' | 'kn-IN' | 'hi-IN' | 'mr-IN' | 'te-IN';
  }): SafeUser {
    const cleanPhone = profile.phone.trim().replace(/\D/g, '');
    const { hash, salt } = hashPassword(profile.password);

    const newUser: UserProfile = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: profile.fullName.trim(),
      phone: cleanPhone,
      passwordHash: hash,
      salt: salt,
      village: profile.village || 'Gram Panchayat',
      district: profile.district || 'District Center',
      state: profile.state || 'Karnataka',
      landholdingAcres: profile.landholdingAcres || 2,
      primaryCrops: profile.primaryCrops || ['Paddy', 'Wheat'],
      preferredLang: profile.preferredLang || 'kn-IN',
      createdAt: new Date().toISOString()
    };

    if (!this.data.users) this.data.users = [];
    this.data.users.push(newUser);
    this.saveData(this.data);

    const { passwordHash: _ph, salt: _s, ...safe } = newUser;
    return safe;
  }

  public createSession(userId: string): AuthSession {
    const token = generateToken();
    const session: AuthSession = {
      token,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    if (!this.data.sessions) this.data.sessions = {};
    this.data.sessions[token] = session;
    this.saveData(this.data);
    return session;
  }

  public validateSession(token: string): SafeUser | null {
    if (!token || !this.data.sessions) return null;
    const session = this.data.sessions[token];
    if (!session) return null;
    if (session.expiresAt < Date.now()) {
      delete this.data.sessions[token];
      this.saveData(this.data);
      return null;
    }
    const user = this.findUserById(session.userId);
    if (!user) return null;
    const { passwordHash: _ph, salt: _s, ...safe } = user;
    return safe;
  }

  public invalidateSession(token: string): boolean {
    if (!token || !this.data.sessions || !this.data.sessions[token]) return false;
    delete this.data.sessions[token];
    this.saveData(this.data);
    return true;
  }

  // 1. Produce Listings CRUD
  public getProduceListings(userId?: string): ProduceListing[] {
    if (userId) {
      return this.data.produce.filter(p => p.userId === userId);
    }
    return this.data.produce;
  }

  public addProduceListing(item: Omit<ProduceListing, 'id' | 'createdAt'>, userId?: string): ProduceListing {
    const newItem: ProduceListing = {
      ...item,
      id: `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: userId || item.userId,
      createdAt: new Date().toISOString()
    };
    this.data.produce.unshift(newItem);
    this.saveData(this.data);
    return newItem;
  }

  public deleteProduceListing(id: string, userId?: string): boolean {
    const item = this.data.produce.find(p => p.id === id);
    if (!item) return false;
    if (userId && item.userId && item.userId !== userId) {
      return false; // Forbidden: belongs to another farmer
    }
    const initialLen = this.data.produce.length;
    this.data.produce = this.data.produce.filter(p => p.id !== id);
    if (this.data.produce.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // 2. Buyer Inquiries
  public addInquiry(inquiry: Omit<BuyerInquiry, 'id' | 'createdAt' | 'status'>, userId?: string): BuyerInquiry {
    const newInquiry: BuyerInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      userId: userId || inquiry.userId,
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };
    this.data.inquiries.unshift(newInquiry);
    this.saveData(this.data);
    return newInquiry;
  }

  public getInquiries(userId?: string): BuyerInquiry[] {
    if (userId) {
      return this.data.inquiries.filter(i => i.userId === userId);
    }
    return this.data.inquiries;
  }

  // 3. Disease Scan History
  public addDiseaseScan(scan: Omit<DiseaseScanLog, 'id' | 'scannedAt'>, userId?: string): DiseaseScanLog {
    const newScan: DiseaseScanLog = {
      ...scan,
      id: `scan-${Date.now()}`,
      userId: userId || scan.userId,
      scannedAt: new Date().toISOString()
    };
    this.data.scans.unshift(newScan);
    if (this.data.scans.length > 50) this.data.scans.pop();
    this.saveData(this.data);
    return newScan;
  }

  public getDiseaseScans(userId?: string): DiseaseScanLog[] {
    if (userId) {
      return this.data.scans.filter(s => s.userId === userId);
    }
    return this.data.scans;
  }

  // 4. Scheme Applications
  public getApplications(userId?: string): SchemeApplication[] {
    if (userId) {
      return this.data.applications.filter(a => a.userId === userId);
    }
    return this.data.applications;
  }

  public addApplication(app: Omit<SchemeApplication, 'id' | 'createdAt'>, userId?: string): SchemeApplication {
    const newApp: SchemeApplication = {
      ...app,
      aadhaar: maskAadhaar(app.aadhaar),
      id: `KM-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: userId || app.userId,
      createdAt: new Date().toISOString()
    };
    this.data.applications.unshift(newApp);
    this.saveData(this.data);
    return newApp;
  }

  public deleteApplication(id: string, userId?: string): boolean {
    const target = this.data.applications.find(a => a.id !== id);
    const item = this.data.applications.find(a => a.id === id);
    if (!item) return false;
    if (userId && item.userId && item.userId !== userId) {
      return false; // Unauthorized
    }
    const initialLen = this.data.applications.length;
    this.data.applications = this.data.applications.filter(a => a.id !== id);
    if (this.data.applications.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // 5. Pump State
  public getPumpState() {
    return this.data.pumpTelemetry;
  }

  public updatePumpState(update: Partial<DataStoreSchema['pumpTelemetry']>) {
    this.data.pumpTelemetry = {
      ...this.data.pumpTelemetry,
      ...update
    };
    this.saveData(this.data);
    return this.data.pumpTelemetry;
  }

  // 6. Kisan Khata CRUD
  public getKhataEntries(userId?: string): KhataEntry[] {
    if (userId) {
      return (this.data.khata || []).filter(e => e.userId === userId);
    }
    return this.data.khata || [];
  }

  public addKhataEntry(entry: Omit<KhataEntry, 'id'>, userId?: string): KhataEntry {
    const newEntry: KhataEntry = {
      ...entry,
      id: `kh-${Date.now()}`,
      userId: userId || entry.userId
    };
    if (!this.data.khata) this.data.khata = [];
    this.data.khata.unshift(newEntry);
    this.saveData(this.data);
    return newEntry;
  }

  public deleteKhataEntry(id: string, userId?: string): boolean {
    if (!this.data.khata) return false;
    const item = this.data.khata.find(e => e.id === id);
    if (!item) return false;
    if (userId && item.userId && item.userId !== userId) {
      return false; // Prevent deleting another farmer's expense
    }
    const initialLen = this.data.khata.length;
    this.data.khata = this.data.khata.filter(e => e.id !== id);
    if (this.data.khata.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // 7. Custom Hiring Machinery
  public getMachinery(): MachineryListing[] {
    return this.data.machinery || SEED_MACHINERY;
  }

  public addMachinery(mach: Omit<MachineryListing, 'id' | 'available'>): MachineryListing {
    const newItem: MachineryListing = {
      ...mach,
      id: `mach-${Date.now()}`,
      available: true
    };
    if (!this.data.machinery) this.data.machinery = [];
    this.data.machinery.unshift(newItem);
    this.saveData(this.data);
    return newItem;
  }

  public getMachineryBookings(userId?: string): MachineryBooking[] {
    if (userId) {
      return (this.data.machineryBookings || []).filter(b => b.userId === userId);
    }
    return this.data.machineryBookings || [];
  }

  public addMachineryBooking(b: Omit<MachineryBooking, 'id' | 'createdAt' | 'status'>, userId?: string): MachineryBooking {
    const newBooking: MachineryBooking = {
      ...b,
      id: `bk-${Date.now()}`,
      userId: userId || b.userId,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    if (!this.data.machineryBookings) this.data.machineryBookings = [];
    this.data.machineryBookings.unshift(newBooking);
    this.saveData(this.data);
    return newBooking;
  }

  // 8. Precision Fertilizer Plans
  public getFertilizerPlans(userId?: string): FertilizerPlan[] {
    if (userId) {
      return (this.data.fertilizerPlans || []).filter(p => p.userId === userId);
    }
    return this.data.fertilizerPlans || [];
  }

  public saveFertilizerPlan(plan: Omit<FertilizerPlan, 'id' | 'createdAt'>, userId?: string): FertilizerPlan {
    const newPlan: FertilizerPlan = {
      ...plan,
      id: `fp-${Date.now()}`,
      userId: userId || plan.userId,
      createdAt: new Date().toISOString()
    };
    if (!this.data.fertilizerPlans) this.data.fertilizerPlans = [];
    this.data.fertilizerPlans.unshift(newPlan);
    this.saveData(this.data);
    return newPlan;
  }

  public deleteFertilizerPlan(id: string, userId?: string): boolean {
    if (!this.data.fertilizerPlans) return false;
    const item = this.data.fertilizerPlans.find(p => p.id === id);
    if (!item) return false;
    if (userId && item.userId && item.userId !== userId) {
      return false; // Unauthorized
    }
    const initialLen = this.data.fertilizerPlans.length;
    this.data.fertilizerPlans = this.data.fertilizerPlans.filter(p => p.id !== id);
    if (this.data.fertilizerPlans.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // 9. PMFBY Crop Insurance Claims
  public getInsuranceClaims(userId?: string): InsuranceClaim[] {
    if (userId) {
      return (this.data.insuranceClaims || []).filter(c => c.userId === userId);
    }
    return this.data.insuranceClaims || [];
  }

  public addInsuranceClaim(claim: Omit<InsuranceClaim, 'id' | 'claimRef' | 'createdAt' | 'status'>, userId?: string): InsuranceClaim {
    const newClaim: InsuranceClaim = {
      ...claim,
      aadhaar: maskAadhaar(claim.aadhaar),
      id: `ins-${Date.now()}`,
      userId: userId || claim.userId,
      claimRef: `PMFBY-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Intimation Submitted (72h Compliant)',
      createdAt: new Date().toISOString()
    };
    if (!this.data.insuranceClaims) this.data.insuranceClaims = [];
    this.data.insuranceClaims.unshift(newClaim);
    this.saveData(this.data);
    return newClaim;
  }

  // 10. Cold Storages
  public getColdStorages(): ColdStorage[] {
    return this.data.coldStorages || SEED_COLD_STORAGES;
  }
}

export const store = new DataStore();
