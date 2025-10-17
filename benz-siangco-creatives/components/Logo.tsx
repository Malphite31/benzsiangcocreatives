import React from 'react';

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 460 40" xmlns="http://www.w3.org/2000/svg" {...props}>
    <text 
      x="0" 
      y="30" 
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'" 
      fontSize="32" 
      fontWeight="bold" 
      fill="currentColor"
      letterSpacing="-0.5"
    >
      Benz Siangco Creatives
    </text>
  </svg>
);