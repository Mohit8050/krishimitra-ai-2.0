import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Truck,
  ShieldCheck,
  Tag,
  Package,
  X,
  CreditCard,
  MapPin,
  Sparkles
} from 'lucide-react';
import { SafeUser } from '../App.tsx';

export interface BuyProduct {
  id: string;
  name: string;
  cat: 'Seeds' | 'Fertilizers' | 'Irrigation' | 'Tools';
  price: number;
  subsidyPrice?: number;
  rating: number;
  inStock: boolean;
  unit: string;
  badge?: string;
  img: string;
  desc: string;
}

export const STORE_PRODUCTS: BuyProduct[] = [
  {
    id: 'prod-1',
    name: 'Hybrid Rice Seeds (IR-64 Certified)',
    cat: 'Seeds',
    price: 240,
    subsidyPrice: 200,
    rating: 4.8,
    inStock: true,
    unit: '10 kg Bag',
    badge: 'Govt Certified',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&auto=format&fit=crop&q=80',
    desc: 'High germination purity (>98%), semi-dwarf, resistant to blast and bacterial leaf blight.'
  },
  {
    id: 'prod-2',
    name: 'HD-2967 High-Yield Wheat Seeds',
    cat: 'Seeds',
    price: 210,
    subsidyPrice: 180,
    rating: 4.7,
    inStock: true,
    unit: '10 kg Bag',
    badge: 'Top Seller',
    img: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&auto=format&fit=crop&q=80',
    desc: 'Rust-resistant bread wheat with excellent tillering capacity and high protein milling quality.'
  },
  {
    id: 'prod-3',
    name: 'Pioneer High-Yield Hybrid Maize',
    cat: 'Seeds',
    price: 260,
    subsidyPrice: 220,
    rating: 4.9,
    inStock: true,
    unit: '5 kg Pack',
    badge: 'Drought Hardy',
    img: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=500&auto=format&fit=crop&q=80',
    desc: 'Heavy cob weight, stay-green trait, excellent performance in Kharif and Rabi seasons.'
  },
  {
    id: 'prod-4',
    name: 'Organic Bio-Compost & Humus (50kg)',
    cat: 'Fertilizers',
    price: 420,
    subsidyPrice: 350,
    rating: 4.9,
    inStock: true,
    unit: '50 kg Bag',
    badge: '100% Organic',
    img: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&auto=format&fit=crop&q=80',
    desc: 'Enriched with beneficial mycorrhizae, boosts microbial activity and water holding capacity.'
  },
  {
    id: 'prod-5',
    name: 'Cold-Pressed Neem Cake Fertilizer',
    cat: 'Fertilizers',
    price: 340,
    subsidyPrice: 280,
    rating: 4.6,
    inStock: true,
    unit: '25 kg Bag',
    badge: 'Nematode Shield',
    img: 'https://images.unsplash.com/photo-1598887142487-8c2a0b7c0c6a?w=500&auto=format&fit=crop&q=80',
    desc: 'Dual-action slow release nitrogen fertilizer and natural soil pest repellent against white grubs.'
  },
  {
    id: 'prod-6',
    name: 'Water-Soluble NPK 19-19-19 Grade',
    cat: 'Fertilizers',
    price: 480,
    subsidyPrice: 420,
    rating: 4.8,
    inStock: true,
    unit: '5 kg Pouch',
    badge: 'Drip Ready',
    img: 'https://images.unsplash.com/photo-1615811361523-6c9f1c2f6f7a?w=500&auto=format&fit=crop&q=80',
    desc: '100% water-soluble balanced foliar spray formula for rapid vegetative crop growth.'
  },
  {
    id: 'prod-7',
    name: 'Electric Battery Sprayer Pump 16L',
    cat: 'Tools',
    price: 1500,
    subsidyPrice: 1200,
    rating: 4.8,
    inStock: true,
    unit: '1 Set (12V 12Ah)',
    badge: '20% Subsidy',
    img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=500&auto=format&fit=crop&q=80',
    desc: 'High-pressure brass lance with 4 interchangeable spray nozzles and 6-hour continuous battery.'
  },
  {
    id: 'prod-8',
    name: 'Drip Irrigation Starter Kit (1 Acre)',
    cat: 'Irrigation',
    price: 3200,
    subsidyPrice: 2500,
    rating: 4.9,
    inStock: true,
    unit: 'Complete Kit',
    badge: 'Water Saver',
    img: 'https://images.unsplash.com/photo-1587502536263-9298d2b2c2c2?w=500&auto=format&fit=crop&q=80',
    desc: 'Includes 16mm inline lateral pipe, pressure compensating drippers, screen filter, and joiners.'
  },
  {
    id: 'prod-9',
    name: 'Solar Powered Agricultural Pump 3HP',
    cat: 'Irrigation',
    price: 11000,
    subsidyPrice: 8500,
    rating: 4.9,
    inStock: true,
    unit: 'Solar Unit',
    badge: 'KUSUM Linked',
    img: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&auto=format&fit=crop&q=80',
    desc: 'Submersible stainless steel multi-stage DC pump with MPPT controller and surge bypass.'
  },
  {
    id: 'prod-10',
    name: 'Field Soil Testing Chemical Kit',
    cat: 'Tools',
    price: 850,
    subsidyPrice: 700,
    rating: 4.7,
    inStock: true,
    unit: '60 Tests Kit',
    badge: 'Accurate',
    img: 'https://images.unsplash.com/photo-1581090700227-4c4e0c6a6c6b?w=500&auto=format&fit=crop&q=80',
    desc: 'Quick diagnostic colorimeter reagent tests for Soil pH, Nitrogen, Phosphorus, and Potassium.'
  },
  {
    id: 'prod-11',
    name: 'Digital Soil pH & Moisture Meter',
    cat: 'Tools',
    price: 550,
    subsidyPrice: 450,
    rating: 4.6,
    inStock: true,
    unit: '1 Device',
    badge: 'No Battery Req',
    img: 'https://images.unsplash.com/photo-1581091870620-5c7f2d5f3c5c?w=500&auto=format&fit=crop&q=80',
    desc: 'Dual probe instant sensor to check root zone acidity (pH 3.5-8) and soil water levels.'
  },
  {
    id: 'prod-12',
    name: 'UV Stabilized Green Shade Net 50%',
    cat: 'Tools',
    price: 1150,
    subsidyPrice: 900,
    rating: 4.7,
    inStock: true,
    unit: '3m x 20m Roll',
    badge: 'UV Proof',
    img: 'https://images.unsplash.com/photo-1598515213692-5f0f7f1b6c1a?w=500&auto=format&fit=crop&q=80',
    desc: 'Protects nursery seedlings and horticulture veggies from scorching summer heatwaves.'
  },
  {
    id: 'prod-13',
    name: 'Automatic 360° Water Sprinkler',
    cat: 'Irrigation',
    price: 1800,
    subsidyPrice: 1500,
    rating: 4.8,
    inStock: true,
    unit: 'Set of 4',
    badge: 'High Throw',
    img: 'https://images.unsplash.com/photo-1587502536263-9298d2b2c2c2?w=500&auto=format&fit=crop&q=80',
    desc: 'Pulsating impact brass head with up to 14 meters radius coverage for groundnut & pulses.'
  },
  {
    id: 'prod-14',
    name: 'Trichoderma Viride Bio-Fungicide',
    cat: 'Fertilizers',
    price: 260,
    subsidyPrice: 210,
    rating: 4.9,
    inStock: true,
    unit: '1 kg Pouch',
    badge: 'Root Guard',
    img: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&auto=format&fit=crop&q=80',
    desc: 'Antagonistic biocontrol fungus that destroys Pythium, Fusarium wilt, and root rot pathogens.'
  }
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  img: string;
  cat?: string;
}

interface BuyFarmInputsProps {
  cart: CartItem[];
  onAddToCart: (prod: { id: string; name: string; price: number; img: string; cat?: string }) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onClearCart: () => void;
  onNavigateHome: () => void;
  currentUser?: SafeUser | null;
}

export function BuyFarmInputs({
  cart,
  onAddToCart,
  onUpdateQty,
  onClearCart,
  onNavigateHome,
  currentUser
}: BuyFarmInputsProps) {
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderId: string;
    total: number;
    itemsCount: number;
    deliveryName: string;
    village: string;
    pincode: string;
  } | null>(null);

  // Form state
  const [checkoutForm, setCheckoutForm] = useState({
    farmerName: currentUser?.fullName || '',
    phone: currentUser?.phone || '',
    village: currentUser?.village || '',
    district: currentUser?.district || 'Davangere',
    state: currentUser?.state || 'Karnataka',
    pincode: '577002',
    deliverySlot: 'Standard 48-Hour Subsidized Delivery'
  });

  useEffect(() => {
    if (currentUser) {
      setCheckoutForm(prev => ({
        ...prev,
        farmerName: currentUser.fullName || prev.farmerName,
        phone: currentUser.phone || prev.phone,
        village: currentUser.village || prev.village,
        district: currentUser.district || prev.district,
        state: currentUser.state || prev.state
      }));
    }
  }, [currentUser]);

  const categories = ['All', 'Seeds', 'Fertilizers', 'Irrigation', 'Tools'];

  const filteredProducts = STORE_PRODUCTS.filter(p => {
    const matchesCat = selectedCat === 'All' || p.cat === selectedCat;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  // Farmer State Subsidy: 15% discount on certified inputs
  const subsidySavings = Math.round(cartSubtotal * 0.15);
  const finalPayable = Math.max(0, cartSubtotal - subsidySavings);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.farmerName.trim() || !checkoutForm.phone.trim() || !checkoutForm.village.trim()) {
      alert('Please fill in Farmer Name, Phone Number, and Village!');
      return;
    }

    const generatedId = `KM-INP-${Date.now().toString().slice(-6)}`;
    setOrderSuccess({
      orderId: generatedId,
      total: finalPayable,
      itemsCount: cartItemsCount,
      deliveryName: checkoutForm.farmerName,
      village: `${checkoutForm.village}, ${checkoutForm.district}`,
      pincode: checkoutForm.pincode
    });

    onClearCart();
    setIsCheckoutOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header and Back Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-900/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛍️</span>
            <h2 className="text-2xl font-bold text-white">
              KrishiMitra Agro Store & Farm Inputs
            </h2>
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
              DBT Farm Subsidy Linked
            </span>
          </div>
          <p className="text-xs text-emerald-300/80 mt-1">
            Certified hybrid seeds, bio-fertilizers, solar pumps, and irrigation kits with doorstep village delivery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Farm Cart ({cartItemsCount})</span>
            {cartItemsCount > 0 && (
              <span className="bg-slate-950 text-amber-400 text-[10px] px-1.5 py-0.5 rounded-full font-mono">
                ₹{cartSubtotal}
              </span>
            )}
          </button>

          <button
            onClick={onNavigateHome}
            className="px-3.5 py-2.5 bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 rounded-xl text-xs hover:text-white flex items-center gap-1.5 font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Home
          </button>
        </div>
      </div>

      {/* Subsidy Highlight Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-teal-950/40 to-emerald-950/50 border border-emerald-600/40 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>National Food Security & RKVY Subsidized Catalogue</span>
              <span className="text-[10px] bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.2 rounded">
                15% OFF
              </span>
            </div>
            <p className="text-[11px] text-emerald-300/80">
              All seed batches certified by ICAR / State Seed Corporation with zero adulteration guarantee.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-emerald-300/90 shrink-0">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-amber-400" /> Doorstep Village Drop
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-emerald-400" /> Cash or DBT on Delivery
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#0a1f13] border border-emerald-900/40 p-3 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCat === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-black/30 border border-emerald-800/40 text-emerald-300 hover:text-white hover:bg-emerald-900/40'
              }`}
            >
              {cat === 'All' ? 'All Inputs' : cat}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-3 text-emerald-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search seeds, bio-fertilizers, sprinkler, drip pipes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/40 border border-emerald-800/50 text-white text-xs placeholder-emerald-600 focus:outline-none focus:border-emerald-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-emerald-500 hover:text-emerald-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Order Success Banner */}
      {orderSuccess && (
        <div className="bg-emerald-950/80 border-2 border-emerald-400 rounded-3xl p-6 shadow-2xl relative animate-in fade-in">
          <button
            onClick={() => setOrderSuccess(null)}
            className="absolute top-4 right-4 text-emerald-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Order Dispatched & Subsidized
              </div>
              <h3 className="text-xl font-bold text-white">
                Thank you, {orderSuccess.deliveryName}! Your Order #{orderSuccess.orderId} is Confirmed.
              </h3>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                Dispatch scheduled to <b>{orderSuccess.village}</b> (Pincode: {orderSuccess.pincode}). Delivery personnel will contact your phone before arrival. Payable on delivery: <span className="font-bold text-emerald-300">₹{orderSuccess.total}</span> (15% State Subsidy Applied).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map(p => {
          const inCart = cart.find(c => c.id === p.id);
          return (
            <div
              key={p.id}
              className="bg-[#0b2416] border border-emerald-900/40 hover:border-emerald-600/70 rounded-2xl p-4 flex flex-col justify-between transition group shadow-sm hover:shadow-emerald-900/20"
            >
              <div>
                <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-black/40">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/80 text-emerald-300 backdrop-blur-sm border border-emerald-800/40">
                    {p.cat}
                  </span>
                  {p.badge && (
                    <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 backdrop-blur-sm">
                      {p.badge}
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/80 text-slate-200">
                    {p.unit}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition line-clamp-1">
                  {p.name}
                </h4>
                <p className="text-xs text-emerald-300/70 mt-1 line-clamp-2 leading-relaxed">
                  {p.desc}
                </p>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-white">
                    ₹{p.subsidyPrice || p.price}
                  </span>
                  {p.subsidyPrice && (
                    <span className="text-xs text-emerald-400/50 line-through">
                      ₹{p.price}
                    </span>
                  )}
                  <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/10 px-1.5 py-0.5 rounded">
                    Subsidy Applied
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-900/40">
                {inCart ? (
                  <div className="flex items-center justify-between bg-black/40 border border-emerald-700/50 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => onUpdateQty(p.id, -1)}
                      className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-300 hover:text-white flex items-center justify-center font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm font-mono text-emerald-300">
                      {inCart.qty} in cart
                    </span>
                    <button
                      type="button"
                      onClick={() => onUpdateQty(p.id, 1)}
                      className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      onAddToCart({
                        id: p.id,
                        name: p.name,
                        price: p.subsidyPrice || p.price,
                        img: p.img,
                        cat: p.cat
                      })
                    }
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow"
                  >
                    <Plus className="w-4 h-4" /> Add to Farm Cart
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="bg-[#0b2416] border border-emerald-900/40 rounded-3xl p-12 text-center space-y-3">
          <div className="text-4xl">🌾</div>
          <h4 className="text-base font-bold text-white">No Farm Inputs Found</h4>
          <p className="text-xs text-emerald-300/80">
            No matching inputs found for "{searchQuery}". Try searching for Seeds, Fertilizers, Sprayers, or Pumps.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCat('All');
            }}
            className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#0a1e13] border-l border-emerald-700/50 h-full flex flex-col justify-between p-6 shadow-2xl animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-lg text-white">Your Farm Cart</h3>
                  <span className="text-xs font-mono bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded-full">
                    {cartItemsCount} Items
                  </span>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full text-emerald-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="my-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <div className="py-16 text-center text-emerald-400/70 space-y-2">
                    <div className="text-3xl">🛒</div>
                    <p className="text-xs">Your farm cart is currently empty.</p>
                    <p className="text-[11px] text-emerald-500/60">
                      Add certified seeds, compost bags, or irrigation tools to request subsidized delivery.
                    </p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 bg-black/30 border border-emerald-900/40 p-3 rounded-xl text-xs"
                    >
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-12 h-12 rounded-lg object-cover bg-emerald-950 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-white truncate">{item.name}</h5>
                        <div className="text-[11px] text-emerald-400 font-mono mt-0.5">
                          ₹{item.price} each
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onUpdateQty(item.id, -1)}
                          className="w-6 h-6 rounded bg-emerald-950 text-emerald-300 hover:text-white flex items-center justify-center font-bold"
                        >
                          -
                        </button>
                        <span className="font-bold font-mono text-white text-xs w-5 text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, 1)}
                          className="w-6 h-6 rounded bg-emerald-500 text-slate-950 hover:bg-emerald-400 flex items-center justify-center font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Cart Summary and Checkout */}
            {cart.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-emerald-900/40">
                <div className="bg-black/30 p-3.5 rounded-xl border border-emerald-900/40 space-y-2 text-xs">
                  <div className="flex justify-between text-emerald-300/80">
                    <span>Retail Value:</span>
                    <span className="font-mono">₹{cartSubtotal}</span>
                  </div>
                  <div className="flex justify-between text-amber-300 font-semibold">
                    <span>KrishiMitra State Subsidy (15%):</span>
                    <span className="font-mono">-₹{subsidySavings}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-emerald-900/50">
                    <span>Net Subsidized Total:</span>
                    <span className="font-mono text-emerald-400">₹{finalPayable}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30 transition"
                >
                  <CreditCard className="w-4 h-4" /> Proceed to Subsidized Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b2416] border border-emerald-600/50 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl relative animate-in fade-in duration-200">
            <button
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-emerald-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-lg text-white">
                  Doorstep Farm Delivery Details
                </h3>
              </div>
              <p className="text-xs text-emerald-300/80 mt-1">
                Enter your Gram Panchayat village address. Subsidized delivery arrives in 24-48 hours.
              </p>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-3 text-xs">
              <div>
                <label className="text-emerald-300 font-semibold block mb-1">
                  Farmer / Buyer Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basavarajappa Patil"
                  value={checkoutForm.farmerName}
                  onChange={e => setCheckoutForm({ ...checkoutForm, farmerName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-emerald-300 font-semibold block mb-1">
                    Mobile Number (10 Digits) *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={checkoutForm.phone}
                    onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-emerald-300 font-semibold block mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="577002"
                    value={checkoutForm.pincode}
                    onChange={e => setCheckoutForm({ ...checkoutForm, pincode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-emerald-300 font-semibold block mb-1">
                    Village / Gram Panchayat *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Harihar Hobli"
                    value={checkoutForm.village}
                    onChange={e => setCheckoutForm({ ...checkoutForm, village: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-emerald-300 font-semibold block mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={checkoutForm.district}
                    onChange={e => setCheckoutForm({ ...checkoutForm, district: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/40 border border-emerald-800 text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div className="bg-black/30 p-3 rounded-xl border border-emerald-900/40 text-[11px] text-emerald-300/90 space-y-1">
                <div className="flex justify-between">
                  <span>Order Items:</span>
                  <span className="font-bold">{cartItemsCount} units</span>
                </div>
                <div className="flex justify-between">
                  <span>Subsidized Amount Due:</span>
                  <span className="font-bold text-amber-300">₹{finalPayable}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Payment Mode:</span>
                  <span>Cash on Delivery / UPI on Arrival</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg transition"
                >
                  Confirm & Place Subsidized Order
                </button>
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="px-4 py-3 bg-black/40 text-emerald-400 rounded-xl hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
