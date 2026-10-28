import React, { useState, useEffect } from 'react';
import {
  Tractor,
  Calendar,
  PhoneCall,
  MapPin,
  CheckCircle,
  PlusCircle,
  Clock,
  Gauge,
  X,
  Filter
} from 'lucide-react';

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
  rateAmount: number;
  operatorIncluded: boolean;
  fuelIncluded: boolean;
  imageUrl: string;
  available: boolean;
}

export interface MachineryBooking {
  id: string;
  machineryId: string;
  machineryName: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  bookingDate: string;
  unitsRequired: number;
  totalEstimatedCost: number;
  status: string;
  createdAt: string;
}

export function MachineryRental() {
  const [machinery, setMachinery] = useState<MachineryListing[]>([]);
  const [bookings, setBookings] = useState<MachineryBooking[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [activeTab, setActiveTab] = useState<'catalog' | 'myBookings'>('catalog');

  // Booking Modal
  const [selectedMachine, setSelectedMachine] = useState<MachineryListing | null>(null);
  const [bookingForm, setBookingForm] = useState({
    farmerName: '',
    farmerPhone: '',
    village: '',
    bookingDate: new Date().toISOString().split('T')[0],
    unitsRequired: 2
  });

  // Add Machinery Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMachinery, setNewMachinery] = useState({
    name: '',
    category: 'Tractor',
    hpOrCapacity: '',
    ownerName: '',
    phone: '',
    location: '',
    state: 'Karnataka',
    rateType: 'hourly',
    rateAmount: '',
    operatorIncluded: true,
    fuelIncluded: false,
    imageUrl: ''
  });

  const fetchMachinery = async () => {
    try {
      let url = '/api/machinery?';
      if (selectedCategory !== 'All') url += `category=${encodeURIComponent(selectedCategory)}&`;
      if (selectedState !== 'All') url += `state=${encodeURIComponent(selectedState)}&`;
      const res = await fetch(url);
      const data = await res.json();
      setMachinery(data.machinery || []);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/machinery/bookings');
      const data = await res.json();
      setBookings(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMachinery();
    fetchBookings();
  }, [selectedCategory, selectedState]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;
    if (!bookingForm.farmerName || !bookingForm.farmerPhone) {
      alert('Please enter your Name and Mobile Number');
      return;
    }

    const totalCost = selectedMachine.rateAmount * bookingForm.unitsRequired;

    try {
      const res = await fetch('/api/machinery/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          machineryId: selectedMachine.id,
          machineryName: selectedMachine.name,
          farmerName: bookingForm.farmerName,
          farmerPhone: bookingForm.farmerPhone,
          village: bookingForm.village,
          bookingDate: bookingForm.bookingDate,
          unitsRequired: bookingForm.unitsRequired,
          totalEstimatedCost: totalCost
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🚜 Booking logged for ${selectedMachine.name}! The owner (${selectedMachine.ownerName} - ${selectedMachine.phone}) has received your request.`);
        setSelectedMachine(null);
        fetchBookings();
        setActiveTab('myBookings');
      }
    } catch (e) {
      console.error(e);
      alert('Error submitting booking');
    }
  };

  const handleAddMachinery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachinery.name || !newMachinery.ownerName || !newMachinery.phone || !newMachinery.rateAmount) {
      alert('Please fill all required machinery fields');
      return;
    }

    try {
      const res = await fetch('/api/machinery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMachinery)
      });
      const data = await res.json();
      if (data.success) {
        alert('🎉 Equipment listed in Custom Hiring Center!');
        setShowAddModal(false);
        setNewMachinery({
          name: '',
          category: 'Tractor',
          hpOrCapacity: '',
          ownerName: '',
          phone: '',
          location: '',
          state: 'Karnataka',
          rateType: 'hourly',
          rateAmount: '',
          operatorIncluded: true,
          fuelIncluded: false,
          imageUrl: ''
        });
        fetchMachinery();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-emerald-900/40 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-2">
            <Tractor className="w-3.5 h-3.5" />
            <span>Custom Hiring Center (CHC) • Peer-to-Peer Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Farm Machinery & Drone Sprayer Sharing
          </h2>
          <p className="text-xs text-emerald-300/80 mt-1 max-w-2xl">
            Solves high machinery capital costs. Rent tractors, rotavators, combine harvesters, laser levelers, and agriculture spray drones with verified local operators on hourly or per-acre basis.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List My Machinery</span>
          </button>
        </div>
      </div>

      {/* Sub-nav Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'catalog'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-[#0a1e13] border border-emerald-800 text-emerald-300 hover:text-white'
            }`}
          >
            Available Equipment ({machinery.length})
          </button>
          <button
            onClick={() => setActiveTab('myBookings')}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'myBookings'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-[#0a1e13] border border-emerald-800 text-emerald-300 hover:text-white'
            }`}
          >
            My Rental Bookings ({bookings.length})
          </button>
        </div>

        {activeTab === 'catalog' && (
          <div className="flex gap-2 text-xs">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="All">All Categories</option>
              <option value="Tractor">Tractors</option>
              <option value="Rotavator">Rotavators</option>
              <option value="Harvester">Combine Harvesters</option>
              <option value="Drone Sprayer">Drone Sprayers</option>
              <option value="Laser Leveler">Laser Levelers</option>
            </select>

            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-emerald-400"
            >
              <option value="All">All States</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Haryana">Haryana</option>
            </select>
          </div>
        )}
      </div>

      {/* Machinery Catalog View */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {machinery.map(item => (
            <div
              key={item.id}
              className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-emerald-500/50 transition group"
            >
              <div className="relative h-44 bg-slate-900 overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  onError={e => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                  {item.category}
                </div>
                <div className="absolute top-3 right-3 bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] shadow">
                  {item.hpOrCapacity}
                </div>
              </div>

              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">{item.name}</h3>
                  <div className="text-xs text-emerald-400/90 mt-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{item.location}, {item.state}</span>
                  </div>

                  {/* Inclusion Badges */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5 text-[10px]">
                    <span className={`px-2 py-0.5 rounded border ${
                      item.operatorIncluded ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {item.operatorIncluded ? '✓ Operator Included' : 'Self-Drive / No Operator'}
                    </span>
                    <span className={`px-2 py-0.5 rounded border ${
                      item.fuelIncluded ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}>
                      {item.fuelIncluded ? '✓ Diesel Included' : 'Diesel by Farmer'}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-emerald-900/40 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-emerald-400 uppercase font-semibold">Rental Rate</div>
                    <div className="text-lg font-bold font-mono text-white">
                      ₹{item.rateAmount}
                      <span className="text-xs font-normal text-emerald-300">
                        /{item.rateType === 'per_acre' ? 'acre' : 'hr'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <a
                      href={`tel:${item.phone}`}
                      className="p-2 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-xl hover:text-white transition"
                      title="Call Owner Directly"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => setSelectedMachine(item)}
                      className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold rounded-xl text-xs hover:from-emerald-400 hover:to-green-400 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bookings View */}
      {activeTab === 'myBookings' && (
        <div className="space-y-3">
          {bookings.length === 0 ? (
            <div className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl p-8 text-center text-xs text-emerald-400/80">
              No equipment bookings made yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map(b => (
                <div
                  key={b.id}
                  className="bg-[#0b2416] border border-emerald-900/40 rounded-2xl p-4 text-xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-white">{b.machineryName}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      {b.status}
                    </span>
                  </div>
                  <div className="text-emerald-300">
                    Farmer: <b>{b.farmerName}</b> ({b.farmerPhone}) • {b.village}
                  </div>
                  <div className="text-emerald-200/70 font-mono">
                    Date: {b.bookingDate} • Units: {b.unitsRequired} • Est. Total: ₹{b.totalEstimatedCost}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedMachine && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b2416] border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Tractor className="w-5 h-5 text-emerald-400" />
                Book {selectedMachine.name}
              </h3>
              <button
                onClick={() => setSelectedMachine(null)}
                className="p-1 rounded-lg hover:bg-emerald-900/40 text-emerald-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-4 text-xs">
              <div className="bg-black/30 border border-emerald-900/50 rounded-xl p-3 space-y-1">
                <div className="text-emerald-300 font-semibold">
                  Owner: {selectedMachine.ownerName} ({selectedMachine.phone})
                </div>
                <div className="font-mono text-emerald-400">
                  Rate: ₹{selectedMachine.rateAmount}/{selectedMachine.rateType === 'per_acre' ? 'acre' : 'hr'}
                </div>
              </div>

              <div>
                <label className="block text-emerald-400 font-semibold mb-1">Your Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patel"
                  value={bookingForm.farmerName}
                  onChange={e => setBookingForm({ ...bookingForm, farmerName: e.target.value })}
                  className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-emerald-400 font-semibold mb-1">Mobile Number</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={bookingForm.farmerPhone}
                  onChange={e => setBookingForm({ ...bookingForm, farmerPhone: e.target.value })}
                  className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-emerald-400 font-semibold mb-1">Farm Village / Landmark</label>
                <input
                  type="text"
                  placeholder="e.g. Hadadi Road, Near Gram Panchayat"
                  value={bookingForm.village}
                  onChange={e => setBookingForm({ ...bookingForm, village: e.target.value })}
                  className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Date Required</label>
                  <input
                    type="date"
                    value={bookingForm.bookingDate}
                    onChange={e => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">
                    Units ({selectedMachine.rateType === 'per_acre' ? 'Acres' : 'Hours'})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bookingForm.unitsRequired}
                    onChange={e => setBookingForm({ ...bookingForm, unitsRequired: Math.max(1, parseFloat(e.target.value) || 1) })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="p-3 bg-black/40 border border-emerald-800/60 rounded-xl flex justify-between items-center text-xs">
                <span className="text-emerald-300">Total Estimated Outlay:</span>
                <span className="text-lg font-bold font-mono text-emerald-400">
                  ₹{(selectedMachine.rateAmount * bookingForm.unitsRequired).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMachine(null)}
                  className="px-4 py-2 rounded-xl bg-black/40 border border-emerald-800 text-emerald-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold shadow-md hover:from-emerald-400 hover:to-green-400"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Machinery Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b2416] border border-emerald-500/40 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Tractor className="w-5 h-5 text-emerald-400" />
                List Equipment for Rent
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-emerald-900/40 text-emerald-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMachinery} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Equipment Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Swaraj 744 FE 48 HP"
                    value={newMachinery.name}
                    onChange={e => setNewMachinery({ ...newMachinery, name: e.target.value })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Category</label>
                  <select
                    value={newMachinery.category}
                    onChange={e => setNewMachinery({ ...newMachinery, category: e.target.value as any })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="Tractor">Tractor</option>
                    <option value="Rotavator">Rotavator</option>
                    <option value="Harvester">Harvester</option>
                    <option value="Drone Sprayer">Drone Sprayer</option>
                    <option value="Laser Leveler">Laser Leveler</option>
                    <option value="Seed Drill">Seed Drill</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">HP / Spec</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 HP 4WD"
                    value={newMachinery.hpOrCapacity}
                    onChange={e => setNewMachinery({ ...newMachinery, hpOrCapacity: e.target.value })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Rental Rate (₹)</label>
                  <input
                    type="number"
                    min="100"
                    placeholder="e.g. 700"
                    value={newMachinery.rateAmount}
                    onChange={e => setNewMachinery({ ...newMachinery, rateAmount: e.target.value })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Owner Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Shivanand Patil"
                    value={newMachinery.ownerName}
                    onChange={e => setNewMachinery({ ...newMachinery, ownerName: e.target.value })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={newMachinery.phone}
                    onChange={e => setNewMachinery({ ...newMachinery, phone: e.target.value })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Sindhanur Taluk"
                    value={newMachinery.location}
                    onChange={e => setNewMachinery({ ...newMachinery, location: e.target.value })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-emerald-400 font-semibold mb-1">Rate Basis</label>
                  <select
                    value={newMachinery.rateType}
                    onChange={e => setNewMachinery({ ...newMachinery, rateType: e.target.value as any })}
                    className="w-full bg-black/50 border border-emerald-800/60 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-400"
                  >
                    <option value="hourly">Hourly (₹/hour)</option>
                    <option value="per_acre">Per Acre (₹/acre)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMachinery.operatorIncluded}
                    onChange={e => setNewMachinery({ ...newMachinery, operatorIncluded: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span className="text-white">Operator Included</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMachinery.fuelIncluded}
                    onChange={e => setNewMachinery({ ...newMachinery, fuelIncluded: e.target.checked })}
                    className="rounded text-emerald-500"
                  />
                  <span className="text-white">Diesel Fuel Included</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-black/40 border border-emerald-800 text-emerald-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-slate-950 font-bold shadow-md hover:from-emerald-400 hover:to-green-400"
                >
                  Publish Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
