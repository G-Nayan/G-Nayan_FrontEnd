
// import React from "react";
// // Make sure this path is correct relative to your project structure
// // If 'bot' is an image file (like bot.png or bot.svg) in src/assets:
// import { bot } from "@/assets"; // Adjust the filename if necessary (e.g., bot.svg)

// // If 'bot' is exported from an index file in src/assets:
// // import { bot as botImage } from '@/assets';

// const EvePopup = ({ onClose }) => (
//   // Added mb-2 to give slight space above the button
//   <div className="absolute bottom-full right-0 mb-2 flex flex-col items-center animate-fade-in w-max max-w-xs">
//     {/* Tooltip Arrow */}
//     {/* <div className="absolute bottom-[-4px] right-[calc(50%-4px)] w-3 h-3 bg-white rotate-45 transform shadow-md"></div> */}

//     {/* Popup Content */}
//     <div className="relative  bg-white text-gray-800 text-sm px-4 py-3 rounded-lg shadow-xl border border-gray-200 flex items-center space-x-3">
//       <img
//         src={bot} // Use the imported image source
//         alt="G-Nayana Assistant" // More descriptive alt text
//         className="w-12 h-12 rounded-lg" // Slightly smaller image size for popup
//       />
//       <span className="font-medium">
//         👋 Hi there! Need help <br /> with eye care? Chat with me!
//       </span>
//       <button
//         onClick={onClose}
//         className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline focus:outline-none"
//       >
//         {/* x icon */}
//         <h1 className="text-decoration-none"> X</h1>
//       </button>
//     </div>

//     {/* Dismiss Button (optional, consider if it should auto-dismiss or only close on click) */}
//   </div>
// );

// // Add this animation to your global CSS or Tailwind config if you don't have it
// /*
// @keyframes fade-in {
//   0% { opacity: 0; transform: translateY(10px); }
//   100% { opacity: 1; transform: translateY(0); }
// }
// .animate-fade-in {
//   animation: fade-in 0.5s ease-out forwards;
// }
// */

// export default EvePopup;
import React from "react";
import { X } from "lucide-react"; // Import the X icon

// --- IMPORTANT ---
// Verify this import path is correct for your project structure.
// 'bot' should be the imported image source (e.g., import bot from './assets/bot_avatar.png';)
import { bot } from "@/assets";
// ---------------

// Define the animation in your global CSS (e.g., index.css or app.css)
/*
@keyframes fade-slide-in-up {
  0% {
    opacity: 0;
    transform: translateY(10px) translateX(-50%); // Start slightly down
  }
  100% {
    opacity: 1;
    transform: translateY(0) translateX(-50%); // End at final position
  }
}

.animate-fade-slide-in-up {
  transform: translateX(-50%); // Needed for initial centering before animation
  animation: fade-slide-in-up 0.4s ease-out forwards;
}
*/

// Interface for props (good practice)
interface EvePopupProps {
  onClose: () => void;
}

const EvePopup: React.FC<EvePopupProps> = ({ onClose }) => {
  return (
    // Position centered above the parent, add fade-in animation and z-index
    <div
      className="absolute bottom-full right-1/2 mb-3 w-max max-w-[260px] z-10
                 animate-fade-slide-in-up" // Uses the custom animation class
    >
      <div className="relative flex flex-col items-center">
        {/* Popup Content Box */}
        <div
          className="bg-gradient-to-br from-blue-600 to-teal-600 text-white // Changed background for better visibility
                     rounded-xl shadow-xl border border-blue-700 // Softer corners, shadow,
                     p-4 flex items-center space-x-3" // Padding and layout
        >
          {/* Bot Avatar */}
          <img
            src={bot} // Use the imported image source
            alt="G-Nayana Assistant Avatar"
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-white/50" // Circular avatar
          />

          {/* Message Text */}
          <span className="text-sm font-medium leading-snug">
            Hi! I'm <strong>G-Nayana</strong>, your eye health assistant. Click the eye below to chat!
          </span>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Dismiss popup"
            className="absolute -top-2 -right-2 p-1 bg-white text-gray-600 rounded-full shadow-md hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tooltip Arrow pointing down */}
        <div
          className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 // Centered arrow
                     w-4 h-4 bg-teal-600 // Matches the bottom gradient color
                     rotate-45 border-r border-b border-blue-700 // Create arrow shape and match border
                     clip-path-polygon-[0%_0%,_100%_100%,_0%_100%]" // Optional: Clip for cleaner edges if border looks odd
          // Note: Basic rotation might be sufficient without clip-path if border looks ok
        />
      </div>
    </div>
  );
};

export default EvePopup;