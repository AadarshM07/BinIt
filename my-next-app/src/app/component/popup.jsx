'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

function Popup({ onClose }) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleRemoveFile = () => {
    setFile(null);
    document.getElementById('fileUpload').value = ''; // Reset input field
  };

  return (
    <div className="fixed inset-0 flex items-center justify-end bg-transparent bg-opacity-10 backdrop-blur-lg z-1000">
      <div className="relative w-96 bg-white rounded-3xl p-8 shadow-2xl flex flex-col items-center border border-gray-300 h-full">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-700 bg-gray-200 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <X size={24} />
        </button>

        <h1 className="text-center text-2xl font-extrabold text-green-700 sm:text-3xl mt-6">
          Sustainable Contribution
        </h1>
        <p className="text-center text-green-600 text-l mt-3 px-4">
          Long-term positive impact through eco-friendly and responsible actions.
        </p>

        <div className="mt-6 text-gray-700 text-center space-y-4">
          {[
            { color: 'red', label: 'Hazardous Waste' },
            { color: 'yellow', label: 'Organic Waste' },
            { color: 'green', label: 'Recyclable Waste' },
          ].map(({ color, label }) => (
            <div
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`flex items-center space-x-3 cursor-pointer transition-all border-4 p-2 rounded-lg w-full justify-center ${
                selectedColor === color ? 'border-black' : 'border-transparent'
              }`}
            >
              <div className={`w-8 h-8 rounded-full`} style={{ backgroundColor: color }}></div>
              <span className="text-gray-700 font-medium">{label}</span>
            </div>
          ))}
        </div>

        <form className="w-full mt-6 space-y-4">
        <label className="text-green-700 text-bold font-bold ">Description</label>
            <textarea
            placeholder="Give a description"
            rows="4"  // This adds more lines
            className="w-full px-4 py-2 rounded-lg bg-gray-100 text-black focus:ring-2 focus:ring-green-500 outline-none shadow-md resize-none"
            />
          <label className="text-green-700 text-sm font-bold">Upload Image</label>
          <div className="flex items-center bg-gray-100 rounded-lg p-2 shadow-md w-full">
            <input type="file" id="fileUpload" className="hidden" onChange={handleFileChange} />
            <label
              htmlFor="fileUpload"
              className="cursor-pointer bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-all"
            >
              Choose File
            </label>

            {file && (
              <div className="flex items-center ml-2 bg-white px-2 py-1 rounded-lg shadow-sm">
                <span className="text-gray-700 text-sm truncate max-w-[150px]">{file.name}</span>
                <button onClick={handleRemoveFile} className="ml-2 text-red-500 hover:text-red-700">
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-4">
              <img src={URL.createObjectURL(file)} alt="Uploaded File" className="w-full h-auto rounded-lg shadow-md" />
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 px-5 py-3 text-xl font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl active:bg-green-600"
          >
            Submit Contribution
          </button>
        </form>
      </div>
    </div>
  );
}

export default Popup;