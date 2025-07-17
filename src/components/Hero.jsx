import React from "react";
import Button from "./Button";
import GNayanaBot from "@/components/GNayana/GNayanaBot";

const Hero = () => {
  return (
    <section
      className="pt-[12rem] -mt-[5.25rem] overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #e0f2fe 0%, #ffffff 100%)",
      }}
 >
      <div className="container relative">
        <div className="relative z-1 max-w-[62rem] mx-auto text-center mb-[3.875rem] md:mb-20 lg:mb-[6.25rem]">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-blue-900">
            <span className="inline-block relative">
              G-NAYANA{" "}
              <svg
                viewBox="0 0 624 28"
                fill="none"
                className="absolute top-full left-0 w-full xl:-mt-2"
              >
                <defs>
                  <linearGradient id="threeColorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EF4444" />
                  </linearGradient>
                </defs>
                <path
                  d="M3 25C142.5 3.5 290.5 3.5 621 25"
                  stroke="url(#threeColorGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-6" style={{ color: "#1e40af" }}>
            Your AI-Powered Guardian for Early Diabetic Retinopathy Detection.
          </p>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8" style={{ color: "#1e40af" }}>
            Fast and Accurate
          </p>
          {/* <Button href="https://retinopathy-dashboard.vercel.app/">Get started</Button> */}
        </div>

       
      </div>
      <GNayanaBot />
    </section>
  );
};

export default Hero;