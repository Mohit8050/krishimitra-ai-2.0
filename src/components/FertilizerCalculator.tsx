import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Save,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Layers,
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface CropFertilizerProfile {
  name: string;
  hindiName: string;
  n: number; // kg pure N per acre
  p: number; // kg pure P2O5 per acre
  k: number; // kg pure K2O per acre
  zincKg: number;
  expectedYieldQtl: number;
  splitSchedule: {
    stage: string;
    timing: string;
    ureaPercent: number;
    dapPercent: number;
    mopPercent: number;
    micronutrients: string;
    advice: string;
  }[];
}

const CROP_PROFILES: Record<string, CropFertilizerProfile> = {
  paddy: {
    name: 'Basmati / Sona Masuri Rice',
    hindiName: 'धान (बासमती / सोना मसूरी)',
    n: 45,
    p: 20,
    k: 20,
    zincKg: 10,
    expectedYieldQtl: 24,
    splitSchedule: [
      {
        stage: 'Basal Dose (At Transplanting)',
        timing: 'Day 0 to Day 3',
        ureaPercent: 25,
        dapPercent: 100,
        mopPercent: 50,
        micronutrients: 'Zinc Sulfate 21% @ 10 kg/acre (Do NOT mix directly with DAP)',
        advice: 'Puddle soil well. Apply all DAP and 50% Potash at final leveling before transplanting.'
      },
      {
        stage: 'Active Tillering Top Dress',
        timing: '20 - 25 Days After Sowing (DAS)',
        ureaPercent: 50,
        dapPercent: 0,
        mopPercent: 0,
        micronutrients: 'Neem-coated Urea broadcasting in shallow 2cm water depth',
        advice: 'Maintain thin water layer. Drain excess water before broadcasting to prevent runoff.'
      },
      {
        stage: 'Panicle Initiation Stage',
        timing: '40 - 45 Days After Sowing (DAS)',
        ureaPercent: 25,
        dapPercent: 0,
        mopPercent: 50,
        micronutrients: '00:52:34 Foliar Spray @ 1 kg/100L water if flag leaf shows pale tips',
        advice: 'Final nitrogen dose ensures bold grain filling and prevents lodging.'
      }
    ]
  },
  wheat: {
    name: 'Sharbati Milling Wheat',
    hindiName: 'गेहूं (शरबती / कल्याण सोना)',
    n: 50,
    p: 25,
    k: 16,
    zincKg: 10,
    expectedYieldQtl: 22,
    splitSchedule: [
      {
        stage: 'Basal Dose (Sowing Time)',
        timing: 'Sowing Day',
        ureaPercent: 33,
        dapPercent: 100,
        mopPercent: 100,
        micronutrients: 'Zinc Sulfate 21% @ 10 kg/acre drilled below seed level',
        advice: 'Drill fertilizer 4-5 cm below seed to promote deep root anchoring.'
      },
      {
        stage: 'First Irrigation (Crown Root CRI)',
        timing: '20 - 25 DAS',
        ureaPercent: 33,
        dapPercent: 0,
        mopPercent: 0,
        micronutrients: 'Broadcast Urea just before first light irrigation',
        advice: 'Most critical stage; never delay first watering and nitrogen application.'
      },
      {
        stage: 'Jointing / Booting Stage',
        timing: '45 - 50 DAS',
        ureaPercent: 34,
        dapPercent: 0,
        mopPercent: 0,
        micronutrients: 'Foliar spray of 13:00:45 (Potassium Nitrate) @ 1.5 kg/acre',
        advice: 'Top dress remaining nitrogen before booting to enhance spikelet count.'
      }
    ]
  },
  cotton: {
    name: 'Bt Cotton (Medium / Long Staple)',
    hindiName: 'बीटी कपास',
    n: 60,
    p: 30,
    k: 30,
    zincKg: 10,
    expectedYieldQtl: 14,
    splitSchedule: [
      {
        stage: 'Basal Dose at Sowing',
        timing: 'Day of Dibbling',
        ureaPercent: 20,
        dapPercent: 100,
        mopPercent: 50,
        micronutrients: 'Magnesium Sulfate @ 10 kg/acre + Zinc Sulfate @ 10 kg/acre',
        advice: 'Ring placement 7 cm away from seed spot to avoid seedling burn.'
      },
      {
        stage: 'Square Formation Stage',
        timing: '35 - 45 DAS',
        ureaPercent: 40,
        dapPercent: 0,
        mopPercent: 25,
        micronutrients: 'Boron 20% foliar spray @ 1 g/L for square retention',
        advice: 'Soil must have good moisture before broadcasting.'
      },
      {
        stage: 'Peak Flowering & Boll Development',
        timing: '60 - 75 DAS',
        ureaPercent: 40,
        dapPercent: 0,
        mopPercent: 25,
        micronutrients: '13:00:45 @ 10 g/L foliar spray to prevent reddening of leaves',
        advice: 'Supports heavy boll weight and prevents premature boll shedding.'
      }
    ]
  },
  maize: {
    name: 'Hybrid Yellow Maize',
    hindiName: 'संकर पीला मक्का',
    n: 50,
    p: 25,
    k: 20,
    zincKg: 10,
    expectedYieldQtl: 30,
    splitSchedule: [
      {
        stage: 'Basal Application',
        timing: 'At Sowing',
        ureaPercent: 25,
        dapPercent: 100,
        mopPercent: 100,
        micronutrients: 'Zinc Sulfate 21% @ 10 kg/acre',
        advice: 'Maize is highly sensitive to zinc deficiency (White bud disease).'
      },
      {
        stage: 'Knee-High Stage',
        timing: '25 - 30 DAS',
        ureaPercent: 50,
        dapPercent: 0,
        mopPercent: 0,
        micronutrients: 'Side-dress Urea along row lines and earth-up ridges',
        advice: 'Earthing up prevents stem lodging and covers fertilizer.'
      },
      {
        stage: 'Tasseling & Silking Stage',
        timing: '45 - 55 DAS',
        ureaPercent: 25,
        dapPercent: 0,
        mopPercent: 0,
        micronutrients: 'Foliar micronutrient mixture (Grade II)',
        advice: 'Crucial for grain setting along the entire cob length.'
      }
    ]
  },
  tomato: {
    name: 'Red Hybrid Tomato',
    hindiName: 'लाल संकर टमाटर',
    n: 65,
    p: 40,
    k: 45,
    zincKg: 8,
    expectedYieldQtl: 180,
    splitSchedule: [
      {
        stage: 'Basal Dose & Bed Preparation',
        timing: 'Pre-transplant',
        ureaPercent: 20,
        dapPercent: 100,
        mopPercent: 50,
        micronutrients: 'Calcium Nitrate @ 15 kg/acre (prevents Blossom End Rot)',
        advice: 'Mix into raised beds before laying drip irrigation and silver mulch.'
      },
      {
        stage: 'Vegetative Growth & Staking',
        timing: '20 - 25 DAT',
        ureaPercent: 40,
        dapPercent: 0,
        mopPercent: 25,
        micronutrients: '19:19:19 water-soluble fertigation @ 3 kg/acre weekly',
        advice: 'Stake plants firmly to avoid soil contact.'
      },
      {
        stage: 'Fruit Set & Continuous Picking',
        timing: '45 DAT onwards',
        ureaPercent: 40,
        dapPercent: 0,
        mopPercent: 25,
        micronutrients: 'Potassium Nitrate 13:00:45 + Boron 20% foliar spray',
        advice: 'Apply post each harvest picking to maintain continuous flowering flush.'
      }
    ]
  }
};

// Subsidized Official Indian MRP Rates
const UREA_BAG_PRICE = 266.5; // 45 kg bag
const DAP_BAG_PRICE = 1350; // 50 kg bag
const MOP_BAG_PRICE = 1700; // 50 kg bag
const ZINC_KG_PRICE = 45; // ₹ per kg

export interface SavedPlan {
  id: string;
  cropName: string;
  acreage: number;
  unit: string;
  targetYieldQtl: number;
  soilHealthLevel: string;
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

export function FertilizerCalculator() {
  const [selectedCropKey, setSelectedCropKey] = useState('paddy');
  const [acreage, setAcreage] = useState(2);
  const [unit, setUnit] = useState<'Acres' | 'Bighas' | 'Gunthas'>('Acres');
  const [soilHealth, setSoilHealth] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const crop = CROP_PROFILES[selectedCropKey] || CROP_PROFILES.paddy;

  // Convert acreage to standard acre basis
  let standardAcres = acreage;
  if (unit === 'Bighas') standardAcres = acreage * 0.4;
  if (unit === 'Gunthas') standardAcres = acreage * 0.025;

  // Soil adjustment factor
  let soilMultiplier = 1.0;
  if (soilHealth === 'Low') soilMultiplier = 1.2; // needs 20% more
  if (soilHealth === 'High') soilMultiplier = 0.85; // can save 15%

  // Raw nutrient calculations (kg)
  const totalN = Math.round(crop.n * standardAcres * soilMultiplier);
  const totalP = Math.round(crop.p * standardAcres * soilMultiplier);
  const totalK = Math.round(crop.k * standardAcres * soilMultiplier);
  const totalZinc = Math.round(crop.zincKg * standardAcres);

  // Commercial Bag conversion
  // DAP (50kg bag) provides: 18% N (9 kg N) and 46% P2O5 (23 kg P)
  const dapBags = Math.max(1, Math.ceil(totalP / 23));
  const nProvidedByDap = dapBags * 9;

  // Remaining N required via Urea (45kg bag provides 46% N = 20.7 kg N)
  const remN = Math.max(0, totalN - nProvidedByDap);
  const ureaBags = Math.max(1, Math.ceil(remN / 20.7));

  // MOP (50kg bag provides 60% K2O = 30 kg K)
  const mopBags = Math.max(1, Math.ceil(totalK / 30));

  // Estimated Government Subsidized Cost
  const totalCost = Math.round(
    ureaBags * UREA_BAG_PRICE +
    dapBags * DAP_BAG_PRICE +
    mopBags * MOP_BAG_PRICE +
    totalZinc * ZINC_KG_PRICE
  );

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('km_auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchSavedPlans = async () => {
    try {
      const res = await fetch('/api/fertilizer/plans', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setSavedPlans(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchSavedPlans();
  }, []);

  const handleSavePlan = async () => {
    if (acreage <= 0 || isNaN(acreage)) {
      alert('Please enter a valid positive land acreage.');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/fertilizer/plans', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          cropName: crop.name,
          acreage,
          unit,
          targetYieldQtl: Math.round(crop.expectedYieldQtl * standardAcres),
          soilHealthLevel: soilHealth,
          pureNkg: totalN,
          purePkg: totalP,
          pureKkg: totalK,
          ureaBags,
          dapBags,
          mopBags,
          zincSulfateKg: totalZinc,
          estimatedCost: totalCost
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg('Fertilizer schedule saved to your farm records!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
        fetchSavedPlans();
      } else {
        alert(data.error || 'Failed to save fertilizer plan.');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving plan to server.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (!confirm('Remove this saved schedule?')) return;
    try {
      const res = await fetch(`/api/fertilizer/plans/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        alert(data.error || 'Cannot delete this plan.');
        return;
      }
      fetchSavedPlans();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="border-b border-emerald-900/40 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>ICAR Scientific NPK Optimization</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Precision Fertilizer & Soil Nutrition Calculator
          </h2>
          <p className="text-xs text-emerald-300/80 mt-1 max-w-2xl">
            Stops over-application of Urea and burns. Generates exact commercial bag counts (Urea, DAP, MOP, Zinc) and 3-stage split application schedules based on your soil test level.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSavePlan}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Schedule'}</span>
          </button>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-900/40 border border-emerald-500/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Inputs Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0a1e13] border border-emerald-800/40 rounded-2xl p-5">
        {/* Crop Selection */}
        <div>
          <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Select Crop
          </label>
          <select
            value={selectedCropKey}
            onChange={e => setSelectedCropKey(e.target.value)}
            className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
          >
            {Object.entries(CROP_PROFILES).map(([key, c]) => (
              <option key={key} value={key} className="bg-slate-900">
                {c.name} ({c.hindiName})
              </option>
            ))}
          </select>
        </div>

        {/* Acreage & Unit */}
        <div>
          <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Farm Plot Size
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0.25"
              step="0.25"
              value={acreage}
              onChange={e => setAcreage(Math.max(0.1, parseFloat(e.target.value) || 0))}
              className="w-1/2 bg-black/50 border border-emerald-800/60 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
            />
            <select
              value={unit}
              onChange={e => setUnit(e.target.value as any)}
              className="w-1/2 bg-black/50 border border-emerald-800/60 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="Acres">Acres</option>
              <option value="Bighas">Bighas (0.4 ac)</option>
              <option value="Gunthas">Gunthas (0.025 ac)</option>
            </select>
          </div>
        </div>

        {/* Soil Health Status */}
        <div>
          <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
            Soil Health Card Level
          </label>
          <select
            value={soilHealth}
            onChange={e => setSoilHealth(e.target.value as any)}
            className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
          >
            <option value="Low">Low NPK Fertility (+20% dosage correction)</option>
            <option value="Medium">Medium Fertility (Standard ICAR dose)</option>
            <option value="High">High Organic Carbon / Fertile (-15% dose saving)</option>
          </select>
        </div>
      </div>

      {/* Bag Requirement Result Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Urea */}
        <div className="bg-[#0b2416] border border-emerald-800/50 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Neem-Coated Urea (46% N)
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            {ureaBags} <span className="text-sm font-normal text-emerald-300">Bags</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 font-mono">
            45kg bag @ ₹266.50 = ₹{Math.round(ureaBags * UREA_BAG_PRICE)}
          </div>
        </div>

        {/* DAP */}
        <div className="bg-[#0b2416] border border-emerald-800/50 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            DAP (18-46-0)
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-300 mt-1">
            {dapBags} <span className="text-sm font-normal text-cyan-200">Bags</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 font-mono">
            50kg bag @ ₹1,350 = ₹{Math.round(dapBags * DAP_BAG_PRICE)}
          </div>
        </div>

        {/* MOP (Potash) */}
        <div className="bg-[#0b2416] border border-emerald-800/50 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Muriate of Potash (60% K2O)
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-300 mt-1">
            {mopBags} <span className="text-sm font-normal text-amber-200">Bags</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 mt-1 font-mono">
            50kg bag @ ₹1,700 = ₹{Math.round(mopBags * MOP_BAG_PRICE)}
          </div>
        </div>

        {/* Total Cost & Zinc */}
        <div className="bg-[#0b2416] border border-emerald-800/50 rounded-2xl p-4 text-center">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Total Subsidized Outlay
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
            ₹{totalCost.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1">
            Includes {totalZinc} kg Zinc Sulfate 21%
          </div>
        </div>
      </div>

      {/* Pure Nutrient Summary Bar */}
      <div className="bg-black/30 border border-emerald-900/40 rounded-xl p-3 px-5 flex flex-wrap items-center justify-between text-xs text-emerald-300">
        <div>
          Pure NPK Requirement for <b className="text-white">{acreage} {unit}</b>:
        </div>
        <div className="flex gap-6 font-mono font-bold">
          <span>Nitrogen (N): <span className="text-white">{totalN} kg</span></span>
          <span>Phosphorus (P2O5): <span className="text-cyan-300">{totalP} kg</span></span>
          <span>Potash (K2O): <span className="text-amber-300">{totalK} kg</span></span>
          <span>Zinc: <span className="text-emerald-400">{totalZinc} kg</span></span>
        </div>
      </div>

      {/* 3-Stage Split Application Schedule */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          Recommended 3-Stage Split Application Timeline
        </h3>

        <div className="space-y-3">
          {crop.splitSchedule.map((stage, i) => (
            <div
              key={i}
              className="bg-[#0a1e13] border border-emerald-800/40 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                  <span className="font-bold text-sm text-white">{stage.stage}</span>
                  <span className="text-[11px] bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded text-emerald-300 font-mono">
                    {stage.timing}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/80 pl-8">{stage.advice}</p>
                <div className="text-[11px] text-emerald-400 pl-8 font-medium">
                  {stage.micronutrients}
                </div>
              </div>

              {/* Quantities for this stage */}
              <div className="flex gap-2 pl-8 md:pl-0 shrink-0">
                {stage.ureaPercent > 0 && (
                  <div className="bg-black/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg text-center min-w-[70px]">
                    <div className="text-[10px] text-emerald-400">Urea</div>
                    <div className="font-mono text-xs font-bold text-white">
                      {(ureaBags * (stage.ureaPercent / 100)).toFixed(1)} bag
                    </div>
                  </div>
                )}
                {stage.dapPercent > 0 && (
                  <div className="bg-black/40 border border-cyan-800/40 px-3 py-1.5 rounded-lg text-center min-w-[70px]">
                    <div className="text-[10px] text-cyan-300">DAP</div>
                    <div className="font-mono text-xs font-bold text-cyan-200">
                      {(dapBags * (stage.dapPercent / 100)).toFixed(1)} bag
                    </div>
                  </div>
                )}
                {stage.mopPercent > 0 && (
                  <div className="bg-black/40 border border-amber-800/40 px-3 py-1.5 rounded-lg text-center min-w-[70px]">
                    <div className="text-[10px] text-amber-300">MOP</div>
                    <div className="font-mono text-xs font-bold text-amber-200">
                      {(mopBags * (stage.mopPercent / 100)).toFixed(1)} bag
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Schedules History */}
      {savedPlans.length > 0 && (
        <div className="pt-4 border-t border-emerald-900/40 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Your Saved Fertilizer Schedules ({savedPlans.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedPlans.map(plan => (
              <div
                key={plan.id}
                className="bg-[#0b2416] border border-emerald-900/40 rounded-xl p-4 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">{plan.cropName}</div>
                  <div className="text-emerald-400 mt-0.5">
                    {plan.acreage} {plan.unit} • Soil: {plan.soilHealthLevel}
                  </div>
                  <div className="text-emerald-200/70 mt-1 font-mono">
                    Urea: {plan.ureaBags}b · DAP: {plan.dapBags}b · MOP: {plan.mopBags}b · Est: ₹{plan.estimatedCost}
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="p-2 text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                  title="Delete schedule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
