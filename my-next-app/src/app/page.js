'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

const MapComponent = () => {
	const mapRef = useRef(null);
	const mapContainerRef = useRef(null);
	const userMarkerRef = useRef(null);
	const [markerClusterGroup, setMarkerClusterGroup] = useState(null);

	useEffect(() => {
		if (typeof window === 'undefined') return; // Ensure code runs on client side

		if (!mapRef.current && mapContainerRef.current) {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition, handleError);
			} else {
				initMap(20.5937, 78.9629);
			}
		}
	}, []);

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
		mapRef.current = L.map(mapContainerRef.current).setView([x, y], 15);

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			keepBuffer: 6,
		}).addTo(mapRef.current);

		// Initialize Marker Cluster Group
		const clusterGroup = L.markerClusterGroup();
		setMarkerClusterGroup(clusterGroup);
		mapRef.current.addLayer(clusterGroup);

		// Add click event to add markers to the cluster
		mapRef.current.on('click', (e) => addMarker(e, clusterGroup));
	}

	function addMarker(e, clusterGroup) {
		const icon = L.divIcon({
			className: "custom-marker",
			html: `<div class="bg-red-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white"></div>`,
			iconSize: [32, 32],
			iconAnchor: [16, 32],
			popupAnchor: [0, -32],
		});

		const marker = L.marker(e.latlng, { icon: icon })
			.bindPopup(`<b>Location:</b> ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`);

		clusterGroup.addLayer(marker);
	}

	function addUserMarker(x, y) {
		const userIcon = L.divIcon({
			className: "user-marker",
			html: `<div class="bg-blue-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white"></div>`,
			iconSize: [32, 32],
			iconAnchor: [16, 16],
			popupAnchor: [0, -32],
		});

		if (mapRef.current) {
			if (userMarkerRef.current) {
				userMarkerRef.current.setLatLng([x, y]);
			} else {
				userMarkerRef.current = L.marker([x, y], { icon: userIcon })
					.addTo(mapRef.current)
					.bindPopup("<b>You are here</b>");
				userMarkerRef.current.on("click", () => {
					mapRef.current.setView([x, y], 15);
				});
			}
		}
	}

	return <div ref={mapContainerRef} className="w-full h-screen" id="map"></div>;
};

export default MapComponent;
