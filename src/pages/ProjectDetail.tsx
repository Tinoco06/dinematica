import { useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { gsap, useGSAP } from '@/lib/gsap'
import { projects, categoryLabels } from '@/data/projects'
import { Logo } from '@/components/icons/Logo'

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement>(null)

  const projectIndex = projects.findIndex((p) => p.slug === slug)
  const project = projects[projectIndex]

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  // Entry animation
  useGSAP(() => {
    if (!project) return

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.fromTo(
      '.detail-hero-img',
      { scale: 1.1 },
      { scale: 1, duration: 1.2, ease: 'power2.out' },
    )

    tl.fromTo(
      '.detail-title',
      { y: 40, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
      0.3,
    )

    tl.fromTo(
      '.detail-meta',
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 },
      0.5,
    )

    tl.fromTo(
      '.detail-body',
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7 },
      0.7,
    )

    tl.fromTo(
      '.detail-gallery-item',
      { y: 40, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.15 },
      0.9,
    )

    tl.fromTo(
      '.detail-nav',
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6 },
      1.1,
    )

    tl.fromTo(
      '.detail-stamp',
      { scale: 0.8, autoAlpha: 0, rotation: -10 },
      { scale: 1, autoAlpha: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' },
      1.3,
    )
  }, { scope: pageRef, dependencies: [slug] })

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

  return (
    <div ref={pageRef} style={{ backgroundColor: 'var(--night-black)' }}>
      {/* Hero del proyecto */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: '16/9', maxHeight: '80vh' }}
      >
        <img
          src={project.thumbnail}
          alt={project.title}
          className="detail-hero-img absolute inset-0 h-full w-full object-cover"
        />

        {/* Dot pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '10px 10px',
            opacity: 0.1,
          }}
        />

        {/* Gradiente */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, var(--night-black) 0%, rgba(24,24,24,0.3) 40%, transparent 70%)',
          }}
        />

        {/* Info sobre la imagen */}
        <div
          className="absolute inset-x-0 bottom-0 p-6 md:p-12 lg:p-16"
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          <span
            className="detail-meta"
            style={{
              visibility: 'hidden',
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              letterSpacing: '0.15em',
              color: project.color,
              textTransform: 'uppercase',
            }}
          >
            {categoryLabels[project.category]}
          </span>
          <h1
            className="detail-title mt-3 font-bold"
            style={{
              visibility: 'hidden',
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(36px, 7vw, 80px)',
              color: 'var(--flash-white)',
              lineHeight: 1,
            }}
          >
            {project.title}
          </h1>
        </div>
      </div>

      {/* Contenido */}
      <div
        className="mx-auto px-6 md:px-12 lg:px-16"
        style={{
          maxWidth: '1200px',
          padding: 'clamp(48px, 8vw, 96px) clamp(24px, 4vw, 64px)',
        }}
      >
        {/* Grid: descripción + datos */}
        <div className="detail-body grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-16" style={{ visibility: 'hidden' }}>
          {/* Descripción — 2 columnas */}
          <div className="md:col-span-2">
            {project.longDescription.map((paragraph, i) => (
              <p
                key={i}
                className={i > 0 ? 'mt-6' : ''}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 300,
                  fontSize: 'clamp(16px, 1.5vw, 20px)',
                  lineHeight: 1.7,
                  color: 'var(--classic-gray)',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Datos del proyecto */}
          <div className="flex flex-col gap-6">
            {[
              { label: 'Cliente', value: project.client },
              { label: 'Categoría', value: categoryLabels[project.category] },
              { label: 'Año', value: String(project.year) },
              { label: 'Director', value: project.director },
            ].map((item) => (
              <div key={item.label}>
                <span
                  className="block uppercase"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    color: 'var(--classic-gray)',
                    marginBottom: '4px',
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: '16px',
                    color: 'var(--flash-white)',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Galería */}
        <div className="mt-16 grid grid-cols-1 gap-4 md:mt-24 md:grid-cols-2">
          {project.images.map((img, i) => (
            <div
              key={i}
              className="detail-gallery-item relative overflow-hidden"
              style={{
                visibility: 'hidden',
                aspectRatio: '16/9',
                borderRadius: '4px',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <img
                src={img}
                alt={`${project.title} — ${i + 1}`}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                  backgroundSize: '10px 10px',
                  opacity: 0.08,
                }}
              />
            </div>
          ))}
        </div>

        {/* Navegación entre proyectos */}
        <div
          className="detail-nav mt-16 flex items-center justify-between border-t pt-8 md:mt-24"
          style={{
            visibility: 'hidden',
            borderColor: 'var(--jet-black)',
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
              <span
                className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
              >
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
              <span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          ) : (
            <span />
          )}
        </div>

        {/* Sello Dinemática — branding disruptivo */}
        <div
          className="detail-stamp mx-auto mt-16 flex flex-col items-center gap-4 md:mt-24"
          style={{ visibility: 'hidden' }}
        >
          {/* Ícono rotado + border circular */}
          <div
            className="stamp-ring relative flex items-center justify-center"
            style={{
              width: '100px',
              height: '100px',
              border: '1px solid rgba(255,94,39,0.3)',
              borderRadius: '50%',
            }}
          >
            <Logo iconSize={40} color="var(--blaze-orange)" showText={false} />
          </div>

          {/* Texto del sello */}
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
              Crafted by
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

          {/* Líneas decorativas a los lados */}
          <div className="flex items-center gap-4">
            <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,94,39,0.2)' }} />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '9px',
                letterSpacing: '0.2em',
                color: 'var(--classic-gray)',
              }}
            >
              14.1066°N
            </span>
            <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,94,39,0.2)' }} />
          </div>
        </div>

        {/* Volver al portafolio */}
        <div className="mt-10 text-center md:mt-16">
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
