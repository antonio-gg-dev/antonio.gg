---
command: [help]
command_public: true
command_description: Lista esta tabla con los comandos disponibles.
---

# Ayuda

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
        <a :href="command.url">{{ command.command }}</a>
      </td>
      <td>{{ command.description }}</td>
    </tr>
  </tbody>
</table>

<script lang="ts" setup>
import { data as commands } from './commands.data'

const publicCommands = commands.filter((command) => command.isPublic && command.isPrimary)
</script>
