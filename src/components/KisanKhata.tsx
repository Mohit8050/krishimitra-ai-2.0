import React, { useState, useEffect } from 'react';
import {
  Coins,
  PlusCircle,
  Trash2,
  TrendingUp,
  AlertTriangle,
  Scale,
  Calendar,
  Layers,
  CheckCircle2,
  PieChart,
  ArrowDownRight,
  ArrowUpRight,
  X
} from 'lucide-react';

export interface KhataEntry {
  id: string;
  cropName: string;
  season: string;
  category: 'Land Preparation & Tractor' | 'Seeds & Nursery' | 'Fertilizer & Nutrition' | 'Pesticides & Spraying' | 'Labor & Weeding' | 'Irrigation & Electricity' | 'Harvesting & Threshing' | 'Transport & Mandi Cess';
  description: string;
  amount: number;
  date: string;
  paymentMode: 'Cash' | 'UPI' | 'Kisan Credit Card (KCC)' | 'Dealer Credit';
}

const CATEGORIES = [
  'Land Preparation & Tractor',
  'Seeds & Nursery',
  'Fertilizer & Nutrition',
  'Pesticides & Spraying',
  'Labor & Weeding',
  'Irrigation & Electricity',
  'Harvesting & Threshing',
  'Transport & Mandi Cess'
] as const;

export function KisanKhata({ currentMandiPrice = 3850 }: { currentMandiPrice?: number }) {
  const [entries, setEntries] = useState<KhataEntry[]>([]);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Harvest yield & break-even calculation
  const [cropName, setCropName] = useState('Basmati Rice (Pusa 1121)');
  const [season, setSeason] = useState('Kharif 2026');
  const [acres, setAcres] = useState(2.5);
  const [expectedYieldQtl, setExpectedYieldQtl] = useState(55); // in quintals
  const [marketSellingRate, setMarketSellingRate] = useState(currentMandiPrice);

  // Add Expense Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    cropName: 'Basmati Rice (Pusa 1121)',
    season: 'Kharif 2026',
    category: 'Fertilizer & Nutrition' as typeof CATEGORIES[number],
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMode: 'UPI' as const
  });

  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('km_auth_token');
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchKhata = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/khata', {
        headers: getAuthHeaders()
      });
      const data = await res.json();
      setEntries(data.entries || []);
      setTotalExpenditure(data.totalExpenditure || 0);
      setCategoryTotals(data.categoryTotals || {});
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKhata();
  }, []);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAmt = parseFloat(newExpense.amount);
    if (isNaN(cleanAmt) || cleanAmt <= 0) {
      alert('Please enter a valid positive expense amount (₹).');
      return;
    }
    if (!newExpense.description.trim()) {
      alert('Please enter an expense description.');
      return;
    }

    try {
      const res = await fetch('/api/khata', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...newExpense,
          amount: cleanAmt
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowAddModal(false);
        setNewExpense({
          cropName: 'Basmati Rice (Pusa 1121)',
          season: 'Kharif 2026',
          category: 'Fertilizer & Nutrition',
          description: '',
          amount: '',
          date: new Date().toISOString().split('T')[0],
          paymentMode: 'UPI'
        });
        fetchKhata();
      } else {
        alert(data.error || 'Failed to record expense.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to farm ledger server.');
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to remove this expense entry?')) return;
    try {
      const res = await fetch(`/api/khata/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        alert(data.error || 'Cannot delete this expense.');
        return;
      }
      fetchKhata();
    } catch (e) {
      console.error(e);
      alert('Network error while deleting entry.');
    }
  };

  // Safe economics metrics with non-negative guard
  const safeAcres = Math.max(0.1, acres);
  const safeYield = Math.max(0.1, expectedYieldQtl);
  const safeRate = Math.max(0, marketSellingRate);

  const costPerAcre = Math.round(totalExpenditure / safeAcres);
  const breakEvenCostPerQuintal = Math.round(totalExpenditure / safeYield);
  const expectedGrossRevenue = Math.round(safeYield * safeRate);
  const netProfit = expectedGrossRevenue - totalExpenditure;
  const profitMarginPercent = totalExpenditure > 0 ? Math.round((netProfit / totalExpenditure) * 100) : 0;
  const isProfitable = netProfit >= 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-emerald-900/40 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            <Coins className="w-3.5 h-3.5" />
            <span>Digital Farm Ledger & Break-Even Intelligence</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Kisan Khata — Cultivation Cost & Profit/Loss Ledger
          </h2>
          <p className="text-xs text-emerald-300/80 mt-1 max-w-2xl">
            Solves blind pricing at the mandi. Logs all input, labor, diesel, and machinery costs, compares your cost per quintal against current mandi rates, and reveals your real net margin.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Farm Expense</span>
        </button>
      </div>

      {/* Economics Summary Matrix */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Cost */}
        <div className="bg-[#0b2416] border border-emerald-800/50 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Total Cultivation Cost
          </div>
          <div className="text-3xl font-extrabold font-mono text-white mt-1">
            ₹{totalExpenditure.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1 font-mono">
            ₹{costPerAcre.toLocaleString('en-IN')} / acre ({acres} acres)
          </div>
        </div>

        {/* Break-Even Rate */}
        <div className="bg-[#0b2416] border border-emerald-800/50 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Break-Even Cost / Quintal
          </div>
          <div className="text-3xl font-extrabold font-mono text-cyan-300 mt-1">
            ₹{breakEvenCostPerQuintal.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1 font-mono">
            Based on {expectedYieldQtl} Q harvest
          </div>
        </div>

        {/* Current Mandi Rate */}
        <div className="bg-[#0b2416] border border-emerald-800/50 rounded-2xl p-4">
          <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
            Current Mandi Rate
          </div>
          <div className="text-3xl font-extrabold font-mono text-amber-300 mt-1">
            ₹{marketSellingRate.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1">
            {marketSellingRate > breakEvenCostPerQuintal ? (
              <span className="text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +₹{marketSellingRate - breakEvenCostPerQuintal}/Q above cost
              </span>
            ) : (
              <span className="text-rose-400 flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> -₹{breakEvenCostPerQuintal - marketSellingRate}/Q below cost
              </span>
            )}
          </div>
        </div>

        {/* Net Profit & Margin */}
        <div className={`border rounded-2xl p-4 ${
          isProfitable ? 'bg-emerald-950/40 border-emerald-500/40' : 'bg-rose-950/40 border-rose-500/40'
        }`}>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
            Estimated Net Return
          </div>
          <div className={`text-3xl font-extrabold font-mono mt-1 ${isProfitable ? 'text-emerald-300' : 'text-rose-300'}`}>
            {isProfitable ? '+' : ''}₹{netProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-200/80 mt-1 font-mono">
            Margin: {profitMarginPercent}% • Gross: ₹{expectedGrossRevenue.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Yield & Mandi Target Controller Bar */}
      <div className="bg-[#0a1e13] border border-emerald-800/40 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">Current Crop:</span>
          <span className="text-emerald-300 bg-black/40 px-3 py-1 rounded-lg border border-emerald-900/60 font-mono">
            {cropName} ({season})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-emerald-400 font-semibold">Total Acres:</label>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={acres}
              onChange={e => setAcres(parseFloat(e.target.value) || 1)}
              className="w-16 bg-black/50 border border-emerald-800/60 rounded-lg px-2 py-1 text-white font-mono text-center"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-emerald-400 font-semibold">Harvest Yield (Qtl):</label>
            <input
              type="number"
              min="1"
              value={expectedYieldQtl}
              onChange={e => setExpectedYieldQtl(parseFloat(e.target.value) || 1)}
              className="w-20 bg-black/50 border border-emerald-800/60 rounded-lg px-2 py-1 text-white font-mono text-center"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-emerald-400 font-semibold">Mandi Sale Price (₹/Q):</label>
            <input
              type="number"
              min="100"
              value={marketSellingRate}
              onChange={e => setMarketSellingRate(parseFloat(e.target.value) || 0)}
              className="w-24 bg-black/50 border border-emerald-800/60 rounded-lg px-2 py-1 text-white font-mono text-center"
            />
          </div>
        </div>
      </div>

      {/* Category Cost Breakdown Bars */}
      <div className="bg-[#0b2416] border border-emerald-800/40 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <PieChart className="w-4 h-4 text-emerald-400" />
            Cost Breakdown by Production Stage
          </h3>
          <span className="text-xs text-emerald-300/80 font-mono">
            {entries.length} expenses logged
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {CATEGORIES.map((cat, i) => {
            const amount = categoryTotals[cat] || 0;
            const percent = totalExpenditure > 0 ? Math.round((amount / totalExpenditure) * 100) : 0;
            return (
              <div key={i} className="bg-black/30 border border-emerald-900/40 rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span className="text-emerald-200">{cat}</span>
                  <span className="font-mono font-bold text-white">₹{amount.toLocaleString('en-IN')} ({percent}%)</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expense History Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            Itemized Expense Register
          </h3>
        </div>

        {entries.length === 0 ? (
          <div className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl p-8 text-center text-xs text-emerald-400/80">
            No expenses logged yet. Click &quot;Log Farm Expense&quot; to begin tracking your cultivation costs!
          </div>
        ) : (
          <div className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-black/40 border-b border-emerald-900/40 text-emerald-400 uppercase text-[11px] font-semibold">
                  <tr>
                    <th className="p-3.5 pl-5">Date</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Description</th>
                    <th className="p-3.5">Payment Mode</th>
                    <th className="p-3.5 text-right font-mono">Amount (₹)</th>
                    <th className="p-3.5 pr-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-900/30 font-medium">
                  {entries.map(entry => (
                    <tr key={entry.id} className="hover:bg-emerald-950/20 transition">
                      <td className="p-3.5 pl-5 text-emerald-300 font-mono">{entry.date}</td>
                      <td className="p-3.5 text-white font-semibold">{entry.category}</td>
                      <td className="p-3.5 text-emerald-200/80">{entry.description}</td>
                      <td className="p-3.5">
                        <span className="text-[11px] bg-black/40 border border-emerald-800/60 px-2 py-0.5 rounded text-emerald-300 font-mono">
                          {entry.paymentMode}
                        </span>
                      </td>
                      <td className="p-3.5 text-right font-mono font-bold text-white">
                        ₹{entry.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5 pr-5 text-center">
                        <button
                          onClick={() => handleDeleteExpense(entry.id)}
                          className="p-1.5 text-rose-400 hover:bg-rose-950/40 rounded-lg transition"
                          title="Delete entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b2416] border border-emerald-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-emerald-400" />
                Log Cultivation Expense
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-emerald-900/40 text-emerald-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="block text-emerald-400 font-semibold mb-1">Expense Category</label>
                <select
                  value={newExpense.category}
                  onChange={e => setNewExpense({ ...newExpense, category: e.target.value as any })}
                  className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c} className="bg-slate-900">{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-emerald-400 font-semibold mb-1">Description / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 2 bags DAP + 1 bag MOP from IFFCO dealer"
                  value={newExpense.description}
                  onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 3500"
                    value={newExpense.amount}
                    onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Payment Mode</label>
                  <select
                    value={newExpense.paymentMode}
                    onChange={e => setNewExpense({ ...newExpense, paymentMode: e.target.value as any })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI / Net Banking</option>
                    <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC)</option>
                    <option value="Dealer Credit">Dealer Credit / Udhaar</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-emerald-400 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-black/40 border border-emerald-800 text-emerald-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold shadow-md hover:from-emerald-400 hover:to-green-400"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
