import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SuccessAnimationProps {
  onContinue: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ onContinue }) => {
  const [animationStage, setAnimationStage] = useState(0);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setAnimationStage(1), 100),
      setTimeout(() => setAnimationStage(2), 300),
      setTimeout(() => setAnimationStage(3), 800),
      setTimeout(() => setAnimationStage(4), 1100),
      setTimeout(() => setAnimationStage(5), 1300),
      setTimeout(() => setAnimationStage(6), 1700),
    ];
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 backdrop-blur-sm">
      {/* Card */}
      <div
        className={cn(
          'relative p-12 rounded-3xl bg-white/80 backdrop-blur-lg border border-white/30 shadow-2xl transition-all duration-700 ease-out',
          'before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-white/50 before:to-transparent before:pointer-events-none',
          animationStage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        )}
      >
        <div className="relative flex flex-col items-center">
          {/* Animated green circle */}
          <div
            className={cn(
              'relative w-24 h-24 rounded-full bg-gradient-to-br from-green-400/30 to-emerald-500/30 backdrop-blur-sm border border-green-300/40 shadow-lg flex items-center justify-center',
              'before:absolute before:inset-[-2px] before:rounded-full before:bg-gradient-to-br before:from-green-300/20 before:to-transparent before:blur-sm',
              animationStage >= 2 ? 'animate-bounce-in opacity-100' : 'opacity-0 scale-0'
            )}
          >
            {animationStage >= 3 && (
              <Check
                className="w-12 h-12 text-green-600 animate-draw-check"
                strokeWidth={2.5}
              />
            )}
          </div>

          {/* Confetti particles */}
          {animationStage >= 4 && (
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-70 animate-confetti-burst"
                  style={
                    {
                      left: '50%',
                      top: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-40px)`,
                      '--rotation': `${i * 30}deg`,
                    } as React.CSSProperties & Record<string, string>
                  }
                />
              ))}
            </div>
          )}

          {/* Message */}
          <div
            className={cn(
              'mt-8 text-center transition-all duration-400 ease-in-out',
              animationStage >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Patient Registered Successfully!
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Ready to upload retinopathy images for analysis
            </p>
          </div>

          {/* Button */}
          <Button
            onClick={onContinue}
            className={cn(
              'mt-8 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-2xl shadow-lg',
              'transition-all duration-200 transform hover:scale-105 active:scale-95',
              'relative overflow-hidden',
              animationStage >= 6 ? 'animate-pop-in opacity-100' : 'opacity-0 scale-90'
            )}
          >
            <span className="relative z-10">Upload Retinopathy Images</span>
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-white/20 scale-0 rounded-full transition-transform duration-300 ease-out hover:scale-150" />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
