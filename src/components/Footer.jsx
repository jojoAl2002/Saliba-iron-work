import { ArrowUp } from 'lucide-react'
import { profile } from '../data.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__hazard" aria-hidden="true" />
      <div className="container footer__inner">
        <a href="#top" className="nav__brand">
          <span className="nav__logo">
            <img src={profile.logo} alt="" />
          </span>
          <span className="nav__word">
            <b>SALIBA</b>
            <i>IRON WORK</i>
          </span>
        </a>
        <p className="footer__copy mono">
          © {new Date().getFullYear()} {profile.name} · {profile.tagline}
        </p>
        <a href="#top" className="footer__top" aria-label="Back to top">
          <ArrowUp size={18} />
        </a>
      </div>
    </footer>
  )
}
