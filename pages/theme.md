---
command: [theme]
command_public: true
command_description: Permite elegir el tema visual de la web y desactivar los efectos visuales.
---

# Tema

Elige la paleta de colores y los efectos visuales que quieres utilizar.

<ThemeSelect />

<ThemeColors />

<AppearanceEffects />

<script lang="ts" setup>
import AppearanceEffects from '@/components/AppearanceEffects/AppearanceEffects.vue'
import ThemeColors from '@/components/ThemeColors/ThemeColors.vue'
import ThemeSelect from '@/components/ThemeSelect/ThemeSelect.vue'
</script>
