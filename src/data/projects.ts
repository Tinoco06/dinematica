export interface Project {
  id: string
  slug: string
  title: string
  client: string
  category: 'documental' | 'spot' | 'cortometraje' | 'corporativo'
  year: number
  thumbnail: string
  video?: string
  description: string
  longDescription: string[]
  images: string[]
  director: string
  color: string
}

export const projects: Project[] = [
  {
    id: '01',
    slug: 'eternidad',
    title: 'Eternidad',
    client: 'Familia Rodríguez',
    category: 'documental',
    year: 2025,
    thumbnail: '/projects/boda-1.jpg',
    description:
      'Sesión cinematográfica que captura la esencia de un amor eterno en un entorno natural.',
    longDescription: [
      'Este proyecto nació de la búsqueda de capturar algo que trasciende el momento: la eternidad de un vínculo. Trabajamos con luz natural al atardecer, aprovechando las sombras largas y los tonos cálidos del paisaje hondureño.',
      'La dirección visual se centró en composiciones abiertas que dejaran respirar a los protagonistas dentro del cuadro, creando una sensación de intimidad sin invadir el momento.',
      'El resultado es una pieza que funciona tanto como registro documental como obra visual independiente, donde cada frame cuenta una historia por sí mismo.',
    ],
    images: ['/projects/boda-1.jpg', '/projects/boda-2.jpg'],
    director: 'Beto Rueda',
    color: '#FF5E27',
  },
  {
    id: '02',
    slug: 'vinculo',
    title: 'Vínculo',
    client: 'Pareja Martínez',
    category: 'spot',
    year: 2025,
    thumbnail: '/projects/boda-2.jpg',
    description:
      'La conexión entre dos personas contada a través de luz, movimiento y emoción.',
    longDescription: [
      'Vínculo explora la química invisible entre dos personas a través del lenguaje cinematográfico. Cada movimiento de cámara fue coreografiado para reflejar la danza natural de la conexión humana.',
      'Utilizamos lentes anamórficos para crear un aspecto cinematográfico con bokeh ovalado, dando a cada toma una calidad etérea que eleva lo cotidiano a lo extraordinario.',
    ],
    images: ['/projects/boda-2.jpg', '/projects/boda-1.jpg'],
    director: 'Beto Rueda',
    color: '#D8FF45',
  },
  {
    id: '03',
    slug: 'alegria',
    title: 'Alegría',
    client: 'Familia López',
    category: 'cortometraje',
    year: 2024,
    thumbnail: '/projects/cumple-1.jpg',
    description:
      'Un retrato vibrante de la inocencia y la felicidad en su estado más puro.',
    longDescription: [
      'Alegría es un cortometraje documental que captura la espontaneidad de la infancia. Sin guión ni dirección forzada, dejamos que la cámara se convirtiera en un observador silencioso de momentos genuinos.',
      'La paleta de color vibrante y la fotografía a nivel del suelo nos permitieron ver el mundo desde la perspectiva de una niña, transformando lo ordinario en algo mágico.',
    ],
    images: ['/projects/cumple-1.jpg', '/projects/cumple-2.jpg'],
    director: 'Beto Rueda',
    color: '#FF5E27',
  },
  {
    id: '04',
    slug: 'celebracion',
    title: 'Celebración',
    client: 'Eventos Especiales',
    category: 'corporativo',
    year: 2024,
    thumbnail: '/projects/cumple-2.jpg',
    description:
      'Producción audiovisual que transforma momentos efímeros en recuerdos permanentes.',
    longDescription: [
      'Este proyecto corporativo demandaba un enfoque que trascendiera el registro típico de eventos. Aplicamos técnicas de cine documental a la cobertura de eventos, creando narrativas visuales que conectan emocionalmente.',
      'La iluminación dramática y la edición rítmica transforman un evento en una experiencia cinematográfica, donde cada detalle contribuye a la historia.',
    ],
    images: ['/projects/cumple-2.jpg', '/projects/cumple-1.jpg'],
    director: 'Beto Rueda',
    color: '#D8FF45',
  },
  {
    id: '05',
    slug: 'promesa',
    title: 'Promesa',
    client: 'Bodas Dinemática',
    category: 'documental',
    year: 2024,
    thumbnail: '/projects/boda-2.jpg',
    description:
      'Documental íntimo sobre el compromiso y la promesa de un futuro juntos.',
    longDescription: [
      'Promesa es un documental íntimo que sigue el viaje emocional de una pareja en el día más importante de sus vidas. Nuestro enfoque fue invisible: estar presentes sin interferir.',
      'Capturamos no solo los grandes momentos, sino los pequeños gestos que revelan la verdadera naturaleza de un compromiso: una mirada, un apretón de manos, una sonrisa nerviosa.',
    ],
    images: ['/projects/boda-2.jpg', '/projects/boda-1.jpg'],
    director: 'Beto Rueda',
    color: '#FF5E27',
  },
  {
    id: '06',
    slug: 'despertar',
    title: 'Despertar',
    client: 'Familia Rueda',
    category: 'spot',
    year: 2023,
    thumbnail: '/projects/cumple-1.jpg',
    description:
      'La magia de crecer capturada en cada cuadro con estética cinematográfica.',
    longDescription: [
      'Despertar documenta ese momento efímero donde la infancia comienza a transformarse. Utilizamos un enfoque poético, donde cada escena funciona como una metáfora visual del crecimiento.',
      'La dirección de fotografía privilegió la luz natural del amanecer, creando una paleta que evoluciona del azul frío al dorado cálido a lo largo de la pieza.',
    ],
    images: ['/projects/cumple-1.jpg', '/projects/cumple-2.jpg'],
    director: 'Beto Rueda',
    color: '#D8FF45',
  },
  {
    id: '07',
    slug: 'renacer',
    title: 'Renacer',
    client: 'Marca Honduras',
    category: 'documental',
    year: 2023,
    thumbnail: '/projects/boda-1.jpg',
    description:
      'Historias de resiliencia y transformación contadas con luz natural.',
    longDescription: [
      'Renacer es una serie documental para Marca Honduras que explora historias de transformación personal en diferentes regiones del país. Cada episodio sigue a un protagonista cuya vida representa la resiliencia hondureña.',
      'El estilo visual combina la crudeza del documental de observación con la belleza formal del cine de autor, creando un puente entre lo real y lo cinematográfico.',
    ],
    images: ['/projects/boda-1.jpg', '/projects/boda-2.jpg'],
    director: 'Beto Rueda',
    color: '#FF5E27',
  },
  {
    id: '08',
    slug: 'instante',
    title: 'Instante',
    client: 'Casa Creativa',
    category: 'cortometraje',
    year: 2023,
    thumbnail: '/projects/cumple-2.jpg',
    description:
      'Cortometraje sobre la belleza de los momentos que definen una vida.',
    longDescription: [
      'Instante es un cortometraje experimental que deconstruye la idea del tiempo a través de la imagen en movimiento. Cada escena fue filmada en una sola toma continua, sin cortes.',
      'El resultado es una meditación visual sobre lo efímero, donde la cámara se convierte en testigo de momentos que existen por un instante y luego desaparecen para siempre.',
    ],
    images: ['/projects/cumple-2.jpg', '/projects/cumple-1.jpg'],
    director: 'Beto Rueda',
    color: '#767676',
  },
]

export const categoryLabels: Record<Project['category'], string> = {
  documental: 'Documental',
  spot: 'Spot Publicitario',
  cortometraje: 'Cortometraje',
  corporativo: 'Corporativo',
}
