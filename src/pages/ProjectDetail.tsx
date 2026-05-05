import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gsap, useGSAP } from '@/lib/gsap'
import { projects, categoryLabels } from '@/data/projects'
import { Logo } from '@/components/icons/Logo'

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const projectIndex = projects.findIndex((p) => p.slug === slug)
  const project = projects[projectIndex]

  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)

  // Reset al cambiar de proyecto: scroll top + estado de player limpio
  useEffect(() => {
    window.scrollTo(0, 0)
    setIsPlaying(true)
    setIsMuted(true)
    const v = videoRef.current
    if (v) v.muted = true
  }, [slug])

  // Sincronizar isPlaying / isMuted con eventos nativos del video
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onVolumeChange = () => setIsMuted(v.muted)
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('volumechange', onVolumeChange)
    return () => {
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('volumechange', onVolumeChange)
    }
  }, [slug])

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }

  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
  }

  // Entry animation
  useGSAP(
    () => {
      if (!project) return

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(
        '.detail-hero-media',
        { scale: 1.06, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 1.2, ease: 'power2.out' },
      )

      tl.fromTo(
        '.detail-chip',
        { y: -10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6 },
        0.4,
      )

      tl.fromTo(
        '.detail-controls',
        { y: 10, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6 },
        0.5,
      )

      tl.fromTo(
        '.detail-title',
        { y: 30, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8 },
        0.5,
      )

      tl.fromTo(
        '.detail-meta-item',
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.08 },
        0.7,
      )

      tl.fromTo(
        '.detail-nav',
        { y: 16, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6 },
        0.9,
      )

      tl.fromTo(
        '.detail-stamp',
        { scale: 0.85, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.7, ease: 'back.out(1.7)' },
        1.1,
      )
    },
    { scope: pageRef, dependencies: [slug] },
  )

  if (!project) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: 'var(--night-black)' }}
      >
        <div className="text-center">
          <h1
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '24px',
              color: 'var(--flash-white)',
            }}
          >
            Proyecto no encontrado
          </h1>
          <Link
            to="/"
            className="mt-4 inline-block"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '13px',
              color: 'var(--blaze-orange)',
              textDecoration: 'none',
            }}
          >
            ← Volver al portafolio
          </Link>
        </div>
      </div>
    )
  }

  const prevProject = projectIndex > 0 ? projects[projectIndex - 1] : null
  const nextProject =
    projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null

  const isVertical = project.videoOrientation === 'vertical'

  // Container del player: vertical 9/16 centrado, horizontal 16/9 full-bleed
  const heroContainerStyle: React.CSSProperties = isVertical
    ? {
        aspectRatio: '9/16',
        height: 'min(85vh, 100vw)',
        maxWidth: '95vw',
        margin: '0 auto',
        marginTop: 'clamp(40px, 6vw, 80px)',
        borderRadius: '12px',
      }
    : {
        aspectRatio: '16/9',
        maxHeight: '80vh',
        borderRadius: '12px',
      }

  return (
    <div ref={pageRef} style={{ backgroundColor: 'var(--night-black)' }}>
      {/* === Player custom — video + chip de categoría + botón play/pause === */}
      <div
        className="relative overflow-hidden"
        style={heroContainerStyle}
      >
        {project.video ? (
          <video
            ref={videoRef}
            src={project.video}
            poster={project.thumbnail}
            autoPlay
            muted
            loop
            playsInline
            className="detail-hero-media absolute inset-0 h-full w-full object-cover"
            style={{
              visibility: 'hidden',
              backgroundColor: 'var(--night-black)',
            }}
          />
        ) : (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="detail-hero-media absolute inset-0 h-full w-full object-cover"
            style={{ visibility: 'hidden' }}
          />
        )}

        {/* Dot pattern (sutil) */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '10px 10px',
            opacity: 0.08,
          }}
        />

        {/* Chip de categoría — top-left */}
        <div
          className="detail-chip absolute left-4 top-4 flex items-center gap-2 md:left-5 md:top-5"
          style={{
            visibility: 'hidden',
            padding: '7px 14px',
            borderRadius: '999px',
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: 'var(--blaze-orange)',
              boxShadow: '0 0 10px rgba(255,94,39,0.7)',
            }}
          />
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '11px',
              letterSpacing: '0.18em',
              color: 'var(--highlight-green)',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {categoryLabels[project.category]}
          </span>
        </div>

        {/* Botón play/pause — wrapper centrado con flex (resistente a GSAP).
            La animación de entrada toca el wrapper, el botón mantiene su
            posición absoluta inalterada. */}
        {project.video && (
          <div
            className="detail-controls pointer-events-none absolute inset-x-0 bottom-5 flex justify-center md:bottom-6"
            style={{ visibility: 'hidden' }}
          >
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
              className="pointer-events-auto flex items-center justify-center"
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.15)',
                cursor: 'pointer',
                transition: 'background 0.3s ease, transform 0.2s ease',
              }}
              data-cursor
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.75)'
                e.currentTarget.style.transform = 'scale(1.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.55)'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {isPlaying ? (
                // Pausa: dos barras verticales
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="var(--flash-white)"
                  aria-hidden="true"
                >
                  <rect x="3" y="2" width="3.5" height="12" rx="1" />
                  <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
                </svg>
              ) : (
                // Play: triángulo
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="var(--flash-white)"
                  aria-hidden="true"
                >
                  <path d="M4 2.5v11l10-5.5z" />
                </svg>
              )}
            </button>
          </div>
        )}

        {/* Botón mute/unmute — bottom-right, secundario al play */}
        {project.video && (
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? 'Activar audio' : 'Silenciar audio'}
            aria-pressed={!isMuted}
            className="detail-controls absolute bottom-5 right-4 flex items-center justify-center md:bottom-6 md:right-5"
            style={{
              visibility: 'hidden',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.15)',
              cursor: 'pointer',
              transition: 'background 0.3s ease, transform 0.2s ease',
            }}
            data-cursor
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.75)'
              e.currentTarget.style.transform = 'scale(1.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0,0,0,0.55)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            {isMuted ? (
              // Speaker con barra diagonal (muted)
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--flash-white)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              // Speaker con ondas (audio activo)
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--flash-white)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* === Bloque de meta — todo centrado === */}
      <div
        style={{
          maxWidth: '900px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 'clamp(48px, 8vw, 96px) clamp(24px, 4vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {/* Título */}
        <h1
          className="detail-title font-bold"
          style={{
            visibility: 'hidden',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(36px, 7vw, 80px)',
            color: 'var(--flash-white)',
            lineHeight: 1.05,
          }}
        >
          {project.title}
        </h1>

        {/* Meta row — Dirigido por · Año */}
        <div className="mt-10 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-24">
          <div className="detail-meta-item flex flex-col items-center gap-1" style={{ visibility: 'hidden' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: 'var(--classic-gray)',
                textTransform: 'uppercase',
              }}
            >
              Dirigido por
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--flash-white)',
                letterSpacing: '0.04em',
              }}
            >
              {project.director}
            </span>
          </div>

          {/* Separador vertical (solo desktop) */}
          <div
            className="detail-meta-item hidden sm:block"
            style={{
              visibility: 'hidden',
              width: '1px',
              height: '44px',
              background: 'rgba(255,255,255,0.15)',
            }}
          />

          <div className="detail-meta-item flex flex-col items-center gap-1" style={{ visibility: 'hidden' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '11px',
                letterSpacing: '0.22em',
                color: 'var(--classic-gray)',
                textTransform: 'uppercase',
              }}
            >
              Año
            </span>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                fontWeight: 600,
                color: 'var(--flash-white)',
                letterSpacing: '0.04em',
              }}
            >
              {project.year}
            </span>
          </div>
        </div>

        {/* Navegación entre proyectos */}
        <div
          className="detail-nav mt-16 flex items-center justify-between border-t pt-8 md:mt-24"
          style={{
            visibility: 'hidden',
            borderColor: 'var(--jet-black)',
            width: '100%',
          }}
        >
          {prevProject ? (
            <Link
              to={`/proyecto/${prevProject.slug}`}
              className="project-nav-link group flex items-center gap-2"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 'clamp(14px, 1.2vw, 16px)',
                color: 'var(--classic-gray)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>
              {prevProject.title}
            </Link>
          ) : (
            <span />
          )}

          {nextProject ? (
            <Link
              to={`/proyecto/${nextProject.slug}`}
              className="project-nav-link group flex items-center gap-2"
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 'clamp(14px, 1.2vw, 16px)',
                color: 'var(--classic-gray)',
                textDecoration: 'none',
                transition: 'color 0.3s ease',
              }}
            >
              {nextProject.title}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Sello Dinemática — limpio y centrado */}
        <div
          className="detail-stamp mx-auto mt-16 flex flex-col items-center gap-4 md:mt-24"
          style={{ visibility: 'hidden' }}
        >
          <div
            className="stamp-ring relative flex items-center justify-center"
            style={{
              width: '88px',
              height: '88px',
              border: '1px solid rgba(255,94,39,0.3)',
              borderRadius: '50%',
            }}
          >
            <Logo iconSize={36} color="var(--blaze-orange)" showText={false} />
          </div>

          <div className="flex flex-col items-center gap-1">
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: 'var(--classic-gray)',
                textTransform: 'uppercase',
              }}
            >
              Shot by
            </span>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '14px',
                letterSpacing: '0.2em',
                color: 'var(--blaze-orange)',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}
            >
              Dinemática
            </span>
          </div>
        </div>

        {/* Volver al portafolio */}
        <div className="mt-10 md:mt-14">
          <button
            onClick={() => navigate('/')}
            className="back-link"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              letterSpacing: '0.15em',
              color: 'var(--blaze-orange)',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
            }}
          >
            ← Volver al portafolio
          </button>
        </div>
      </div>

      <style>{`
        .project-nav-link:hover { color: var(--flash-white) !important; }
        .back-link:hover { color: var(--flash-white) !important; }
      `}</style>
    </div>
  )
}
