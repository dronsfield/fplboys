export function randomKey(n = 6) {
  const num = Math.random()
  const str = num.toString(36)
  const sub = str.substring(2, 2 + n)
  return sub
}
