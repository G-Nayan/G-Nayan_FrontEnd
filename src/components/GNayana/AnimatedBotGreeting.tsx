// src/components/FriendlyBotGreeting.tsx (adjust path as needed)
import React from 'react';
import { Button } from '@/components/ui/button'; // Assuming Shadcn UI Button
import { MessageCircle, Zap } from 'lucide-react'; // Or other relevant icons

// --- CSS Styles ---
// IMPORTANT: Add these @keyframes and the associated animation classes
// to your global CSS file (e.g., index.css, app.css) for best practice.
const css = `
  /* Entrance animation for the whole component */
  @keyframes greeting-popup-enter {
    0% {
      opacity: 0;
      transform: translateY(60px) scale(0.8);
    }
    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Bot floating */
  @keyframes bot-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); } /* Floating height */
  }

  /* Eye 'looking' animation (subtle pupil movement) */
  @keyframes eye-look {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-1px, -0.5px); } /* Look left-up */
    50% { transform: translate(0, 0); }        /* Center */
    75% { transform: translate(1px, -0.5px); } /* Look right-up */
  }

   /* Simple eye blink */
  @keyframes eye-blink {
    0%, 90%, 100% { transform: scaleY(1); }
    95% { transform: scaleY(0.1); } /* Blink */
  }


  /* Arm waving */
  @keyframes arm-wave {
    0% { transform: rotate(-10deg); }
    50% { transform: rotate(25deg); } /* Wave up */
    100% { transform: rotate(-10deg); }/* Back down */
  }

  /* Speech bubble entrance */
  @keyframes bubble-appear {
     0% { opacity: 0; transform: scale(0.8) translateY(10px); }
     100% { opacity: 1; transform: scale(1) translateY(0); }
  }

  /* Button pulse */
   @keyframes button-throb {
    0%, 100% { transform: scale(1); box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1); }
    50% { transform: scale(1.05); box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15); }
  }

  /* --- Animation Classes --- */
  .animate-greeting-popup-enter {
    animation: greeting-popup-enter 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; /* Overshoot bounce */
  }

  .bot-float-group {
    animation: bot-float 4s ease-in-out infinite;
    animation-delay: 0.7s; /* Start float after entrance */
  }

  .bot-pupil-animated {
    animation: eye-look 6s ease-in-out infinite;
    animation-delay: 1.5s; /* Start looking around */
  }

  .bot-eye-blink-animated {
     transform-origin: center;
     animation: eye-blink 4.5s ease-in-out infinite;
     animation-delay: 2.0s; /* Start blinking */
  }

  .bot-arm-wave {
    transform-origin: 5px 10px; /* Adjust pivot point near shoulder */
    animation: arm-wave 1.6s ease-in-out infinite;
    animation-delay: 1.2s; /* Start waving */
  }

   .animate-bubble-appear {
     transform-origin: bottom center;
     animation: bubble-appear 0.5s ease-out forwards;
     animation-delay: 1.0s; /* Appear after bot starts animating */
     opacity: 0; /* Start hidden */
   }

   .animate-button-throb {
      animation: button-throb 2.2s ease-in-out infinite;
      animation-delay: 1.8s; /* Start button animation last */
   }
`;

interface FriendlyBotGreetingProps {
  isVisible: boolean;
  onOpenChat: () => void; // Function to trigger opening the main chat toggle/window
}

const FriendlyBotGreeting: React.FC<FriendlyBotGreetingProps> = ({
  isVisible,
  onOpenChat,
}) => {
  // Color Palette (Inspired by image)
  const colors = {
    gradStart: '#4FD1C5', // Teal-ish
    gradEnd: '#A7F3D0',   // Light Green-ish
    faceplate: '#1A202C', // Dark Gray/Black
    eyesBase: '#000000',
    eyesPupil: '#FFFFFF',
    eyesHighlight: 'rgba(255, 255, 255, 0.8)',
    mouth: '#FFFFFF',
    antenna: '#6EE7B7', // Lighter green
    bubbleGradStart: 'rgba(167, 243, 208, 0.9)', // Light green transparent
    bubbleGradEnd: 'rgba(79, 209, 197, 0.9)', // Teal transparent
    bubbleTextStart: '#0694A2', // Darker Teal
    bubbleTextEnd: '#34D399', // Darker Green
    buttonBg: '#38B2AC', // Teal button
    buttonHoverBg: '#2C7A7B',
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed bottom-6 right-4 z-40 flex flex-col items-center animate-greeting-popup-enter mb-16"
      aria-live="polite"
    >
      {/* Inject styles (Remove if not needed globally) */}
      <style>{css}</style>

      {/* Speech Bubble */}
      <div
        className="relative mb-4 px-4 py-1 rounded-full shadow-md animate-bubble-appear" // Rounded bubble
        style={{
            background: `linear-gradient(to right, ${colors.bubbleGradStart}, ${colors.bubbleGradEnd})`,
            minWidth: '100px', // Ensure it has some width
         }}
      >
        {/* Text with Gradient */}
        <span
          className="text-base whitespace-nowrap bg-clip-text text-transparent"
           style={{ backgroundImage: `linear-gradient(to right, ${colors.bubbleTextStart}, ${colors.bubbleTextEnd})`}}
        >
            Hello! Need help?
        </span>

         {/* Bubble Tail */}
        <div
          className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-4 h-4 rotate-45"
           style={{ background: `linear-gradient(135deg, ${colors.bubbleGradStart}, ${colors.bubbleGradEnd})` }} // Match gradient direction
        />
      </div>

      {/* Bot Container */}
      <div className="relative w-[90px] h-[80px]" style={{ filter: 'drop-shadow(0px 5px 10px rgba(0, 80, 80, 0.2))' }}>
        <svg
          viewBox="0 0 100 110" // Adjusted viewBox
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full bot-float-group" // Float animation
        >
          {/* Defs for Gradients */}
          <defs>
            <linearGradient id="botBodyGrad" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stopColor={colors.gradEnd} />
              <stop offset="100%" stopColor={colors.gradStart} />
            </linearGradient>
             {/* Optional: Radial Shine */}
             <radialGradient id="botShine" cx="50%" cy="25%" r="60%" fx="50%" fy="20%">
                 <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                 <stop offset="100%" stopColor="rgba(255,255,255,0)" />
             </radialGradient>
          </defs>

          {/* Main Group */}
          <g>
             {/* Waving Arm */}
             <g className="bot-arm-wave" transform="translate(70, 65)">
                 <path d="M 0,0 C 10,5 15,20 8,30 C 1,40 -5,35 0,25 Z" fill="url(#botBodyGrad)" stroke={colors.gradStart} strokeWidth="0.5"/>
             </g>

             {/* Body */}
             <path d="M 50,15 C 20,15 5,35 5,60 C 5,90 25,105 50,105 C 75,105 95,90 95,60 C 95,35 80,15 50,15 Z" fill="url(#botBodyGrad)"/>
             <path d="M 50,15 C 20,15 5,35 5,60 C 5,90 25,105 50,105 C 75,105 95,90 95,60 C 95,35 80,15 50,15 Z" fill="url(#botShine)"/> {/* Shine Overlay */}

            {/* Antenna */}
            <line x1="50" y1="18" x2="50" y2="5" stroke={colors.antenna} strokeWidth="2" />
            <circle cx="50" cy="5" r="4" fill={colors.antenna} />

             {/* Faceplate */}
             <path d="M 20,35 Q 18,30 25,30 H 75 Q 82,30 80,35 V 65 Q 80,75 70,75 H 30 Q 20,75 20,65 Z" fill={colors.faceplate}/>

             {/* Eyes Group */}
             <g className="bot-eye-blink-animated">
                 {/* Eye Base (Black) */}
                 <circle cx="38" cy="52" r="10" fill={colors.eyesBase} />
                 <circle cx="62" cy="52" r="10" fill={colors.eyesBase} />
                 {/* Pupil (White) - Animated */}
                 <g className="bot-pupil-animated">
                    <circle cx="38" cy="52" r="6" fill={colors.eyesPupil} />
                    <circle cx="62" cy="52" r="6" fill={colors.eyesPupil} />
                 </g>
                 {/* Highlights */}
                 <circle cx="42" cy="48" r="2.5" fill={colors.eyesHighlight} opacity="0.9" />
                 <circle cx="66" cy="48" r="2.5" fill={colors.eyesHighlight} opacity="0.9" />
             </g>

             {/* Mouth */}
             <path d="M 35 68 Q 50 75 65 68" stroke={colors.mouth} strokeWidth="2" fill="none" strokeLinecap="round"/>
          </g>
        </svg>
      </div>

      {/* Action Button */}
      {/* <Button
        onClick={onOpenChat}
        className="mt-3 animate-button-throb px-4 py-2 rounded-md shadow-md font-semibold text-white transition-colors duration-200"
        style={{ backgroundColor: colors.buttonBg }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = colors.buttonHoverBg}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = colors.buttonBg}
        aria-label="Open Chat Assistant"
      >
        <Zap className="mr-2 h-4 w-4 animate-pulse" /> 
        Chat Now!
      </Button> */}
    </div>
  );
};

export default FriendlyBotGreeting;