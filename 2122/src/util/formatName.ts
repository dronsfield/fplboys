import { capitalCase } from "change-case"

export function formatName(name: string) {
  const [firstName, ...otherNames] = capitalCase(name).split(" ")
  const formattedName =
    firstName + " " + otherNames.map((str) => str[0]).join("")
  return formattedName
}
