import { defineConfig, type HeadConfig } from 'vitepress'
import path from 'path'
import { fileURLToPath } from 'url'
import { createShikiTheme } from '../config/ShikiTheme'

const siteUrl = 'https://antonio.gg'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // Site Metadata
  title: 'Antonio Gonzalez Gea',
  description:
    'Portfolio de Antonio González Gea, desarrollador full stack y entusiasta de la impresión 3D.' +
    ' Explora mi carrera y proyectos.',
  lang: 'es',
  head: [
    [
      'meta',
      { name: 'viewport', content: 'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no' },
    ],
    [
      'link',
      { rel: 'icon', href: '/favicon.ico' },
    ],
    [
      'meta',
      { property: 'og:type', content: 'website' },
    ],
  ],
  transformHead(context): HeadConfig[] {
    const canonicalUrl = new URL(context.page.replace(/(index)?\.md$/, ''), `${siteUrl}/`)
    const frontmatter = context.pageData.frontmatter
    const description = context.description
    const socialImage = getAbsoluteUrl(frontmatter.cover_url)
    const socialImageAlt = getFrontmatterString(frontmatter.cover_alt)
    const socialImageAltHead: HeadConfig[] =
      socialImageAlt === ''
        ? []
        : [
            [
              'meta',
              { property: 'og:image:alt', content: socialImageAlt },
            ],
            [
              'meta',
              { name: 'twitter:image:alt', content: socialImageAlt },
            ],
          ]

    return [
      [
        'meta',
        { property: 'og:title', content: context.title },
      ],
      [
        'meta',
        { property: 'og:description', content: description },
      ],
      [
        'meta',
        { property: 'og:url', content: canonicalUrl.href },
      ],
      [
        'meta',
        { property: 'og:image', content: socialImage },
      ],
      [
        'meta',
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      [
        'meta',
        { name: 'twitter:title', content: context.title },
      ],
      [
        'meta',
        { name: 'twitter:description', content: description },
      ],
      [
        'meta',
        { name: 'twitter:image', content: socialImage },
      ],
      ...socialImageAltHead,
      [
        'link',
        { rel: 'canonical', href: canonicalUrl.href },
      ],
    ]
  },

  // Routing
  cleanUrls: true,

  // Build
  srcDir: 'pages',
  sitemap: {
    hostname: 'https://antonio.gg',
  },

  // Markdown
  markdown: {
    // TODO: enable lineNumbers: true,

    theme: createShikiTheme(),

    config(md) {
      const renderFence = md.renderer.rules.fence

      if (renderFence !== undefined) {
        md.renderer.rules.fence = (...args) =>
          `<ScrollableContent>${renderFence(...args).replace(
            /<button title="([^"]*)" class="copy"><\/button>/,
            '<button title="$1" aria-label="$1" class="copy"><ClipboardCopyIcon class="code-copy-icon" aria-hidden="true" /></button>',
          )}</ScrollableContent>`
      }

      const renderTableOpen = md.renderer.rules.table_open
      const renderTableClose = md.renderer.rules.table_close

      md.renderer.rules.table_open = (...args) => {
        const [
          tokens,
          index,
          options,
          ,
          renderer,
        ] = args
        const tableOpen = renderTableOpen?.(...args) ?? renderer.renderToken(tokens, index, options)

        return `<ScrollableContent>${tableOpen}`
      }
      md.renderer.rules.table_close = (...args) => {
        const [
          tokens,
          index,
          options,
          ,
          renderer,
        ] = args
        const tableClose = renderTableClose?.(...args) ?? renderer.renderToken(tokens, index, options)

        return `${tableClose}</ScrollableContent>`
      }

      const renderLinkClose = md.renderer.rules.link_close

      md.renderer.rules.link_close = (...args) => {
        const [
          tokens,
          index,
          options,
          ,
          renderer,
        ] = args
        const linkOpen = tokens
          .slice(0, index)
          .reverse()
          .find((token) => token.type === 'link_open')
        const closingTag = renderLinkClose?.(...args) ?? renderer.renderToken(tokens, index, options)

        if (linkOpen?.attrGet('target') !== '_blank') {
          return closingTag
        }

        return `<ExternalLinkIcon class="external-link-icon" aria-hidden="true" />${closingTag}`
      }
    },

    container: {
      tipLabel: 'Consejo',
      warningLabel: 'Advertencia',
      dangerLabel: 'Peligro',
      infoLabel: 'Información',
      detailsLabel: 'Detalles',
    },
  },

  // Vite
  vite: {
    publicDir: '../public',
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
      },
    },
  },
})

function getAbsoluteUrl(value: unknown): string {
  if (typeof value !== 'string' || value.trim() === '') {
    return new URL('/images/og-image.png', `${siteUrl}/`).href
  }

  return new URL(value, `${siteUrl}/`).href
}

function getFrontmatterString(value: unknown): string {
  return typeof value === 'string' ? value : ''
}
