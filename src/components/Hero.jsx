import { lazy, Suspense, useRef } from 'react'
import { ArrowDown, MapPin, Phone } from 'lucide-react'
import { profile, yearsOfExperience, experience, education, languages } from '../data.js'
import { prefersReducedMotion, useCountUp, useInView } from '../hooks.js'
import { HelmetIcon, TorchIcon } from './Icons.jsx'

const HeroScene = lazy(() => import('./HeroScene.jsx'))

const companies = new Set(experience.filter((e) => !e.current).map((e) => e.company)).size

function Stat({ value, suffix = '', label, start }) {
  const n = useCountUp(value, start)
  return (
    <div className="stat">
      <span className="stat__value">
        {n}
        <em>{suffix}</em>
      </span>
      <span className="stat__label">{label}</span>
    </div>
  )
}

export default function Hero({ ready }) {
  const ref = useRef(null)
  const onScreen = useInView(ref, '100px')
  const reduced = prefersReducedMotion()

  return (
    <section id="top" ref={ref} className={`hero ${ready ? 'is-ready' : ''}`}>
      <div className="hero__bg" aria-hidden="true">
        <div className="hero__grid" />
        <div className="hero__glow hero__glow--blue" />
        <div className="hero__glow hero__glow--orange" />
      </div>

      <div className="hero__inner container">
        <div className="hero__copy">
          <p className="eyebrow mono hero__line" style={{ '--d': 0 }}>
            <span className="dot-live" /> Certified welder · Available for projects
          </p>

          <h1 className="hero__title">
            <span className="hero__line" style={{ '--d': 1 }}>{profile.firstName}</span>
            <span className="hero__line hero__title-last" style={{ '--d': 2 }}>
              {profile.lastName}
              <TorchIcon className="hero__title-torch" size={46} strokeWidth={1.6} />
            </span>
          </h1>

          <p className="hero__role hero__line" style={{ '--d': 3 }}>
            <span className="text-orange">Welding</span>
            <i>/</i>
            <span>Ironwork</span>
            <i>/</i>
            <span className="text-blue">Metal Fabrication</span>
          </p>

          <p className="hero__lead hero__line" style={{ '--d': 4 }}>
            Custom steel for roofs, solar panel structures, doors and gates, built in Zahle with {yearsOfExperience()}+ years
            behind the torch. I learned the trade from my father, and every weld still gets the same care.
          </p>

          <div className="hero__actions hero__line" style={{ '--d': 5 }}>
            <a href="#contact" className="btn btn--primary">
              <TorchIcon size={18} /> Start a project
            </a>
            <a href="#experience" className="btn btn--ghost">
              View experience
            </a>
          </div>

          <ul className="hero__meta hero__line mono" style={{ '--d': 6 }}>
            <li>
              <MapPin size={15} /> {profile.location}
            </li>
            <li>
              <Phone size={15} /> <a href={`tel:${profile.phoneRaw}`}>{profile.phone}</a>
            </li>
          </ul>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="hero__stage">
            <Suspense fallback={<div className="hero__fallback" />}>
              <HeroScene active={onScreen} reducedMotion={reduced} />
            </Suspense>
          </div>
          <div className="hero__hud hero__hud--tl mono">
            <span>PROCESS</span>
            <b>MIG · FILLET</b>
          </div>
          <div className="hero__hud hero__hud--br mono">
            <HelmetIcon size={18} />
            <span>SHADE 11 · SAFETY ON</span>
          </div>
        </div>
      </div>

      <div className="hero__stats container">
        <Stat value={yearsOfExperience()} suffix="+" label="Years welding" start={ready} />
        <Stat value={companies} label="Companies served" start={ready} />
        <Stat value={education.length} label="Diploma & certificate" start={ready} />
        <Stat value={languages.length} label="Languages spoken" start={ready} />
      </div>

      <a href="#about" className="hero__scroll mono" aria-label="Scroll to About">
        <ArrowDown size={16} /> scroll
      </a>
    </section>
  )
}
