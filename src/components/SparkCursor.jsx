import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks.js'

// Sparks follow the pointer; a click throws a burst. Desktop only.
export default function SparkCursor() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia('(hover: none), (pointer: coarse)').matches) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const sparks = []
    let raf = 0
    let running = false
    let last = { x: 0, y: 0 }
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const emit = (x, y, n, power = 1) => {
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.6
        const s = (1.5 + Math.random() * 4.5) * power
        sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1, decay: 0.018 + Math.random() * 0.03 })
      }
      if (sparks.length > 400) sparks.splice(0, sparks.length - 400)
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'lighter'
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i]
        p.vy += 0.22
        p.x += p.vx
        p.y += p.vy
        p.life -= p.decay
        if (p.life <= 0) {
          sparks.splice(i, 1)
          continue
        }
        const k = p.life
        ctx.strokeStyle = `rgba(255, ${Math.round(120 + 120 * k)}, ${Math.round(40 + 120 * k * k)}, ${k})`
        ctx.lineWidth = 1.4 * k + 0.4
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2)
        ctx.stroke()
      }
      if (sparks.length) raf = requestAnimationFrame(loop)
      else {
        running = false
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    const onMove = (e) => {
      const dx = e.clientX - last.x
      const dy = e.clientY - last.y
      last = { x: e.clientX, y: e.clientY }
      const speed = Math.hypot(dx, dy)
      if (speed > 6 && Math.random() < 0.55) emit(e.clientX, e.clientY, Math.min(4, 1 + Math.floor(speed / 25)), 0.7)
    }
    const onDown = (e) => emit(e.clientX, e.clientY, 26, 1.2)

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
    }
  }, [])

  return <canvas ref={canvasRef} className="spark-cursor" aria-hidden="true" />
}
