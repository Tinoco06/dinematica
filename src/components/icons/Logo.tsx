import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

/**
 * Posiciones de los 24 puntos del ícono de Dinemática
 * Grilla 8 columnas × 7 filas (paso de 10px)
 * Mapeado desde socialmedia-07.jpg del brand manual
 * DEBE coincidir con ICON_GRID en Loader.tsx
 */
const DOTS: [number, number][] = [
  // Fila 0 (superior) — 2 pares horizontales
  [2, 0], [3, 0], [5, 0], [6, 0],
  // Lateral izquierdo superior — par vertical
  [0, 1], [0, 2],
  // Lateral derecho superior — par vertical
  [7, 1], [7, 2],
  // Centro — cluster (corazón del ícono)
  [4, 2], [5, 2],
  [3, 3], [4, 3], [5, 3],
  [3, 4], [4, 4], [5, 4],
  // Lateral izquierdo inferior — par vertical
  [0, 4], [0, 5],
  // Lateral derecho inferior — par vertical
  [7, 4], [7, 5],
  // Fila 6 (inferior) — 2 pares horizontales
  [2, 6], [3, 6], [5, 6], [6, 6],
]

interface LogoProps {
  /** Tamaño del ícono SVG en px */
  iconSize?: number
  /** Color de los dots y el texto */
  color?: string
  /** Mostrar texto "DINEMÁTICA" al lado */
  showText?: boolean
  /** Clase CSS adicional */
  className?: string
}

export function Logo({
  iconSize = 28,
  color = 'var(--flash-white)',
  showText = true,
  className = '',
}: LogoProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const { contextSafe } = useGSAP(() => {
    // No setup necesario — solo necesitamos contextSafe para los handlers
  }, { scope: containerRef })

  const handleMouseEnter = contextSafe(() => {
    const dots = containerRef.current!.querySelectorAll('.logo-dot')

    // Dispersar cada punto en dirección random
    gsap.to(dots, {
      attr: {
        cx: (_i: number, el: SVGCircleElement) => {
          const base = parseFloat(el.dataset.cx!)
          return base + gsap.utils.random(-3, 3)
        },
        cy: (_i: number, el: SVGCircleElement) => {
          const base = parseFloat(el.dataset.cy!)
          return base + gsap.utils.random(-3, 3)
        },
      },
      fill: 'var(--blaze-orange)',
      duration: 0.3,
      ease: 'power2.out',
      stagger: { amount: 0.2, from: 'random' },
    })
  })

  const handleMouseLeave = contextSafe(() => {
    const dots = containerRef.current!.querySelectorAll('.logo-dot')

    // Volver a posición original con elastic
    gsap.to(dots, {
      attr: {
        cx: (_i: number, el: SVGCircleElement) => parseFloat(el.dataset.cx!),
        cy: (_i: number, el: SVGCircleElement) => parseFloat(el.dataset.cy!),
      },
      fill: color,
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
      stagger: { amount: 0.15, from: 'random' },
    })
  })

  return (
    <div
      ref={containerRef}
      className={`logo-group flex items-center gap-[10px] ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ícono SVG — 24 puntos animables */}
      <svg
        viewBox="0 0 80 70"
        width={iconSize}
        height={Math.round(iconSize * 70 / 80)}
        aria-hidden="true"
      >
        {DOTS.map(([col, row], i) => {
          const cx = col * 10 + 5
          const cy = row * 10 + 5
          return (
            <circle
              key={i}
              className="logo-dot"
              cx={cx}
              cy={cy}
              r={4}
              fill={color}
              data-cx={cx}
              data-cy={cy}
            />
          )
        })}
      </svg>

      {/* Texto "DINEMÁTICA" */}
      {showText && (
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(14px, 1.8vw, 18px)',
            fontWeight: 700,
            letterSpacing: '0.18em',
            color,
            transition: 'color 0.3s ease',
            lineHeight: 1,
          }}
        >
          DINEMÁTICA
        </span>
      )}
    </div>
  )
}
