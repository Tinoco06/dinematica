/**
 * Reel rotativo del Hero — slides destacados que se muestran después del loader.
 *
 * Cada slide es un proyecto featured: video full-bleed + título + director.
 * Click en el área central → navega a /proyecto/{projectSlug}.
 *
 * ───────────────────────────────────────────────────────────────────
 * VIDEOS — instrucciones para el equipo
 * ───────────────────────────────────────────────────────────────────
 * Coloque archivos MP4 en `public/videos/` con los nombres referenciados abajo.
 * Recomendación técnica:
 *   - 1080p (1920×1080) H.264, sin audio
 *   - 6–10s en loop, 2–4 MB por clip
 *   - Exportar con `-movflags +faststart` para streaming progresivo
 *
 * Fuentes recomendadas (royalty-free, uso comercial):
 *   - Pexels Videos       https://www.pexels.com/videos/
 *   - Mixkit              https://mixkit.co/free-stock-video/
 *   - Coverr              https://coverr.co/
 *
 * Si un video falta, el `poster` (imagen) se muestra como fallback automático.
 * ───────────────────────────────────────────────────────────────────
 */
export interface HeroSlide {
  id: string
  title: string
  subtitle: string
  director: string
  video: string
  poster: string
  projectSlug: string
}

export const heroReel: HeroSlide[] = [
  {
    id: 'eternidad',
    title: 'Eternidad',
    subtitle: 'Documental de Boda',
    director: 'Beto Rueda',
    // Sugerencia Pexels: "wedding ceremony cinematic" / "couple sunset"
    video: '/videos/hero-eternidad.mp4',
    poster: '/projects/boda-1.jpg',
    projectSlug: 'eternidad',
  },
  {
    id: 'vinculo',
    title: 'Vínculo',
    subtitle: 'Spot Publicitario',
    director: 'Beto Rueda',
    // Sugerencia Pexels: "couple intimate bokeh" / "anamorphic portrait"
    video: '/videos/hero-vinculo.mp4',
    poster: '/projects/boda-2.jpg',
    projectSlug: 'vinculo',
  },
  {
    id: 'renacer',
    title: 'Renacer',
    subtitle: 'Documental — Marca Honduras',
    director: 'Beto Rueda',
    // Sugerencia Pexels: "honduras landscape" / "cinematic portrait people"
    video: '/videos/hero-renacer.mp4',
    poster: '/projects/cumple-1.jpg',
    projectSlug: 'renacer',
  },
  {
    id: 'celebracion',
    title: 'Celebración',
    subtitle: 'Corporativo — Eventos',
    director: 'Beto Rueda',
    // Sugerencia Pexels: "elegant event lights" / "corporate celebration"
    video: '/videos/hero-celebracion.mp4',
    poster: '/projects/cumple-2.jpg',
    projectSlug: 'celebracion',
  },
  {
    id: 'instante',
    title: 'Instante',
    subtitle: 'Cortometraje',
    director: 'Beto Rueda',
    // Sugerencia Pexels: "experimental cinematic slow motion" / "abstract light"
    video: '/videos/hero-instante.mp4',
    poster: '/projects/boda-1.jpg',
    projectSlug: 'instante',
  },
]
