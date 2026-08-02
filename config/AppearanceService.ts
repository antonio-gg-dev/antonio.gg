import { shallowRef } from 'vue'
import { Appearance, AppearanceEffect } from './Appearance'
import { Theme, ThemeColor, ThemeId, type PresetThemeId } from './Theme'
import { Viewport } from './Viewport'

interface StoredAppearance {
  theme: ThemeId
  bezel?: string
  background?: string
  foreground?: string
  neutral?: string
  neutralEmphasis?: string
  danger?: string
  dangerEmphasis?: string
  success?: string
  successEmphasis?: string
  warning?: string
  warningEmphasis?: string
  primary?: string
  primaryEmphasis?: string
  accent?: string
  accentEmphasis?: string
  info?: string
  infoEmphasis?: string
  aberration: boolean
  flicker: boolean
  curvature: boolean
  scanlines: boolean
  sweep: boolean
}

type StoredCustomTheme = Required<Pick<StoredAppearance, ThemeColor>>

class AppearanceService {
  private static readonly storageKey = 'antonio.gg.theme'
  private static readonly reducedMotionQuery = '(prefers-reduced-motion: reduce)'
  private static readonly curvatureQuery = `(min-width: ${Viewport.lg.pixelWidth})`

  private readonly appearanceState = shallowRef<Appearance>(
    new Appearance(Theme.mambo(), null, true, true, true, true, true),
  )

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

  activateThemeColor(color: ThemeColor, value: string): void {
    const customTheme = Theme.custom(this.appearance.theme, { [color]: value })

    this.replace({
      theme: customTheme,
      customTheme,
    })
    this.persist()
  }

  activateEffect(effect: AppearanceEffect, active: boolean): void {
    this.replace({ [effect]: active })
    this.persist()
  }

  private apply(appearance: Appearance): void {
    this.appearanceState.value = appearance
    document.documentElement.dataset.theme = appearance.theme.id
    this.applyThemeProperties(appearance.theme)
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
        changes.customTheme === undefined ? current.customTheme : changes.customTheme,
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
        null,
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

      const customTheme = this.createCustomTheme(stored)
      const theme =
        typeof stored.theme === 'string'
          ? this.createTheme(stored.theme, customTheme) ?? fallback.theme
          : fallback.theme

      return new Appearance(
        theme,
        customTheme,
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

    return new Appearance(Theme.mambo(), null, true, animationsActive, curvatureActive, true, animationsActive)
  }

  private createTheme(id: string, customTheme: Theme | null = null): Theme | null {
    if (id === ThemeId.Custom) {
      return customTheme
    }

    return Theme.all()[id as PresetThemeId] ?? null
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

    if (appearance.customTheme !== null) {
      Object.assign(stored, this.toStoredCustomTheme(appearance.customTheme))
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

  private applyThemeProperties(theme: Theme): void {
    const rootStyle = document.documentElement.style

    Object.entries(theme.toCssProperties()).forEach(
      ([
        property,
        value,
      ]) => {
        if (theme.id === ThemeId.Custom) {
          rootStyle.setProperty(property, value)
        } else {
          rootStyle.removeProperty(property)
        }
      },
    )
  }

  private createCustomTheme(value: unknown): Theme | null {
    if (!this.isStoredTheme(value)) {
      return null
    }

    return Theme.custom(Theme.mambo(), value)
  }

  private toStoredCustomTheme(theme: Theme): StoredCustomTheme {
    return {
      bezel: theme.bezel,
      background: theme.background,
      foreground: theme.foreground,
      neutral: theme.neutral,
      neutralEmphasis: theme.neutralEmphasis,
      danger: theme.danger,
      dangerEmphasis: theme.dangerEmphasis,
      success: theme.success,
      successEmphasis: theme.successEmphasis,
      warning: theme.warning,
      warningEmphasis: theme.warningEmphasis,
      primary: theme.primary,
      primaryEmphasis: theme.primaryEmphasis,
      accent: theme.accent,
      accentEmphasis: theme.accentEmphasis,
      info: theme.info,
      infoEmphasis: theme.infoEmphasis,
    }
  }

  private isStoredTheme(value: unknown): value is StoredCustomTheme {
    if (!this.isRecord(value)) {
      return false
    }

    return Object.values(ThemeColor).every((color) => this.isColor(value[color]))
  }

  private isColor(value: unknown): value is string {
    return typeof value === 'string' && /^#[\dA-Fa-f]{6}$/.test(value)
  }
}

export const appearanceService = new AppearanceService()
