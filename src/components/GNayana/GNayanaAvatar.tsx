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
      {/* Robot head outline */}
      <div 
        className="absolute rounded-lg border-2 border-white/80 bg-white/20"
        style={{ 
          width: sizeMap[size].width * 1.8, 
          height: sizeMap[size].height * 1.4,
          animationDuration: '3s'
        }}
      >
        {/* Antenna */}
        <div 
          className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 bg-white/80"
          style={{ 
            height: sizeMap[size].height * 0.3 
          }}
        />
      </div>
      
      {/* Robot eyes */}
      <div className="flex space-x-1">
        <div 
          className="rounded-full bg-cyan-400" 
          style={{ 
            width: sizeMap[size].width * 0.4, 
            height: sizeMap[size].height * 0.4,
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.6)'
          }}
        />
        <div 
          className="rounded-full bg-cyan-400" 
          style={{ 
            width: sizeMap[size].width * 0.4, 
            height: sizeMap[size].height * 0.4,
            boxShadow: '0 0 10px rgba(34, 211, 238, 0.6)'
          }}
        />
      </div>
    </div>
  );
};

export default GNayanaAvatar;
