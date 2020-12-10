export const fonts = {
  sans: "IBM Plex Sans, sans-serif",
  serif: "IBM Plex Serif, serif",
}

export const colors = {
  purple: `rgb(150, 60, 255)`,
  darkPurple: `rgb(55, 0, 60)`,
}

export const mobileMq = `@media (max-width: 600px)`

export const rootFontSize = 16
export function rem(num: number) {
  return `${num * rootFontSize}px`
}
