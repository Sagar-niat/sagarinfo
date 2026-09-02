import React from 'react';

export const GlobeGraphic: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
      {/* Outer Neon Glow Halo */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-cyan-500/20 blur-3xl -bottom-10 pointer-events-none" />

      <svg
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-4xl h-auto drop-shadow-[0_0_35px_rgba(6,182,212,0.35)]"
      >
        {/* Globe Main Sphere Outline */}
        <ellipse cx="400" cy="320" rx="320" ry="320" stroke="url(#cyan-grad-1)" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
        <ellipse cx="400" cy="320" rx="280" ry="280" stroke="url(#cyan-grad-1)" strokeWidth="2" opacity="0.8" />

        {/* Latitude Lines */}
        <ellipse cx="400" cy="320" rx="280" ry="80" stroke="url(#cyan-grad-2)" strokeWidth="1.2" opacity="0.7" />
        <ellipse cx="400" cy="240" rx="240" ry="60" stroke="url(#cyan-grad-2)" strokeWidth="1" opacity="0.5" />
        <ellipse cx="400" cy="180" rx="180" ry="40" stroke="url(#cyan-grad-2)" strokeWidth="1" opacity="0.4" />
        <ellipse cx="400" cy="400" rx="240" ry="60" stroke="url(#cyan-grad-2)" strokeWidth="1" opacity="0.5" />

        {/* Longitude Curved Arc Lines */}
        <path d="M400,40 Q280,320 400,600" stroke="url(#cyan-grad-1)" strokeWidth="1.5" opacity="0.7" />
        <path d="M400,40 Q520,320 400,600" stroke="url(#cyan-grad-1)" strokeWidth="1.5" opacity="0.7" />
        <path d="M400,40 Q160,320 400,600" stroke="url(#cyan-grad-2)" strokeWidth="1" opacity="0.4" />
        <path d="M400,40 Q640,320 400,600" stroke="url(#cyan-grad-2)" strokeWidth="1" opacity="0.4" />

        {/* Glowing Network Connection Arcs & Beams */}
        <path d="M220,260 Q400,120 580,260" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
        <path d="M280,340 Q420,180 540,360" stroke="#06B6D4" strokeWidth="2" strokeDasharray="8 6" opacity="0.85" />
        <path d="M340,220 Q480,290 460,420" stroke="#818CF8" strokeWidth="2" opacity="0.7" />

        {/* Glowing Data Nodes (Dots) */}
        <circle cx="220" cy="260" r="5" fill="#38BDF8" className="animate-pulse-cyan" />
        <circle cx="580" cy="260" r="6" fill="#06B6D4" className="animate-pulse-cyan" />
        <circle cx="400" cy="180" r="4" fill="#818CF8" />
        <circle cx="280" cy="340" r="5" fill="#38BDF8" />
        <circle cx="540" cy="360" r="5" fill="#06B6D4" className="animate-pulse-cyan" />
        <circle cx="460" cy="420" r="4" fill="#38BDF8" />

        {/* Outer Orbital Rings */}
        <ellipse cx="400" cy="320" rx="340" ry="120" stroke="url(#cyan-grad-1)" strokeWidth="1" strokeDasharray="12 8" opacity="0.4" />

        <defs>
          <linearGradient id="cyan-grad-1" x1="0" y1="0" x2="800" y2="500" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" />
            <stop offset="0.5" stopColor="#06B6D4" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="cyan-grad-2" x1="400" y1="40" x2="400" y2="600" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="1" stopColor="#0F172A" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
