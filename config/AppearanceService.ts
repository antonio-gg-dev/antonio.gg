import { shallowRef } from 'vue'
import { Appearance, AppearanceEffect } from './Appearance'
import { Theme, type ThemeId } from './Theme'
import { Viewport } from './Viewport'

interface StoredAppearance {
  theme: ThemeId
  aberration: boolean
  flicker: boolean
  curvature: boolean
  scanlines: boolean
  sweep: boolean
}

class AppearanceService {
  private static readonly storageKey = 'antonio.gg.theme'
  private static readonly reducedMotionQuery = '(prefers-reduced-motion: reduce)'
  private static readonly curvatureQuery = `(min-width: ${Viewport.lg.pixelWidth})`

  private readonly appearanceState = shallowRef<Appearance>(new Appearance(Theme.mambo(), true, true, true, true, true))

  private started = false

  get appearance(): Appearance {
    return this.appearanceState.value
  }

  private readonly storageListener = (event: StorageEvent): void => {
    if (event.key === AppearanceService.storageKey) {
      this.load(event.newValue)
    } else if (event.key === null) {
      this.load(null)
    }
  }

  start(): void {
    if (this.started) {
      return
    }

    this.started = true
    this.load(this.readStoredAppearance())
    window.addEventListener('storage', this.storageListener)
  }

  stop(): void {
    if (!this.started) {
      return
    }

    window.removeEventListener('storage', this.storageListener)
    this.started = false
  }

  activateTheme(theme: Theme): void {
    this.replace({ theme })
    this.persist()
  }

  activateEffect(effect: AppearanceEffect, active: boolean): void {
    this.replace({ [effect]: active })
    this.persist()
  }

  private apply(appearance: Appearance): void {
    this.appearanceState.value = appearance
    document.documentElement.dataset.theme = appearance.theme.id
    document.documentElement.dataset.effectAberration = appearance.aberration.toString()
    document.documentElement.dataset.effectFlicker = (appearance.aberration && appearance.flicker).toString()
    document.documentElement.dataset.effectCurvature = appearance.curvature.toString()
    document.documentElement.dataset.effectScanlines = appearance.scanlines.toString()
    document.documentElement.dataset.effectSweep = (appearance.scanlines && appearance.sweep).toString()
  }

  private replace(changes: Partial<Appearance>): void {
    const current = this.appearance

    this.apply(
      new Appearance(
        changes.theme ?? current.theme,
        changes.aberration ?? current.aberration,
        changes.flicker ?? current.flicker,
        changes.curvature ?? current.curvature,
        changes.scanlines ?? current.scanlines,
        changes.sweep ?? current.sweep,
      ),
    )
  }

  private load(value: string | null): void {
    this.apply(this.parse(value))
  }

  private parse(value: string | null): Appearance {
    const fallback = this.createFallbackAppearance()

    if (value === null) {
      return fallback
    }

    const legacyTheme = this.createTheme(value)

    if (legacyTheme !== null) {
      return new Appearance(
        legacyTheme,
        fallback.aberration,
        fallback.flicker,
        fallback.curvature,
        fallback.scanlines,
        fallback.sweep,
      )
    }

    try {
      const stored: unknown = JSON.parse(value)

      if (!this.isRecord(stored)) {
        return fallback
      }

      const readEffect = (effect: AppearanceEffect, defaultValue: boolean): boolean => {
        const storedEffect = stored[effect]

        if (typeof storedEffect === 'boolean') {
          return storedEffect
        }

        return defaultValue
      }

      return new Appearance(
        typeof stored.theme === 'string' ? this.createTheme(stored.theme) ?? fallback.theme : fallback.theme,
        readEffect(AppearanceEffect.Aberration, fallback.aberration),
        readEffect(AppearanceEffect.Flicker, fallback.flicker),
        readEffect(AppearanceEffect.Curvature, fallback.curvature),
        readEffect(AppearanceEffect.Scanlines, fallback.scanlines),
        readEffect(AppearanceEffect.Sweep, fallback.sweep),
      )
    } catch {
      return fallback
    }
  }

  private createFallbackAppearance(): Appearance {
    const animationsActive = !window.matchMedia(AppearanceService.reducedMotionQuery).matches
    const curvatureActive = window.matchMedia(AppearanceService.curvatureQuery).matches

    return new Appearance(Theme.mambo(), true, animationsActive, curvatureActive, true, animationsActive)
  }

  private createTheme(id: string): Theme | null {
    return Theme.all()[id as ThemeId] ?? null
  }

  private readStoredAppearance(): string | null {
    try {
      return window.localStorage.getItem(AppearanceService.storageKey)
    } catch {
      return null
    }
  }

  private persist(): void {
    const appearance = this.appearance
    const stored: StoredAppearance = {
      theme: appearance.theme.id,
      aberration: appearance.aberration,
      flicker: appearance.flicker,
      curvature: appearance.curvature,
      scanlines: appearance.scanlines,
      sweep: appearance.sweep,
    }

    try {
      window.localStorage.setItem(AppearanceService.storageKey, JSON.stringify(stored))
    } catch {
      // The active appearance still works in memory when storage is unavailable.
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }
}

export const appearanceService = new AppearanceService()
