export enum ThemeId {
  Mambo = 'mambo',
  P1Phosphor = 'p1-phosphor',
}

export class Theme {
  private constructor(
    public readonly id: ThemeId,
    public readonly name: string,
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

  public static mambo(): Theme {
    return new Theme(
      ThemeId.Mambo,
      'Mambo',
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

  public toCssProperties(): Record<string, string> {
    return {
      'color-scheme': 'dark',
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
