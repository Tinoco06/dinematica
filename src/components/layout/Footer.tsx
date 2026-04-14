import { useLenis } from 'lenis/react'

export function Footer() {
  const lenis = useLenis()

  function scrollToTop() {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer
      style={{
        backgroundColor: 'var(--night-black)',
        borderTop: '1px solid var(--jet-black)',
        padding: 'clamp(32px, 5vw, 60px) clamp(16px, 4vw, 64px)',
      }}
    >
      <div
        className="mx-auto flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left"
        style={{ maxWidth: '1200px', width: '100%' }}
      >
        {/* Izquierda — Copyright */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 300,
            fontSize: '13px',
            color: 'var(--classic-gray)',
          }}
        >
          © 2025 Dinemática
        </p>

        {/* Centro — Ubicación (solo desktop) */}
        <p
          className="hidden md:block"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            color: 'var(--classic-gray)',
            letterSpacing: '0.1em',
          }}
        >
          Tegucigalpa, HN
        </p>

        {/* Derecha — Scroll to top */}
        <button
          onClick={scrollToTop}
          className="footer-top-link"
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: '13px',
            color: 'var(--classic-gray)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
          }}
        >
          Arriba ↑
        </button>
      </div>

      <style>{`
        .footer-top-link:hover {
          color: var(--highlight-green) !important;
        }
      `}</style>
    </footer>
  )
}
