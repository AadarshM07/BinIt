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

	return (<div className="relative w-full h-screen">
		<div className="absolute inset-0" id="map"></div>
		
		{/* Container for heading */}
		<div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 text-3xl font-bold text-black">
			<h1 className='text-5xl'>BinIt</h1>
			<span className="text-black">|</span>
			<h1>Username</h1>
		</div>
		
		<p className='absolute top-20 left-1/2 transform -translate-x-1/2 bg-transparent bg-opacity-100 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-md text-black'>
			A collaborative waste management initiative designed to make cities cleaner through community participation. Users can mark locations with trash, and volunteers or waste collectors can pick it up to earn rewards. By integrating maps, location tracking, and a points-based incentive system, BinIt encourages responsible waste disposal and fosters a cleaner, greener environment.
		</p>
	
		<SearchForm />
  	</div>);
}

const SearchForm = () => {
	return (
	  <form className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur-md p-6 rounded-2xl shadow-lg w-full max-w-md max-h-[400px] overflow-hidden">
		{/* Heading */}
		<p className="text-2xl font-semibold tracking-tighter text-start text-gray-900">ENTER</p>
		<p className="text-2xl font-semibold tracking-tighter text-start -mt-2 text-gray-900">DETAILS</p>
  
		{/* Location Input */}
		<div className="flex flex-col w-full mt-4">
		  <label className="text-lg font-medium text-gray-800">Location:</label>
		  <input
			id="location"
			placeholder="Enter location"
			required
			type="text"
			className="bg-white w-full p-2 border-b border-gray-400 focus:outline-none focus:border-black"
		  />
		</div>
  
		{/* Search Description */}
		<div className="flex flex-col w-full mt-4">
		  <label className="text-lg font-medium text-gray-800">What are you looking for?</label>
		  <textarea
			id="desc"
			placeholder="Hospitals, good AQI, etc."
			className="bg-white w-full p-2 border border-gray-400 rounded-md focus:outline-none focus:border-black h-24 resize-none"
		  />
		</div>
  
		{/* Submit Button */}
		<button type="submit" className="bg-black text-white font-medium text-lg rounded-xl w-full py-3 mt-6 hover:bg-gray-900 transition">
		  SEARCH
		</button>
	  </form>
	);
  };
  
export default MapComponent;