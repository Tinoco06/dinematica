import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/**
 * Posiciones de los 24 puntos del ícono de Dinemática [columna, fila]
 * Grilla de 8 columnas (0-7) × 7 filas (0-6)
 * Mapeado directamente desde socialmedia-10.jpg del brand manual
 */
const ICON_GRID: [number, number][] = [
  // Fila 0 (superior) — 2 pares horizontales
  [2, 0], [3, 0],
  [5, 0], [6, 0],

  // Lateral izquierdo superior — par vertical
  [0, 1],
  [0, 2],

  // Lateral derecho superior — par vertical
  [7, 1],
  [7, 2],

  // Centro — cluster (corazón del ícono)
  [4, 2], [5, 2],
  [3, 3], [4, 3], [5, 3],
  [3, 4], [4, 4], [5, 4],

  // Lateral izquierdo inferior — par vertical
  [0, 4],
  [0, 5],

  // Lateral derecho inferior — par vertical
  [7, 4],
  [7, 5],

  // Fila 6 (inferior) — 2 pares horizontales (simétrico con fila 0)
  [2, 6], [3, 6],
  [5, 6], [6, 6],
]

interface LoaderProps {
  onComplete: () => void
}

export function Loader({ onComplete }: LoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)

  // Tamaños responsivos (Vite SPA, window siempre disponible)
  const isMobile = window.innerWidth < 768
  const dotSize = isMobile ? 12 : 20
  const dotStep = isMobile ? 18 : 30
  const iconWidth = 7 * dotStep + dotSize
  const iconHeight = 6 * dotStep + dotSize
  const logoGap = isMobile ? 16 : 24

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const vw = window.innerWidth
    const vh = window.innerHeight
    const dots = gsap.utils.toArray<HTMLElement>('.loader-dot')
    const textEl = textRef.current!
    const iconEl = iconRef.current!
    const centerEl = centerRef.current!

    // Centrar el wrapper con GSAP (evita conflicto con CSS transforms)
    gsap.set(centerEl, { xPercent: -50, yPercent: -50 })

    // Medir ancho del texto (funciona con visibility:hidden)
    const textWidth = textEl.offsetWidth

    // ============================================================
    // PREFERS-REDUCED-MOTION: logo estático → wipe
    // ============================================================
    if (prefersReducedMotion) {
      gsap.set(centerEl, { x: -(textWidth + logoGap) / 2 })
      gsap.set(textEl, {
        autoAlpha: 1,
        yPercent: -50,
        clipPath: 'inset(0 0% 0 0)',
      })

      const tl = gsap.timeline({ onComplete })
      tl.to({}, { duration: 1.5 })
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      })
      return
    }

    // ============================================================
    // ESTADO INICIAL: puntos dispersos por el viewport
    // ============================================================
    gsap.set(textEl, {
      autoAlpha: 0,
      yPercent: -50,
      clipPath: 'inset(0 100% 0 0)',
    })

    dots.forEach((dot) => {
      gsap.set(dot, {
        x: (Math.random() - 0.5) * vw * 1.2,
        y: (Math.random() - 0.5) * vh * 1.2,
        scale: 0.3 + Math.random() * 1.2,
        autoAlpha: 0,
      })
    })

    // ============================================================
    // MASTER TIMELINE
    // ============================================================
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete,
    })

    // --- Fase 1: APARICIÓN (0s → 0.5s) ---
    // Puntos aparecen en posiciones aleatorias con stagger
    tl.addLabel('appear', 0)
    tl.to(
      '.loader-dot',
      {
        autoAlpha: 1,
        duration: 0.5,
        stagger: 0.02,
        ease: 'power2.out',
      },
      'appear',
    )

    // --- Fase 2: FLOTACIÓN (0.5s → 1.4s) ---
    // Movimiento sutil + transición de color blanco → naranja
    tl.addLabel('float', 0.5)
    tl.to(
      '.loader-dot',
      {
        x: '+=random(-20, 20)',
        y: '+=random(-20, 20)',
        duration: 0.35,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: 1,
        stagger: 0.01,
      },
      'float',
    )
    tl.to(
      '.loader-dot',
      {
        backgroundColor: '#FF5E27',
        duration: 0.6,
        stagger: 0.015,
        ease: 'power2.inOut',
      },
      'float',
    )

    // --- Fase 3: ENSAMBLAJE "efecto imán" (1.5s → 3.4s) ---
    // Los puntos viajan a su posición final en el ícono
    tl.addLabel('assemble', 1.5)
    tl.to(
      '.loader-dot',
      {
        x: 0,
        y: 0,
        scale: 1,
        duration: 1.5,
        ease: 'power3.inOut',
        stagger: {
          each: 0.02,
          from: 'random',
        },
        overwrite: 'auto',
      },
      'assemble',
    )

    // --- Fase 4: PAUSA + PULSE (3.5s) ---
    // Respiro cinematográfico, sutil pulso de vida
    tl.addLabel('formed', '+=0.1')
    tl.to(iconEl, {
      scale: 1.04,
      duration: 0.3,
      yoyo: true,
      repeat: 1,
      ease: 'sine.inOut',
    })

    // --- Fase 5: TRANSICIÓN A LOGOTIPO ---
    // Ícono se desplaza a la izquierda, texto se revela con clip-path
    tl.addLabel('logoReveal', '+=0.1')
    tl.to(
      centerEl,
      {
        x: -(textWidth + logoGap) / 2,
        duration: 0.8,
        ease: 'power3.inOut',
      },
      'logoReveal',
    )
    tl.fromTo(
      textEl,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        autoAlpha: 1,
        clipPath: 'inset(0 0% 0 0)',
        duration: 0.8,
        ease: 'power3.inOut',
      },
      'logoReveal+=0.15',
    )

    // --- Fase 6: SALIDA ---
    // Fade out del logotipo + wipe del fondo
    tl.addLabel('exit', '+=0.3')
    tl.to(
      centerEl,
      {
        scale: 0.95,
        autoAlpha: 0,
        duration: 0.5,
        ease: 'power2.in',
      },
      'exit',
    )
    tl.to(
      containerRef.current,
      {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut',
      },
      'exit+=0.3',
    )
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999]"
      style={{ backgroundColor: 'var(--night-black)' }}
    >
      {/* Wrapper centrado — posición con CSS, centering con GSAP xPercent/yPercent */}
      <div ref={centerRef} className="absolute left-1/2 top-1/2">
        {/* Contenedor del ícono */}
        <div
          ref={iconRef}
          className="relative"
          style={{ width: iconWidth, height: iconHeight }}
        >
          {ICON_GRID.map(([col, row], i) => (
            <div
              key={i}
              className="loader-dot absolute rounded-full"
              style={{
                width: dotSize,
                height: dotSize,
                left: col * dotStep,
                top: row * dotStep,
                backgroundColor: 'var(--flash-white)',
                willChange: 'transform',
              }}
            />
          ))}
        </div>

        {/* Texto del logotipo — absoluto para no afectar el centering del ícono */}
        <span
          ref={textRef}
          className="absolute whitespace-nowrap font-bold tracking-widest"
          style={{
            left: iconWidth + logoGap,
            top: '50%',
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? 32 : 52,
            color: 'var(--blaze-orange)',
            visibility: 'hidden',
          }}
        >
          DINEMÁTICA
        </span>
      </div>
    </div>
  )
}
