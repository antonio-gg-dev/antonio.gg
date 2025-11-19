export class Viewport {
  public static readonly xs = new Viewport('xs', 320)
  public static readonly sm = new Viewport('sm', 640)
  public static readonly md = new Viewport('md', 768)
  public static readonly lg = new Viewport('lg', 1024)
  public static readonly xl = new Viewport('xl', 1280)
  public static readonly xxl = new Viewport('2xl', 1536)

  private constructor(
    public readonly name: string,
    public readonly width: number,
  ) {}

  public get pixelWidth(): string {
    return `${this.width}px`
  }
}
