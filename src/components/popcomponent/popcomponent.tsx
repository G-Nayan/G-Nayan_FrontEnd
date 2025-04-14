// import React, { useState } from 'react';
// import {bot} from '@/assets';

// const EvePopup = ({ onClose }) => (
//     <div className="absolute bottom-20 right-0 flex flex-col items-center animate-fade-in">
//       <img
//         src={bot}
//         alt="EVE"
//         className="w-16 h-16 mb-2 drop-shadow-lg"
//       />
//       <div className="bg-white text-gray-800 text-sm px-3 py-2 rounded shadow-md">
//         👋 Hi there! Need help with eye care? Chat with me!
//       </div>
//       <button
//         onClick={onClose}
//         className="mt-2 text-xs text-blue-500 underline"
//       >
//         Dismiss
//       </button>
//     </div>
//   );

//   export default EvePopup;

// src/components/popcomponent/EvePopup.jsx (or .tsx)
import React from "react";
// Make sure this path is correct relative to your project structure
// If 'bot' is an image file (like bot.png or bot.svg) in src/assets:
import { bot } from "@/assets"; // Adjust the filename if necessary (e.g., bot.svg)

// If 'bot' is exported from an index file in src/assets:
// import { bot as botImage } from '@/assets';

const EvePopup = ({ onClose }) => (
  // Added mb-2 to give slight space above the button
  <div className="absolute bottom-full right-0 mb-2 flex flex-col items-center animate-fade-in w-max max-w-xs">
    {/* Tooltip Arrow */}
    {/* <div className="absolute bottom-[-4px] right-[calc(50%-4px)] w-3 h-3 bg-white rotate-45 transform shadow-md"></div> */}

    {/* Popup Content */}
    <div className="relative  bg-white text-gray-800 text-sm px-4 py-3 rounded-lg shadow-xl border border-gray-200 flex items-center space-x-3">
      <img
        src={bot} // Use the imported image source
        alt="G-Nayana Assistant" // More descriptive alt text
        className="w-12 h-12 rounded-lg" // Slightly smaller image size for popup
      />
      <span className="font-medium">
        👋 Hi there! Need help <br /> with eye care? Chat with me!
      </span>
      <button
        onClick={onClose}
        className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline focus:outline-none"
      >
        {/* x icon */}
        <h1 className="text-decoration-none"> X</h1>
      </button>
    </div>

    {/* Dismiss Button (optional, consider if it should auto-dismiss or only close on click) */}
  </div>
);

// Add this animation to your global CSS or Tailwind config if you don't have it
/*
@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
*/

export default EvePopup;
