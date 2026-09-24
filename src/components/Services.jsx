import { services } from '../data.js'
import { useReveal, useTilt } from '../hooks.js'
import SectionHead from './SectionHead.jsx'
import { Icon } from './Icons.jsx'

function ServiceCard({ service, index }) {
  const tilt = useTilt(8)
  const reveal = useReveal()
  return (
    <article ref={reveal} className="reveal" style={{ '--i': index }}>
      <div ref={tilt} className="card service tilt">
        <span className="card__seam" aria-hidden="true" />
        <span className="card__rivets" aria-hidden="true" />
        <div className="service__top">
          <span className="hex">
            <Icon name={service.icon} size={28} />
          </span>
          <span className="service__num mono">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="service__title">{service.title}</h3>
        <p className="service__text">{service.text}</p>
        <span className="card__glare" aria-hidden="true" />
      </div>
    </article>
  )
}

export default function Services() {
  return (
    <section id="services" className="section services">
      <div className="container">
        <SectionHead index="02" kicker="What I build" title={<>Steel work, <span className="text-blue">start to finish</span></>}>
          From a single gate to the frame under a solar array, measured, cut, welded and installed by the same hands.
        </SectionHead>
        <div className="services__grid">
          {services.map((s, i) => (
            <ServiceCard key={s.title} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
