import { type Project } from '@/pages/projects/projects.data'

export const bashunit: Project = {
  url: '#bashunit',
  fileName: 'bashunit.src',
  title: 'bashunit',
  description:
    'Framework de testing para scripts de Bash sencillo y eficiente, se centra en el developer experience con una sintaxis clara y un enfoque minimalista.',
  createdAt: '2023-09-04',
  author: 'TypedDevs',
  wordCount: 528,
  tags: [
    'bash',
    'software',
    'testing',
  ],
  coverUrl: '/images/projects/bashunit.png',
  coverAlt: 'Imagen de portada de bashunit',
}

export const huezzle: Project = {
  url: '#huezzle',
  fileName: 'huezzle.src',
  title: 'Huezzle',
  description:
    'Juego de puzzles diarios, reordena cromáticamente una cuadrícula de colores, cada día todo el mundo se enfrentará a un mismo reto que se generará proceduralmente.',
  createdAt: '2023-07-01',
  author: 'Antonio',
  wordCount: 369,
  tags: [
    'frontend',
    'juego',
    'puzzle',
    'software',
    'vue',
  ],
  coverUrl: '/images/projects/huezzle.png',
  coverAlt: 'Imagen de portada de Huezzle',
}

export const carDoorTrashBin: Project = {
  url: '#car-door-trash-bin',
  fileName: 'car-door-trash-bin.3d',
  title: 'Papelera para puerta del coche',
  description:
    'Todo empezó con una molestia cotidiana, los pequeños residuos que se acumulan en el coche. Envoltorios, tickets, papeles...',
  createdAt: '2022-02-15',
  author: 'Antonio',
  wordCount: 921,
  tags: [
    '3d-print',
    'accesorio',
    'coche',
  ],
  coverUrl: '/images/projects/car-door-trash-bin.jpg',
  coverAlt: 'Imagen de portada de la papelera para puerta del coche',
}
