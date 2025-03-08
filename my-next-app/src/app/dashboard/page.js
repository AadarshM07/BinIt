'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
	const [map, setMap] = useState(null);
	useEffect(() => {
		if (typeof window !== 'undefined' && L) {
			const mapContainer = document.getElementById('map');
			if (mapContainer) {
				if (!mapContainer._leaflet_id) {
					const map = L.map(mapContainer, {
						center: [20.5937, 78.9629], 
						zoom: 12, 
						zoomControl: false, 
						dragging: false, // Prevent user dragging
						scrollWheelZoom: false, 
						doubleClickZoom: false,
						boxZoom: false,
						keyboard: false,
						fadeAnimation: true,
						scrollWheelZoom: true,
					});

					L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
						attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
						keepBuffer: 6,
						updateWhenIdle: false
					}).addTo(map);

					// Function to smoothly pan the map indefinitely
					function startInfinitePan() {
						setInterval(() => {
						map.panBy([350000, 0], { animate: true, duration: 10000 }); // Move right smoothly
						}, 1000); // Change position every second
					}

					startInfinitePan(); // Start the smooth panning
				}
			}
		}
	}, []);

	return <div className="w-full h-screen" id="map"></div>;
};

export default MapComponent;
