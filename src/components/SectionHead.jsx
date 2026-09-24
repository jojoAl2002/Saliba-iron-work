import { useReveal } from '../hooks.js'

export default function SectionHead({ index, kicker, title, children, align = 'left' }) {
  const ref = useReveal()
  return (
    <header ref={ref} className={`section-head reveal section-head--${align}`}>
      <p className="section-head__kicker mono">
        <span className="section-head__index">{index}</span>
        <span className="section-head__rule" />
        {kicker}
      </p>
      <h2 className="section-head__title">{title}</h2>
      {children && <p className="section-head__sub">{children}</p>}
    </header>
  )
}
