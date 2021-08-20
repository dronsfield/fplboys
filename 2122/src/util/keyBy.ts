export function keyBy<By extends string, Obj extends Record<By, number>>(
  input: Obj[],
  by: By
): { [k: number]: Obj }
export function keyBy<By extends string, Obj extends Record<By, string>>(
  input: Obj[],
  by: By
): { [k: string]: Obj }
export function keyBy<By extends string, Obj extends Record<By, string>>(
  input: Obj[],
  by: By
): { [k: string]: Obj } {
  const output: any = {}
  input.forEach((item) => {
    output[item[by]] = item
  })
  return output
}
