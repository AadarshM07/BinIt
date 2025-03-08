'use client';

import { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  useEffect(() => {

    if (typeof window !== 'undefined' && L) {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
  
        if (!mapContainer._leaflet_id) {
     
          const map = L.map(mapContainer).setView([20.5937, 78.9629], 5); 
          

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);


          function drawCircle(e) {
            const latlng = e.latlng; 

            L.circle(latlng, {
              color: 'red', 
              fillColor: '#f03', 
              fillOpacity: 0.5,
              radius: 50000 
            }).addTo(map)
              .bindPopup(`Circle at ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`).openPopup(); // Automatically open the popup
          }

            
          map.on('click', drawCircle);
        }
      }
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }} id="map"></div> 
  );
};

export default MapComponent;
