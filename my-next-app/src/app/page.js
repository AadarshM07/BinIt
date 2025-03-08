'use client';

import { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import Popup from './component/popup.jsx';

const MapComponent = () => {
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && L) {
      const mapContainer = document.getElementById('map');
      if (mapContainer && !mapRef.current) {
        navigator.geolocation?.getCurrentPosition(({ coords }) => {
          const { latitude, longitude } = coords;
          initMap(latitude, longitude);
        });

        function initMap(lat, lng) {
          const map = L.map(mapContainer).setView([lat, lng], 15);
          mapRef.current = map;

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);

          const customIcon = L.divIcon({
            className: "custom-marker",
            html: `<div class="bg-red-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white">📍</div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });

          function addMarker(e) {
            if (markers.length === 0) {
              const newMarker = L.marker(e.latlng, { icon: customIcon }).addTo(map);

              newMarker.on('click', () => {
                setSelectedMarker(e.latlng);
                setPopupOpen(true);
              });

              setMarkers([newMarker]);
            }
          }

          map.on('click', addMarker);

          
          searchForPlace(map, customIcon);
        }
      }
    }
  }, [markers]);

  
  return (
    <div className="w-full h-screen relative">
      <div className="w-full h-full" id="map"></div>

      {popupOpen && <Popup onClose={() => setPopupOpen(false)} />}
      

    </div>
  );
};

export default MapComponent;

