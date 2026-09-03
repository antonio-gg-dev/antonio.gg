import { createContentLoader } from 'vitepress'

export interface Project {
  url: string
  fileName: string
  title: string
  description: string
  createdAt: string
  author: string
  wordCount: number
  tags: string[]
  coverUrl: string
  coverAlt: string
}

interface ProjectFrontmatter {
  command: string[]
  title: string
  description: string
  created_at: string
  author: string
  tags: string[]
  cover_url: string
  cover_alt: string
}

export default createContentLoader<Project[]>('./projects/*.md', {
  includeSrc: true,

  transform(projects) {
    return projects
      .filter((project) => project.url !== '/projects/')
      .map((project): Project => {
        const frontmatter = project.frontmatter as ProjectFrontmatter

        return {
          url: project.url,
          fileName: frontmatter.command[0].replace(/^projects open\s+/, ''),
          title: frontmatter.title,
          description: frontmatter.description,
          createdAt: new Date(frontmatter.created_at).toISOString(),
          author: frontmatter.author,
          wordCount: project.src?.split(/\s+/).length ?? 0,
          tags: frontmatter.tags,
          coverUrl: frontmatter.cover_url,
          coverAlt: frontmatter.cover_alt,
        }
      })
      .sort((projectA, projectB) => (projectA.createdAt < projectB.createdAt ? 1 : -1))
  },
})
