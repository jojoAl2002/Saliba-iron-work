import { useEffect, useRef } from 'react'
import { experience, START_YEAR, yearsOfExperience } from '../data.js'
import { useReveal } from '../hooks.js'
import SectionHead from './SectionHead.jsx'
import { NutIcon } from './Icons.jsx'

function Job({ job, index }) {
  const ref = useReveal()
  const duration = job.current ? `${yearsOfExperience()}+ years · since ${START_YEAR}` : job.duration
  return (
    <li ref={ref} className={`job reveal ${job.current ? 'job--current' : ''}`} style={{ '--i': index }}>
      <span className="job__node" aria-hidden="true">
        <NutIcon size={22} strokeWidth={2} />
      </span>
      <div className="card job__card">
        <span className="card__seam" aria-hidden="true" />
        <div className="job__head">
          <span className="job__period mono">{job.period}</span>
          {job.current && <span className="badge-live mono">Current</span>}
        </div>
        <h3 className="job__title">{job.title}</h3>
        <p className="job__company">
          {job.company} <span className="mono">— {duration}</span>
        </p>
        <p className="job__text">{job.text}</p>
        <ul className="tags">
          {job.tags.map((t) => (
            <li key={t} className="tag mono">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export default function Experience() {
  const listRef = useRef(null)

  // The weld bead down the spine grows with scroll position.
  useEffect(() => {
    const el = listRef.current
    let raf = 0
    const update = () => {
      const r = el.getBoundingClientRect()
      const mid = window.innerHeight * 0.6
      const p = Math.min(1, Math.max(0, (mid - r.top) / r.height))
      el.style.setProperty('--fill', p.toFixed(4))
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <SectionHead index="04" kicker="Career" title={<>Years on the <span className="text-orange">tools</span></>}>
          Freelance since {START_YEAR}, with time on production floors, in machine shops and on solar sites along the way.
        </SectionHead>
        <div ref={listRef} className="timeline">
          <span className="timeline__spine" aria-hidden="true">
            <span className="timeline__fill" />
          </span>
          <ol className="timeline__list">
            {experience.map((job, i) => (
              <Job key={job.period} job={job} index={i} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
