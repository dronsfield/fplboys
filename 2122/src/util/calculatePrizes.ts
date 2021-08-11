import mapValues from "../util/mapValues"
import { sortBy } from "../util/sortBy"

export interface Player {
  name: string
  fplId: string
  buyIn: number
  placement: number
}
export interface Prize {
  player: Player
  value: number
}
export interface Pot {
  buyIn: number
  totalPrize: number
  players: Player[]
  prizes: Prize[]
}
export interface PlayerWithPrize extends Player {
  prizeValue: number
  profit: number
}
export interface PrizeCalculation {
  buyIns: number[]
  pots: { [buyIn: number]: Pot }
  potPlayers: { [buyIn: number]: Player[] }
  totalPrize: number
  prizes: Prize[]
  players: PlayerWithPrize[]
}

// export const PRIZE_DISTRIBUTIONS: { [k: number]: number[] } = {
//   1: [1],
//   2: [0.625, 0.375],
//   3: [0.5, 0.3, 0.2]
// }
export const PRIZE_DISTRIBUTIONS: { [k: number]: number[] } = {
  1: [1],
  2: [1, 0],
  3: [0.625, 0.375, 0]
}

function sortPlayers(players: Player[]): Player[] {
  return sortBy(players, "placement")
}

export function calculatePrizes(players: Player[]): PrizeCalculation {
  const playersById: { [id: string]: Player } = {}
  let buyIns: number[] = []
  const buyInPlayers: { [key: number]: Player[] } = {}
  let totalPrize: number = 0
  players.forEach((player) => {
    const { buyIn } = player
    playersById[player.fplId] = player
    if (!buyIns.includes(buyIn)) buyIns.push(buyIn)
    buyInPlayers[buyIn] = [...(buyInPlayers[buyIn] || []), player]
    totalPrize += buyIn
  })
  buyIns = sortBy(buyIns, undefined, true)

  let potPlayers: { [key: number]: Player[] } = {}

  buyIns.forEach((buyIn, index) => {
    const higherBuyIns = buyIns.slice(0, index)
    let pot: Player[] = []
    ;[buyIn, ...higherBuyIns].forEach((someBuyIn) => {
      pot.push(...buyInPlayers[someBuyIn])
    })
    potPlayers[buyIn] = pot
  })

  function calculatePrizesFromPot(pot: Omit<Pot, "prizes">): Prize[] {
    const winners = sortPlayers(pot.players).slice(0, 3)
    if (!winners.length) return []
    const distributionIndex = Math.min(winners.length, 3)
    const distribution = PRIZE_DISTRIBUTIONS[distributionIndex]
    return winners.map((winner, index) => {
      const prizeValue = distribution[index] * pot.totalPrize
      return { player: winner, value: prizeValue }
    })
  }

  let pots: { [k: number]: Pot } = mapValues(potPlayers, (value, key) => {
    const buyIn = Number(key)
    const players = value
    const buyInIndex = buyIns.indexOf(buyIn)
    if (buyInIndex < 0) {
      throw new Error("invalid buyIn index")
    }
    const lowerBuyInIndex = buyInIndex + 1
    const prizePerPlayer =
      lowerBuyInIndex <= buyIns.length - 1
        ? buyIn - buyIns[lowerBuyInIndex]
        : buyIn
    const pot = {
      buyIn,
      totalPrize: prizePerPlayer * players.length,
      players: sortPlayers(players)
    }
    return { ...pot, prizes: calculatePrizesFromPot(pot) }
  })

  // pots = mapValues(pots, (pot) => {
  //   return { ...pot, prizes: calculatePrizesFromPot(pot) }
  // })

  const totalPrizePerPlayer: { [id: string]: number } = {}
  Object.values(pots).forEach((pot) => {
    const { prizes } = pot
    prizes.forEach((prize) => {
      totalPrizePerPlayer[prize.player.fplId] =
        (totalPrizePerPlayer[prize.player.fplId] || 0) + prize.value
    })
  })

  let prizes: Array<{ value: number; player: Player }> = []
  Object.keys(totalPrizePerPlayer).forEach((playerId) => {
    prizes.push({
      player: playersById[playerId],
      value: totalPrizePerPlayer[playerId]
    })
  })
  prizes = sortBy(prizes, "value", true)

  const playersWithPrize: PlayerWithPrize[] = players.map((player) => {
    const prizeValue = totalPrizePerPlayer[player.fplId] || 0
    return { ...player, prizeValue, profit: prizeValue - player.buyIn }
  })

  return {
    potPlayers,
    totalPrize,
    buyIns,
    pots,
    prizes,
    players: playersWithPrize
  }
}
