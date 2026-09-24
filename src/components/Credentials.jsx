import { education, languages, skills } from '../data.js'
import { useReveal, useTilt } from '../hooks.js'
import SectionHead from './SectionHead.jsx'
import { Icon } from './Icons.jsx'

function Plate({ item, index }) {
  const tilt = useTilt(7)
  const reveal = useReveal()
  return (
    <article ref={reveal} className="reveal" style={{ '--i': index }}>
      <div ref={tilt} className="plate tilt">
        <span className="frame__rivet frame__rivet--tl" />
        <span className="frame__rivet frame__rivet--tr" />
        <span className="frame__rivet frame__rivet--bl" />
        <span className="frame__rivet frame__rivet--br" />
        <div className="plate__head">
          <span className="hex hex--orange">
            <Icon name={item.icon} size={26} />
          </span>
          <span className="plate__date mono">{item.date}</span>
        </div>
        <h3 className="plate__title">{item.title}</h3>
        <p className="plate__org">{item.org}</p>
        <p className="plate__text">{item.text}</p>
        <span className="plate__stamp mono" aria-hidden="true">
          {item.stamp}
        </span>
        <span className="card__glare" aria-hidden="true" />
      </div>
    </article>
  )
}

export default function Credentials() {
  const skillsRef = useReveal({ threshold: 0.1 })
  const langRef = useReveal()
  return (
    <section id="credentials" className="section credentials">
      <div className="container">
        <SectionHead index="05" kicker="Qualifications" title={<>Certified, trained, <span className="text-blue">tested</span></>} />

        <div className="plates">
          {education.map((e, i) => (
            <Plate key={e.title} item={e} index={i} />
          ))}
        </div>

        <div className="cred__lower">
          <div ref={skillsRef} className="skills reveal-group">
            <h3 className="subhead mono">// Skills</h3>
            <ul className="skills__grid">
              {skills.map((s, i) => (
                <li key={s.label} className="skill" style={{ '--i': i }}>
                  <span className="skill__hole" aria-hidden="true" />
                  <Icon name={s.icon} size={20} />
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div ref={langRef} className="langs reveal">
            <h3 className="subhead mono">// Languages</h3>
            <ul className="langs__list">
              {languages.map((l) => (
                <li key={l.code} className="lang">
                  <span className="lang__code">{l.code}</span>
                  <span className="lang__name">{l.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
