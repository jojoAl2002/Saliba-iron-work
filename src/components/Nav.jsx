import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { profile } from '../data.js'

const links = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'experience', label: 'Experience' },
  { id: 'credentials', label: 'Credentials' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight
        setScrolled(window.scrollY > 24)
        setProgress(max > 0 ? window.scrollY / max : 0)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    const sections = links.map((l) => document.getElementById(l.id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__inner container">
        <a href="#top" className="nav__brand" onClick={() => setOpen(false)} aria-label={`${profile.brand} — home`}>
          <span className="nav__logo">
            <img src={profile.logo} alt="" />
          </span>
          <span className="nav__word">
            <b>SALIBA</b>
            <i>IRON WORK</i>
          </span>
        </a>

        <nav className="nav__links" aria-label="Main">
          {links.map((l) => (
            <a key={l.id} href={`#${l.id}`} className={active === l.id ? 'is-active' : ''} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn btn--primary btn--sm nav__cta" onClick={() => setOpen(false)}>
            Get a quote
          </a>
        </nav>

        <button className="nav__toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className="nav__progress" style={{ '--p': progress }} aria-hidden="true">
        <span />
      </div>
    </header>
  )
}
