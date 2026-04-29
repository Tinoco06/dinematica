import { useRef, useState, useEffect, useCallback } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

interface HeroProps {
  /** true cuando el loader terminó y el hero puede animarse */
  isReady: boolean
}

interface Slide {
  id: string
  title: string
  video: string
  poster: string
  category: string
}

const SLIDES: Slide[] = [
  {
    id: 'arbol',
    title: 'Organización Árbol de Misericordia',
    video: '/videos/arbol-de-misericordia.mp4',
    poster: '/videos/posters/arbol-de-misericordia.jpg',
    category: 'Documental',
  },
  {
    id: 'sinclair',
    title: 'Exportadora SINCLAIR',
    video: '/videos/sinclair.mp4',
    poster: '/videos/posters/sinclair.jpg',
    category: 'Corporativo',
  },
  {
    id: 'delicias',
    title: 'Delicias del Carmen',
    video: '/videos/delicias-del-carmen.mp4',
    poster: '/videos/posters/delicias-del-carmen.jpg',
    category: 'Spot',
  },
]

const AUTO_ADVANCE_MS = 9000

export function Hero({ isReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const slidesRef = useRef<(HTMLDivElement | null)[]>([])
  const videosRef = useRef<(HTMLVideoElement | null)[]>([])
  const titleRef = useRef<HTMLHeadingElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number | null>(null)

  const [activeIndex, setActiveIndex] = useState(0)

  // Avanzar a un slide específico (con wrap-around)
  const goTo = useCallback((index: number) => {
    const next = ((index % SLIDES.length) + SLIDES.length) % SLIDES.length
    setActiveIndex(next)
  }, [])

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  // === Auto-advance ===
  useEffect(() => {
    if (!isReady) return
    const t = window.setTimeout(() => {
      goTo(activeIndex + 1)
    }, AUTO_ADVANCE_MS)
    return () => window.clearTimeout(t)
  }, [activeIndex, isReady, goTo])

  // === Control de reproducción + crossfade entre slides ===
  // Espera a que el video activo tenga buffer (canplay) antes de animar la
  // transición — así evitamos el "freeze" visible cuando el siguiente slide
  // todavía no descargó el primer chunk.
  useEffect(() => {
    const activeVideo = videosRef.current[activeIndex]

    // Pausar los inactivos siempre, sin esperar
    videosRef.current.forEach((v, idx) => {
      if (v && idx !== activeIndex) v.pause()
    })

    if (!activeVideo) return

    let cancelled = false

    const startActiveSlide = () => {
      if (cancelled) return

      // Reset al primer frame para que cada visita arranque igual
      try {
        activeVideo.currentTime = 0
      } catch {
        // Algunos navegadores en mobile lanzan si el seek no está listo
      }
      activeVideo.play().catch(() => {})

      slidesRef.current.forEach((slide, idx) => {
        if (!slide) return
        gsap.to(slide, {
          autoAlpha: idx === activeIndex ? 1 : 0,
          duration: 1.1,
          ease: 'power2.inOut',
        })
      })

      if (titleRef.current && metaRef.current) {
        gsap.fromTo(
          [titleRef.current, metaRef.current],
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.08,
            delay: 0.3,
          },
        )
      }
    }

    // readyState >= 2 (HAVE_CURRENT_DATA): hay al menos un frame listo
    if (activeVideo.readyState >= 2) {
      startActiveSlide()
      return () => {
        cancelled = true
      }
    }

    // Si no, esperar a canplay con un fallback de 1.5s para no bloquear UX
    const onCanPlay = () => {
      activeVideo.removeEventListener('canplay', onCanPlay)
      startActiveSlide()
    }
    activeVideo.addEventListener('canplay', onCanPlay)
    const fallback = window.setTimeout(() => {
      activeVideo.removeEventListener('canplay', onCanPlay)
      startActiveSlide()
    }, 1500)

    return () => {
      cancelled = true
      window.clearTimeout(fallback)
      activeVideo.removeEventListener('canplay', onCanPlay)
    }
  }, [activeIndex])

  // === Animación de entrada inicial post-loader ===
  useGSAP(
    () => {
      if (!isReady) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '.hero-slide-active',
        { autoAlpha: 0, scale: 1.05 },
        { autoAlpha: 1, scale: 1, duration: 1.4 },
        0,
      )
        .fromTo(
          '.hero-meta-fixed',
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          0.6,
        )
        .fromTo(
          '.hero-controls',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          0.9,
        )
    },
    { scope: sectionRef, dependencies: [isReady] },
  )

  // === Navegación por teclado (desktop) ===
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // === Swipe en mobile ===
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) {
      if (dx < 0) next()
      else prev()
    }
    touchStartX.current = null
  }

  const activeSlide = SLIDES[activeIndex]

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ backgroundColor: 'var(--night-black)' }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* === CAPA 1 — Carrusel de videos (full-bleed) === */}
      {SLIDES.map((slide, idx) => (
        <div
          key={slide.id}
          ref={(el) => {
            slidesRef.current[idx] = el
          }}
          className={`absolute inset-0 ${idx === activeIndex ? 'hero-slide-active' : ''}`}
          style={{
            zIndex: 1,
            opacity: idx === activeIndex ? 1 : 0,
            visibility: idx === activeIndex ? 'visible' : 'hidden',
          }}
          aria-hidden={idx !== activeIndex}
        >
          <video
            ref={(el) => {
              videosRef.current[idx] = el
            }}
            src={slide.video}
            poster={slide.poster}
            muted
            loop
            playsInline
            // Importante: autoPlay en el active para que iOS dispare carga
            autoPlay={idx === activeIndex}
            preload="auto"
            className="h-full w-full object-cover"
            // Fondo oscuro mientras el video carga
            style={{ backgroundColor: 'var(--night-black)' }}
          />
        </div>
      ))}

      {/* === CAPA 2 — Overlay de legibilidad (gradiente cinematográfico) === */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: 2,
          background:
            'linear-gradient(to bottom, rgba(24,24,24,0.78) 0%, rgba(24,24,24,0.35) 18%, rgba(24,24,24,0.2) 45%, rgba(24,24,24,0.55) 70%, rgba(24,24,24,0.92) 100%)',
        }}
      />

      {/* === CAPA 3 — Tinte naranja sutil (firma de marca) === */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{
          zIndex: 2,
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(255,94,39,0.18) 0%, transparent 55%)',
        }}
      />

      {/* === CAPA 4 — Dot-pattern (firma disruptiva) === */}
      <div
        className="dot-pattern pointer-events-none absolute inset-0"
        style={{ zIndex: 3, opacity: 0.5 }}
      />

      {/* === CAPA 5 — Contenido === */}

      {/* Etiqueta superior izquierda — categoría del proyecto activo */}
      <div
        className="hero-meta-fixed absolute left-4 top-20 sm:left-8 sm:top-24 md:left-10 md:top-28"
        style={{ zIndex: 10, visibility: 'hidden' }}
      >
        <div
          className="flex items-center gap-3"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(10px, 0.9vw, 12px)',
            letterSpacing: '0.2em',
            color: 'var(--blaze-orange)',
            textTransform: 'uppercase',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '24px',
              height: '1px',
              background: 'var(--blaze-orange)',
            }}
          />
          <span>
            {String(activeIndex + 1).padStart(2, '0')} /{' '}
            {String(SLIDES.length).padStart(2, '0')} — {activeSlide.category}
          </span>
        </div>
      </div>

      {/* Bloque central — Título del proyecto + meta */}
      <div
        className="absolute inset-x-0 bottom-20 px-6 sm:bottom-24 sm:px-10 md:bottom-24 md:px-16 lg:bottom-28"
        style={{ zIndex: 10 }}
      >
        <div className="mx-auto max-w-6xl text-center">
          <h1
            ref={titleRef}
            className="font-bold leading-[1.05]"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(32px, 6.5vw, 88px)',
              color: 'var(--flash-white)',
              textShadow: '0 2px 24px rgba(0,0,0,0.45)',
              visibility: 'hidden',
            }}
          >
            {activeSlide.title}
          </h1>

          <div
            ref={metaRef}
            className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:mt-8 sm:gap-x-5"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(12px, 1.15vw, 17px)',
              letterSpacing: '0.22em',
              color: 'var(--flash-white)',
              textTransform: 'uppercase',
              visibility: 'hidden',
            }}
          >
            <span style={{ color: 'var(--flash-white)', opacity: 0.85 }}>
              Dirigido y producido por
            </span>
            <span
              style={{
                color: 'var(--highlight-green)',
                fontWeight: 700,
                letterSpacing: '0.18em',
              }}
            >
              Beto Rueda
            </span>
            <span
              aria-hidden="true"
              style={{ color: 'var(--blaze-orange)', opacity: 0.9 }}
            >
              ·
            </span>
            <span style={{ color: 'var(--flash-white)', opacity: 0.85 }}>
              2026
            </span>
          </div>
        </div>
      </div>

      {/* === Controles del carrusel === */}
      <div
        className="hero-controls absolute inset-x-0 bottom-6 px-6 sm:bottom-8 md:bottom-10"
        style={{ zIndex: 10, visibility: 'hidden' }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          {/* Indicadores (líneas progresivas) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Ir al proyecto ${idx + 1}: ${s.title}`}
                className="group relative h-3 cursor-pointer"
                style={{
                  width: idx === activeIndex ? '48px' : '24px',
                  transition: 'width 0.4s ease',
                  background: 'transparent',
                  border: 0,
                  padding: 0,
                }}
                data-cursor
              >
                <span
                  className="absolute left-0 top-1/2 block h-px w-full -translate-y-1/2"
                  style={{
                    background:
                      idx === activeIndex
                        ? 'var(--blaze-orange)'
                        : 'rgba(255,255,255,0.35)',
                    transition: 'background 0.3s ease',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Flechas — desktop */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={prev}
              aria-label="Proyecto anterior"
              className="flex h-12 w-12 items-center justify-center transition-all hover:bg-white/10"
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--flash-white)',
                background: 'transparent',
              }}
              data-cursor
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Proyecto siguiente"
              className="flex h-12 w-12 items-center justify-center transition-all hover:bg-white/10"
              style={{
                border: '1px solid rgba(255,255,255,0.2)',
                color: 'var(--flash-white)',
                background: 'transparent',
              }}
              data-cursor
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Hint mobile — swipe */}
          <div
            className="md:hidden"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'var(--classic-gray)',
              textTransform: 'uppercase',
            }}
          >
            ← Desliza →
          </div>
        </div>
      </div>
    </section>
  )
}
