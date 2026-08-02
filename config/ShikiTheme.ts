import type { ThemeRegistration } from 'shikiji'

export const shikiThemeName = 'antonio-gg'

export function createShikiTheme(): ThemeRegistration {
  return {
    name: shikiThemeName,
    type: 'dark',
    colors: {
      'editor.background': 'var(--color-neutral)',
      'editor.foreground': 'var(--color-foreground)',
    },
    tokenColors: [
      {
        scope: [
          'comment',
          'punctuation.definition.comment',
          'string.quoted.docstring.multi',
        ],
        settings: {
          foreground: 'var(--color-neutral-emphasis)',
        },
      },
      {
        scope: [
          'keyword',
          'storage',
          'punctuation.definition.template-expression',
          'punctuation.separator.key-value',
        ],
        settings: {
          foreground: 'var(--color-primary-emphasis)',
        },
      },
      {
        scope: [
          'keyword.control',
          'keyword.operator',
          'storage.modifier',
          'storage.type',
        ],
        settings: {
          foreground: 'var(--color-primary-emphasis)',
        },
      },
      {
        scope: [
          'string',
          'markup.fenced_code',
          'markup.inline.raw',
          'markup.inserted',
        ],
        settings: {
          foreground: 'var(--color-success-emphasis)',
        },
      },
      {
        scope: [
          'constant.character.escape',
          'string.regexp',
          'string.interpolated',
          'string.template',
        ],
        settings: {
          foreground: 'var(--color-success-emphasis)',
        },
      },
      {
        scope: [
          'constant',
          'support.constant',
          'variable.other.constant',
          'markup.changed',
        ],
        settings: {
          foreground: 'var(--color-warning-emphasis)',
        },
      },
      {
        scope: [
          'constant.numeric',
          'constant.language',
          'constant.character',
          'variable.language',
        ],
        settings: {
          foreground: 'var(--color-warning-emphasis)',
        },
      },
      {
        scope: [
          'entity.name.function',
          'meta.function-call',
          'support.function',
        ],
        settings: {
          foreground: 'var(--color-info-emphasis)',
        },
      },
      {
        scope: [
          'entity.name.class',
          'entity.name.type',
          'entity.name.namespace',
          'entity.other.inherited-class',
          'support.class',
          'support.type',
        ],
        settings: {
          foreground: 'var(--color-info-emphasis)',
        },
      },
      {
        scope: [
          'variable',
          'meta.definition.variable.name',
          'support.variable',
          'entity.name.variable',
          'entity.name.tag',
        ],
        settings: {
          foreground: 'var(--color-accent-emphasis)',
        },
      },
      {
        scope: [
          'variable.parameter',
          'meta.object-literal.key',
          'meta.property-name',
          'support.type.property-name',
          'entity.other.attribute-name',
          'markup.heading',
          'markup.bold',
          'markup.underline.link',
        ],
        settings: {
          foreground: 'var(--color-accent-emphasis)',
        },
      },
      {
        scope: [
          'invalid.deprecated',
          'markup.deleted',
        ],
        settings: {
          foreground: 'var(--color-danger-emphasis)',
        },
      },
      {
        scope: [
          'invalid',
          'invalid.illegal',
        ],
        settings: {
          foreground: 'var(--color-danger-emphasis)',
        },
      },
      {
        scope: [
          'punctuation',
          'meta.brace',
        ],
        settings: {
          foreground: 'var(--color-neutral-emphasis)',
        },
      },
      {
        scope: [
          'emphasis',
          'markup.italic',
        ],
        settings: {
          fontStyle: 'italic',
        },
      },
      {
        scope: [
          'strong',
          'markup.bold',
          'markup.heading',
        ],
        settings: {
          fontStyle: 'bold',
        },
      },
    ],
  }
}
