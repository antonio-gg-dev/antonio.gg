import { createContentLoader } from 'vitepress'
import { clearCommandDefinition, normalizeCommand, type CommandDefinition } from '../components/CommandPrompt/Command'

export default createContentLoader<CommandDefinition[]>('./**/*.md', {
  transform(pages) {
    const commands: CommandDefinition[] = [clearCommandDefinition]
    const registeredCommands = new Map<string, string>([
      [
        normalizeCommand(clearCommandDefinition.command),
        'the built-in clear command',
      ],
    ])

    pages.forEach((page) => {
      const pageCommands: unknown = page.frontmatter.command
      const pageCommandDescription: unknown = page.frontmatter.command_description
      const pageCommandPublic: unknown = page.frontmatter.command_public

      if (pageCommands === undefined) {
        return
      }

      if (!Array.isArray(pageCommands) || pageCommands.length === 0) {
        throw new Error(`The "command" frontmatter in ${page.url} must be a non-empty array.`)
      }

      if (pageCommandPublic !== undefined && typeof pageCommandPublic !== 'boolean') {
        throw new Error(`The "command_public" frontmatter in ${page.url} must be a boolean.`)
      }

      if (
        pageCommandDescription !== undefined &&
        (typeof pageCommandDescription !== 'string' || pageCommandDescription.trim() === '')
      ) {
        throw new Error(`The "command_description" frontmatter in ${page.url} must be a non-empty string.`)
      }

      if (pageCommandPublic === true && pageCommandDescription === undefined) {
        throw new Error(`Public commands in ${page.url} must define "command_description" frontmatter.`)
      }

      pageCommands.forEach((pageCommand: unknown, index: number) => {
        if (typeof pageCommand !== 'string' || pageCommand.trim() === '') {
          throw new Error(`Every command in ${page.url} must be a non-empty string.`)
        }

        const command = pageCommand.trim()
        const normalizedCommand = normalizeCommand(command)
        const registeredUrl = registeredCommands.get(normalizedCommand)

        if (registeredUrl !== undefined) {
          throw new Error(`The command "${command}" is registered by both ${registeredUrl} and ${page.url}.`)
        }

        registeredCommands.set(normalizedCommand, page.url)
        commands.push({
          type: 'navigation',
          command,
          url: page.url,
          description: typeof pageCommandDescription === 'string' ? pageCommandDescription.trim() : null,
          isPrimary: index === 0,
          isPublic: pageCommandPublic === true,
        })
      })
    })

    return commands.sort((commandA, commandB) => commandA.command.localeCompare(commandB.command))
  },
})
