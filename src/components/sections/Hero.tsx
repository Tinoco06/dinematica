import { useRef, useState, useEffect, lazy, Suspense } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'
import { TrueFocus } from '@/components/ui/TrueFocus'

// Lazy load del Dither — Three.js es pesado, solo cargar en desktop
const Dither = lazy(() =>
  import('@/components/ui/Dither').then((m) => ({ default: m.Dither })),
)

interface HeroProps {
  /** true cuando el loader terminó y el hero puede animarse */
  isReady: boolean
}

export function Hero({ isReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  // Detectar desktop para renderizar Dither condicionalmente
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useGSAP(() => {
    if (!isReady) return

    const content = contentRef.current!
    const section = sectionRef.current!

    // --- Animación de entrada (post-loader) ---
    const entryTl = gsap.timeline({
      defaults: { ease: 'power3.out' },
    })

    entryTl.fromTo(
      '.hero-title',
      { y: 60, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1 },
      0.3,
    )

    entryTl.fromTo(
      '.hero-subtitle',
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
      0.7,
    )

    entryTl.fromTo(
      '.hero-logo-split',
      { y: 40, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' },
      0.8,
    )

    // --- Parallax solo en desktop (>768px) ---
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      gsap.to(content, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    })
  }, {
    scope: sectionRef,
    dependencies: [isReady],
  })

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex h-screen items-center justify-center"
      style={{ backgroundColor: 'var(--night-black)', overflowX: 'clip', overflowY: 'visible' }}
    >
      {/* === DITHER BACKGROUND — solo desktop === */}
      {isDesktop && (
        <Suspense fallback={null}>
          <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }}>
            <Dither
              waveSpeed={0.03}
              waveFrequency={2}
              waveAmplitude={0.2}
              waveColor={[1.0, 0.369, 0.153]}
              colorNum={4}
              pixelSize={3}
              enableMouseInteraction={true}
              mouseRadius={0.8}
            />
          </div>
        </Suspense>
      )}

      {/* Overlay oscuro para legibilidad del texto sobre el dither */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 2,
          background: isDesktop
            ? 'radial-gradient(ellipse at center, rgba(24,24,24,0.55) 0%, rgba(24,24,24,0.75) 60%, rgba(24,24,24,0.9) 100%)'
            : 'none',
        }}
      />

      {/* Fondo atmosférico mobile — gradiente animado cuando no hay dither */}
      {!isDesktop && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            zIndex: 1,
            background: 'radial-gradient(ellipse at 60% 40%, rgba(255,94,39,0.12) 0%, transparent 60%), radial-gradient(ellipse at 30% 70%, rgba(255,94,39,0.06) 0%, transparent 50%)',
          }}
        />
      )}

      {/* Dot pattern de fondo (más visible en mobile donde no hay dither) */}
      <div
        className="dot-pattern pointer-events-none absolute inset-0"
        style={{ zIndex: 3, opacity: isDesktop ? 0.4 : 1 }}
      />

      {/* Líneas diagonales sutiles */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 3,
          backgroundImage:
            'repeating-linear-gradient(135deg, transparent, transparent 60px, rgba(255,94,39,0.015) 60px, rgba(255,94,39,0.015) 61px)',
        }}
      />

      {/* Contenido — se mueve con parallax en desktop */}
      <div
        ref={contentRef}
        className="relative flex flex-col items-center px-6"
        style={{ zIndex: 10 }}
      >
        {/* Titular */}
        <h1
          className="hero-title text-center font-bold leading-tight"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(28px, 5.5vw, 72px)',
            color: 'var(--flash-white)',
            maxWidth: '900px',
            visibility: 'hidden',
          }}
        >
          Transformamos ideas en{' '}
          <TrueFocus
            sentence="experiencias visuales"
            blurAmount={3}
            borderColor="var(--blaze-orange)"
            glowColor="rgba(255, 94, 39, 0.6)"
            animationDuration={0.6}
            pauseBetweenAnimations={1.5}
          />{' '}
          memorables.
        </h1>

        {/* Subtítulo */}
        <p
          className="hero-subtitle mt-6 text-center uppercase md:mt-8"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: 'clamp(11px, 1.2vw, 16px)',
            letterSpacing: '0.15em',
            color: 'var(--classic-gray)',
            visibility: 'hidden',
          }}
        >
          Productora audiovisual creativa — Tegucigalpa, HN
        </p>

      </div>

      {/* ─── LOGO SPLIT — mitad superior naranja + mitad inferior verde ─── */}
      {/* Wrapper centrado en el borde inferior del hero (translateY 50% lo divide) */}
      <div
        className="hero-logo-split absolute bottom-0 left-1/2"
        style={{
          zIndex: 10,
          transform: 'translateX(-50%) translateY(45%)',
          width: 'clamp(280px, 55vw, 850px)',
          visibility: 'hidden',
        }}
      >
        {/* Logo naranja — solo mitad superior visible (clipPath corta la inferior) */}
        <img
          src="/logos/logo-dots-orange.png"
          alt=""
          className="w-full"
          style={{
            display: 'block',
            clipPath: 'inset(0 0 45% 0)',
          }}
          draggable={false}
          aria-hidden="true"
        />
        {/* Logo verde — solo mitad inferior visible, superpuesto exactamente */}
        <img
          src="/logos/logo-dots-green.png"
          alt=""
          className="absolute left-0 top-0 w-full"
          style={{
            display: 'block',
            clipPath: 'inset(55% 0 0 0)',
          }}
          draggable={false}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
