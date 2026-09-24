import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks.js'

const INTERACTIVE = 'a, button, input, select, textarea, label, summary, [role="button"], [tabindex]:not([tabindex="-1"])'

// Custom cursor: a stick-welding electrode holder. The rod tip is the hotspot.
// Ember at rest, blue arc over clickable things, flash on press. Mouse only.
export default function StickCursor() {
  const ref = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = ref.current
    const root = document.documentElement
    const still = prefersReducedMotion()
    let x = -100
    let y = -100
    let lastX = 0
    let angle = 0
    let target = 0
    let raf = 0

    const render = () => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${angle.toFixed(2)}deg)`
    }

    // Lean the holder a little in the direction of travel, then settle back.
    const tick = () => {
      target *= 0.86
      angle += (target - angle) * 0.2
      render()
      raf = Math.abs(angle) > 0.05 || Math.abs(target) > 0.05 ? requestAnimationFrame(tick) : 0
    }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      root.classList.add('has-stick-cursor')
      el.classList.add('is-visible')
      x = e.clientX
      y = e.clientY
      if (!still) {
        target = Math.max(-16, Math.min(16, target + (x - lastX) * 0.35))
        if (!raf) raf = requestAnimationFrame(tick)
      }
      lastX = x
      render()
      el.classList.toggle('is-arc', !!e.target.closest?.(INTERACTIVE))
    }
    const onDown = (e) => {
      if (e.pointerType === 'mouse') el.classList.add('is-down')
    }
    const onUp = () => el.classList.remove('is-down')
    const onLeave = () => el.classList.remove('is-visible')

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      root.classList.remove('has-stick-cursor')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className="stick-cursor" aria-hidden="true">
      <span className="stick-cursor__glow" />
      {/* Drawn horizontally from the tip at (0,0), then rotated up-right 45deg. */}
      <svg width="64" height="64" viewBox="0 0 64 64" className="stick-cursor__svg">
        <defs>
          <linearGradient id="stick-handle" x1="0" y1="-5" x2="0" y2="5" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#3a434d" />
            <stop offset="0.45" stopColor="#1d2227" />
            <stop offset="1" stopColor="#0e1115" />
          </linearGradient>
          <linearGradient id="stick-jaw" x1="0" y1="-4" x2="0" y2="4" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#f0b07a" />
            <stop offset="0.5" stopColor="#c9824a" />
            <stop offset="1" stopColor="#7a4520" />
          </linearGradient>
          <linearGradient id="stick-flux" x1="0" y1="-1.4" x2="0" y2="1.4" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#e4d6bd" />
            <stop offset="1" stopColor="#9c8a6c" />
          </linearGradient>
        </defs>
        <g transform="translate(1.5 62.5) rotate(-45)">
          {/* cable */}
          <path d="M72 0 C 76 0, 78 2, 82 6" stroke="#0b0d10" strokeWidth="3.2" fill="none" strokeLinecap="round" />
          {/* insulated handle with grip rings */}
          <rect x="45" y="-4.6" width="28" height="9.2" rx="3.6" fill="url(#stick-handle)" stroke="#000" strokeOpacity=".5" strokeWidth=".6" />
          <path d="M53 -4.4v8.8M58 -4.4v8.8M63 -4.4v8.8" stroke="#f7931e" strokeWidth="1.3" />
          {/* copper jaws gripping the rod */}
          <path d="M45 -3.8 L36.5 -2 L35 0 L36.5 2 L45 3.8 Z" fill="url(#stick-jaw)" stroke="#5a3214" strokeWidth=".5" />
          <path d="M36 0 H44" stroke="#5a3214" strokeWidth=".6" />
          {/* electrode: bare grip end, flux coating, burning tip */}
          <rect x="30.5" y="-0.9" width="6" height="1.8" fill="#aab3bd" />
          <rect x="2.2" y="-1.4" width="28.6" height="2.8" rx=".6" fill="url(#stick-flux)" stroke="#000" strokeOpacity=".35" strokeWidth=".4" />
          <rect x="0" y="-1.1" width="2.6" height="2.2" rx="1" className="stick-cursor__tip" />
        </g>
      </svg>
    </div>
  )
}
