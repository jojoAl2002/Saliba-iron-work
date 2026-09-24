import { process } from '../data.js'
import { useReveal } from '../hooks.js'
import SectionHead from './SectionHead.jsx'
import { Icon } from './Icons.jsx'

export default function Process() {
  const ref = useReveal({ threshold: 0.3 })
  return (
    <section className="section process" aria-labelledby="process-title">
      <div className="container">
        <SectionHead index="03" kicker="How a job runs" title={<span id="process-title">From drawing to <span className="text-orange">installed</span></span>} />
        <div ref={ref} className="process__track reveal-group">
          <span className="process__bead" aria-hidden="true">
            <span className="process__arc" />
          </span>
          <ol className="process__steps">
            {process.map((step, i) => (
              <li key={step.title} className="process__step" style={{ '--i': i }}>
                <span className="process__node">
                  <Icon name={step.icon} size={26} />
                </span>
                <span className="process__num mono">Step {String(i + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
