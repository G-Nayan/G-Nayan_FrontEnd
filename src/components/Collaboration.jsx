import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { brainwaveSymbol, check } from "../assets";
import { collabApps, collabContent } from "../constants";
import Button from "./Button";
import Section from "./Section";

const Collaboration = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Section id="detection" className="overflow-hidden">
      <div className="container lg:flex lg:items-center lg:gap-12">
        <div className="max-w-[30rem] mb-10 lg:mb-0 lg:flex-1">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 lg:leading-tight text-blue-900">
            AI-Powered Retinal Disease Detection
          </h2>
          
          <ul className="grid gap-y-5 mb-8 md:mb-11">
            {collabContent.map((item) => (
              <li className="flex items-start" key={item.id}>
                <img src={check} width={24} height={24} alt="check" className="flex-shrink-0 mt-1" />
                <div className="ml-4">
                  <h6 className="text-base font-semibold mb-1" style={{ color: "#1e40af" }}>{item.title}</h6>
                  {item.text && (
                    <p className="text-sm text-blue-600">{item.text}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          
          <Button href="/pricing">Learn More</Button>
        </div>
        
        <div className="flex items-center justify-center lg:flex-1">
          <div className="relative flex w-[22rem] md:w-[25rem] lg:w-[30rem] aspect-square border border-blue-200 rounded-full bg-gradient-to-b from-blue-50 to-white">
            <div className="flex w-[60%] aspect-square m-auto border border-blue-300 rounded-full">
              <div className="w-[60%] aspect-square m-auto p-[0.2rem] bg-conic-gradient rounded-full">
                <motion.div
                  className="flex items-center justify-center w-full h-full bg-white rounded-full"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img
                    src={brainwaveSymbol}
                    width={48}
                    height={48}
                    alt="brainwave"
                  />
                </motion.div>
              </div>
            </div>
            
            <motion.ul
              style={{ transform: `rotate(${rotation}deg)` }}
              className="absolute inset-0"
            >
              {collabApps.map((app, index) => (
                <li
                  key={app.id}
                  className="absolute top-0 left-1/2 h-1/2 -ml-[1.6rem] origin-bottom"
                  style={{ transform: `rotate(${index * 45}deg)` }}
                >
                  <div
                    className="relative -top-[1.6rem] flex w-[3.2rem] h-[3.2rem] bg-white border border-blue-200 rounded-xl shadow-lg"
                    style={{ transform: `rotate(-${rotation + index * 45}deg)` }}
                  >
                    <img
                      className="m-auto"
                      width={app.width}
                      height={app.height}
                      alt={app.title}
                      src={app.icon}
                    />
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Collaboration;