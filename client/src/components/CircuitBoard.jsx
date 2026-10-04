import { useId } from 'react';
import ProfilePhoto from './ProfilePhoto';

/*
 * The hero's signature element: the portrait is mounted like a chip (U1) on a
 * solder-mask board. Copper traces run from its pins to pads at the board edge
 * and draw themselves once on page load. Coordinates use a 400 x 440 viewBox;
 * the photo occupies x 88..312, y 80..360 (a 4:5 portrait).
 */
const COPPER = '#c98a45';
const SILK = '#e8eee6';

const TRACES = [
  // left side
  { d: 'M80 130 H58 L38 110 V58', pad: [38, 58], delay: 0 },
  { d: 'M80 175 H24', pad: [24, 175], delay: 80 },
  { d: 'M80 220 H24', pad: [24, 220], delay: 160 },
  { d: 'M80 265 H62 L40 287 V380', pad: [40, 380], delay: 240 },
  { d: 'M80 310 H54', pad: [54, 310], delay: 320 },
  // right side
  { d: 'M320 130 H376', pad: [376, 130], delay: 40 },
  { d: 'M320 175 H340 L362 197 V250', pad: [362, 250], delay: 120 },
  { d: 'M320 220 H346', pad: [346, 220], delay: 200 },
  { d: 'M320 265 H376', pad: [376, 265], delay: 280 },
  { d: 'M320 310 H344 L366 332 V384', pad: [366, 384], delay: 360 },
  // top and bottom
  { d: 'M143 72 V44', pad: [143, 44], delay: 100 },
  { d: 'M203 72 V30', pad: [203, 30], delay: 180 },
  { d: 'M263 72 V52 L279 36 H330', pad: [330, 36], delay: 260 },
  { d: 'M173 368 V396', pad: [173, 396], delay: 220 },
  { d: 'M233 368 V388 L249 404 H300', pad: [300, 404], delay: 300 },
];

const SIDE_PINS = [130, 175, 220, 265, 310];
const TOP_PINS = [140, 200, 260];
const BOTTOM_PINS = [170, 230];
const HOLES = [
  [26, 26],
  [374, 26],
  [26, 414],
  [374, 414],
];

export default function CircuitBoard({ photoUrl, name, loading, animated = true }) {
  const patternId = `vias-${useId().replace(/:/g, '')}`;

  return (
    <div className="relative mx-auto aspect-[400/440] w-full max-w-[26rem]">
      <svg viewBox="0 0 400 440" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.2" fill="#ffffff" opacity="0.07" />
          </pattern>
        </defs>

        <rect width="400" height="440" rx="18" fill="var(--board)" />
        <rect width="400" height="440" rx="18" fill={`url(#${patternId})`} />

        {HOLES.map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="9" fill="none" stroke={COPPER} strokeWidth="2.5" opacity="0.8" />
            <circle cx={cx} cy={cy} r="6" fill="var(--canvas)" />
          </g>
        ))}

        {/* Chip pins */}
        <g fill={COPPER}>
          {SIDE_PINS.map((y) => (
            <g key={y}>
              <rect x="80" y={y - 3} width="8" height="6" rx="1" />
              <rect x="312" y={y - 3} width="8" height="6" rx="1" />
            </g>
          ))}
          {TOP_PINS.map((x) => (
            <rect key={x} x={x} y="72" width="6" height="8" rx="1" />
          ))}
          {BOTTOM_PINS.map((x) => (
            <rect key={x} x={x} y="360" width="6" height="8" rx="1" />
          ))}
        </g>

        {/* Traces and pads */}
        {TRACES.map((trace) => (
          <g key={trace.d} style={{ '--delay': `${trace.delay}ms` }}>
            <path
              className={animated ? 'trace' : undefined}
              d={trace.d}
              pathLength="1"
              fill="none"
              stroke={COPPER}
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle className={animated ? 'pad' : undefined} cx={trace.pad[0]} cy={trace.pad[1]} r="6" fill={COPPER} />
            <circle className={animated ? 'pad' : undefined} cx={trace.pad[0]} cy={trace.pad[1]} r="2.2" fill="var(--board)" />
          </g>
        ))}

        {/* Silkscreen: reference designator and pin-1 marker */}
        <text x="92" y="62" fill={SILK} opacity="0.85" fontFamily="IBM Plex Mono, monospace" fontSize="12">
          U1
        </text>
        <circle cx="122" cy="58" r="2.6" fill={SILK} opacity="0.85" />
      </svg>

      {/* The chip body: portrait inside a dark package */}
      <div className="absolute top-[18.18%] right-[22%] bottom-[18.18%] left-[22%] rounded-[6px] bg-[#0f1a16] p-[2.5%]">
        <div className="h-full w-full overflow-hidden rounded-[3px]">
          <ProfilePhoto src={photoUrl} name={name} loading={loading} priority />
        </div>
      </div>
    </div>
  );
}
