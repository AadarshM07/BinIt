'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

function SubmitPopup({ onClose }) {
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
		<img className="rounded-3xl" src="https://static.vecteezy.com/system/resources/previews/008/086/278/non_2x/plastic-trash-bin-bags-of-garbage-on-the-pavement-in-park-clean-environment-concept-free-photo.jpg"></img>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-700 bg-gray-200 hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <X size={24} />
        </button>

        <p className="text-center text-bold font-bold text-green-900 text-l mt-3 px-4">
			Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quam itaque qui exercitationem nemo sint magni obcaecati quia officiis incidunt, repellat recusandae. Velit quisquam corrupti fugit saepe non minima iusto ea.
        </p>

        <div className="mt-6 text-gray-700 text-center space-y-4">
          {/* {[
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
          ))} */}
        </div>

        <form className="w-full mt-6 space-y-4">
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
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubmitPopup;