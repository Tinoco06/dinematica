import { Hero } from '@/components/sections/Hero'
import { Marquee } from '@/components/sections/Marquee'
import { Projects } from '@/components/sections/Projects'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'
import { Footer } from '@/components/layout/Footer'
import { SectionDivider } from '@/components/ui/SectionDivider'

interface HomeProps {
  isReady: boolean
}

export function Home({ isReady }: HomeProps) {
  return (
    <>
      <Hero isReady={isReady} />

      <Projects />

      <Marquee />

      <About />

      <SectionDivider bg="var(--jet-black)" />

      {/* Gradiente: night-black → jet-black (about → contact) */}
      <div
        style={{
          height: '60px',
          background: 'linear-gradient(to bottom, var(--night-black), var(--jet-black))',
        }}
      />

      <Contact />

      <Footer />
    </>
  )
}
