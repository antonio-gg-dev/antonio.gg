import { defineConfig } from 'vitepress'
import path from 'path'
import { createShikiTheme } from '../config/ShikiTheme'

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
      'link',
      { rel: 'icon', href: '/favicon.ico' },
    ],
    [
      'meta',
      { property: 'og:type', content: 'website' },
    ],
    [
      'meta',
      { property: 'og:image', content: '/images/og-image.png' },
    ],
  ],
  transformHead(context) {
    const canonical = context.page.replace(/(index)?\.md$/, '')

    return [
      [
        'meta',
        { property: 'og:title', content: context.title },
      ],
      [
        'meta',
        { property: 'og:url', content: `https://antonio.gg/${canonical}` },
      ],
      [
        'link',
        { rel: 'canonical', href: `https://antonio.gg/${canonical}` },
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
          renderFence(...args).replace(
            /<button title="([^"]*)" class="copy"><\/button>/,
            '<button title="$1" aria-label="$1" class="copy"><ClipboardCopyIcon class="code-copy-icon" aria-hidden="true" /></button>',
          )
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
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '..'),
      },
    },
  },
})
