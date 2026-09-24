import { useEffect, useRef, useState } from 'react'

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Adds `.in` to the element (and keeps it) once it scrolls into view. */
export function useReveal(options = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) {
      el.classList.add('in')
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: options.threshold ?? 0.18, rootMargin: options.rootMargin ?? '0px 0px -8% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [options.threshold, options.rootMargin])
  return ref
}

/** True while the element is (roughly) on screen. */
export function useInView(ref, rootMargin = '0px') {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, rootMargin])
  return inView
}

/** Counts from 0 to `to` once `start` becomes true. */
export function useCountUp(to, start, duration = 1600) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    if (prefersReducedMotion()) {
      setValue(to)
      return
    }
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [to, start, duration])
  return value
}

/** Pointer-driven 3D tilt. Writes --rx/--ry/--mx/--my on the element. */
export function useTilt(max = 10) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion() || window.matchMedia('(hover: none)').matches) return
    let raf = 0
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--ry', `${(x - 0.5) * max * 2}deg`)
        el.style.setProperty('--rx', `${(0.5 - y) * max * 2}deg`)
        el.style.setProperty('--mx', `${x * 100}%`)
        el.style.setProperty('--my', `${y * 100}%`)
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [max])
  return ref
}
