import {
  Wrench, Ruler, ShieldCheck, Handshake, MessageCircle, Award, GraduationCap,
} from 'lucide-react'

// Hand-drawn welding / ironwork icons. 24x24 grid, stroke = currentColor.
const Svg = ({ children, size = 24, className, strokeWidth = 1.8 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {children}
  </svg>
)

export const TorchIcon = (p) => (
  <Svg {...p}>
    <path d="M2.5 21.5 7 17" />
    <path d="M6 15.5 11.5 10l3 3L9 18.5z" />
    <path d="M8 13.5 10.5 16" />
    <path d="M13.2 11.3c1.6-1.6 3.4-2.6 5-1.8" />
    <path d="M18.2 9.5 19.6 12" />
    <path d="M21.5 11.5 23 11M21 14.2l1.3 1.3M19.2 14.8l-.3 1.7M22.2 9.2l.8-.8" className="spark-lines" />
  </Svg>
)

export const HelmetIcon = (p) => (
  <Svg {...p}>
    <path d="M5 11.5a7 7 0 0 1 14 0V15a5 5 0 0 1-5 5h-4a5 5 0 0 1-5-5z" />
    <rect x="8" y="11" width="8" height="3.6" rx="1" />
    <path d="M5 9.5 3 8.5M19 9.5l2-1" />
    <path d="M10 17.5h4" />
  </Svg>
)

export const SparkIcon = (p) => (
  <Svg {...p}>
    <path d="M12 2v5M12 17v5M2 12h5M17 12h5M4.9 4.9l3.2 3.2M15.9 15.9l3.2 3.2M4.9 19.1l3.2-3.2M15.9 8.1l3.2-3.2" />
    <circle cx="12" cy="12" r="1.6" />
  </Svg>
)

export const GearIcon = (p) => (
  <Svg {...p}>
    <path d="M10.3 2.5h3.4l.5 2.4a7.5 7.5 0 0 1 2 1.1l2.3-.8 1.7 2.9-1.8 1.6a7.6 7.6 0 0 1 0 2.4l1.8 1.6-1.7 2.9-2.3-.8a7.5 7.5 0 0 1-2 1.1l-.5 2.4h-3.4l-.5-2.4a7.5 7.5 0 0 1-2-1.1l-2.3.8-1.7-2.9 1.8-1.6a7.6 7.6 0 0 1 0-2.4L3.8 8.1l1.7-2.9 2.3.8a7.5 7.5 0 0 1 2-1.1z" />
    <circle cx="12" cy="12" r="3" />
  </Svg>
)

export const SolarIcon = (p) => (
  <Svg {...p}>
    <path d="M4.5 4h15L21 14H3z" />
    <path d="M3.8 9h16.4M9.3 4l-.6 10M14.7 4l.6 10" />
    <path d="M12 14v5M7.5 20.5h9" />
    <path d="M17 18l2 2.5M7 18l-2 2.5" />
  </Svg>
)

export const GateIcon = (p) => (
  <Svg {...p}>
    <path d="M3 21V5M21 21V5" />
    <path d="M3 9.5c4-3.5 14-3.5 18 0" />
    <path d="M3 18h18M3 13h18" />
    <path d="M7 8v10M10.5 7.2V18M13.5 7.2V18M17 8v10" />
    <circle cx="3" cy="4" r=".6" /><circle cx="21" cy="4" r=".6" />
  </Svg>
)

export const TrussIcon = (p) => (
  <Svg {...p}>
    <path d="M1.5 17.5 12 5l10.5 12.5z" />
    <path d="M12 5v12.5M6.8 11.2 9 17.5M17.2 11.2 15 17.5M9 17.5 12 12l3 5.5" />
    <path d="M1.5 20.5h21" />
  </Svg>
)

export const LatheIcon = (p) => (
  <Svg {...p}>
    <path d="M2 19.5h20M4 19.5V21M20 19.5V21" />
    <rect x="2.5" y="7" width="5.5" height="10" rx="1" />
    <path d="M8 10.5h2v3H8" />
    <path d="M10 11.2h7.5v1.6H10" />
    <path d="M17.5 12h1.5M19 9.5h2.5v5H19z" />
    <path d="M12 15.5l1.5-2.5 1.5 2.5z" />
  </Svg>
)

export const BlueprintIcon = (p) => (
  <Svg {...p}>
    <rect x="2.5" y="4" width="19" height="16" rx="1.5" />
    <path d="M6 16V8h5v4h7v4z" />
    <path d="M2.5 8h1.5M2.5 12h1.5M2.5 16h1.5" />
  </Svg>
)

export const BeamIcon = (p) => (
  <Svg {...p}>
    <path d="M4 4h16v3h-6v10h6v3H4v-3h6V7H4z" />
  </Svg>
)

export const NutIcon = (p) => (
  <Svg {...p}>
    <path d="M12 2.5 20.2 7.2v9.6L12 21.5l-8.2-4.7V7.2z" />
    <circle cx="12" cy="12" r="3.4" />
  </Svg>
)

export const FlameIcon = (p) => (
  <Svg {...p}>
    <path d="M12 22c4 0 7-2.8 7-6.8 0-3.6-2.6-6-4.1-8.7-.6 1.9-1.6 3-3 3.6.3-3-1-6-3.9-8.1.3 3.6-1.8 5.6-3.3 7.6A9.4 9.4 0 0 0 5 15.2C5 19.2 8 22 12 22z" />
    <path d="M12 22c-1.7 0-3-1.2-3-3 0-1.9 1.8-3.2 3-5 1.2 1.8 3 3.1 3 5 0 1.8-1.3 3-3 3z" />
  </Svg>
)

export const GrinderIcon = (p) => (
  <Svg {...p}>
    <circle cx="7.5" cy="15.5" r="4.5" />
    <circle cx="7.5" cy="15.5" r="1" />
    <path d="M9.5 11.5 15 6a2 2 0 0 1 2.8 0l.7.7a2 2 0 0 1 0 2.8L13 15" />
    <path d="M15 11.5l3.5 3.5" />
    <path d="M2 21.5l-.8.8M4 22.5l-.3 1M1.2 19.5l-1 .3" />
  </Svg>
)

const lucide = (Cmp) => ({ size = 24, className, strokeWidth = 1.8 }) => (
  <Cmp size={size} className={className} strokeWidth={strokeWidth} aria-hidden="true" />
)

const registry = {
  torch: TorchIcon,
  helmet: HelmetIcon,
  spark: SparkIcon,
  gear: GearIcon,
  solar: SolarIcon,
  gate: GateIcon,
  truss: TrussIcon,
  lathe: LatheIcon,
  blueprint: BlueprintIcon,
  beam: BeamIcon,
  nut: NutIcon,
  flame: FlameIcon,
  wrench: lucide(Wrench),
  ruler: lucide(Ruler),
  shield: lucide(ShieldCheck),
  handshake: lucide(Handshake),
  chat: lucide(MessageCircle),
  cert: lucide(Award),
  grad: lucide(GraduationCap),
  cut: GrinderIcon,
}

export function Icon({ name, ...rest }) {
  const Cmp = registry[name] ?? SparkIcon
  return <Cmp {...rest} />
}
