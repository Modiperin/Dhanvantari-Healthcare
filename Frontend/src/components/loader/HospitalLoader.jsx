import { useState, useEffect } from "react";

const loadingMessages = [
  "Preparing your workspace...",
  "Initializing patient records...",
  "Setting up appointments...",
];

const HospitalLoader = () => {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#F0F7FF] to-blue-100 flex items-center justify-center z-50 overflow-hidden">
      {/* Floating background circles */}
      <div className="absolute w-24 h-24 bg-blue-50 rounded-full top-[10%] left-[10%] animate-float"></div>
      <div className="absolute w-16 h-16 bg-blue-50 rounded-full top-[70%] right-[15%] animate-float-delayed-2"></div>
      <div className="absolute w-20 h-20 bg-blue-50 rounded-full bottom-[20%] left-[20%] animate-float-delayed-4"></div>

      <div className="text-center relative z-10">
        {/* Medical Cross Loader */}
        <div className="relative w-16 h-16 mx-auto mb-8">
          <div className="absolute inset-0 w-16 h-16 border-2 border-blue-200 border-t-blue-400 rounded-full animate-spin"></div>
          <div className="absolute -inset-2 w-20 h-20 border-2 border-blue-100 border-r-emerald-400/60 rounded-full animate-spin-reverse"></div>
          <div className="absolute top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2">
            <div className="absolute w-1.5 h-10 bg-emerald-400 rounded-sm left-1/2 -translate-x-1/2 animate-pulse-cross"></div>
            <div className="absolute w-10 h-1.5 bg-emerald-400 rounded-sm top-1/2 -translate-y-1/2 animate-pulse-cross"></div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-52 h-1 bg-blue-100 rounded-full mx-auto mb-5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full shadow-lg animate-loading-progress"></div>
        </div>

        {/* Animated Loading Message */}
        <div className="h-6 flex items-center justify-center mb-5">
          <div className="text-blue animate-message-slide drop-shadow-sm">
            {loadingMessages[currentMessage]}
          </div>
        </div>

        {/* Status Dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="w-2 h-2 bg-blue-300 rounded-full animate-dot-pulse"
              style={{ animationDelay: `${index * 0.2}s` }}
            ></div>
          ))}
        </div>

        {/* Security Badge */}
        <div className="flex items-center space-x-2 text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-full mt-8 mx-auto w-max">
          <svg
            className="w-4 h-4 text-emerald-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L3 7v4c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
          </svg>
          <span>HIPAA Compliant & Secure</span>
        </div>
      </div>
    </div>
  );
};

export default HospitalLoader;
