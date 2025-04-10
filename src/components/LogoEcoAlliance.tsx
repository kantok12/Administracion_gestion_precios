import React from 'react';

interface LogoEcoAllianceProps {
  className?: string;
}

const LogoEcoAlliance: React.FC<LogoEcoAllianceProps> = ({ className = '' }) => {
  return (
    <svg
      className={className}
      width="180"
      height="65"
      viewBox="0 0 180 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Círculo principal */}
      <circle cx="32.5" cy="32.5" r="24" fill="#F0F9FF" stroke="#0369A1" strokeWidth="2" />
      
      {/* Gráfico de crecimiento */}
      <path 
        d="M17 38.5L24.5 30L31 35.5L40 24.5L47 31.5" 
        stroke="#0369A1" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      
      {/* Barras verticales */}
      <rect x="21" y="38" width="4" height="9" rx="1" fill="#60A5FA" />
      <rect x="30" y="35" width="4" height="12" rx="1" fill="#3B82F6" />
      <rect x="39" y="30" width="4" height="17" rx="1" fill="#2563EB" />
      
      {/* Hoja */}
      <path 
        d="M43 23C46.5 18 51.5 18.5 52 23C52.5 27.5 47 31 43 23Z" 
        fill="#DCFCE7" 
        stroke="#16A34A" 
        strokeWidth="1.5" 
      />
      
      {/* Flecha ascendente */}
      <path 
        d="M48 22L52 19L56 22" 
        stroke="#16A34A" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M52 19V27" 
        stroke="#16A34A" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
      />
      
      {/* Texto "Eco" */}
      <text x="72" y="32" fontSize="18" fontWeight="700" fill="#0369A1" letterSpacing="0.5">
        Eco
      </text>
      
      {/* Texto "Alliance" */}
      <text x="72" y="48" fontSize="16" fontWeight="600" fill="#16A34A" letterSpacing="0.5">
        Alliance
      </text>
    </svg>
  );
};

export default LogoEcoAlliance; 