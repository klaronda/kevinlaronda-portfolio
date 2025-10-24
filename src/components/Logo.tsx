import React from 'react';
import logoImage from 'figma:asset/cb2d190e89a3d72c3cbb50955a1ad11ade7437a2.png';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className = '', size = 32 }: LogoProps) {
  return (
    <img
      src={logoImage}
      alt="Kevin Laronda Logo"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

// Same as Logo - keeping for compatibility
export function LogoMinimal({ className = '', size = 32 }: LogoProps) {
  return (
    <img
      src={logoImage}
      alt="Kevin Laronda Logo"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

// Icon version with background container
export function LogoIcon({ className = '', size = 24 }: LogoProps) {
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-lg bg-white shadow-sm border border-gray-200 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoImage}
        alt="Kevin Laronda Logo"
        width={size * 0.7}
        height={size * 0.7}
        className="object-contain"
        style={{ width: size * 0.7, height: size * 0.7 }}
      />
    </div>
  );
}

// Dark version for dark backgrounds
export function LogoIconDark({ className = '', size = 24 }: LogoProps) {
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-lg bg-gray-900 shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logoImage}
        alt="Kevin Laronda Logo"
        width={size * 0.7}
        height={size * 0.7}
        className="object-contain filter invert"
        style={{ width: size * 0.7, height: size * 0.7 }}
      />
    </div>
  );
}