import { createContentLoader } from 'vitepress'

export interface Post {
  url: string
  title: string
  description: string
  createdAt: string
  coverUrl: string
  coverAlt: string
}

export default createContentLoader<Post[]>('./blog/*.md', {
  transform(posts) {
    return posts
      .filter((post) => post.url !== '/blog/')
      .map(
        (post): Post => ({
          url: post.url,
          title: post.frontmatter.title,
          description: post.frontmatter.description,
          createdAt: post.frontmatter.created_at,
          coverUrl: post.frontmatter.cover_url,
          coverAlt: post.frontmatter.cover_alt,
        }),
      )
      .sort((postA, postB) => (postA.createdAt < postB.createdAt ? 1 : -1))
  },
})
