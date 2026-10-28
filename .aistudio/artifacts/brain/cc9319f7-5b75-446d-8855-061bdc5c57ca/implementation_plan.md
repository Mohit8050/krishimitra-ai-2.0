# Implementation Plan: Upgrade KrishiMitra AI to a Production-Ready Agricultural AI Platform

## 1. Overview & Objectives
Transform KrishiMitra AI (developed by Team KCT Coders) into a hardened, production-ready, mobile-first agricultural AI platform. The platform will solve real farmer challenges with dependable AI crop disease diagnosis, server-side authentication, reliable weather and APMC mandi pricing, trilingual agronomist assistance (Kannada, Hindi, English), and a crisp green-and-white visual identity.

---

## 2. Core Architecture & Enhancements

### Phase 1: Real AI Crop Disease Diagnostic & Vision Quality Guardrails
- **Multimodal Plant Pathology via Gemini 2.5 Flash**:
  - Accept actual farmer image uploads (JPEG/PNG/WEBP, size up to 15MB).
  - Backend validation for mime type, payload integrity, and dimensions.
  - Multi-stage prompt to first verify whether the image contains agricultural vegetation, leaves, stems, or fruit.
  - If the image is non-agricultural, blurred, or corrupted, reject with a polite, clear message asking for a well-lit photo of the affected plant foliage.
  - **Eliminate Fake/Random Diagnoses**: Completely delete randomized array fallbacks (`Math.random()`). If the AI service cannot be reached, return a transparent diagnostic error allowing one-tap retry.
  - Diagnose with confidence rating: **Confirmed / Probable / Inconclusive**.
  - Provide actionable dual treatments: Organic/Biopesticide (e.g., Neem 10,000 ppm, Trichoderma viride) and Chemical with exact statutory dilution rates (g/L or ml/L) and safety waiting periods (PHI).
  - Store scan logs to farmer's persistent pathology diary with image thumbnails and timestamps.

### Phase 2: Security Hardening & Server-Side Authentication
- **Farmer Authentication System**:
  - Replace client-only `localStorage` login with secure server-side session authentication (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`).
  - Salted hash storage for farmer passwords using `crypto` standard libraries.
  - Farmer profile management: Name, Village, District, State, Landholding (Acres), Primary Crops, Preferred Language.
- **Privacy & PII Protection**:
  - Mask all Aadhaar numbers strictly to `XXXX-XXXX-1234` on ingestion.
  - Remove any dummy or sensitive Aadhaar numbers from seed data.
  - Sanitize all text inputs to prevent XSS and script injection.
- **API Protection & Rate Limiting**:
  - In-memory sliding window rate limiter for Gemini endpoints and auth routes.
  - Safe error handling without stack trace or server path leaks.

### Phase 3: Trustworthy Live Mandi Rates & Agro-Meteorology
- **Live Open-Meteo Integration**:
  - Transparent data provenance badges: "Live Open-Meteo Satellite & Ground Station Feed" with exact observation timestamp.
  - Real agricultural spray forecast index: wind speed drift hazard, leaf wetness rain probability, and high heat evaporation hazard.
  - Searchable geocoding across Indian agricultural districts and taluks.
- **APMC Mandi Commodity Intelligence**:
  - Clear labeling of live arrivals vs. verified official APMC benchmark daily rates.
  - Arrival volume tracking in Quintals, Modal / Min / Max rates per quintal, daily change indicators (₹/qtl and %).
  - Filter by category (Cereals, Pulses, Oilseeds, Cash Crops, Horticulture) and State / District Mandi hub.

### Phase 4: Enhanced Trilingual AI Farming Assistant
- **Specialized Agronomist Persona**:
  - Grounded responses covering crop selection based on soil/season/water, fertilizer split dosing (NPK), biological pest control, official PM-KISAN/PMFBY schemes, and cost-benefit calculations.
  - Native script support with respectful tone for:
    - **Kannada (ಕನ್ನಡ)** (`kn-IN`)
    - **Hindi (हिन्दी)** (`hi-IN`)
    - **English** (`en-IN`)
    - Additional support for Marathi and Telugu.
  - Structured bullet-point formatting with exact units and dosages.
  - Clear distinction between general agronomical advice and official government eligibility rules.

### Phase 5: Production-Ready Modules & Data Persistence
- **Direct Farmer-to-Buyer Marketplace**:
  - Real listing creation with photo, harvest date, location, quantity (kg), and asking price.
  - Working buyer inquiry modal with real notification in farmer's desk.
  - Ability for farmers to mark lots as "Sold" or remove active listings.
- **Kisan Khata (Farm Ledger & P&L)**:
  - Add real seasonal crop expense entries (Seeds, Fertilizer, Tractor hire, Labor, Spraying, Transport).
  - Automatic calculation of total cost of cultivation and category-wise expenditure breakdown.
- **Custom Hiring Center (Machinery & Drone Rental)**:
  - Machinery catalog (Tractors, Rotavators, Drone sprayers, Harvesters) with hourly/per-acre rates.
  - Real booking submission with date, acres, contact details, and persistent booking diary.
- **PMFBY Crop Loss Intimation & Cold Storage Locator**:
  - 72-hour crop insurance intimation filing with tracking reference.
  - Searchable cold storage directory with contact numbers and capacity.
- **Precision Fertilizer NPK Calculator**:
  - Customized fertilizer bag calculator (Urea, DAP, MOP, Zinc) based on crop acreage and soil fertility.

### Phase 6: Mobile-First Professional Green-and-White UI/UX
- **Visual Identity**:
  - Clean agricultural daylight theme: Crisp white card surfaces (`#ffffff`), fresh agricultural green accents (`#15803d`, `#166534`, `#22c55e`), subtle borders (`#e2e8f0`), high-contrast slate text (`#0f172a`, `#334155`).
  - Mobile bottom navigation bar for quick access on Android smartphones (Home, Disease, Mandi, Weather, Assistant).
  - Kannada typography optimization: Adequate line-height (`leading-relaxed`), appropriate letter spacing, and clean font scaling to ensure Kannada vowels (vattakshara) render without clipping.
  - Responsive cards, zero pill clutter, high-contrast buttons, loading skeletons, and accessible touch targets (min 44px).

---

## 3. Verification & Testing Checklist
- [ ] Test AI Crop Disease Scan with healthy leaf, diseased leaf, non-plant image (e.g. household object), and corrupted base64. Verify appropriate rejection of non-plant images and zero fake fallback diagnoses.
- [ ] Test Farmer Auth: Register new farmer, login with correct/wrong password, session persistence, logout.
- [ ] Test Weather & Spraying Index: Check live Open-Meteo fetching, temperature, humidity, wind, and dynamic spraying hazard warnings.
- [ ] Test Live Mandi: Filter by commodity category and mandi hub, verify price modal calculations and arrival counts.
- [ ] Test AI Assistant in Kannada, Hindi, and English with agronomical questions.
- [ ] Test Marketplace: Add produce lot, create buyer inquiry, verify persistence in backend store.
- [ ] Test Kisan Khata ledger: Add expense, view category breakdowns, delete entry.
- [ ] Run `npm run lint` and `compile_applet` to guarantee error-free TypeScript build.
