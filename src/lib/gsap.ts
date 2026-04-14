import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

// Registrar plugins una sola vez
gsap.registerPlugin(ScrollTrigger, useGSAP)

// Defaults del proyecto: easing cinematográfico, duraciones generosas
gsap.defaults({
  duration: 0.8,
  ease: 'power3.out',
})

// ScrollTrigger: ignorar resize de barra de dirección en mobile
ScrollTrigger.config({
  ignoreMobileResize: true,
})

// Refrescar ScrollTrigger al resize (debounced)
let resizeTimer: ReturnType<typeof setTimeout>
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200)
})

export { gsap, ScrollTrigger, useGSAP }
