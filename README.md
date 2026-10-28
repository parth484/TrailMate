# Wanderlust Adventure India 🏔️

A full-stack, production-ready travel planning, expedition booking, and accommodation exploration web application with interactive 3D WebGL visuals, real-time Tripadvisor API integration, day-by-day itineraries, and budget tracking.

---

## 🌟 Key Features

- **🏔️ 3D Interactive Landing Page**:
  - Live Three.js WebGL 3D Earth Globe with pulsing coordinates on Indian adventure spots (Pune, Rishikesh, Manali, Ladakh, Goa) and glowing 3D trajectory arcs.
  - Interactive 3D wireframe mountain terrain mode with dynamic peak wave physics.
  - Interactive 3D Tilt Cards with depth elevation (`preserve-3d`, `translateZ`) and realistic mouse glare sheen.
- **🦉 Tripadvisor Live API (RapidAPI Integration)**:
  - 2-Step verified flow:
    1. `/api/v1/hotels/searchLocation` resolves any user city input to a Tripadvisor `geoId`.
    2. `/api/v1/hotels/searchHotels` searches hotels using check-in & check-out dates (`YYYY-MM-DD`).
  - Displays real hotel names, live prices, verified ratings, and authentic high-resolution Tripadvisor photos.
- **🏡 50+ Curated Stays & Adventure Expeditions**:
  - Luxury Airbnb pool villas in Pune (Koregaon Park) & Mumbai.
  - Pawna Lake luxury safari camping & kayaking, Kundalika white-water rafting, Kamshet tandem paragliding, Rajmachi Fort trek, and Harishchandragad cliff adventures.
  - Multi-photo gallery modal with carousel navigation and stay booking modal with instant reference receipts and auto-budget sync.
- **🗺️ Interactive Maps & Weather**:
  - Leaflet.js interactive maps with OpenStreetMap Nominatim geocoding.
  - Live 5-day weather forecasts via Open-Meteo API.
- **📊 Itinerary & Budget Manager**:
  - Day-wise activity scheduling with times, categories, and locations.
  - Expense tracker with budget progress and category breakdowns.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Three.js, Tailwind CSS v3, React Router v6, Lucide React, Leaflet.js, Axios
- **Backend**: Node.js, Express (MVC), Mongoose / MongoDB with resilient in-memory fallback, JWT Authentication, bcryptjs
- **External APIs**: Tripadvisor API (RapidAPI), OpenStreetMap Nominatim, Open-Meteo Weather

---

## 🚀 Quick Start (Running Locally)

### 1. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Start Servers

Open **Terminal 1** (Backend API):
```bash
cd server
node src/index.js
```
*API runs on `http://localhost:5000`*

Open **Terminal 2** (Frontend Client):
```bash
cd client
npm run dev -- --host
```
*Frontend runs on `http://localhost:3000`*

### 🔑 Demo Login Credentials
- **Email**: `demo@travelplanner.com`
- **Password**: `123456`

---

## 📦 Deploying to Vercel

1. Push or upload this project to GitHub.
2. In [Vercel](https://vercel.com), import your repository.
3. Set **Root Directory** to `client` (or leave root as `vercel.json` is preconfigured).
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**!
