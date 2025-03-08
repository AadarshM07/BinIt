'use client';

import { useEffect, useState, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
	const mapRef = useRef(null);
	const mapContainerRef = useRef(null);
	const userMarkerRef = useRef(null);
	const [markers, setMarkers] = useState([]);
	
	useEffect(() => {
		let Leaf;

		const initializeMap = async () => {
			if (typeof window !== 'undefined') {
				Leaf = await import('leaflet');

				if (!mapRef.current && mapContainerRef.current) {
					if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(showPosition, handleError);
					} else {
						initMap(20.5937, 78.9629);
					}
				}
			}
		};

		function showPosition(position) {
			let x = position.coords.latitude;
			let y = position.coords.longitude;
			initMap(x, y);
			addUserMarker(x, y);
		}

		function handleError(error) {
			console.error("Geolocation error:", error);
			initMap(20.5937, 78.9629);
		}

		function initMap(x, y) {
			mapRef.current = Leaf.map(mapContainerRef.current).setView([x, y], 15);

			Leaf.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				keepBuffer: 20,
			}).addTo(mapRef.current);

			const icon = Leaf.divIcon({
				className: "custom-marker",
				html: `<div class="bg-red-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white"></div>`,
				iconSize: [32, 32],
				iconAnchor: [16, 32],
				popupAnchor: [0, -32]
			});

			function addMarker(e) {
				const marker = Leaf.marker(e.latlng, { icon: icon })
					.addTo(mapRef.current)
					.bindPopup(`<b>Click me to remove</b><br>${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);

				marker.on('click', function () {
					mapRef.current.removeLayer(marker);
					setMarkers(prevMarkers => prevMarkers.filter(m => m !== marker));
				});

				setMarkers(prevMarkers => [...prevMarkers, marker]);
			}

			mapRef.current.on('click', addMarker);
		}

		function addUserMarker(x, y) {
			const userIcon = Leaf.divIcon({
				className: "user-marker",
				html: `<div class="bg-blue-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white"></div>`,
				iconSize: [32, 32],
				iconAnchor: [16, 32],
				popupAnchor: [0, -32],
			});

			if (mapRef.current) {
				if (userMarkerRef.current) {
					userMarkerRef.current.setLatLng([x, y]);
				} else {
					userMarkerRef.current = Leaf.marker([x, y], { icon: userIcon })
						.addTo(mapRef.current)
						.bindPopup("<b>You are here</b>");
					userMarkerRef.current.on("click", () => {
						mapRef.current.setView([x, y], 15);
					});
				}
			}
		}

		initializeMap(); // Call function to load Leaflet dynamically
	}, []);

	return <div ref={mapContainerRef} className="w-full h-screen" id="map"></div>;
};

export default MapComponent;
