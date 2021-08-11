import mapValues from "../util/mapValues"
import { sortBy } from "../util/sortBy"

export interface Player {
  name: string
  fplId: string
  buyIn: number
  points: number
}

function calculatePrizes(players: Player[]) {
  const playersById: { [id: string]: Player } = {}
  let buyIns: number[] = []
  const buyInPlayers: { [key: number]: Player[] } = {}
  let totalPrize: number = 0
  players.forEach(player => {
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
    ;[buyIn, ...higherBuyIns].forEach(someBuyIn => {
      pot.push(...buyInPlayers[someBuyIn])
    })
    potPlayers[buyIn] = pot
  })

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
    return {
      buyIn,
      totalPrize: prizePerPlayer * players.length,
      players: sortBy(players, "points", true),
    }
  })

  function calculatePrizesFromPot(pot: Pot): Prize[] {
    const winners = sortBy(pot.players, "points", true).slice(0, 3)
    if (!winners.length) return []
    const distributionIndex = Math.min(winners.length, 3)
    const distribution = PRIZE_DISTRIBUTIONS[distributionIndex]
    return winners.map((winner, index) => {
      const prizeValue = distribution[index] * pot.totalPrize
      return { player: winner, value: prizeValue }
    })
  }

  pots = mapValues(pots, pot => {
    return { ...pot, prizes: calculatePrizesFromPot(pot) }
  })

  const totalPrizePerPlayer: { [id: string]: number } = {}
  Object.values(pots).forEach(pot => {
    const { prizes } = pot
    prizes.forEach(prize => {
      totalPrizePerPlayer[prize.player.fplId] =
        (totalPrizePerPlayer[prize.player.fplId] || 0) + prize.value
    })
  })

  let prizes: Array<{ value: number; player: Player }> = []
  Object.keys(totalPrizePerPlayer).forEach(playerId => {
    prizes.push({
      player: playersById[playerId],
      value: totalPrizePerPlayer[playerId],
    })
  })
  prizes = sortBy(prizes, "value", true)

  return { potPlayers, totalPrize, buyIns, pots, prizes }
}
