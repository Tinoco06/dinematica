import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { projects } from '@/data/projects'
import { ProjectCard } from '@/components/ui/ProjectCard'

/**
 * Layout asimétrico — 5 cards verticales (9/16) en dos filas que llenan
 * la rejilla por completo, con offsets verticales muy contrastantes para
 * crear ritmo editorial sin dejar huecos muertos.
 *
 * Fila 1 (slots 0-2): col-5 + col-3 + col-4 = 12 — hero + small + medium
 * Fila 2 (slots 3-4): col-6 + col-6 = 12 — par dominante con stagger fuerte
 */
const LAYOUT: {
  span: string
  aspect: '16/9' | '4/3' | '9/16'
  mt: string
  start?: string
}[] = [
  { span: 'md:col-span-5', aspect: '9/16', mt: '' },
  { span: 'md:col-span-3', aspect: '9/16', mt: 'md:mt-32' },
  { span: 'md:col-span-4', aspect: '9/16', mt: 'md:mt-12' },
  { span: 'md:col-span-6', aspect: '9/16', mt: 'md:mt-16' },
  { span: 'md:col-span-6', aspect: '9/16', mt: 'md:mt-48' },
  // Slots de reserva si el portafolio crece (mezcla horizontales/verticales)
  { span: 'md:col-span-7', aspect: '16/9', mt: 'md:mt-16' },
  { span: 'md:col-span-5', aspect: '4/3', mt: '' },
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

      {/* Grid asimétrico — 12 columnas en desktop, 1 en mobile.
          items-start en desktop para que cada card mantenga su altura
          natural según aspect-ratio (no se estiren a la fila más alta). */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-start md:gap-6">
        {projects.map((project, i) => {
          const layout = LAYOUT[i % LAYOUT.length]
          return (
            <div
              key={project.id}
              className={`project-wrapper ${layout.span} ${layout.mt} ${layout.start ?? ''}`}
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
