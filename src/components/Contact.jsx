import { useState } from 'react'
import { Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react'
import { profile, services } from '../data.js'
import { useReveal } from '../hooks.js'
import SectionHead from './SectionHead.jsx'
import { TorchIcon } from './Icons.jsx'

const channels = [
  { icon: Phone, label: 'Call', value: profile.phone, href: `tel:${profile.phoneRaw}` },
  { icon: MessageCircle, label: 'WhatsApp', value: 'Message me', href: `https://wa.me/${profile.whatsapp}`, external: true },
  { icon: Mail, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  {
    icon: MapPin,
    label: 'Workshop',
    value: profile.location,
    href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Kaa El Rim, Zahle, Lebanon')}`,
    external: true,
  },
]

// No backend: the form composes a WhatsApp message or an email.
export default function Contact() {
  const [form, setForm] = useState({ name: '', service: services[0].title, message: '' })
  const [error, setError] = useState('')
  const cards = useReveal({ threshold: 0.1 })
  const formRef = useReveal({ threshold: 0.1 })

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const compose = () =>
    `Hello Elias, my name is ${form.name.trim()}.\nService: ${form.service}\n\n${form.message.trim()}`

  const validate = () => {
    if (!form.name.trim() || !form.message.trim()) {
      setError('Please add your name and a few words about the job.')
      return false
    }
    setError('')
    return true
  }

  const sendWhatsApp = (e) => {
    e.preventDefault()
    if (!validate()) return
    window.open(`https://wa.me/${profile.whatsapp}?text=${encodeURIComponent(compose())}`, '_blank', 'noopener')
  }

  const sendEmail = () => {
    if (!validate()) return
    const subject = `Project enquiry: ${form.service}`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose())}`
  }

  return (
    <section id="contact" className="section contact">
      <div className="contact__glow" aria-hidden="true" />
      <div className="container">
        <SectionHead index="06" kicker="Contact" title={<>Got a job for steel? <span className="text-orange">Let’s weld it.</span></>}>
          Tell me what you need built or repaired. I usually reply the same day.
        </SectionHead>

        <div className="contact__grid">
          <ul ref={cards} className="channels reveal-group">
            {channels.map(({ icon: I, label, value, href, external }, i) => (
              <li key={label} style={{ '--i': i }}>
                <a className="channel" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  <span className="hex hex--sm">
                    <I size={20} />
                  </span>
                  <span className="channel__body">
                    <span className="mono">{label}</span>
                    <b>{value}</b>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <form ref={formRef} className="card quote reveal" onSubmit={sendWhatsApp} noValidate>
            <span className="card__seam" aria-hidden="true" />
            <h3 className="quote__title">
              <TorchIcon size={22} /> Request a quote
            </h3>
            <label className="field">
              <span className="mono">Your name</span>
              <input value={form.name} onChange={update('name')} autoComplete="name" placeholder="Full name" />
            </label>
            <label className="field">
              <span className="mono">Service</span>
              <select value={form.service} onChange={update('service')}>
                {services.map((s) => (
                  <option key={s.title}>{s.title}</option>
                ))}
                <option>Something else</option>
              </select>
            </label>
            <label className="field">
              <span className="mono">Project details</span>
              <textarea
                rows={4}
                value={form.message}
                onChange={update('message')}
                placeholder="What should be built, rough sizes, location…"
              />
            </label>
            {error && (
              <p className="quote__error" role="alert">
                {error}
              </p>
            )}
            <div className="quote__actions">
              <button type="submit" className="btn btn--primary">
                <MessageCircle size={18} /> Send on WhatsApp
              </button>
              <button type="button" className="btn btn--ghost" onClick={sendEmail}>
                <Send size={17} /> Send by email
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
