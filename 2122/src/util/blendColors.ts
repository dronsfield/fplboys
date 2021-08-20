interface Color {
  r: number
  g: number
  b: number
  a?: number
}

export function parseColor(colorCode: string): Color {
  if (colorCode.startsWith("#")) {
    const noPrefix = colorCode.replace("#", "")
    const r = parseInt(noPrefix.slice(0, 2), 16)
    const g = parseInt(noPrefix.slice(2, 4), 16)
    const b = parseInt(noPrefix.slice(4, 6), 16)
    const a = 1
    return { r, g, b, a }
  } else if (colorCode.startsWith("rgb(")) {
    const noPrefix = colorCode.replace("rgb(", "").replace(")", "")
    const [r, g, b] = noPrefix.split(",").map(Number)
    const a = 1
    return { r, g, b, a }
  } else {
    return usefulColors.transparent
  }
}

export function formatColor(color: Color): string {
  const { r, g, b, a } = color
  return `rgba(${[r, g, b, a].join(",")})`
}

// blendValue should be 0 for 100% color1, 1 for 100% color2
export function blendColors(
  color1: Color,
  color2: Color,
  blendValue: number
): Color {
  const color2Weight = Math.min(blendValue, 1)
  const color1Weight = 1 - color2Weight
  const blended = {
    r: color1Weight * color1.r + color2Weight * color2.r,
    g: color1Weight * color1.g + color2Weight * color2.g,
    b: color1Weight * color1.b + color2Weight * color2.b,
    a: color1Weight * (color1.a || 255) + color2Weight * (color2.a || 255)
  }
  return blended
}

export const usefulColors = {
  white: { r: 255, g: 255, b: 255, a: 255 },
  black: { r: 0, g: 0, b: 0, a: 255 },
  transparent: { r: 0, g: 0, b: 0, a: 0 }
}
