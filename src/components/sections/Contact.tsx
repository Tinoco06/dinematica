import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

const CONTACT_LINKS = [
  { label: 'beto@dinematica.hn', href: 'mailto:beto@dinematica.hn', size: 'large' },
  { label: '+504 3030 2020', href: 'tel:+50430302020', size: 'large' },
] as const

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'YouTube', href: '#' },
] as const

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })

    // Título
    tl.fromTo(
      '.contact-title',
      { y: 50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out' },
    )

    // Subtítulo
    tl.fromTo(
      '.contact-subtitle',
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' },
      '-=0.5',
    )

    // Items de contacto — stagger desde la derecha
    tl.fromTo(
      '.contact-item',
      { x: -30, autoAlpha: 0 },
      {
        x: 0,
        autoAlpha: 1,
        duration: 0.7,
        ease: 'power2.out',
        stagger: 0.12,
      },
      '-=0.3',
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="contacto"
      style={{
        backgroundColor: 'var(--jet-black)',
        padding: 'clamp(80px, 12vw, 160px) clamp(24px, 4vw, 64px)',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        className="grid w-full grid-cols-1 gap-12 md:grid-cols-2 md:gap-24"
        style={{ maxWidth: '1200px', margin: '0 auto' }}
      >
        {/* Columna izquierda — CTA */}
        <div>
          <h2
            className="contact-title font-bold"
            style={{
              visibility: 'hidden',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(28px, 4.5vw, 56px)',
              color: 'var(--flash-white)',
              lineHeight: 1.1,
            }}
          >
            Hablemos de tu
            <br />
            <span style={{ color: 'var(--blaze-orange)' }}>próximo proyecto.</span>
          </h2>

          <p
            className="contact-subtitle mt-6"
            style={{
              visibility: 'hidden',
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 'clamp(16px, 1.5vw, 20px)',
              color: 'var(--classic-gray)',
              lineHeight: 1.5,
            }}
          >
            Estamos listos para crear algo
            <br className="hidden md:block" />
            extraordinario juntos.
          </p>
        </div>

        {/* Columna derecha — Datos de contacto */}
        <div className="flex flex-col justify-center gap-6">
          {/* Email y teléfono */}
          {CONTACT_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="contact-item contact-link group inline-flex items-center"
              style={{
                visibility: 'hidden',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 'clamp(18px, 2.2vw, 28px)',
                color: 'var(--flash-white)',
                textDecoration: 'none',
                transition: 'color 0.4s ease',
              }}
            >
              <span className="contact-link-text relative">
                {link.label}
              </span>
            </a>
          ))}

          {/* Separador */}
          <div
            className="contact-item"
            style={{
              visibility: 'hidden',
              width: '60px',
              height: '1px',
              backgroundColor: 'var(--classic-gray)',
              margin: '8px 0',
            }}
          />

          {/* Redes sociales */}
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="contact-item contact-link group inline-flex items-center"
              style={{
                visibility: 'hidden',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 'clamp(16px, 1.5vw, 20px)',
                color: 'var(--flash-white)',
                textDecoration: 'none',
                transition: 'color 0.4s ease',
              }}
            >
              <span className="contact-link-text relative">
                {link.label}
              </span>
            </a>
          ))}

          {/* Ubicación */}
          <p
            className="contact-item mt-4"
            style={{
              visibility: 'hidden',
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              color: 'var(--classic-gray)',
              letterSpacing: '0.1em',
            }}
          >
            Tegucigalpa, Honduras
          </p>
        </div>
      </div>

      {/* Hover underline styles */}
      <style>{`
        .contact-link .contact-link-text::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background-color: var(--blaze-orange);
          transition: width 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .contact-link:hover .contact-link-text::after {
          width: 100%;
        }
        .contact-link:hover {
          color: var(--blaze-orange) !important;
        }
      `}</style>
    </section>
  )
}
