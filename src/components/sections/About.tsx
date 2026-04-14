import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { RotatingText } from '@/components/ui/RotatingText'

const TEXT_LINES = [
  'Somos una productora audiovisual',
  'donde la creatividad disruptiva',
  'y el minimalismo se unen para',
  'transformar ideas en experiencias',
  'visuales memorables.',
]

const SERVICES = [
  'Documentales',
  'Cortometrajes',
  'Spots',
  'Consultoría',
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const lines = gsap.utils.toArray<HTMLElement>('.about-line')
    const meta = gsap.utils.toArray<HTMLElement>('.about-meta')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })

    tl.fromTo(
      lines,
      { yPercent: 110, autoAlpha: 0 },
      {
        yPercent: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
      },
    )

    tl.fromTo(
      meta,
      { y: 20, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.15,
      },
      '-=0.3',
    )
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="dot-pattern relative"
      style={{
        backgroundColor: 'var(--night-black)',
        padding: 'clamp(80px, 12vw, 160px) clamp(24px, 4vw, 64px)',
      }}
    >
      <div
        className="mx-auto grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16"
        style={{ maxWidth: '1100px' }}
      >
        {/* Columna izquierda — Texto principal (2/3) */}
        <div className="md:col-span-2">
          <div className="relative flex gap-6">
            {/* Barra vertical naranja */}
            <div
              className="about-meta hidden shrink-0 md:block"
              style={{
                visibility: 'hidden',
                width: '4px',
                height: '40px',
                backgroundColor: 'var(--blaze-orange)',
                borderRadius: '2px',
                marginTop: '10px',
              }}
            />

            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 300,
                fontSize: 'clamp(24px, 3.5vw, 42px)',
                lineHeight: 1.3,
                color: 'var(--flash-white)',
              }}
            >
              {TEXT_LINES.map((line, i) => (
                <div key={i} style={{ overflow: 'hidden' }}>
                  <div className="about-line" style={{ visibility: 'hidden' }}>
                    {line}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna derecha — Servicios con rotación */}
        <div className="about-meta flex flex-col justify-center" style={{ visibility: 'hidden' }}>
          <span
            className="mb-5 block uppercase"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              letterSpacing: '0.2em',
              color: 'var(--classic-gray)',
            }}
          >
            Lo que hacemos
          </span>

          {/* Servicio actual — rotación animada, GRANDE para contrastar */}
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: 'clamp(40px, 5vw, 72px)',
              color: 'var(--blaze-orange)',
              lineHeight: 1.1,
              minHeight: 'clamp(48px, 6vw, 82px)',
            }}
          >
            <RotatingText
              texts={SERVICES}
              splitBy="characters"
              staggerDuration={0.03}
              staggerFrom="first"
              rotationInterval={2500}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
            />
          </div>

          {/* Línea decorativa naranja */}
          <div
            className="mt-6"
            style={{
              width: '40px',
              height: '2px',
              backgroundColor: 'var(--blaze-orange)',
              borderRadius: '1px',
            }}
          />
        </div>
      </div>

      {/* Coordenadas — centradas, despegadas del texto */}
      <div
        className="about-meta mt-16 text-center md:mt-24"
        style={{ visibility: 'hidden' }}
      >
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '13px',
            color: 'var(--classic-gray)',
            letterSpacing: '0.15em',
          }}
        >
          14.1066°N, -87.2014°W
        </p>
      </div>

      <style>{`
        .rotating-text {
          display: flex;
          flex-wrap: wrap;
          white-space: pre-wrap;
          position: relative;
        }
        .rotating-text-sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .rotating-text-word {
          display: inline-flex;
        }
        .rotating-text-lines {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .rotating-text-element {
          display: inline-block;
        }
        .rotating-text-space {
          white-space: pre;
        }
      `}</style>
    </section>
  )
}
