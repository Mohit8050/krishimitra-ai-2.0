import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ThermometerSnowflake,
  Clock,
  MapPin,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Warehouse,
  PlusCircle,
  Building2
} from 'lucide-react';

export interface InsuranceClaim {
  id: string;
  claimRef: string;
  farmerName: string;
  mobile: string;
  aadhaar: string;
  policyOrKCC: string;
  crop: string;
  affectedAcres: number;
  totalAcres: number;
  disasterType: string;
  incidentDate: string;
  estimatedLossPercent: number;
  village: string;
  district: string;
  status: string;
  createdAt: string;
}

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

const PERISHABLE_SHELF_LIFE = [
  {
    crop: 'Red Hybrid Tomato',
    currentAmbientTemp: '31°C',
    ambientSafeDays: '2 - 3 Days (Rapid softening & decay)',
    coldStorageTemp: '10°C - 12°C',
    coldStorageSafeDays: '18 - 24 Days',
    recommendation: 'Market immediately or move to cold storage within 24 hours of picking.'
  },
  {
    crop: 'Nashik Red Onion',
    currentAmbientTemp: '31°C',
    ambientSafeDays: '20 - 30 Days (If cured in shaded ventilated shed)',
    coldStorageTemp: '0°C - 2°C (Dry Air)',
    coldStorageSafeDays: '5 - 6 Months',
    recommendation: 'Ensure neck tissue is fully dried before bagging. Do not stack wet sacks.'
  },
  {
    crop: 'Jyoti Table Potato',
    currentAmbientTemp: '31°C',
    ambientSafeDays: '10 - 15 Days (Sprouting risk if exposed to light)',
    coldStorageTemp: '3°C - 4°C',
    coldStorageSafeDays: '7 - 9 Months (with CIPC treatment)',
    recommendation: 'Store in dark, cool, ventilated area to prevent solanine greening.'
  },
  {
    crop: 'Guntur Green/Dry Chilli',
    currentAmbientTemp: '31°C',
    ambientSafeDays: '4 - 5 Days (Green) / 6 Months (Dry)',
    coldStorageTemp: '7°C - 8°C (Humidity 85%)',
    coldStorageSafeDays: '25 - 35 Days (Green)',
    recommendation: 'Pre-cool harvested green chillies to remove field heat within 4 hours.'
  }
];

export function CropInsuranceColdStorage({ currentTemp = 29 }: { currentTemp?: number }) {
  const [activeSubTab, setActiveSubTab] = useState<'insurance' | 'coldstorage'>('insurance');
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [coldStorages, setColdStorages] = useState<ColdStorage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // PMFBY Intimation Form
  const [claimForm, setClaimForm] = useState({
    farmerName: '',
    mobile: '',
    aadhaar: '',
    policyOrKCC: '',
    crop: 'Basmati Rice',
    affectedAcres: '1.5',
    totalAcres: '3.0',
    disasterType: 'Unseasonal Heavy Rain' as const,
    incidentDate: new Date().toISOString().split('T')[0],
    estimatedLossPercent: '50',
    village: '',
    district: 'Davangere'
  });

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('km_auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchClaims = async () => {
    try {
      const res = await fetch('/api/insurance/claims', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setClaims(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchColdStorages = async () => {
    try {
      const res = await fetch('/api/coldstorages');
      const data = await res.json();
      setColdStorages(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchClaims();
    fetchColdStorages();
  }, []);

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimForm.farmerName || !claimForm.mobile || !claimForm.village) {
      alert('Please fill farmer name, mobile number, and village');
      return;
    }

    const cleanAff = parseFloat(claimForm.affectedAcres);
    const cleanTot = parseFloat(claimForm.totalAcres);
    if (isNaN(cleanAff) || cleanAff <= 0 || isNaN(cleanTot) || cleanTot <= 0) {
      alert('Please enter valid positive acreage numbers.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/insurance/claims', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...claimForm,
          affectedAcres: cleanAff,
          totalAcres: cleanTot
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Local Pre-Filing Intimation Record Generated! Reference: ${data.claim.claimRef}. Note: This is an offline pre-survey record. Please call the official PMFBY toll-free number 1800-180-1551 or notify your local Raitha Samparka Kendra / KCC bank within 72 hours of damage.`);
        fetchClaims();
        setClaimForm({
          farmerName: '',
          mobile: '',
          aadhaar: '',
          policyOrKCC: '',
          crop: 'Basmati Rice',
          affectedAcres: '1.5',
          totalAcres: '3.0',
          disasterType: 'Unseasonal Heavy Rain',
          incidentDate: new Date().toISOString().split('T')[0],
          estimatedLossPercent: '50',
          village: '',
          district: 'Davangere'
        });
      }
    } catch (e) {
      console.error(e);
      alert('Error recording claim intimation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-emerald-900/40 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>PMFBY 72-Hour Rapid Intimation & Cold Chain Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Crop Loss Insurance & Perishable Cold Storage
          </h2>
          <p className="text-xs text-emerald-300/80 mt-1 max-w-2xl">
            Solves the 72-hour PMFBY insurance deadline rejection crisis and post-harvest distress selling of perishable vegetables through climate-controlled storage locators.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('insurance')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'insurance'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                : 'bg-[#0a1e13] border border-emerald-800 text-emerald-300 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            72h Crop Loss Intimation ({claims.length})
          </button>
          <button
            onClick={() => setActiveSubTab('coldstorage')}
            className={`px-3.5 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'coldstorage'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30'
                : 'bg-[#0a1e13] border border-emerald-800 text-emerald-300 hover:text-white'
            }`}
          >
            <Warehouse className="w-4 h-4" />
            Cold Storage Locator ({coldStorages.length})
          </button>
        </div>
      </div>

      {/* 1. PMFBY 72-Hour Rapid Loss Intimation Section */}
      {activeSubTab === 'insurance' && (
        <div className="space-y-6">
          {/* Urgent 72h Rule Alert */}
          <div className="bg-gradient-to-r from-rose-950/60 to-red-900/40 border border-rose-500/40 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
                <Clock className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  Official PMFBY 72-Hour Mandatory Window
                  <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">
                    Crucial Compliance
                  </span>
                </h3>
                <p className="text-xs text-rose-200/90 mt-1 max-w-2xl leading-relaxed">
                  Under the Pradhan Mantri Fasal Bima Yojana guidelines, localized crop damage due to hailstorm, landslide, inundation, or post-harvest cyclonic rains MUST be intimated within <b>72 hours</b> of occurrence to prevent automatic claim rejection.
                </p>
              </div>
            </div>
          </div>

          {successMsg && (
            <div className="p-4 bg-emerald-950/50 border border-emerald-500/50 rounded-2xl text-xs text-emerald-300 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Intimation Form */}
            <div className="lg:col-span-2 bg-[#0b2416] border border-emerald-800/40 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Generate 72-Hour Crop Loss Dossier
              </h3>

              <form onSubmit={handleSubmitClaim} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Farmer Full Name</label>
                    <input
                      type="text"
                      placeholder="As per Aadhaar / Bank Passbook"
                      value={claimForm.farmerName}
                      onChange={e => setClaimForm({ ...claimForm, farmerName: e.target.value })}
                      className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Mobile Number (SMS Linked)</label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={claimForm.mobile}
                      onChange={e => setClaimForm({ ...claimForm, mobile: e.target.value })}
                      className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Aadhaar Number</label>
                    <input
                      type="text"
                      placeholder="12-digit Aadhaar"
                      value={claimForm.aadhaar}
                      onChange={e => setClaimForm({ ...claimForm, aadhaar: e.target.value })}
                      className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Policy / KCC Account No.</label>
                    <input
                      type="text"
                      placeholder="KCC Loan Account / PMFBY Application ID"
                      value={claimForm.policyOrKCC}
                      onChange={e => setClaimForm({ ...claimForm, policyOrKCC: e.target.value })}
                      className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Damaged Crop</label>
                    <select
                      value={claimForm.crop}
                      onChange={e => setClaimForm({ ...claimForm, crop: e.target.value })}
                      className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="Basmati Rice">Basmati Rice (Paddy)</option>
                      <option value="Wheat">Wheat</option>
                      <option value="Bt Cotton">Bt Cotton</option>
                      <option value="Yellow Soybean">Yellow Soybean</option>
                      <option value="Hybrid Maize">Hybrid Maize</option>
                      <option value="Tomato">Tomato (Horticulture)</option>
                      <option value="Onion">Onion</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-rose-400 font-semibold mb-1">Disaster / Calamity Type</label>
                    <select
                      value={claimForm.disasterType}
                      onChange={e => setClaimForm({ ...claimForm, disasterType: e.target.value as any })}
                      className="w-full bg-black/50 border border-rose-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-400"
                    >
                      <option value="Inundation / Flooding">Inundation / Flooding</option>
                      <option value="Hailstorm">Severe Hailstorm Damage</option>
                      <option value="Unseasonal Heavy Rain">Unseasonal Heavy Rain</option>
                      <option value="Post-Harvest Rain Damage">Post-Harvest Rain Damage in Yard</option>
                      <option value="Severe Drought / Moisture Deficit">Severe Drought / Moisture Deficit</option>
                      <option value="Pest Outbreak">Extensive Pest / Disease Attack</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Incident Date</label>
                    <input
                      type="date"
                      value={claimForm.incidentDate}
                      onChange={e => setClaimForm({ ...claimForm, incidentDate: e.target.value })}
                      className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Affected Area (Acres)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={claimForm.affectedAcres}
                      onChange={e => setClaimForm({ ...claimForm, affectedAcres: e.target.value })}
                      className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Estimated Loss (%)</label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={claimForm.estimatedLossPercent}
                      onChange={e => setClaimForm({ ...claimForm, estimatedLossPercent: e.target.value })}
                      className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">Village & Gram Panchayat</label>
                    <input
                      type="text"
                      placeholder="e.g. Hadadi Village"
                      value={claimForm.village}
                      onChange={e => setClaimForm({ ...claimForm, village: e.target.value })}
                      className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-emerald-400 font-semibold mb-1">District</label>
                    <input
                      type="text"
                      placeholder="e.g. Davangere"
                      value={claimForm.district}
                      onChange={e => setClaimForm({ ...claimForm, district: e.target.value })}
                      className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSubmitting ? 'Recording Official Intimation...' : 'Submit 72-Hour PMFBY Claim Dossier'}
                </button>
              </form>
            </div>

            {/* Claims History Tracker */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Active Intimations ({claims.length})
              </h3>

              <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
                {claims.map(claim => (
                  <div
                    key={claim.id}
                    className="bg-[#0a1e13] border border-emerald-800/40 rounded-2xl p-4 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-rose-400">{claim.claimRef}</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                        72h Logged
                      </span>
                    </div>

                    <div className="font-bold text-white">{claim.crop} • {claim.farmerName}</div>
                    <div className="text-emerald-300">
                      Disaster: <span className="text-rose-300 font-semibold">{claim.disasterType}</span>
                    </div>
                    <div className="text-emerald-200/70 font-mono">
                      Area: {claim.affectedAcres} ac · Est. Loss: {claim.estimatedLossPercent}% · Date: {claim.incidentDate}
                    </div>
                    <div className="text-[11px] text-emerald-400 bg-black/40 p-2 rounded-lg border border-emerald-900/60">
                      Status: <b>{claim.status}</b>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Perishable Shelf Life & Cold Storage Locator */}
      {activeSubTab === 'coldstorage' && (
        <div className="space-y-6">
          {/* Spoilage Risk Gauge based on Ambient Temp */}
          <div className="bg-[#0b2416] border border-emerald-800/40 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-900/40 pb-3">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <ThermometerSnowflake className="w-4 h-4 text-cyan-400" />
                  Perishable Shelf-Life Spoilage Risk Calculator
                </h3>
                <p className="text-xs text-emerald-300/80 mt-0.5">
                  Ambient temperature accelerates bacterial rot and enzymatic degradation. See cold chain extension:
                </p>
              </div>
              <div className="text-xs font-mono bg-black/40 px-3 py-1.5 rounded-xl border border-emerald-800 text-emerald-400">
                Current Field Temperature: <b>{currentTemp}°C</b>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERISHABLE_SHELF_LIFE.map((item, i) => (
                <div key={i} className="bg-black/30 border border-emerald-900/40 rounded-xl p-4 text-xs space-y-2">
                  <div className="font-bold text-white text-sm">{item.crop}</div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="bg-rose-950/30 border border-rose-800/40 p-2 rounded-lg">
                      <div className="text-rose-400 font-semibold">At Ambient ({item.currentAmbientTemp}):</div>
                      <div className="text-rose-200 mt-0.5">{item.ambientSafeDays}</div>
                    </div>
                    <div className="bg-cyan-950/30 border border-cyan-800/40 p-2 rounded-lg">
                      <div className="text-cyan-400 font-semibold">In Cold Storage ({item.coldStorageTemp}):</div>
                      <div className="text-cyan-200 mt-0.5">{item.coldStorageSafeDays}</div>
                    </div>
                  </div>
                  <p className="text-emerald-300/80 italic text-[11px] pt-1">
                    Advice: {item.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Cold Storage Directory */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-cyan-400" />
              Verified Climate-Controlled Cold Storages & Warehouses ({coldStorages.length})
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coldStorages.map(cs => (
                <div
                  key={cs.id}
                  className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm text-white">{cs.name}</h4>
                      {cs.enwrRegistered && (
                        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full font-semibold shrink-0">
                          e-NWR Loan Eligible
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-emerald-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{cs.district}, {cs.state} • {cs.distanceKm} km from APMC</span>
                    </div>

                    <div className="text-xs text-emerald-200/80">
                      Temperature: <b className="text-cyan-300">{cs.temperatureRange}</b>
                    </div>

                    <div className="flex flex-wrap gap-1 text-[10px]">
                      {cs.suitableCrops.map((c, idx) => (
                        <span key={idx} className="bg-black/40 border border-emerald-800 px-2 py-0.5 rounded text-emerald-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-emerald-900/40 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-emerald-400">Monthly Storage Fee</div>
                      <div className="font-mono font-bold text-white text-base">
                        ₹{cs.monthlyRatePerQuintal} <span className="text-xs font-normal text-emerald-300">/quintal</span>
                      </div>
                      <div className="text-[10px] text-emerald-300/70 font-mono">
                        Available: {cs.availableCapacityMT} MT of {cs.capacityMT} MT
                      </div>
                    </div>

                    <a
                      href={`tel:${cs.phone}`}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs transition shadow"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Contact Depot</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
