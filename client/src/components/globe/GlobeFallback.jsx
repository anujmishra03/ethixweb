import { HUBS } from './constants.js';
import { Sparkles } from 'lucide-react';
import './globe.css';

/**
 * Editorial Static Fallback for India Network Globe
 * Rendered during 3D scene lazy-loading, or when WebGL is unsupported/disabled.
 */
export default function GlobeFallback({
  reason = 'loading',
  onActivate3D,
  showActivateButton = false
}) {
  // 2D projection coordinates for the 5 Indian tech hubs on a 500x500 orthographic map
  const svgHubs = [
    { name: 'Delhi NCR', code: 'DEL', x: 236, y: 155, role: 'Strategy & Cloud' },
    { name: 'Mumbai', code: 'BOM', x: 198, y: 258, role: 'Commerce Systems' },
    { name: 'Hyderabad', code: 'HYD', x: 248, y: 275, role: 'Enterprise Workflows' },
    { name: 'Bengaluru', code: 'BLR', x: 240, y: 326, role: 'AI & Engineering' },
    { name: 'Chennai', code: 'MAA', x: 265, y: 322, role: 'Product Design' }
  ];

  return (
    <div className="globe-fallback-card" role="img" aria-label="Ethixweb India Network Graphic">
      <div className="globe-hud-top">
        <div className="hud-badge">
          <span className="hud-dot live" />
          <span>ETHIXWEB INDIA · NETWORK TOPOLOGY</span>
        </div>
        <div className="hud-meta">
          <span>5 STRATEGIC HUBS</span>
        </div>
      </div>

      <div className="fallback-svg-wrap">
        <svg viewBox="0 0 500 500" className="fallback-svg" aria-hidden="true">
          <defs>
            {/* Background circular radial tone */}
            <radialGradient id="sphereGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ede7dc" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#e3dcce" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#d5ccbd" stopOpacity="0.6" />
            </radialGradient>
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d94332" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d94332" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Astrolabe / Celestial Rings */}
          <circle cx="250" cy="250" r="220" fill="none" stroke="#d8d1c4" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
          <circle cx="250" cy="250" r="195" fill="url(#sphereGrad)" stroke="#cecfc5" strokeWidth="1" />
          <circle cx="250" cy="250" r="195" fill="none" stroke="#d94332" strokeWidth="1.5" opacity="0.3" strokeDasharray="1 12" />

          {/* Lat/Lon Grid Lines */}
          <ellipse cx="250" cy="250" rx="195" ry="90" fill="none" stroke="#ded8cc" strokeWidth="0.8" opacity="0.7" />
          <ellipse cx="250" cy="250" rx="195" ry="150" fill="none" stroke="#ded8cc" strokeWidth="0.8" opacity="0.7" />
          <line x1="250" y1="55" x2="250" y2="445" stroke="#ded8cc" strokeWidth="0.8" opacity="0.8" strokeDasharray="4 4" />
          <line x1="55" y1="250" x2="445" y2="250" stroke="#ded8cc" strokeWidth="0.8" opacity="0.8" strokeDasharray="4 4" />

          {/* Stylized Architectural Contour of the Indian Subcontinent */}
          <path
            d="M 238 120 L 255 130 L 260 148 L 285 160 L 310 162 L 320 180 L 305 190 L 290 195 L 275 220 L 278 245 L 285 260 L 275 285 L 268 325 L 245 375 L 235 370 L 220 330 L 200 290 L 195 260 L 192 235 L 180 230 L 175 220 L 185 210 L 198 215 L 205 180 L 220 140 Z"
            fill="#d9433215"
            stroke="#d94332"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />

          {/* Internal Network Arcs */}
          {/* Delhi to Mumbai */}
          <path d="M 236 155 Q 190 200 198 258" fill="none" stroke="#d94332" strokeWidth="1.4" opacity="0.85" />
          {/* Delhi to Bengaluru */}
          <path d="M 236 155 Q 210 240 240 326" fill="none" stroke="#d94332" strokeWidth="1.5" opacity="0.9" />
          {/* Delhi to Hyderabad */}
          <path d="M 236 155 Q 255 215 248 275" fill="none" stroke="#d94332" strokeWidth="1.3" opacity="0.8" />
          {/* Mumbai to Bengaluru */}
          <path d="M 198 258 Q 210 295 240 326" fill="none" stroke="#d94332" strokeWidth="1.4" opacity="0.85" />
          {/* Mumbai to Hyderabad */}
          <path d="M 198 258 Q 225 260 248 275" fill="none" stroke="#d94332" strokeWidth="1.2" opacity="0.8" />
          {/* Bengaluru to Hyderabad */}
          <path d="M 240 326 Q 242 300 248 275" fill="none" stroke="#d94332" strokeWidth="1.4" opacity="0.85" />
          {/* Bengaluru to Chennai */}
          <path d="M 240 326 Q 252 320 265 322" fill="none" stroke="#d94332" strokeWidth="1.5" opacity="0.9" />
          {/* Hyderabad to Chennai */}
          <path d="M 248 275 Q 262 295 265 322" fill="none" stroke="#d94332" strokeWidth="1.3" opacity="0.8" />

          {/* Radiating International Arcs */}
          <path d="M 236 155 Q 140 110 80 120" fill="none" stroke="#a19a8d" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 198 258 Q 120 240 70 250" fill="none" stroke="#a19a8d" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <path d="M 240 326 Q 320 380 410 395" fill="none" stroke="#a19a8d" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

          {/* Hub Pins & Pulsing Waves */}
          {svgHubs.map(h => (
            <g key={h.code}>
              {/* Concentric subtle radar ring */}
              <circle cx={h.x} cy={h.y} r="12" fill="url(#hubGlow)" />
              <circle cx={h.x} cy={h.y} r="7" fill="none" stroke="#d94332" strokeWidth="1" opacity="0.75" />
              {/* Core dot */}
              <circle cx={h.x} cy={h.y} r="3.2" fill="#d94332" />
              <circle cx={h.x} cy={h.y} r="1.2" fill="#ffffff" />
              {/* Text tag */}
              <text
                x={h.x + (h.name === 'Mumbai' ? -10 : h.name === 'Delhi NCR' ? 12 : 10)}
                y={h.y + (h.name === 'Bengaluru' ? 14 : -6)}
                textAnchor={h.name === 'Mumbai' ? 'end' : 'start'}
                fill="#20201e"
                fontSize="9"
                fontWeight="700"
                fontFamily="'DM Sans', sans-serif"
                letterSpacing="0.8px"
              >
                {h.name.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="globe-hud-bottom">
        <div className="hud-pills">
          {HUBS.map(h => (
            <span key={h.id} className="hud-pill active">
              {h.name}
            </span>
          ))}
        </div>
        <div className="hud-caption">
          {showActivateButton ? (
            <button
              type="button"
              className="hud-btn hud-btn-activate"
              onClick={onActivate3D}
              aria-label="Launch interactive 3D Globe"
            >
              <Sparkles size={12} />
              <span>LAUNCH 3D GLOBE</span>
            </button>
          ) : reason === 'unsupported' ? (
            <span>WebGL unavailable · Static vector network rendered</span>
          ) : (
            <span>Initializing 3D Interactive Scene · Stand by</span>
          )}
        </div>
      </div>
    </div>
  );
}
