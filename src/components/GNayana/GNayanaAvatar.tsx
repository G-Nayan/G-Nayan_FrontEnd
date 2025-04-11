
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type GNayanaAvatarProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const GNayanaAvatar: React.FC<GNayanaAvatarProps> = ({ 
  size = "md",
  className 
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16"
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage src="" /> {/* We'll use the fallback */}
      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-indigo-800 text-white flex items-center justify-center">
        <EyeIcon size={size} />
      </AvatarFallback>
    </Avatar>
  );
};

// Custom animated eye icon
const EyeIcon = ({ size }: { size: string }) => {
  const sizeMap = {
    sm: { width: 14, height: 14 },
    md: { width: 18, height: 18 },
    lg: { width: 28, height: 28 }
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer eye shape */}
      <div 
        className="absolute rounded-full border-2 border-white/80 bg-white/20 animate-pulse"
        style={{ 
          width: sizeMap[size].width * 1.8, 
          height: sizeMap[size].height, 
          animationDuration: '3s'
        }}
      ></div>
      
      {/* Iris */}
      <div 
        className="rounded-full bg-white/90" 
        style={{ 
          width: sizeMap[size].width * 0.7, 
          height: sizeMap[size].height * 0.7 
        }}
      >
        {/* Pupil */}
        <div 
          className="rounded-full bg-indigo-900 mx-auto" 
          style={{ 
            width: sizeMap[size].width * 0.3, 
            height: sizeMap[size].height * 0.3 
          }}
        ></div>
      </div>
    </div>
  );
};

export default GNayanaAvatar;
