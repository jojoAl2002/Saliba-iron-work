import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../hooks.js'

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const duration = prefersReducedMotion() ? 300 : 1500
    const t0 = performance.now()
    let raf
    let timer
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      setPct(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else {
        setLeaving(true)
        timer = setTimeout(onDone, 650)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [onDone])

  return (
    <div className={`loader ${leaving ? 'is-leaving' : ''}`} role="status" aria-label="Loading">
      <div className="loader__plate">
        <img src="/logo.jpg" alt="" className="loader__logo" />
        <div className="loader__seam" style={{ '--p': pct / 100 }}>
          <span className="loader__bead" />
          <span className="loader__arc" />
        </div>
        <div className="loader__meta mono">
          <span>STRIKING ARC</span>
          <span>{String(pct).padStart(3, '0')}%</span>
        </div>
      </div>
    </div>
  )
}
