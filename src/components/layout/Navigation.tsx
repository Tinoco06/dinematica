import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { motion, AnimatePresence } from 'motion/react'
import { gsap, useGSAP } from '@/lib/gsap'
import { Logo } from '@/components/icons/Logo'

const MENU_LINKS = [
  { label: 'Proyectos', target: '#proyectos' },
  { label: 'Sobre', target: '#sobre' },
  { label: 'Contacto', target: '#contacto' },
]

const NAV_LINKS = [
  { label: 'Proyectos', target: '#proyectos' },
  { label: 'Contacto', target: '#contacto' },
]

interface NavigationProps {
  isReady?: boolean
}

export function Navigation({ isReady = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isNavHidden, setIsNavHidden] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const navRef = useRef<HTMLElement>(null)
  const lastScrollY = useRef(0)

  const lenis = useLenis(({ scroll, direction }) => {
    setIsScrolled(scroll > 80)

    // Smart nav: ocultar al scrollear hacia abajo, mostrar al subir
    if (!isMenuOpen) {
      if (scroll > 120 && direction === 1 && scroll - lastScrollY.current > 8) {
        setIsNavHidden(true)
      } else if (direction === -1) {
        setIsNavHidden(false)
      }
    }

    lastScrollY.current = scroll
  })

  // Fallback: scroll nativo cuando Lenis está deshabilitado (reduced-motion)
  useEffect(() => {
    if (lenis) return
    let lastY = 0
    function handleScroll() {
      const y = window.scrollY
      setIsScrolled(y > 80)
      if (!isMenuOpen) {
        if (y > 120 && y > lastY + 8) setIsNavHidden(true)
        else if (y < lastY - 5) setIsNavHidden(false)
      }
      lastY = y
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lenis, isMenuOpen])

  // Cuando el menú se abre, siempre mostrar la nav
  useEffect(() => {
    if (isMenuOpen) {
      setIsNavHidden(false)
      lenis?.stop()
    } else {
      lenis?.start()
    }
  }, [isMenuOpen, lenis])

  // --- ANIMACIÓN DE ENTRADA post-loader ---
  useGSAP(() => {
    if (!isReady) return

    const tl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power2.out' } })

    // Logo: desliza desde la izquierda
    tl.fromTo(
      '.nav-logo-group',
      { x: -20, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.6 },
    )

    // Links de desktop: stagger desde arriba
    tl.fromTo(
      '.nav-link',
      { y: -10, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.1 },
      '-=0.3',
    )

    // Hamburger: fade in
    tl.fromTo(
      '.nav-hamburger',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.3 },
      '-=0.2',
    )
  }, { scope: navRef, dependencies: [isReady] })

  function scrollTo(target: string) {
    setIsMenuOpen(false)

    // Si estamos en una página de proyecto, navegar a home primero
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const el = document.querySelector(target)
        if (el) {
          if (lenis) {
            lenis.scrollTo(target, { offset: -80, duration: 1.2 })
          } else {
            el.scrollIntoView({ behavior: 'smooth' })
          }
        }
      }, 600)
      return
    }

    setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(target, { offset: -80, duration: 1.2 })
      } else {
        document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
      }
    }, 400)
  }

  function scrollToTop() {
    setIsMenuOpen(false)

    if (location.pathname !== '/') {
      navigate('/')
      return
    }

    setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.2 })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 400)
  }

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[900]"
        style={{
          padding: '24px clamp(24px, 5vw, 80px)',
          backgroundColor: isScrolled
            ? 'rgba(24, 24, 24, 0.92)'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          transition:
            'background-color 0.4s ease, backdrop-filter 0.4s ease, transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
          transform: isNavHidden && !isMenuOpen ? 'translateY(-100%)' : 'translateY(0)',
        }}
      >
        <div className="flex items-center justify-between">
          {/* Logo — ícono SVG animado + texto */}
          <button
            onClick={scrollToTop}
            className="nav-logo-group relative z-[950] cursor-pointer border-none bg-transparent"
            style={{ visibility: 'hidden' }}
          >
            <Logo
              iconSize={28}
              color={isMenuOpen ? 'var(--blaze-orange)' : 'var(--flash-white)'}
            />
          </button>

          {/* Derecha: links + hamburger */}
          <div className="flex items-center gap-10">
            {/* Links inline — desktop only */}
            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.target}
                  onClick={() => scrollTo(link.target)}
                  className="nav-link cursor-pointer border-none bg-transparent uppercase"
                  style={{
                    visibility: 'hidden',
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 500,
                    letterSpacing: '0.12em',
                    color: 'var(--classic-gray)',
                    transition: 'color 0.3s ease',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = 'var(--flash-white)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = 'var(--classic-gray)')
                  }
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Hamburger — siempre visible */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="nav-hamburger relative z-[950] flex h-10 w-10 cursor-pointer flex-col items-end justify-center gap-[6px] border-none bg-transparent"
              style={{ visibility: 'hidden' }}
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              <motion.span
                className="block rounded-full"
                style={{
                  height: '2px',
                  backgroundColor: 'var(--flash-white)',
                  transformOrigin: 'right center',
                }}
                animate={{
                  width: isMenuOpen ? 28 : 24,
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? 4 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              />
              <motion.span
                className="block rounded-full"
                style={{
                  height: '2px',
                  backgroundColor: 'var(--flash-white)',
                  transformOrigin: 'right center',
                }}
                animate={{
                  width: isMenuOpen ? 28 : 16,
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? -4 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Menú fullscreen overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[940]"
            style={{ backgroundColor: 'var(--night-black)' }}
            initial={{ clipPath: 'circle(0% at calc(100% - 52px) 44px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 52px) 44px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 52px) 44px)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            {/* Dot pattern overlay en menú */}
            <div className="dot-pattern pointer-events-none absolute inset-0" />

            {/* Gradiente atmosférico sutil en el menú */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 70% 30%, rgba(255,94,39,0.06) 0%, transparent 60%)',
              }}
            />

            {/* Contenido del menú — centrado */}
            <div className="relative flex h-full flex-col justify-center px-[clamp(24px,5vw,80px)]">
              <nav className="flex flex-col items-start gap-1 md:gap-2">
                {MENU_LINKS.map((link, i) => (
                  <motion.button
                    key={link.target}
                    onClick={() => scrollTo(link.target)}
                    className="menu-link cursor-pointer border-none bg-transparent uppercase"
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(48px, 10vw, 96px)',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      color: 'var(--flash-white)',
                      lineHeight: 1.15,
                      transition: 'color 0.4s ease, transform 0.4s ease',
                    }}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.15 + i * 0.1,
                      ease: [0.76, 0, 0.24, 1],
                    }}
                    whileHover={{ color: '#FF5E27', x: 20 }}
                  >
                    {link.label}
                  </motion.button>
                ))}
              </nav>

              {/* Footer del menú */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-[clamp(24px,5vw,80px)] pb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <a
                  href="mailto:beto@dinematica.hn"
                  className="menu-footer-link"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    color: 'var(--classic-gray)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                >
                  beto@dinematica.hn
                </a>
                <a
                  href="#"
                  className="menu-footer-link"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '12px',
                    color: 'var(--classic-gray)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                  }}
                >
                  Instagram
                </a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .nav-logo-group:hover span {
          color: var(--blaze-orange) !important;
        }
        .menu-footer-link:hover {
          color: var(--flash-white) !important;
        }
      `}</style>
    </>
  )
}
