import React, { useState, useEffect } from 'react';
import PlaceCard from '../components/places/PlaceCard';
import HotelBookingModal from '../components/places/HotelBookingModal';
import HotelDetailModal from '../components/places/HotelDetailModal';
import TripadvisorSearchBanner from '../components/places/TripadvisorSearchBanner';
import { fetchHotelsByCity } from '../services/hotelService';
import { Compass, Sparkles, MapPin, Search, Mountain, Waves, Wind, Tent, Hotel, Home, Globe } from 'lucide-react';

const INDIAN_ADVENTURE_PLACES = [
  // --- PUNE & NEAR PUNE ADVENTURE PLACES ---
  {
    id: 'pune_adv_1',
    city: 'pune',
    name: 'Pawna Lake Camping, Kayaking & Stargazing',
    category: 'Camping',
    rating: 4.9,
    address: 'Pawna Dam Reservoir, Lonavala / Kamshet (near Pune)',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=1000&auto=format&fit=crop',
    description: 'Scenic lakeside tent camping with kayaking, live acoustic music, bonfire, and barbecue night.',
    priceRange: '₹1,200 / night',
    difficulty: 'Easy',
    bestSeason: 'Sept - May',
  },
  {
    id: 'pune_adv_2',
    city: 'pune',
    name: 'Rajmachi Fort & Waterfall Trek',
    category: 'Trekking & Hiking',
    rating: 4.9,
    address: 'Rajmachi Plateau, Lonavala / Khandala (near Pune)',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000&auto=format&fit=crop',
    description: 'Famous dual-fort trek (Shrivardhan & Manaranjan) through lush monsoon forests and firefly trails.',
    priceRange: '₹1,500 / trek',
    difficulty: 'Moderate',
    bestSeason: 'June - Oct',
  },
  {
    id: 'pune_adv_3',
    city: 'pune',
    name: 'Kamshet Tandem Paragliding',
    category: 'Aerial & Paragliding',
    rating: 4.8,
    address: 'Kamshet Paragliding Drop Zone (45 km from Pune)',
    image: 'https://images.unsplash.com/photo-1508672019048-805479767513?w=1000&auto=format&fit=crop',
    description: 'Tandem flights soaring over Pawna Dam, Western Ghats hills, and lush green valleys.',
    priceRange: '₹3,200 / flight',
    difficulty: 'Moderate',
    bestSeason: 'Oct - May',
  },
  {
    id: 'pune_adv_4',
    city: 'pune',
    name: 'Kundalika White-Water River Rafting (Kolad)',
    category: 'Water Sports',
    rating: 4.9,
    address: 'Kolad, Raigad (near Pune - 110 km)',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1000&auto=format&fit=crop',
    description: 'Thrilling 12 km white-water rafting on dam-released Grade 3 rapids along Kundalika River.',
    priceRange: '₹1,800 / person',
    difficulty: 'Challenging',
    bestSeason: 'All Year',
  },
  {
    id: 'pune_adv_5',
    city: 'pune',
    name: 'Sinhagad Fort Sunrise Trek',
    category: 'Trekking & Hiking',
    rating: 4.8,
    address: 'Sinhagad Ghat Rd, Pune (30 km from Pune City)',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1000&auto=format&fit=crop',
    description: 'Historic 17th-century hill fort trek, famous for Kalyan Darwaja and hot Pitla Bhakri at summit.',
    priceRange: 'Free',
    difficulty: 'Moderate',
    bestSeason: 'All Year',
  },
  {
    id: 'pune_adv_6',
    city: 'pune',
    name: 'Devkund Waterfall Jungle Trek (Tamhini Ghat)',
    category: 'Trekking & Hiking',
    rating: 4.8,
    address: 'Bhira Village, Tamhini Ghat (near Pune)',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1000&auto=format&fit=crop',
    description: 'Dense rainforest trail through Bhira dam backwaters leading to a roaring blue waterfall pool.',
    priceRange: '₹1,200 / trek',
    difficulty: 'Moderate',
    bestSeason: 'July - Nov',
  },
  {
    id: 'pune_adv_7',
    city: 'pune',
    name: 'Dukes Nose (Nagphani) 300ft Rappelling & Zipline',
    category: 'Aerial & Paragliding',
    rating: 4.9,
    address: 'Khandala / Lonavala (near Pune)',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1000&auto=format&fit=crop',
    description: 'Thrilling 300-foot vertical cliff face rappelling and 800-foot valley zip traverse.',
    priceRange: '₹2,500 / person',
    difficulty: 'Extreme',
    bestSeason: 'Oct - March',
  },
  {
    id: 'pune_adv_8',
    city: 'pune',
    name: 'Harishchandragad & Konkan Kada Cliff Trek',
    category: 'Trekking & Hiking',
    rating: 4.9,
    address: 'Khireshwar / Base (near Pune)',
    image: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1000&auto=format&fit=crop',
    description: 'Iconic trek to 1,800 ft vertical overhanging cliff face and ancient Kedareshwar cave.',
    priceRange: '₹1,800 / trek',
    difficulty: 'Extreme',
    bestSeason: 'Oct - May',
  },
];

const PlacesPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingHotel, setSelectedBookingHotel] = useState(null);
  const [selectedDetailHotel, setSelectedDetailHotel] = useState(null);
  const [curatedHotels, setCuratedHotels] = useState([]);
  const [tripadvisorHotels, setTripadvisorHotels] = useState([]);
  const [activeTripadvisorMeta, setActiveTripadvisorMeta] = useState(null);

  useEffect(() => {
    const loadHotels = async () => {
      const data = await fetchHotelsByCity(searchQuery);
      setCuratedHotels(data);
    };
    loadHotels();
  }, [searchQuery]);

  const categories = [
    { label: 'All Stays & Places', value: 'All', icon: Mountain },
    { label: 'Tripadvisor Live 🦉', value: 'Tripadvisor', icon: Globe },
    { label: 'Airbnb & Villas 🏡', value: 'Airbnb & Villa', icon: Home },
    { label: 'Hotels & Resorts 🏨', value: 'Hotel', icon: Hotel },
    { label: 'Pune & Mumbai 🏙️', value: 'pune_mumbai_special', icon: Mountain },
    { label: 'Trekking & Camps ⛺', value: 'camps_and_treks', icon: Tent },
    { label: 'Water & Paragliding 🌊', value: 'sports_special', icon: Waves },
  ];

  // Callback when Tripadvisor search runs
  const handleTripadvisorResults = (hotels, meta) => {
    setTripadvisorHotels(hotels || []);
    setActiveTripadvisorMeta(meta);
    setActiveCategory('Tripadvisor');
  };

  const handleClearTripadvisor = () => {
    setTripadvisorHotels([]);
    setActiveTripadvisorMeta(null);
    setActiveCategory('All');
  };

  // Merge Live Tripadvisor hotels + curated database + adventure spots
  const combinedList = [
    ...tripadvisorHotels,
    ...curatedHotels,
    ...INDIAN_ADVENTURE_PLACES,
  ];

  // Unique list deduplicated by ID
  const uniqueItems = Array.from(new Map(combinedList.map(item => [item.id, item])).values());

  const filtered = uniqueItems.filter((place) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      q === '' ||
      place.city.toLowerCase().includes(q) ||
      place.name.toLowerCase().includes(q) ||
      place.address.toLowerCase().includes(q) ||
      (place.description && place.description.toLowerCase().includes(q));

    if (activeCategory === 'Tripadvisor') {
      return matchesQuery && (place.source === 'Tripadvisor' || place.id?.startsWith('tripadvisor_'));
    }

    if (activeCategory === 'pune_mumbai_special') {
      return matchesQuery && (
        place.city === 'pune' ||
        place.city === 'mumbai' ||
        place.address.toLowerCase().includes('pune') ||
        place.address.toLowerCase().includes('mumbai') ||
        place.address.toLowerCase().includes('lonavala') ||
        place.address.toLowerCase().includes('khandala')
      );
    }

    if (activeCategory === 'Airbnb & Villa') {
      return matchesQuery && (
        place.category === 'Airbnb & Villa' ||
        place.name.toLowerCase().includes('villa') ||
        place.name.toLowerCase().includes('airbnb') ||
        place.name.toLowerCase().includes('penthouse')
      );
    }

    if (activeCategory === 'Hotel') {
      return matchesQuery && (place.category === 'Hotel' || place.category === 'Lodge');
    }

    if (activeCategory === 'camps_and_treks') {
      return matchesQuery && (
        place.category === 'Camping' ||
        place.category === 'Camping & Safaris' ||
        place.category === 'Trekking & Hiking' ||
        place.category === 'Lodge'
      );
    }

    if (activeCategory === 'sports_special') {
      return matchesQuery && (
        place.category === 'Water Sports' ||
        place.category === 'Aerial & Paragliding' ||
        place.category === 'Snow & Alpine'
      );
    }

    const matchesCat = activeCategory === 'All' || place.category === activeCategory;
    return matchesQuery && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden glass-panel p-8 border border-emerald-500/20 bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> Tripadvisor API & Curated Expeditions 🦉
          </span>
          <h1 className="text-3xl font-black text-white">
            Explore <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 bg-clip-text text-transparent">Hotels, Lodges & Stays</span>
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Live Tripadvisor search with real-time hotel rates, star ratings, and photo galleries across Pune, Mumbai, Goa & global cities.
          </p>
        </div>
      </div>

      {/* Tripadvisor Live RapidAPI Search Banner */}
      <TripadvisorSearchBanner
        currentCity="Pune"
        onSearchResults={handleTripadvisorResults}
        onClearSearch={handleClearTripadvisor}
      />

      {/* Search & Category Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by hotel name, address, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-2xl border border-slate-200 dark:border-slate-800/80 w-full sm:w-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeCategory === cat.value
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count & Current Filter Label */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Showing <strong>{filtered.length}</strong> accommodations & places</span>
        {activeCategory === 'Tripadvisor' && activeTripadvisorMeta && (
          <span className="text-emerald-500 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Tripadvisor Live: {activeTripadvisorMeta.city} (GeoId: {activeTripadvisorMeta.geoId})
          </span>
        )}
      </div>

      {/* Grid List View */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800">
          <Compass className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Stays or Places Found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try searching for a city in the Tripadvisor bar above, or browse another category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onSelectPlace={(h) => setSelectedDetailHotel(h)}
              onBookHotel={(h) => setSelectedBookingHotel(h)}
            />
          ))}
        </div>
      )}

      {/* Hotel Photo Gallery & Info Modal */}
      <HotelDetailModal
        isOpen={Boolean(selectedDetailHotel)}
        onClose={() => setSelectedDetailHotel(null)}
        hotel={selectedDetailHotel}
        onProceedToBooking={(h) => setSelectedBookingHotel(h)}
      />

      {/* Hotel & Villa Reservation Modal */}
      <HotelBookingModal
        isOpen={Boolean(selectedBookingHotel)}
        onClose={() => setSelectedBookingHotel(null)}
        hotel={selectedBookingHotel}
      />
    </div>
  );
};

export default PlacesPage;
