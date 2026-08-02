import { reactive } from 'vue'
import { Theme, ThemeId } from './Theme'

interface ThemeState {
  activeTheme: Theme
}

class ThemeService {
  private static readonly storageKey = 'antonio.gg.theme'

  readonly state = reactive<ThemeState>({
    activeTheme: Theme.mambo(),
  })

  private started = false

  private readonly storageListener = (event: StorageEvent): void => {
    if (event.key === ThemeService.storageKey) {
      this.apply(this.createTheme(event.newValue))
    } else if (event.key === null) {
      this.apply(Theme.mambo())
    }
  }

  start(): void {
    if (this.started) {
      return
    }

    this.started = true
    this.apply(this.readStoredTheme())
    window.addEventListener('storage', this.storageListener)
  }

  stop(): void {
    if (!this.started) {
      return
    }

    window.removeEventListener('storage', this.storageListener)
    this.started = false
  }

  activate(theme: Theme): void {
    this.apply(theme)

    try {
      window.localStorage.setItem(ThemeService.storageKey, theme.id)
    } catch {
      // The active theme still works in memory when storage is unavailable.
    }
  }

  private apply(theme: Theme): void {
    this.state.activeTheme = theme
    document.documentElement.dataset.theme = theme.id
  }

  private readStoredTheme(): Theme {
    try {
      return this.createTheme(window.localStorage.getItem(ThemeService.storageKey))
    } catch {
      return Theme.mambo()
    }
  }

  private createTheme(id: string | null): Theme {
    switch (id) {
      case ThemeId.P1Phosphor:
        return Theme.p1Phosphor()
      case ThemeId.Mambo:
      default:
        return Theme.mambo()
    }
  }
}

export const themeService = new ThemeService()
