import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/ui/ProjectCard'

/**
 * Layout asimétrico: define tamaño y aspect-ratio por posición.
 * Patrón: grande-pequeño, pequeño-grande, full, etc.
 */
const LAYOUT: { span: string; aspect: '16/9' | '4/3' }[] = [
  { span: 'md:col-span-7', aspect: '16/9' },
  { span: 'md:col-span-5', aspect: '4/3' },
  { span: 'md:col-span-5', aspect: '4/3' },
  { span: 'md:col-span-7', aspect: '16/9' },
  { span: 'md:col-span-12', aspect: '16/9' },
  { span: 'md:col-span-6', aspect: '4/3' },
  { span: 'md:col-span-6', aspect: '4/3' },
  { span: 'md:col-span-7', aspect: '16/9' },
]

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const wrappers = gsap.utils.toArray<HTMLElement>('.project-wrapper')
    const mm = gsap.matchMedia()

    // Mobile: reveal más corto, sin parallax
    mm.add('(max-width: 767px)', () => {
      wrappers.forEach((wrapper) => {
        gsap.fromTo(
          wrapper,
          { y: 30, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          },
        )
      })
    })

    // Desktop: reveal completo + parallax en thumbnails
    mm.add('(min-width: 768px)', () => {
      wrappers.forEach((wrapper) => {
        gsap.fromTo(
          wrapper,
          { y: 60, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: wrapper,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          },
        )

        // Parallax sutil en la imagen del thumbnail
        const img = wrapper.querySelector('.project-img')
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: wrapper,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            },
          )
        }
      })
    })
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="proyectos"
      style={{
        backgroundColor: 'var(--jet-black)',
        padding: 'clamp(60px, 10vw, 160px) clamp(16px, 4vw, 64px)',
      }}
    >
      {/* Título de sección */}
      <h2
        className="mb-10 font-bold uppercase md:mb-24"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(32px, 6vw, 72px)',
          color: 'var(--flash-white)',
          lineHeight: 1,
        }}
      >
        Proyectos
      </h2>

      {/* Grid asimétrico — 12 columnas en desktop, 1 en mobile */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-4">
        {projects.map((project, i) => {
          const layout = LAYOUT[i % LAYOUT.length]
          return (
            <div
              key={project.id}
              className={`project-wrapper ${layout.span}`}
              style={{ visibility: 'hidden' }}
            >
              <ProjectCard project={project} aspect={layout.aspect} />
            </div>
          )
        })}
      </div>

    </section>
  )
}
