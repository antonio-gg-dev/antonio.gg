import { type Post } from '@/pages/blog/blog.data'

export const reAprendiendoOop: Post = {
  url: '#re-aprendiendo-oop',
  fileName: 're-aprendiendo-oop.md',
  title: 'Re-aprendiendo OOP',
  description:
    'Esta charla nació de una conversación con un café de por medio. Hablando de nuestros años de estudio, recordé que a mí la Programación Orientada a Objetos me costó de aprender. No tardamos en darnos cuenta de que es algo que nos pasó a todos. De ahí surgió la idea de explicar la OOP de otra forma: con contexto histórico, entendiendo el porqué antes que el cómo.',
  createdAt: '2025-10-28',
  author: 'Varios',
  wordCount: 336,
  tags: [
    'diseño',
    'oop',
    'software',
  ],
  coverUrl: '/images/blog/2025-10-28-re-aprendiendo-oop.png',
  coverAlt: 'Imagen de portada de Re-aprendiendo OOP',
}

export const porQueUsarInlineSvgs: Post = {
  url: '#por-que-usar-inline-svgs',
  fileName: 'por-que-usar-inline-svgs.md',
  title: 'Por qué usar Inline SVGs',
  description:
    'Los iconos parecen un detalle menor, pero su formato influye mucho en el rendimiento y la flexibilidad de una interfaz. Usar SVGs en línea en lugar de etiquetas img abre la puerta a mejoras reales tanto en velocidad como en personalización.',
  createdAt: '2025-11-19',
  author: 'Antonio',
  wordCount: 520,
  tags: [
    'frontend',
    'software',
    'svg',
  ],
  coverUrl: '/images/blog/2025-11-19-por-que-usar-inline-svgs.png',
  coverAlt: 'Imagen de portada de Por qué usar Inline SVGs',
}
