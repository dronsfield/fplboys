function mapValues<I, O>(
  obj: I,
  transform: (value: I[keyof I], key: keyof I) => O
) {
  const keys = Object.keys(obj) as Array<keyof I>
  return keys.reduce((acc, key) => {
    acc[key] = transform(obj[key], key)
    return acc
  }, {} as { [K in keyof I]: O })
}

export default mapValues
