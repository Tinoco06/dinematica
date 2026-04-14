import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import type { LenisRef } from 'lenis/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import 'lenis/dist/lenis.css'

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    // Si reduced-motion, no sincronizar Lenis con GSAP
    if (prefersReducedMotion) return

    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // Sincronizar ScrollTrigger con Lenis en cada scroll
    const lenis = lenisRef.current?.lenis
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update)
    }

    return () => {
      gsap.ticker.remove(update)
      lenis?.off('scroll', ScrollTrigger.update)
    }
  }, [])

  // Si reduced-motion, usar scroll nativo sin Lenis
  if (prefersReducedMotion) {
    return <>{children}</>
  }

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  )
}
