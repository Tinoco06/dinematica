import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap, useGSAP } from '@/lib/gsap'
import { heroReel } from '@/data/heroReel'

interface HeroProps {
  /** true cuando el loader terminó y el hero puede animarse */
  isReady: boolean
}

const ROTATION_MS = 7000
const CROSSFADE_MS = 800

export function Hero({ isReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const navigate = useNavigate()
  const current = heroReel[index]

  useGSAP(
    () => {
      if (!isReady) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '.hero-video-stack',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 1.2 },
        0.1,
      )
      tl.fromTo(
        '.hero-text',
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8 },
        0.5,
      )
      tl.fromTo(
        '.hero-arrow',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.6, stagger: 0.1 },
        0.9,
      )
      tl.fromTo(
        '.hero-meta',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.6 },
        1.1,
      )
      tl.fromTo(
        '.hero-logo-split',
        { y: 40, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: 'power2.out' },
        1.0,
      )
    },
    { scope: sectionRef, dependencies: [isReady] },
  )

  // Auto-rotación — arranca cuando isReady, se reinicia con cada cambio de índice
  useEffect(() => {
    if (!isReady) return
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % heroReel.length)
    }, ROTATION_MS)
    return () => window.clearTimeout(id)
  }, [index, isReady])

  // Animación del texto cuando cambia el slide (no en el mount inicial)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (!isReady) return
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!textRef.current) return
    gsap.fromTo(
      textRef.current,
      { y: 24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
    )
  }, [index, isReady])

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIndex((i) => (i - 1 + heroReel.length) % heroReel.length)
  }
  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIndex((i) => (i + 1) % heroReel.length)
  }
  const openProject = () => navigate(`/proyecto/${current.projectSlug}`)

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-hidden"
      style={{ backgroundColor: 'var(--night-black)' }}
    >
      {/* === STACK DE VIDEOS — todos cargados, opacity para crossfade === */}
      <div
        className="hero-video-stack absolute inset-0"
        style={{ zIndex: 1, visibility: 'hidden' }}
      >
        {heroReel.map((slide, i) => (
          <video
            key={slide.id}
            className="absolute inset-0 h-full w-full object-cover"
            src={slide.video}
            poster={slide.poster}
            autoPlay
            muted
            loop
            playsInline
            preload={i === 0 ? 'auto' : 'metadata'}
            aria-hidden="true"
            style={{
              opacity: i === index ? 1 : 0,
              transition: `opacity ${CROSSFADE_MS}ms ease-in-out`,
            }}
          />
        ))}
      </div>

      {/* Overlay oscuro para legibilidad — gradiente radial + viñeta inferior */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 2,
          background:
            'radial-gradient(ellipse at center, rgba(24,24,24,0.35) 0%, rgba(24,24,24,0.6) 70%, rgba(24,24,24,0.85) 100%)',
        }}
      />

      {/* Dot pattern sutil sobre el video */}
      <div
        className="dot-pattern pointer-events-none absolute inset-0"
        style={{ zIndex: 3, opacity: 0.25 }}
      />

      {/* === ÁREA CLICKEABLE CENTRAL — abre el proyecto === */}
      <button
        type="button"
        onClick={openProject}
        data-cursor="project"
        aria-label={`Ver proyecto: ${current.title}`}
        className="absolute inset-0 cursor-pointer"
        style={{
          zIndex: 5,
          background: 'transparent',
          border: 'none',
          padding: 0,
        }}
      />

      {/* === FLECHAS DE NAVEGACIÓN === */}
      <button
        type="button"
        onClick={goPrev}
        data-cursor="pointer"
        aria-label="Slide anterior"
        className="hero-arrow absolute top-1/2 -translate-y-1/2"
        style={{
          zIndex: 20,
          left: 'clamp(12px, 3vw, 40px)',
          width: 'clamp(40px, 5vw, 56px)',
          height: 'clamp(40px, 5vw, 56px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          color: 'var(--blaze-orange)',
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(28px, 3.5vw, 44px)',
          fontWeight: 300,
          lineHeight: 1,
          padding: 0,
          visibility: 'hidden',
          transition: 'transform 0.3s ease, color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translate(-4px, -50%)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(0, -50%)'
        }}
      >
        ←
      </button>

      <button
        type="button"
        onClick={goNext}
        data-cursor="pointer"
        aria-label="Slide siguiente"
        className="hero-arrow absolute top-1/2 -translate-y-1/2"
        style={{
          zIndex: 20,
          right: 'clamp(12px, 3vw, 40px)',
          width: 'clamp(40px, 5vw, 56px)',
          height: 'clamp(40px, 5vw, 56px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          border: 'none',
          color: 'var(--blaze-orange)',
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(28px, 3.5vw, 44px)',
          fontWeight: 300,
          lineHeight: 1,
          padding: 0,
          visibility: 'hidden',
          transition: 'transform 0.3s ease, color 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translate(4px, -50%)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(0, -50%)'
        }}
      >
        →
      </button>

      {/* === TÍTULO + DIRECTOR — centrados === */}
      <div
        className="hero-text pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
        style={{ zIndex: 10, visibility: 'hidden' }}
      >
        <div ref={textRef}>
          <h1
            className="font-bold leading-tight"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(40px, 8vw, 120px)',
              color: 'var(--flash-white)',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            }}
          >
            {current.title}
          </h1>

          <p
            className="mt-2 md:mt-3"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 300,
              fontSize: 'clamp(14px, 1.6vw, 22px)',
              color: 'var(--flash-white)',
              opacity: 0.92,
              textShadow: '0 1px 12px rgba(0,0,0,0.5)',
            }}
          >
            {current.subtitle}
          </p>

          <p
            className="mt-4 uppercase md:mt-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(10px, 1vw, 13px)',
              letterSpacing: '0.2em',
              color: 'var(--blaze-orange)',
            }}
          >
            Dirigido por {current.director}
          </p>
        </div>
      </div>

      {/* === META INFERIOR — contador + tagline (no bloquea click central) === */}
      <div
        className="hero-meta pointer-events-none absolute bottom-4 left-0 right-0 flex items-center justify-between px-4 md:bottom-8 md:px-8"
        style={{ zIndex: 15, visibility: 'hidden' }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(10px, 0.9vw, 12px)',
            letterSpacing: '0.18em',
            color: 'var(--classic-gray)',
            textTransform: 'uppercase',
          }}
        >
          {String(index + 1).padStart(2, '0')} / {String(heroReel.length).padStart(2, '0')}
        </span>

        <span
          className="hidden md:inline"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(10px, 0.9vw, 12px)',
            letterSpacing: '0.18em',
            color: 'var(--classic-gray)',
            textTransform: 'uppercase',
          }}
        >
          Productora audiovisual — Tegucigalpa, HN
        </span>
      </div>

      {/* === LOGO SPLIT — naranja arriba + verde abajo en el borde inferior === */}
      <div
        className="hero-logo-split absolute bottom-0 left-1/2"
        style={{
          display: 'none',
          zIndex: 10,
          transform: 'translateX(-50%) translateY(65%)',
          width: 'clamp(280px, 55vw, 850px)',
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <img
          src="/logos/logo-dots-orange.png"
          alt=""
          className="w-full"
          style={{ display: 'block', clipPath: 'inset(0 0 45% 0)' }}
          draggable={false}
          aria-hidden="true"
        />
        <img
          src="/logos/logo-dots-green.png"
          alt=""
          className="absolute left-0 top-0 w-full"
          style={{ display: 'block', clipPath: 'inset(55% 0 0 0)' }}
          draggable={false}
          aria-hidden="true"
        />
      </div>
    </section>
  )
}
