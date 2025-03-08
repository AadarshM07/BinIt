"use client";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = () => {
	const [place, setPlace] = useState("Tokyo"); // Default location
	const [searchTimeout, setSearchTimeout] = useState(null);
	const mapRef = useRef(null);
	const markersRef = useRef([]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const mapContainer = document.getElementById("map");
			if (mapContainer && !mapContainer._leaflet_id) {
				const newMap = L.map(mapContainer, {
					center: [20.5937, 78.9629], // Default India
					zoom: 5,
				});

				L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
				}).addTo(newMap);

				mapRef.current = newMap;
			}
		}
	}, []);

	const searchPlace = async (query) => {
		if (!mapRef.current || !query) return;

		try {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
			);
			const data = await response.json();

			if (data.length > 0) {
				const { lat, lon, display_name } = data[0];

				mapRef.current.setView([lat, lon], 10); // Move map to new location

				// Clear previous markers
				markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
				markersRef.current = [];

				// Add new marker
				const newMarker = L.marker([lat, lon])
					.addTo(mapRef.current)
					.bindPopup(display_name)
					.openPopup();

				markersRef.current.push(newMarker);
			} else {
				alert("Location not found!");
			}
		} catch (error) {
			console.error("Error searching for place:", error);
		}
	};

	// Delayed Search to prevent excessive API calls
	useEffect(() => {
		if (!place) return;
		if (searchTimeout) clearTimeout(searchTimeout);

		const timeout = setTimeout(() => {
			searchPlace(place);
		}, 500); // 500ms delay

		setSearchTimeout(timeout);
		return () => clearTimeout(timeout); // Cleanup
	}, [place]);

	return (
		<div className="w-full h-screen relative">
			<input
				type="text"
				placeholder="Search for a place"
				value={place}
				onChange={(e) => setPlace(e.target.value)}
				className="absolute top-5 left-5 p-2 bg-white border rounded-md z-50"
			/>
			<div className="w-full h-full" id="map"></div>
		</div>
	);
};

export default MapComponent;