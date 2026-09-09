import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Star, Clock, Briefcase, Search, LocateFixed } from 'lucide-react';
import ScoreCircle from '../components/ui/ScoreCircle';
import L from 'leaflet';

// Fix default marker icon paths for Vite/Webpack bundlers
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Partners() {
  const [location, setLocation] = useState('Pune, Maharashtra');

  const partners = [
    { id: 1, name: 'State Bank of India', type: 'Public Bank', score: 95, dist: 2.4, time: '7-10 days', lat: 18.5204, lng: 73.8567 },
    { id: 2, name: 'HDFC Bank', type: 'Private Bank', score: 88, dist: 1.2, time: '3-5 days', lat: 18.5254, lng: 73.8617 },
    { id: 3, name: 'Muthoot Finance', type: 'NBFC', score: 82, dist: 0.8, time: '1-2 days', lat: 18.5154, lng: 73.8517 }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 w-full">
      <div className="mb-6 flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#171717] tracking-[-0.01em]">Find Channel Partners</h1>
          <p className="text-sm text-[#6B7280] mt-1">Locate the best banks and NBFCs for your scheme.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] w-4 h-4" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Enter location"
              className="bg-white border border-[#E8E8E6] rounded-md pl-9 pr-4 py-2 text-sm text-[#171717] focus:outline-none focus:ring-1 focus:ring-[#171717] placeholder:text-[#9CA3AF] w-64 transition-colors"
            />
          </div>
          <button
            type="button"
            className="p-2 bg-[#F5F5F3] text-[#6B7280] rounded-md hover:bg-[#E8E8E6] transition-colors"
            aria-label="Locate position"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="px-3 py-2 bg-[#171717] text-white text-sm font-medium rounded-md hover:bg-[#2D2D2D] transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[560px]">
        {/* List */}
        <div className="w-full lg:w-[340px] flex flex-col gap-4 overflow-y-auto pr-2">
          {partners.map((p, i) => (
            <div
              key={p.id}
              className={`bg-white border ${i === 0 ? 'border-[#059669]' : 'border-[#E8E8E6]'} rounded-lg p-4 cursor-pointer hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-150`}
            >
              {i === 0 && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] px-1.5 py-0.5 rounded-sm inline-block mb-2">
                  Best Match
                </span>
              )}
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-semibold text-[#171717]">{p.name}</h3>
                  <p className="text-xs text-[#6B7280]">{p.type}</p>
                </div>
                <ScoreCircle score={p.score} size={44} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-[#6B7280] mt-3">
                <div className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" />
                  <span>{p.dist} km</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1 text-[#9CA3AF]" />
                  <span>{p.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="flex-1 rounded-lg border border-[#E8E8E6] overflow-hidden">
          <MapContainer center={[18.5204, 73.8567]} zoom={13} scrollWheelZoom={false} className="w-full h-full">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {partners.map(p => (
              <Marker key={p.id} position={[p.lat, p.lng]}>
                <Popup>
                  <div className="text-sm font-semibold text-[#171717]">{p.name}</div>
                  <div className="text-xs text-[#6B7280]">{p.type}</div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
