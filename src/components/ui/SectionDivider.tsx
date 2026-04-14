import { useRef } from 'react'
import { gsap, useGSAP } from '@/lib/gsap'

interface SectionDividerProps {
  bg?: string
}

export function SectionDivider({ bg = 'var(--night-black)' }: SectionDividerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.fromTo(
      ref.current!.querySelector('.divider-line'),
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      },
    )
  }, { scope: ref })

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        backgroundColor: bg,
        padding: '0 clamp(24px, 4vw, 64px)',
      }}
    >
      {/* Gradient blend superior */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{
          height: '60px',
          background: `linear-gradient(to bottom, ${bg}, transparent)`,
        }}
      />
      <div
        className="divider-line mx-auto"
        style={{
          maxWidth: '1200px',
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, var(--blaze-orange) 20%, var(--blaze-orange) 80%, transparent 100%)',
          transformOrigin: 'left center',
          opacity: 0.4,
        }}
      />
      {/* Gradient blend inferior */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: '60px',
          background: `linear-gradient(to top, ${bg}, transparent)`,
        }}
      />
    </div>
  )
}
