import { marquee } from '../data.js'
import { SparkIcon } from './Icons.jsx'

export default function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-label={marquee.join(', ')}>
      <div className="marquee__track" aria-hidden="true">
        {items.map((m, i) => (
          <span key={i} className="marquee__item">
            {m}
            <SparkIcon size={20} className="marquee__spark" />
          </span>
        ))}
      </div>
    </div>
  )
}
