import { createContentLoader } from 'vitepress'
import { normalizeCommand, type CommandDefinition } from '../components/CommandPrompt/Command'

export default createContentLoader<CommandDefinition[]>('./**/*.md', {
  transform(pages) {
    const commands: CommandDefinition[] = []
    const registeredCommands = new Map<string, string>()

    pages.forEach((page) => {
      const pageCommands: unknown = page.frontmatter.command

      if (pageCommands === undefined) {
        return
      }

      if (!Array.isArray(pageCommands) || pageCommands.length === 0) {
        throw new Error(`The "command" frontmatter in ${page.url} must be a non-empty array.`)
      }

      pageCommands.forEach((pageCommand: unknown) => {
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
          command,
          url: page.url,
        })
      })
    })

    return commands.sort((commandA, commandB) => commandA.command.localeCompare(commandB.command))
  },
})
