import { useCallback, useEffect, useState } from 'react'
import Loader from './components/Loader.jsx'
import SparkCursor from './components/SparkCursor.jsx'
import StickCursor from './components/StickCursor.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import About from './components/About.jsx'
import Services from './components/Services.jsx'
import Process from './components/Process.jsx'
import Experience from './components/Experience.jsx'
import Credentials from './components/Credentials.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const finishLoading = useCallback(() => setLoaded(true), [])

  useEffect(() => {
    document.body.classList.toggle('is-loading', !loaded)
  }, [loaded])

  return (
    <>
      {!loaded && <Loader onDone={finishLoading} />}
      <SparkCursor />
      <StickCursor />
      <Nav />
      <main>
        <Hero ready={loaded} />
        <Marquee />
        <About />
        <Services />
        <Process />
        <Experience />
        <Credentials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
