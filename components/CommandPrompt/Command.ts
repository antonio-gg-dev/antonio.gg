interface CommandMetadata {
  command: string
  description: string | null
  isPrimary: boolean
  isPublic: boolean
}

export interface NavigationCommandDefinition extends CommandMetadata {
  type: 'navigation'
  url: string
}

export interface ClearCommandDefinition extends CommandMetadata {
  type: 'clear'
}

export type CommandDefinition = NavigationCommandDefinition | ClearCommandDefinition

export const clearCommandDefinition: ClearCommandDefinition = {
  type: 'clear',
  command: 'clear',
  description: 'Limpia la salida del terminal.',
  isPrimary: true,
  isPublic: true,
}

export const commandNotFoundMessage = '404 Command Not Found'

export function formatShellPath(path: string): string {
  const pathname = new URL(path, 'http://antonio.gg').pathname.replace(/\/+$/, '')

  return pathname === '' ? '~' : `~${decodePathname(pathname)}`
}

export function normalizeCommand(command: string): string {
  return command.replace(/\s+/g, ' ').trim().toLowerCase()
}

function decodePathname(pathname: string): string {
  try {
    return decodeURIComponent(pathname)
  } catch {
    return pathname
  }
}
