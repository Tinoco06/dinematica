export interface Project {
  id: string
  slug: string
  title: string
  category: 'documental' | 'spot' | 'cortometraje' | 'corporativo'
  year: number
  thumbnail: string
  video?: string
  /** Orientación del video (default: horizontal) */
  videoOrientation?: 'horizontal' | 'vertical'
  /** Color de acento del proyecto */
  color: string
  /** Persona que dirigió la pieza */
  director: string
}

export const projects: Project[] = [
  {
    id: '01',
    slug: 'testimonial',
    title: 'Testimonial',
    category: 'corporativo',
    year: 2026,
    thumbnail: '/projects/testimonial-thumb.jpg',
    video: '/videos/projects/testimonial.mp4',
    videoOrientation: 'vertical',
    color: '#FF5E27',
    director: 'Beto Rueda',
  },
  {
    id: '02',
    slug: 'evento-kia',
    title: 'Evento KIA',
    category: 'corporativo',
    year: 2026,
    thumbnail: '/projects/evento-kia-thumb.jpg',
    video: '/videos/projects/evento-kia.mp4',
    videoOrientation: 'vertical',
    color: '#D8FF45',
    director: 'Beto Rueda',
  },
  {
    id: '03',
    slug: 'milla-guirst',
    title: 'Milla Guirst',
    category: 'spot',
    year: 2026,
    thumbnail: '/projects/milla-guirst-thumb.jpg',
    video: '/videos/projects/milla-guirst.mp4',
    videoOrientation: 'vertical',
    color: '#FF5E27',
    director: 'Beto Rueda',
  },
]

export const categoryLabels: Record<Project['category'], string> = {
  documental: 'Documental',
  spot: 'Spot Publicitario',
  cortometraje: 'Cortometraje',
  corporativo: 'Corporativo',
}
