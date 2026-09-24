import { Mail, MapPin, Phone, Languages } from 'lucide-react'
import { about, languages, profile, START_YEAR } from '../data.js'
import { useReveal, useTilt } from '../hooks.js'
import SectionHead from './SectionHead.jsx'
import { FlameIcon, HelmetIcon } from './Icons.jsx'

export default function About() {
  const tilt = useTilt(6)
  const body = useReveal()
  const photo = useReveal()

  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <div ref={photo} className="about__media reveal reveal--left">
          <div ref={tilt} className="frame tilt">
            <span className="frame__rivet frame__rivet--tl" />
            <span className="frame__rivet frame__rivet--tr" />
            <span className="frame__rivet frame__rivet--bl" />
            <span className="frame__rivet frame__rivet--br" />
            <div className="frame__photo">
              <img src={profile.photo} alt={`${profile.name}, welder and metal fabricator`} loading="lazy" width="1200" height="1600" />
              <div className="frame__glare" />
            </div>
            <div className="frame__tag mono">
              <HelmetIcon size={16} /> {profile.name.toUpperCase()}
            </div>
          </div>

          <div className="about__stamp" aria-hidden="true">
            <svg viewBox="0 0 120 120" className="about__stamp-ring">
              <defs>
                <path id="stamp-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
              </defs>
              <text>
                <textPath href="#stamp-circle">SALIBA IRON WORK • EST. {START_YEAR} • ZAHLE •</textPath>
              </text>
            </svg>
            <FlameIcon size={30} className="about__stamp-icon" />
          </div>
        </div>

        <div ref={body} className="about__body reveal">
          <SectionHead index="01" kicker="About me" title={<>Forged in the family <span className="text-orange">workshop</span></>} />
          <div className="about__text">
            {about.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <ul className="facts">
            <li>
              <MapPin size={18} />
              <div>
                <span className="mono">Based in</span>
                <b>{profile.location}</b>
              </div>
            </li>
            <li>
              <Phone size={18} />
              <div>
                <span className="mono">Phone</span>
                <a href={`tel:${profile.phoneRaw}`}>{profile.phone}</a>
              </div>
            </li>
            <li>
              <Mail size={18} />
              <div>
                <span className="mono">Email</span>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </div>
            </li>
            <li>
              <Languages size={18} />
              <div>
                <span className="mono">Languages</span>
                <b>{languages.map((l) => l.name).join(' · ')}</b>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
