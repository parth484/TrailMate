import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

const MapView = ({ lat = 48.8566, lng = 2.3522, destination = 'Paris', points = [] }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [coords, setCoords] = useState({ lat, lng });

  useEffect(() => {
    let isMounted = true;
    const resolveCoords = async () => {
      // Check if coordinates need geocoding update (e.g. default Paris coords for non-Paris destination)
      const isDefaultParis = Math.abs(lat - 48.8566) < 0.001 && Math.abs(lng - 2.3522) < 0.001;
      const isNotParis = destination.toLowerCase().trim() !== 'paris';

      if ((isDefaultParis && isNotParis) || !lat || !lng) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`, {
            headers: { 'User-Agent': 'TravelPlannerApp/1.0' }
          });
          const data = await res.json();
          if (data && data.length > 0 && isMounted) {
            setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
            return;
          }
        } catch (e) {
          console.warn('Map geocoding fallback failed:', e);
        }
      }
      if (isMounted) {
        setCoords({ lat, lng });
      }
    };

    resolveCoords();

    return () => {
      isMounted = false;
    };
  }, [lat, lng, destination]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Reset container if previously initialized
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const currentLat = coords.lat || 28.6139;
    const currentLng = coords.lng || 77.2090;

    const map = L.map(mapRef.current).setView([currentLat, currentLng], 12);
    mapInstanceRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Default Main Destination Marker
    const mainIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="background-color:#0ea5e9; width:28px; height:28px; border-radius:50%; border:3px solid white; box-shadow:0 4px 10px rgba(0,0,0,0.3); display:flex; align-items:center; justify-content:center; color:white; font-weight:bold; font-size:12px;">📍</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });

    L.marker([currentLat, currentLng], { icon: mainIcon })
      .addTo(map)
      .bindPopup(`<b>${destination}</b><br/>Primary Destination Target`)
      .openPopup();

    // Additional points (itinerary activities / nearby places)
    if (points && points.length > 0) {
      points.forEach((p) => {
        if (p.lat && p.lng) {
          L.marker([p.lat, p.lng])
            .addTo(map)
            .bindPopup(`<b>${p.title || p.name}</b><br/>${p.category || ''}`);
        }
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coords, destination, points]);

  return (
    <div className="glass-panel p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Interactive Map - {destination}
        </h4>
        <span className="text-xs font-semibold text-sky-500">
          {(coords.lat || 0).toFixed(4)}, {(coords.lng || 0).toFixed(4)}
        </span>
      </div>
      <div
        ref={mapRef}
        className="h-72 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 z-10"
      />
    </div>
  );
};

export default MapView;
