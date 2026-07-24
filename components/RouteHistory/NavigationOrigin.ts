const navigationOrigins = new WeakMap<MouseEvent, string>()

if (typeof window !== 'undefined') {
  window.addEventListener(
    'click',
    (event) => {
      navigationOrigins.set(event, window.location.href)
    },
    { capture: true },
  )
}

export function getNavigationOrigin(event: MouseEvent): string | null {
  return navigationOrigins.get(event) ?? null
}
