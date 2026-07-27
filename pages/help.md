---
command: [help, menu]
command_public: true
command_description: Lista esta tabla con los comandos disponibles.
---

# Ayuda

¡Hola! Mi portfolio está inspirado en una terminal de comandos. Para navegar, escribe cualquiera de los comandos de la
lista y pulsa `Enter`.

También puedes utilizar los botones y enlaces que encuentres en cada página, pero el comando `help` es lo más parecido a
un menú principal: muestra todas las secciones disponibles y el comando necesario para acceder a cada una de ellas.

<table>
  <thead>
    <tr>
      <th>Comando</th>
      <th>Descripción</th>
    </tr>
  </thead>
  <tbody>
    <tr
      v-for="command in publicCommands"
      :key="command.command"
    >
      <td>
        <a
          :href="command.type === 'navigation' ? command.url : '#'"
          @click="handleCommandClick($event, command)"
        >
          {{ command.command }}
        </a>
      </td>
      <td>{{ command.description }}</td>
    </tr>
  </tbody>
</table>

<script lang="ts" setup>
import type { CommandDefinition } from '@/components/CommandPrompt/Command'
import { data as commands } from './commands.data'

const publicCommands = commands.filter((command) => command.isPublic && command.isPrimary)

function handleCommandClick(event: MouseEvent, command: CommandDefinition): void {
  if (command.type === 'navigation') {
    return
  }

  event.preventDefault()
  event.stopPropagation()

  if (event.currentTarget instanceof HTMLElement) {
    event.currentTarget.dispatchEvent(
      new CustomEvent('route-history-command', {
        bubbles: true,
        detail: command.command,
      }),
    )
  }
}
</script>
