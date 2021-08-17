import { Manager } from "src/services/api"
import mapValues from "../util/mapValues"
import { sortBy } from "../util/sortBy"

export interface BuyInManager extends Manager {
  buyIn: number
}
export interface Prize {
  manager: BuyInManager
  value: number
}
export interface Pot {
  buyIn: number
  totalPrize: number
  managers: BuyInManager[]
  prizes: Prize[]
}
export interface managerWithPrize extends BuyInManager {
  prizeValue: number
  profit: number
}
export interface PrizeCalculation {
  buyIns: number[]
  pots: { [buyIn: number]: Pot }
  potManagers: { [buyIn: number]: BuyInManager[] }
  totalPrize: number
  prizes: Prize[]
  managers: managerWithPrize[]
}

// export const PRIZE_DISTRIBUTIONS: { [k: number]: number[] } = {
//   1: [1],
//   2: [0.625, 0.375],
//   3: [0.5, 0.3, 0.2]
// }
export const PRIZE_DISTRIBUTIONS: { [k: number]: number[] } = {
  1: [1],
  2: [1, 0],
  3: [0.625, 0.375, 0],
  4: [0.5, 0.3, 0.2]
}

function sortmanagers(managers: BuyInManager[]): BuyInManager[] {
  return sortBy(managers, "rank")
}

export function calculatePrizes(managers: BuyInManager[]): PrizeCalculation {
  const managersById: { [id: string]: BuyInManager } = {}
  let buyIns: number[] = []
  const buyInmanagers: { [key: number]: BuyInManager[] } = {}
  let totalPrize: number = 0
  managers.forEach((manager) => {
    const { buyIn } = manager
    managersById[manager.id] = manager
    if (!buyIns.includes(buyIn)) buyIns.push(buyIn)
    buyInmanagers[buyIn] = [...(buyInmanagers[buyIn] || []), manager]
    totalPrize += buyIn
  })
  buyIns = sortBy(buyIns, undefined, true)

  let potManagers: { [key: number]: BuyInManager[] } = {}

  buyIns.forEach((buyIn, index) => {
    const higherBuyIns = buyIns.slice(0, index)
    let pot: BuyInManager[] = []
    ;[buyIn, ...higherBuyIns].forEach((someBuyIn) => {
      pot.push(...buyInmanagers[someBuyIn])
    })
    potManagers[buyIn] = pot
  })

  function calculatePrizesFromPot(pot: Omit<Pot, "prizes">): Prize[] {
    const winners = sortmanagers(pot.managers).slice(0, 3)
    if (!winners.length) return []
    const distributionIndex = Math.min(pot.managers.length, 4)
    const distribution = PRIZE_DISTRIBUTIONS[distributionIndex]
    return winners.map((winner, index) => {
      const prizeValue = distribution[index] * pot.totalPrize
      return { manager: winner, value: prizeValue }
    })
  }

  let pots: { [k: number]: Pot } = mapValues(potManagers, (value, key) => {
    const buyIn = Number(key)
    const managers = value
    const buyInIndex = buyIns.indexOf(buyIn)
    if (buyInIndex < 0) {
      throw new Error("invalid buyIn index")
    }
    const lowerBuyInIndex = buyInIndex + 1
    const prizePermanager =
      lowerBuyInIndex <= buyIns.length - 1
        ? buyIn - buyIns[lowerBuyInIndex]
        : buyIn
    const pot = {
      buyIn,
      totalPrize: prizePermanager * managers.length,
      managers: sortmanagers(managers)
    }
    return { ...pot, prizes: calculatePrizesFromPot(pot) }
  })

  const totalPrizePermanager: { [id: string]: number } = {}
  Object.values(pots).forEach((pot) => {
    const { prizes } = pot
    prizes.forEach((prize) => {
      totalPrizePermanager[prize.manager.id] =
        (totalPrizePermanager[prize.manager.id] || 0) + prize.value
    })
  })

  let prizes: Array<{ value: number; manager: BuyInManager }> = []
  Object.keys(totalPrizePermanager).forEach((managerId) => {
    prizes.push({
      manager: managersById[managerId],
      value: totalPrizePermanager[managerId]
    })
  })
  prizes = sortBy(prizes, "value", true)

  const managersWithPrize: managerWithPrize[] = managers.map((manager) => {
    const prizeValue = totalPrizePermanager[manager.id] || 0
    return { ...manager, prizeValue, profit: prizeValue - manager.buyIn }
  })

  return {
    potManagers,
    totalPrize,
    buyIns,
    pots,
    prizes,
    managers: managersWithPrize
  }
}
