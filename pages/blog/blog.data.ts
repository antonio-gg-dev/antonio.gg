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

export default createContentLoader<Post[]>('./blog/*.md', {
  includeSrc: true,

  transform(posts) {
    return posts
      .filter((post) => post.url !== '/blog/')
      .map((post): Post => ({
        url: post.url,
        fileName: post.frontmatter.command[0].replace(/^blog open\s+/, ''),
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        createdAt: new Date(String(post.frontmatter.created_at)).toISOString(),
        author: post.frontmatter.author,
        wordCount: post.src?.split(/\s+/).length ?? 0,
        tags: post.frontmatter.tags,
        coverUrl: post.frontmatter.cover_url,
        coverAlt: post.frontmatter.cover_alt,
      }))
      .sort((postA, postB) => (postA.createdAt < postB.createdAt ? 1 : -1))
  },
})
