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

export default createContentLoader<Project[]>('./projects/*.md', {
  includeSrc: true,

  transform(projects) {
    return projects
      .filter((project) => project.url !== '/projects/')
      .map(
        (project): Project => ({
          url: project.url,
          fileName: project.frontmatter.command[0].replace(/^projects open\s+/, ''),
          title: project.frontmatter.title,
          description: project.frontmatter.description,
          createdAt: new Date(String(project.frontmatter.created_at)).toISOString(),
          author: project.frontmatter.author,
          wordCount: project.src?.split(/\s+/).length ?? 0,
          tags: project.frontmatter.tags,
          coverUrl: project.frontmatter.cover_url,
          coverAlt: project.frontmatter.cover_alt,
        }),
      )
      .sort((projectA, projectB) => (projectA.createdAt < projectB.createdAt ? 1 : -1))
  },
})
