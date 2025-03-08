"use client";
import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import axios from 'axios';
import { useRouter } from "next/navigation";
import Popup from './component/popup.jsx';
import SubmitPopup from './component/submitPopup.jsx';

const MapComponent = () => {
	const router = useRouter();
    const [place, setPlace] = useState("Tokyo");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [popupOpen, setPopupOpen] = useState(false);
	const [submitOpen, setSubmitOpen] = useState(false);
    const mapRef = useRef(null);
    const markersRef = useRef([]);
    const mapContainerRef = useRef(null);
    const userMarkerRef = useRef(null);
	const backButtonRef = useRef(null);
	const homeButtonRef = useRef(null);
    const [markerClusterGroup, setMarkerClusterGroup] = useState(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!mapRef.current && mapContainerRef.current) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, handleError);
            } else {
                initMap(20.5937, 78.9629);
            }

			backButtonRef.current.addEventListener('click', () => {
				router.push("/dashboard");
			});
			homeButtonRef.current.addEventListener('click', () => {
				if (userMarkerRef.current) {
					mapRef.current.setView(userMarkerRef.current.getLatLng());
				}
			});
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

    function initMap(lat, lng) {
		if (mapRef.current) {
			mapRef.current.setView([lat, lng], 15);
			return;
		}
	
		mapRef.current = L.map(mapContainerRef.current, {
			center: [lat, lng],
			zoom: 15,
			zoomControl: false
		});
	
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			keepBuffer: 6,
		}).addTo(mapRef.current);
	
		const clusterGroup = L.markerClusterGroup();
		setMarkerClusterGroup(clusterGroup);
		mapRef.current.addLayer(clusterGroup);
	
		mapRef.current.on('click', (e) => addMarker(e, clusterGroup));
	}
	

	async function addMarker(e, clusterGroup) {
		const { lat, lng } = e.latlng;

		try {

			const icon = L.divIcon({
				className: "custom-marker",
				html: `<div class="bg-red-500 text-white font-bold text-xs flex items-center justify-center w-8 h-8 rounded-full shadow-lg border-2 border-white"></div>`,
				iconSize: [32, 32],
				iconAnchor: [16, 16],
				popupAnchor: [0, -32],
			});

			const marker = L.marker(e.latlng, { icon: icon })
				.bindPopup(`<b>Location:</b> ${lat.toFixed(4)}, ${lng.toFixed(4)}`);

			clusterGroup.addLayer(marker);
		} catch (error) {
			console.error("Error checking water body:", error);
		}
	}

    function addUserMarker(x, y) {
		const userIcon = L.icon({
			iconUrl: "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2_hdpi.png",
			iconSize: [27, 43],
			iconAnchor: [13, 43],
			popupAnchor: [0, -35]
		});
	
		if (mapRef.current) {
			if (userMarkerRef.current) {
				userMarkerRef.current.setLatLng([x, y]);
			} else {
				userMarkerRef.current = L.marker([x, y], { icon: userIcon })
					.addTo(mapRef.current)
					.bindPopup("<b>You are here</b>");
	
				userMarkerRef.current.on("click", () => {
					mapRef.current.setView([x, y]);
				});
			}
		}
	}
	

    const searchPlace = async (query) => {
        if (!mapRef.current || !query) return;

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
            );
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon, display_name } = data[0];

                mapRef.current.setView([lat, lon], 10);

                markersRef.current.forEach(marker => mapRef.current.removeLayer(marker));
                markersRef.current = [];

                const newMarker = L.marker([lat, lon])
                    .addTo(mapRef.current)
                    .bindPopup(display_name)
                    .openPopup();

                markersRef.current.push(newMarker);
                setMarkers([...markersRef.current]);
                
                if (markerClusterGroup) {
                    markerClusterGroup.addLayer(newMarker);
                }
            } else {
                alert("Location not found!");
            }
        } catch (error) {
            console.error("Error searching for place:", error);
        }
    };

	useEffect(() => {
		if (!place) return;
		if (searchTimeout) clearTimeout(searchTimeout);
	
		const timeout = setTimeout(() => {
			searchPlace(place);
		}, 500);

		setSearchTimeout(timeout);
		return () => clearTimeout(timeout);
	}, [place]);
	

    return (
		<div className="w-full h-screen relative">
			<div
				className="absolute top-5 left-5 p-4 backdrop-blur-md text-black bg-opacity-100 rounded-lg shadow-md z-50 flex flex-col space-y-2 border"
			>
				<input
					type="text"
					placeholder="Search for a place"
					value={place}
					onChange={(e) => setPlace(e.target.value)}
					className="p-2 bg-white border rounded-md"
				/>
	
				<div className="flex space-x-2 rounded-md">
					<button ref={backButtonRef} className="p-2 bg-white border rounded-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-caret-left-fill" viewBox="0 0 16 16">
							<path d="m3.86 8.753 5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z"/>
						</svg>
					</button>
	
					<button ref={homeButtonRef} className="p-2 bg-white border rounded-md">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-house-door-fill" viewBox="0 0 16 16">
							<path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5"/>
						</svg>
					</button>
				</div>
			</div>
	
			<div ref={mapContainerRef} className="w-full h-full" id="map"></div>
	
			{popupOpen && <Popup onClose={() => setPopupOpen(false)} />}
			{submitOpen && <SubmitPopup onClose={() => setSubmitOpen(false)} />}
		</div>
	);
};

export default MapComponent;