// components/Background.tsx
export default function Background() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: -1 }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Background gradient (dark navy)  */}
          <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#01050a" />
            <stop offset="100%" stopColor="#01191e" />
          </linearGradient>

          {/* {/* Stroke palettes for lines */}
          <linearGradient id="lineA" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0e5a7a" />
            <stop offset="100%" stopColor="#153b6e" />
          </linearGradient>
          <linearGradient id="lineB" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#116d87" />
            <stop offset="100%" stopColor="#17345f" />
          </linearGradient>
          <linearGradient id="lineC" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0b6a8e" />
            <stop offset="100%" stopColor="#0e2f59" />
          </linearGradient>

          {/* Snowflake gradient (dark cyan to dark blue) */}
          <linearGradient id="flake" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f7890" />
            <stop offset="100%" stopColor="#133a68" />
          </linearGradient>

          {/* Soft glow for flakes */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Fractal-style snowflake symbol (6-fold symmetry with sub-branches) */}
          <symbol id="snowflake" viewBox="-60 -60 120 120">
            {/* Main spokes */}
            <g
              stroke="url(#flake)"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
              filter="url(#softGlow)"
            >
              {/* 6 spokes rotated around center */}
              <g>
                <line x1="0" y1="-50" x2="0" y2="-15" />
                <line x1="0" y1="15" x2="0" y2="50" />
                <line x1="-50" y1="0" x2="-15" y2="0" />
                <line x1="15" y1="0" x2="50" y2="0" />
                <line x1="-43" y1="-25" x2="-13" y2="-8" />
                <line x1="13" y1="8" x2="43" y2="25" />
              </g>

              {/* Sub-branches on each spoke (simple recursive motif) */}
              {/* Top spoke */}
              <g transform="rotate(0)">
                <line x1="-8" y1="-28" x2="-16" y2="-36" />
                <line x1="8" y1="-28" x2="16" y2="-36" />
                <line x1="-6" y1="-18" x2="-12" y2="-24" />
                <line x1="6" y1="-18" x2="12" y2="-24" />
              </g>
              {/* Bottom spoke */}
              <g transform="rotate(180)">
                <line x1="-8" y1="-28" x2="-16" y2="-36" />
                <line x1="8" y1="-28" x2="16" y2="-36" />
                <line x1="-6" y1="-18" x2="-12" y2="-24" />
                <line x1="6" y1="-18" x2="12" y2="-24" />
              </g>
              {/* Left spoke */}
              <g transform="rotate(270)">
                <line x1="-8" y1="-28" x2="-16" y2="-36" />
                <line x1="8" y1="-28" x2="16" y2="-36" />
                <line x1="-6" y1="-18" x2="-12" y2="-24" />
                <line x1="6" y1="-18" x2="12" y2="-24" />
              </g>
              {/* Right spoke */}
              <g transform="rotate(90)">
                <line x1="-8" y1="-28" x2="-16" y2="-36" />
                <line x1="8" y1="-28" x2="16" y2="-36" />
                <line x1="-6" y1="-18" x2="-12" y2="-24" />
                <line x1="6" y1="-18" x2="12" y2="-24" />
              </g>
              {/* Diagonal spokes */}
              <g transform="rotate(30)">
                <line x1="0" y1="-40" x2="0" y2="-15" />
                <line x1="-7" y1="-25" x2="-14" y2="-33" />
                <line x1="7" y1="-25" x2="14" y2="-33" />
              </g>
              <g transform="rotate(210)">
                <line x1="0" y1="-40" x2="0" y2="-15" />
                <line x1="-7" y1="-25" x2="-14" y2="-33" />
                <line x1="7" y1="-25" x2="14" y2="-33" />
              </g>
            </g>
          </symbol>
        </defs>

        {/* Background */}
        <rect x="0" y="0" width="1600" height="900" fill="url(#bg)" />

        {/* Random stroke lines layer  */}
        <g fill="none" strokeLinecap="round" opacity="0.9">
          {/* Curved, varied thickness, gradient strokes */}
          <path
            d="M-100,120 C200,60 380,140 650,110 S1050,60 1320,120"
            stroke="url(#lineA)"
            strokeWidth="1.6"
            strokeOpacity="0.65"
          />
          <path
            d="M-50,420 C250,520 520,350 780,480 S1150,660 1700,520"
            stroke="url(#lineB)"
            strokeWidth="1.4"
            strokeOpacity="0.5"
          />
          <path
            d="M-120,750 C120,600 420,720 680,650 S1030,560 1500,690"
            stroke="url(#lineC)"
            strokeWidth="1.2"
            strokeOpacity="0.55"
          />
          <path
            d="M0,260 C180,160 360,300 520,240 S780,160 980,200 S1180,260 1460,220"
            stroke="url(#lineA)"
            strokeWidth="0.9"
            strokeOpacity="0.6"
          />
          <path
            d="M100,840 C240,760 460,820 620,780 S940,740 1240,820"
            stroke="url(#lineB)"
            strokeWidth="0.8"
            strokeOpacity="0.5"
          />
          {/* Subtle zig strokes */}
          <path
            d="M140,100 L220,130 L320,115 L420,140 L520,120"
            stroke="url(#lineC)"
            strokeWidth="0.7"
            strokeOpacity="0.45"
          />
          <path
            d="M880,300 L950,340 L1020,320 L1100,360 L1180,330"
            stroke="url(#lineA)"
            strokeWidth="0.7"
            strokeOpacity="0.45"
          />
          {/* Wavy micro-strokes */}
          <path
            d="M300,560 q40,-20 80,0 t80,0 t80,0"
            stroke="url(#lineB)"
            strokeWidth="0.6"
            strokeOpacity="0.5"
          />
          <path
            d="M1020,520 q50,25 100,0 t100,0 t100,0"
            stroke="url(#lineC)"
            strokeWidth="0.6"
            strokeOpacity="0.5"
          />
        </g>

        {/* Snowflakes layer  */}
        <g opacity="0.95">
          <use
            href="#snowflake"
            x="260"
            y="160"
            width="60"
            height="60"
            transform="rotate(8 290 190)"
          />
          <use
            href="#snowflake"
            x="1120"
            y="160"
            width="84"
            height="84"
            transform="rotate(-12 1162 202)"
          />
          <use
            href="#snowflake"
            x="780"
            y="420"
            width="72"
            height="72"
            transform="rotate(18 816 456)"
          />
          <use
            href="#snowflake"
            x="380"
            y="520"
            width="96"
            height="96"
            transform="rotate(-6 428 568)"
          />
          <use
            href="#snowflake"
            x="1280"
            y="520"
            width="64"
            height="64"
            transform="rotate(22 1312 552)"
          />
          <use
            href="#snowflake"
            x="180"
            y="760"
            width="80"
            height="80"
            transform="rotate(-16 220 800)"
          />
          <use
            href="#snowflake"
            x="1060"
            y="740"
            width="92"
            height="92"
            transform="rotate(10 1106 786)"
          />
        </g>

        {/* Sparse small flakes to keep clarity on mobile  */}
        <g opacity="0.7">
          <use href="#snowflake" x="60" y="60" width="36" height="36" />
          <use href="#snowflake" x="1540" y="80" width="32" height="32" />
          <use href="#snowflake" x="1460" y="860" width="28" height="28" />
          <use href="#snowflake" x="80" y="820" width="30" height="30" />
        </g>
      </svg>
    </div>
  );
}
