function isEmpty(value: any) {
  return Boolean(!value && value !== false && value !== 0)
}

function compareFactory<T>(opts: {
  prop?: keyof T
  desc?: boolean
  valueTransform: (x: any) => any
  secondaryProp?: keyof T
}): (left: T, right: T) => number {
  const { prop, desc, valueTransform, secondaryProp } = opts
  const directionTransform = (n: number) => (desc ? -1 : 1) * n
  const secondaryCompare = secondaryProp
    ? compareFactory({ prop: secondaryProp, valueTransform, desc: false })
    : () => 0

  return (left: T, right: T) => {
    const leftProp = prop ? left[prop] : left
    const rightProp = prop ? right[prop] : right
    let order = 0
    if (isEmpty(leftProp) && isEmpty(rightProp)) {
      order = secondaryCompare(left, right)
    } else if (isEmpty(leftProp)) {
      order = 1
    } else if (isEmpty(rightProp)) {
      order = -1
    } else {
      const l = valueTransform(leftProp)
      const r = valueTransform(rightProp)
      if (l > r) {
        order = directionTransform(1)
      } else if (l < r) {
        order = directionTransform(-1)
      } else if (l === r) {
        order = secondaryCompare(left, right)
      }
    }
    return order
  }
}

export function sortBy<T>(
  input: T[],
  prop?: keyof T,
  desc?: boolean,
  opts?: {
    castLower?: boolean
    secondaryProp?: keyof T
    valueTransform?: (x: any) => any
  }
) {
  const {
    castLower,
    secondaryProp,
    valueTransform: valueTransformProp
  } = opts || {}
  const valueTransform =
    valueTransformProp || castLower
      ? (x: T[keyof T]) => (typeof x === "string" ? x.toLowerCase() : x)
      : (x: T[keyof T]) => x

  const compare = compareFactory({ prop, desc, valueTransform, secondaryProp })

  return [...input].sort(compare)
}
