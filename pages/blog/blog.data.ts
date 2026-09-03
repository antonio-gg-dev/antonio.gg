import { createContentLoader } from 'vitepress'

export interface Post {
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

interface PostFrontmatter {
  command: string[]
  title: string
  description: string
  created_at: string
  author: string
  tags: string[]
  cover_url: string
  cover_alt: string
}

export default createContentLoader<Post[]>('./blog/*.md', {
  includeSrc: true,

  transform(posts) {
    return posts
      .filter((post) => post.url !== '/blog/')
      .map((post): Post => {
        const frontmatter = post.frontmatter as PostFrontmatter

        return {
          url: post.url,
          fileName: frontmatter.command[0].replace(/^blog open\s+/, ''),
          title: frontmatter.title,
          description: frontmatter.description,
          createdAt: new Date(frontmatter.created_at).toISOString(),
          author: frontmatter.author,
          wordCount: post.src?.split(/\s+/).length ?? 0,
          tags: frontmatter.tags,
          coverUrl: frontmatter.cover_url,
          coverAlt: frontmatter.cover_alt,
        }
      })
      .sort((postA, postB) => (postA.createdAt < postB.createdAt ? 1 : -1))
  },
})
