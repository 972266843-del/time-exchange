
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'size-8',
    md: 'size-12',
    lg: 'size-24'
  };

  return (
    <div className={`relative flex items-center justify-center ${dimensions[size]}`}>
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-brand-green/10 blur-xl rounded-full animate-pulse"></div>
      
      {/* Logo Shapes */}
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 overflow-visible">
        <defs>
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8BAA91" />
            <stop offset="100%" stopColor="#8D8176" />
          </linearGradient>
        </defs>
        
        {/* Stylized Hourglass / Infinity / Exchange paths */}
        <path 
          d="M30 20 Q50 50 30 80 L70 80 Q50 50 70 20 Z" 
          fill="url(#logoGrad)" 
          className="animate-hourglass origin-center"
        />
        
        {/* Floating Particles */}
        <circle cx="50" cy="50" r="3" fill="#FFFFFF" opacity="0.8" className="animate-bounce">
          <animate attributeName="cy" values="30;70;30" dur="4s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default Logo;
