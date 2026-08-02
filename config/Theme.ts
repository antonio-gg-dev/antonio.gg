export enum ThemeId {
  Chocula = 'chocula',
  Mambo = 'mambo',
  P1Phosphor = 'p1-phosphor',
  Custom = 'custom',
  Solaris = 'solaris',
}

export type PresetThemeId = Exclude<ThemeId, ThemeId.Custom>

export enum ThemeColor {
  Bezel = 'bezel',
  Background = 'background',
  Foreground = 'foreground',
  Neutral = 'neutral',
  NeutralEmphasis = 'neutralEmphasis',
  Danger = 'danger',
  DangerEmphasis = 'dangerEmphasis',
  Success = 'success',
  SuccessEmphasis = 'successEmphasis',
  Warning = 'warning',
  WarningEmphasis = 'warningEmphasis',
  Primary = 'primary',
  PrimaryEmphasis = 'primaryEmphasis',
  Accent = 'accent',
  AccentEmphasis = 'accentEmphasis',
  Info = 'info',
  InfoEmphasis = 'infoEmphasis',
}

export enum ColorScheme {
  Dark = 'dark',
  Light = 'light',
}

export class Theme {
  private constructor(
    public readonly id: ThemeId,
    public readonly name: string,
    public readonly colorScheme: ColorScheme,
    public readonly bezel: string,
    public readonly background: string,
    public readonly foreground: string,
    public readonly neutral: string,
    public readonly neutralEmphasis: string,
    public readonly danger: string,
    public readonly dangerEmphasis: string,
    public readonly success: string,
    public readonly successEmphasis: string,
    public readonly warning: string,
    public readonly warningEmphasis: string,
    public readonly primary: string,
    public readonly primaryEmphasis: string,
    public readonly accent: string,
    public readonly accentEmphasis: string,
    public readonly info: string,
    public readonly infoEmphasis: string,
  ) {}

  public static all(): Record<PresetThemeId, Theme> {
    return {
      [ThemeId.Chocula]: Theme.chocula(),
      [ThemeId.Mambo]: Theme.mambo(),
      [ThemeId.P1Phosphor]: Theme.p1Phosphor(),
      [ThemeId.Solaris]: Theme.solaris(),
    }
  }

  public static chocula(): Theme {
    return new Theme(
      ThemeId.Chocula,
      'Chocula',
      ColorScheme.Dark,
      '#000000',
      '#282A36',
      '#F8F8F2',
      '#21222C',
      '#6272A4',
      '#FF5555',
      '#FF6E6E',
      '#50FA7B',
      '#69FF94',
      '#F1FA8C',
      '#FFFFA5',
      '#BD93F9',
      '#D6ACFF',
      '#FF79C6',
      '#FF92DF',
      '#8BE9FD',
      '#A4FFFF',
    )
  }

  public static mambo(): Theme {
    return new Theme(
      ThemeId.Mambo,
      'Mambo',
      ColorScheme.Dark,
      '#000000',
      '#2E3436',
      '#EEEEEC',
      '#555753',
      '#D3D7CF',
      '#CC0000',
      '#EF2929',
      '#4E9A06',
      '#8AE234',
      '#C4A000',
      '#FCE94F',
      '#3465A4',
      '#729FCF',
      '#75507B',
      '#AD7FA8',
      '#06989A',
      '#34E2E2',
    )
  }

  public static p1Phosphor(): Theme {
    return new Theme(
      ThemeId.P1Phosphor,
      'P1 Phosphor',
      ColorScheme.Dark,
      '#000000',
      '#001408',
      '#B6FFC5',
      '#082A11',
      '#0F4B1E',
      '#1A8435',
      '#2DE15A',
      '#1A8435',
      '#2DE15A',
      '#1A8435',
      '#2DE15A',
      '#1A8435',
      '#2DE15A',
      '#1A8435',
      '#2DE15A',
      '#1A8435',
      '#2DE15A',
    )
  }

  public static solaris(): Theme {
    return new Theme(
      ThemeId.Solaris,
      'Solaris',
      ColorScheme.Light,
      '#073642',
      '#FDF6E3',
      '#4C6770',
      '#CACDC2',
      '#7F9091',
      '#9A3031',
      '#DC322F',
      '#5D7810',
      '#859900',
      '#7F6D10',
      '#B58900',
      '#1B6EA3',
      '#268BD2',
      '#94336B',
      '#D33682',
      '#1D7E7B',
      '#2AA198',
    )
  }

  public static custom(source: Theme, colors: Partial<Record<ThemeColor, string>> = {}): Theme {
    const background = colors.background ?? source.background
    const foreground = colors.foreground ?? source.foreground

    return new Theme(
      ThemeId.Custom,
      'Personalizado',
      Theme.detectColorScheme(background, foreground),
      colors.bezel ?? source.bezel,
      background,
      foreground,
      colors.neutral ?? source.neutral,
      colors.neutralEmphasis ?? source.neutralEmphasis,
      colors.danger ?? source.danger,
      colors.dangerEmphasis ?? source.dangerEmphasis,
      colors.success ?? source.success,
      colors.successEmphasis ?? source.successEmphasis,
      colors.warning ?? source.warning,
      colors.warningEmphasis ?? source.warningEmphasis,
      colors.primary ?? source.primary,
      colors.primaryEmphasis ?? source.primaryEmphasis,
      colors.accent ?? source.accent,
      colors.accentEmphasis ?? source.accentEmphasis,
      colors.info ?? source.info,
      colors.infoEmphasis ?? source.infoEmphasis,
    )
  }

  private static detectColorScheme(background: string, foreground: string): ColorScheme {
    return Theme.relativeLuminance(background) > Theme.relativeLuminance(foreground)
      ? ColorScheme.Light
      : ColorScheme.Dark
  }

  /**
   * @see https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
   */
  private static relativeLuminance(color: string): number {
    const EIGHT_BIT_CHANNEL_MAX = 255
    const LINEAR_THRESHOLD = 0.04045
    const LINEAR_DIVISOR = 12.92
    const NONLINEAR_OFFSET = 0.055
    const NONLINEAR_SCALE = 1.055
    const NONLINEAR_EXPONENT = 2.4
    const RED_WEIGHT = 0.2126
    const GREEN_WEIGHT = 0.7152
    const BLUE_WEIGHT = 0.0722
    const [
      red,
      green,
      blue,
    ] = [
      Number.parseInt(color.slice(1, 3), 16),
      Number.parseInt(color.slice(3, 5), 16),
      Number.parseInt(color.slice(5, 7), 16),
    ].map((channel) => {
      const normalized = channel / EIGHT_BIT_CHANNEL_MAX

      if (normalized <= LINEAR_THRESHOLD) {
        return normalized / LINEAR_DIVISOR
      }

      return ((normalized + NONLINEAR_OFFSET) / NONLINEAR_SCALE) ** NONLINEAR_EXPONENT
    })

    return RED_WEIGHT * red + GREEN_WEIGHT * green + BLUE_WEIGHT * blue
  }

  public toCssProperties(): Record<string, string> {
    return {
      'color-scheme': this.colorScheme,
      '--color-bezel': this.bezel,
      '--color-background': this.background,
      '--color-foreground': this.foreground,
      '--color-neutral': this.neutral,
      '--color-neutral-emphasis': this.neutralEmphasis,
      '--color-danger': this.danger,
      '--color-danger-emphasis': this.dangerEmphasis,
      '--color-success': this.success,
      '--color-success-emphasis': this.successEmphasis,
      '--color-warning': this.warning,
      '--color-warning-emphasis': this.warningEmphasis,
      '--color-primary': this.primary,
      '--color-primary-emphasis': this.primaryEmphasis,
      '--color-accent': this.accent,
      '--color-accent-emphasis': this.accentEmphasis,
      '--color-info': this.info,
      '--color-info-emphasis': this.infoEmphasis,
    }
  }
}
