import React from 'react';
import { CrystalColor, CrystalPieceData, Direction } from '../types/game';

interface CrystalPieceProps {
  piece: CrystalPieceData;
  isHinted?: boolean;
  onTap: (piece: CrystalPieceData) => void;
}

const COLOR_CONFIGS: Record<CrystalColor, {
  primary: string;
  secondary: string;
  dark: string;
  glow: string;
  facetLight: string;
  facetDark: string;
  accent: string;
}> = {
  cyan: {
    primary: '#06b6d4',
    secondary: '#0891b2',
    dark: '#0e7490',
    glow: 'rgba(6, 182, 212, 0.75)',
    facetLight: 'rgba(255, 255, 255, 0.35)',
    facetDark: 'rgba(12, 74, 96, 0.55)',
    accent: '#a5f3fc',
  },
  magenta: {
    primary: '#f43f5e',
    secondary: '#e11d48',
    dark: '#9f1239',
    glow: 'rgba(244, 63, 94, 0.75)',
    facetLight: 'rgba(255, 255, 255, 0.35)',
    facetDark: 'rgba(136, 19, 55, 0.55)',
    accent: '#fecdd3',
  },
  emerald: {
    primary: '#10b981',
    secondary: '#059669',
    dark: '#047857',
    glow: 'rgba(16, 185, 129, 0.75)',
    facetLight: 'rgba(255, 255, 255, 0.35)',
    facetDark: 'rgba(6, 78, 59, 0.55)',
    accent: '#a7f3d0',
  },
  amber: {
    primary: '#f59e0b',
    secondary: '#d97706',
    dark: '#b45309',
    glow: 'rgba(245, 158, 11, 0.75)',
    facetLight: 'rgba(255, 255, 255, 0.4)',
    facetDark: 'rgba(120, 53, 15, 0.55)',
    accent: '#fef08a',
  },
  violet: {
    primary: '#a855f7',
    secondary: '#9333ea',
    dark: '#7e22ce',
    glow: 'rgba(168, 85, 247, 0.75)',
    facetLight: 'rgba(255, 255, 255, 0.35)',
    facetDark: 'rgba(88, 28, 135, 0.55)',
    accent: '#f3e8ff',
  },
  blue: {
    primary: '#3b82f6',
    secondary: '#2563eb',
    dark: '#1d4ed8',
    glow: 'rgba(59, 130, 246, 0.75)',
    facetLight: 'rgba(255, 255, 255, 0.35)',
    facetDark: 'rgba(30, 58, 138, 0.55)',
    accent: '#bfdbfe',
  },
};

const DIRECTION_ROTATIONS: Record<Direction, number> = {
  up: 0,
  right: 90,
  down: 180,
  left: 270,
};

export const CrystalPiece: React.FC<CrystalPieceProps> = ({ piece, isHinted, onTap }) => {
  const config = COLOR_CONFIGS[piece.color] || COLOR_CONFIGS.cyan;
  const rotation = DIRECTION_ROTATIONS[piece.direction];

  // Dynamic exit vector for slide animation
  let exitTransform = '';
  if (piece.exiting) {
    switch (piece.direction) {
      case 'up':
        exitTransform = 'translateY(-300%) scale(0.85)';
        break;
      case 'down':
        exitTransform = 'translateY(300%) scale(0.85)';
        break;
      case 'left':
        exitTransform = 'translateX(-300%) scale(0.85)';
        break;
      case 'right':
        exitTransform = 'translateX(300%) scale(0.85)';
        break;
    }
  }

  const renderShapeGeometry = () => {
    const bgFill = `url(#bg_grad_${piece.id})`;

    switch (piece.shape) {
      case 'diamond':
        return (
          <>
            {/* Outer Diamond Rhombus */}
            <polygon
              points="50,8 92,50 50,92 8,50"
              fill={bgFill}
              stroke={config.accent}
              strokeWidth="2.5"
            />
            {/* Facets */}
            <polygon points="50,8 92,50 50,50" fill={config.facetLight} />
            <polygon points="50,92 92,50 50,50" fill={config.facetDark} />
            <polygon points="50,92 8,50 50,50" fill={config.facetLight} opacity="0.3" />
            <polygon points="50,8 8,50 50,50" fill={config.facetDark} opacity="0.5" />
            {/* Inner table diamond */}
            <polygon
              points="50,26 74,50 50,74 26,50"
              fill={config.primary}
              fillOpacity="0.4"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.9"
            />
          </>
        );

      case 'hexagon':
        return (
          <>
            {/* Outer Hexagon */}
            <polygon
              points="50,8 89,30 89,70 50,92 11,70 11,30"
              fill={bgFill}
              stroke={config.accent}
              strokeWidth="2.5"
            />
            {/* Inner Prismatic Facets */}
            <polygon points="50,8 89,30 50,50" fill={config.facetLight} />
            <polygon points="89,30 89,70 50,50" fill={config.facetDark} />
            <polygon points="89,70 50,92 50,50" fill={config.facetLight} opacity="0.3" />
            <polygon points="50,92 11,70 50,50" fill={config.facetDark} opacity="0.6" />
            <polygon points="11,70 11,30 50,50" fill={config.facetLight} opacity="0.4" />
            {/* Hex core table */}
            <polygon
              points="50,24 74,38 74,62 50,76 26,62 26,38"
              fill={config.primary}
              fillOpacity="0.35"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.9"
            />
          </>
        );

      case 'triangle':
        return (
          <>
            {/* Outer Chamfered Triangle */}
            <polygon
              points="50,10 90,82 10,82"
              fill={bgFill}
              stroke={config.accent}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Facets */}
            <polygon points="50,10 90,82 50,56" fill={config.facetLight} />
            <polygon points="90,82 10,82 50,56" fill={config.facetDark} />
            <polygon points="10,82 50,10 50,56" fill={config.facetLight} opacity="0.3" />
            {/* Inner core */}
            <polygon
              points="50,28 75,72 25,72"
              fill={config.primary}
              fillOpacity="0.35"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.9"
            />
          </>
        );

      case 'rectangle':
        return (
          <>
            {/* Emerald Step-Cut Octagonal Rectangle */}
            <polygon
              points="24,10 76,10 90,24 90,76 76,90 24,90 10,76 10,24"
              fill={bgFill}
              stroke={config.accent}
              strokeWidth="2.5"
            />
            {/* Step Facets */}
            <polygon points="24,10 76,10 68,22 32,22" fill={config.facetLight} />
            <polygon points="76,10 90,24 78,32 68,22" fill={config.facetLight} opacity="0.7" />
            <polygon points="90,24 90,76 78,68 78,32" fill={config.facetDark} />
            <polygon points="90,76 76,90 68,78 78,68" fill={config.facetDark} opacity="0.7" />
            <polygon points="76,90 24,90 32,78 68,78" fill={config.facetDark} opacity="0.9" />
            {/* Central Table */}
            <polygon
              points="32,22 68,22 78,32 78,68 68,78 32,78 22,68 22,32"
              fill={config.primary}
              fillOpacity="0.4"
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.9"
            />
          </>
        );

      case 'rounded':
      default:
        return (
          <>
            {/* Rounded Gem / Cabochon */}
            <rect
              x="10"
              y="10"
              width="80"
              height="80"
              rx="24"
              fill={bgFill}
              stroke={config.accent}
              strokeWidth="2.5"
            />
            {/* Inner refractive ring */}
            <rect
              x="20"
              y="20"
              width="60"
              height="60"
              rx="16"
              fill={config.facetDark}
              stroke="#ffffff"
              strokeWidth="1.2"
              opacity="0.8"
            />
            <rect
              x="28"
              y="28"
              width="44"
              height="44"
              rx="10"
              fill={config.facetLight}
              opacity="0.5"
            />
          </>
        );
    }
  };

  return (
    <div
      onClick={() => onTap(piece)}
      className={`relative w-full h-full p-1 cursor-pointer select-none transition-all duration-300 ${
        piece.blocked ? 'animate-shake-blocked' : ''
      }`}
      style={{
        transform: exitTransform || undefined,
        opacity: piece.exiting ? 0 : 1,
        transition: piece.exiting
          ? 'transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.32s ease'
          : undefined,
        zIndex: piece.exiting ? 40 : 10,
      }}
      role="button"
      tabIndex={0}
      aria-label={`Crystal ${piece.shape} aiming ${piece.direction}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onTap(piece);
        }
      }}
    >
      {/* Hint Ring / Pulse Aura */}
      {isHinted && (
        <div
          className="absolute inset-0 rounded-2xl animate-hint-pulse pointer-events-none"
          style={{
            boxShadow: `0 0 20px 6px ${config.accent}, inset 0 0 14px ${config.primary}`,
            border: `2px solid ${config.accent}`,
          }}
        />
      )}

      {/* SVG Crystal Render */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full overflow-visible drop-shadow-md"
        style={{
          filter: `drop-shadow(0 0 8px ${config.glow})`,
        }}
      >
        <defs>
          {/* Solid Vibrant Crystal Gradient */}
          <linearGradient id={`bg_grad_${piece.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.primary} />
            <stop offset="55%" stopColor={config.secondary} />
            <stop offset="100%" stopColor={config.dark} />
          </linearGradient>

          {/* Subtle linear glow gradient */}
          <linearGradient id={`grad_${piece.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.accent} stopOpacity="0.9" />
            <stop offset="100%" stopColor={config.secondary} stopOpacity="0.3" />
          </linearGradient>

          {/* Directional light trail gradient */}
          <linearGradient id={`trail_${piece.id}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={config.accent} stopOpacity="0.2" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Crystal Shape Body and Facets */}
        {renderShapeGeometry()}

        {/* 
          ORIGINAL DIRECTIONAL INDICATOR:
          High contrast photon energy beam on solid filled crystal
        */}
        <g transform={`rotate(${rotation}, 50, 50)`}>
          {/* Dark contrast halo line behind conduit */}
          <line
            x1="50"
            y1="54"
            x2="50"
            y2="22"
            stroke="rgba(0,0,0,0.4)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Directional flow line / conduit */}
          <line
            x1="50"
            y1="52"
            x2="50"
            y2="24"
            stroke={`url(#trail_${piece.id})`}
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Trailing energy nodes */}
          <circle cx="50" cy="54" r="3" fill="rgba(0,0,0,0.4)" />
          <circle cx="50" cy="54" r="2.2" fill="#ffffff" opacity="0.9" />
          <circle cx="50" cy="42" r="2.5" fill="#ffffff" opacity="0.95" />

          {/* Forward triangular light indicator (sharp prism apex) */}
          <polygon
            points="50,14 57,26 43,26"
            fill="rgba(0,0,0,0.3)"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <polygon
            points="50,15 56,26 44,26"
            fill="#ffffff"
            stroke={config.accent}
            strokeWidth="1"
            strokeLinejoin="round"
          />

          {/* Forward radiant light beacon dot */}
          <circle
            cx="50"
            cy="15"
            r="3.5"
            fill="#ffffff"
            style={{
              filter: `drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 10px ${config.accent})`,
            }}
          />

          {/* Forward boundary energy crest */}
          <path
            d="M 38,11 Q 50,7 62,11"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.2"
            opacity="0.95"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};
