import { type Theme } from './Theme'

export enum AppearanceEffect {
  Aberration = 'aberration',
  Flicker = 'flicker',
  Curvature = 'curvature',
  Scanlines = 'scanlines',
  Sweep = 'sweep',
}

export class Appearance {
  constructor(
    public readonly theme: Theme,
    public readonly customTheme: Theme | null,
    public readonly aberration: boolean,
    public readonly flicker: boolean,
    public readonly curvature: boolean,
    public readonly scanlines: boolean,
    public readonly sweep: boolean,
  ) {}
}
