import React from "react";

interface ValveLogoProps {
  className?: string;
  size?: number;
  variant?: "engine-valve" | "twin-valves" | "classic";
}

/**
 * VALVES Monogram:
 * Modeled precisely after an automotive engine poppet valve (صباب ماتور عربية):
 * - Top retainer collet lock (تيلة الصباب)
 * - Ground precision cylindrical stem (ساق الصباب)
 * - Heavy-duty helical valve spring (سوستة الصباب) in oxidized copper
 * - Lower spring seat washer
 * - Aerodynamic tulip flare neck (رقبة الصباب)
 * - 45° precision ground valve seat face & margin (قرص وشامفر الصباب)
 */
export const ValveLogo: React.FC<ValveLogoProps> = ({
  className = "w-6 h-6",
  size,
  variant = "engine-valve",
}) => {
  if (variant === "twin-valves") {
    return (
      <svg
        viewBox="0 0 100 100"
        width={size || 28}
        height={size || 28}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
        aria-label="VALVES Twin Engine Valves"
      >
        {/* Left Angled Valve */}
        <g transform="rotate(-18 50 88)">
          <polygon points="42,12 58,12 56,17 44,17" fill="currentColor" />
          <rect x="47.5" y="17" width="5" height="52" fill="currentColor" />
          <path
            d="M 40 25 L 60 22 M 40 35 L 60 32 M 40 45 L 60 42 M 40 55 L 60 52"
            stroke="var(--accent, #A64B2A)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 47.5 67 C 47.5 73 35 77 28 81 L 72 81 C 65 77 52.5 73 52.5 67 Z"
            fill="currentColor"
          />
          <polygon points="26,81 74,81 69,86 31,86" fill="var(--accent, #A64B2A)" />
          <rect x="31" y="86" width="38" height="2" fill="currentColor" />
        </g>
        {/* Right Angled Valve */}
        <g transform="rotate(18 50 88)">
          <polygon points="42,12 58,12 56,17 44,17" fill="currentColor" opacity="0.9" />
          <rect x="47.5" y="17" width="5" height="52" fill="currentColor" opacity="0.9" />
          <path
            d="M 40 25 L 60 22 M 40 35 L 60 32 M 40 45 L 60 42 M 40 55 L 60 52"
            stroke="var(--accent, #A64B2A)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M 47.5 67 C 47.5 73 35 77 28 81 L 72 81 C 65 77 52.5 73 52.5 67 Z"
            fill="currentColor"
            opacity="0.9"
          />
          <polygon points="26,81 74,81 69,86 31,86" fill="var(--accent, #A64B2A)" />
          <rect x="31" y="86" width="38" height="2" fill="currentColor" />
        </g>
      </svg>
    );
  }

  if (variant === "classic") {
    return (
      <svg
        viewBox="0 0 512 512"
        width={size || 28}
        height={size || 28}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={size ? { width: size, height: size } : undefined}
        aria-label="VALVES Monogram Classic"
      >
        <path d="M 130 140 L 195 140 L 256 295 L 222 295 Z" fill="currentColor" opacity="0.85" />
        <path d="M 382 140 L 317 140 L 256 295 L 290 295 Z" fill="currentColor" opacity="0.75" />
        <path d="M 180 200 L 256 385 L 332 200 L 294 200 L 256 295 L 218 200 Z" fill="currentColor" />
        <polygon points="256,325 242,275 270,275" fill="var(--accent, #A64B2A)" />
      </svg>
    );
  }

  // DEFAULT: Car Engine Poppet Valve with Spring (صباب ماتور عربية أصلي)
  return (
    <svg
      viewBox="0 0 100 100"
      width={size || 28}
      height={size || 28}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      aria-label="VALVES Car Engine Valve"
    >
      {/* Top Retainer Collet Cap (تيلة الصباب) */}
      <polygon points="39,13 61,13 58,19 42,19" fill="currentColor" />
      <line x1="41" y1="15" x2="59" y2="15" stroke="var(--accent, #A64B2A)" strokeWidth="1.5" />

      {/* Central Polished Valve Stem (ساق الصباب) */}
      <rect x="47" y="19" width="6" height="50" fill="currentColor" />

      {/* High-Tension Helical Valve Spring Coils (سوستة الصباب) in Oxidized Copper */}
      <path
        d="M 37 28 L 63 24 M 37 37 L 63 33 M 37 46 L 63 42 M 37 55 L 63 51 M 37 64 L 63 60"
        stroke="var(--accent, #A64B2A)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Lower Spring Seat Washer (قاعدة السوستة) */}
      <rect x="40" y="66" width="20" height="3" fill="currentColor" />

      {/* Aerodynamic Tulip Flare Neck (رقبة الصباب الانسيابية) */}
      <path
        d="M 47 69 C 47 77 29 81 21 86 L 79 86 C 71 81 53 77 53 69 Z"
        fill="currentColor"
      />

      {/* 45-degree Ground Valve Seat Face (شامفر زاوية الصباب) */}
      <polygon points="17,86 83,86 77,92 23,92" fill="var(--accent, #A64B2A)" />

      {/* Valve Margin Base & Head Rim (قرص ورأس الصباب) */}
      <rect x="23" y="92" width="54" height="2.5" fill="currentColor" />
      <ellipse cx="50" cy="94" rx="15" ry="1" fill="var(--accent, #A64B2A)" opacity="0.6" />
    </svg>
  );
};

export default ValveLogo;
