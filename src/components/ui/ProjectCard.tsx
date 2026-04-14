import { Link } from 'react-router-dom'
import type { Project } from '@/data/projects'
import { categoryLabels } from '@/data/projects'

interface ProjectCardProps {
  project: Project
  aspect?: '16/9' | '4/3'
}

export function ProjectCard({ project, aspect = '16/9' }: ProjectCardProps) {
  return (
    <Link
      to={`/proyecto/${project.slug}`}
      className="project-card group relative block cursor-pointer overflow-hidden"
      data-cursor="project"
      data-aspect={aspect}
      style={{
        aspectRatio: '16/9',
        borderRadius: '4px',
        border: '1px solid rgba(255,255,255,0.05)',
        textDecoration: 'none',
      }}
    >
      {/* Imagen con scale en hover */}
      <img
        src={project.thumbnail}
        alt={project.title}
        className="project-img absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        style={{
          transition: 'transform 0.8s ease',
        }}
      />

      {/* Dot pattern overlay — sutil, se intensifica en hover */}
      <div
        className="dot-overlay absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '10px 10px',
          opacity: 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Gradiente base — siempre visible, cubre 40% inferior */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(24,24,24,0.7) 0%, rgba(24,24,24,0) 40%)',
        }}
      />

      {/* Gradiente hover — se intensifica */}
      <div
        className="hover-gradient absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(24,24,24,0.9) 0%, rgba(24,24,24,0.2) 60%)',
          opacity: 0,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Contenido — siempre visible abajo-izquierda */}
      <div
        className="card-content absolute inset-x-0 bottom-0 flex flex-col p-5 md:p-6"
      >
        {/* Título del proyecto */}
        <h3
          className="card-title font-bold"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(18px, 2.5vw, 24px)',
            color: 'var(--flash-white)',
            lineHeight: 1.1,
            transition: 'transform 0.5s ease',
          }}
        >
          {project.title}
        </h3>

        {/* Meta: categoría + año */}
        <div className="mt-2 flex items-center gap-3">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              letterSpacing: '0.1em',
              color: 'var(--blaze-orange)',
              textTransform: 'uppercase',
            }}
          >
            {categoryLabels[project.category]}
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '12px',
              letterSpacing: '0.1em',
              color: 'var(--classic-gray)',
            }}
          >
            {project.year}
          </span>
        </div>

        {/* CTA hover — "VER PROYECTO →" */}
        <span
          className="card-cta"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: 'var(--flash-white)',
            textTransform: 'uppercase',
            marginTop: '12px',
            opacity: 0,
            transform: 'translateY(8px)',
            transition: 'opacity 0.4s ease 0.1s, transform 0.4s ease 0.1s',
          }}
        >
          Ver proyecto →
        </span>
      </div>

      {/* Número del proyecto — esquina superior derecha, hover only */}
      <div
        className="card-number absolute top-4 right-4 md:top-5 md:right-5"
        style={{
          opacity: 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '12px',
            color: 'var(--classic-gray)',
            letterSpacing: '0.1em',
          }}
        >
          /{project.id}
        </span>
      </div>

      <style>{`
        .project-card:hover .project-img { transform: scale(1.05); }
        .project-card:hover .dot-overlay { opacity: 0.15 !important; }
        .project-card:hover .hover-gradient { opacity: 1 !important; }
        .project-card:hover .card-title { transform: translateY(-10px); }
        .project-card:hover .card-cta { opacity: 1 !important; transform: translateY(0) !important; }
        .project-card:hover .card-number { opacity: 1 !important; }
      `}</style>
    </Link>
  )
}
