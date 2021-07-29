import React from "react"
import styled from "styled-components"
import mapValues from "../util/mapValues"
import { sortBy } from "../util/sortBy"
import Spacer from "./Spacer"

interface Player {
  name: string
  fplId: string
  buyIn: number
  points: number
}

const buyIns = [5, 10, 20, 40]

const numberOfPlayers = 16
const players: Player[] = new Array(numberOfPlayers).fill(0).map((_, index) => {
  const letter = String.fromCharCode(65 + index)
  const name = new Array(5).fill(letter).join("").toLowerCase()
  const fplId = name
  const buyIn = buyIns[Math.floor(Math.random() * 3.99)]
  const points = 10 * (numberOfPlayers - index)
  return { name, fplId, buyIn, points }
})

console.log(JSON.stringify(players, null, 2))

const Container = styled.div`
  font-family: monospace;
  font-size: 18px;
  line-height: 30px;
  padding: 40px;
`

const ListItem = styled.li``

interface Prize {
  player: Player
  value: number
}
interface Pot {
  buyIn: number
  totalPrize: number
  players: Player[]
  prizes?: Prize[]
}

const PRIZE_DISTRIBUTIONS = {
  1: [1],
  2: [0.625, 0.375],
  3: [0.5, 0.3, 0.2],
}
console.log({ PRIZE_DISTRIBUTIONS })

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
    console.log({ buyIn, higherBuyIns })
    let pot: Player[] = []
    ;[buyIn, ...higherBuyIns].forEach(someBuyIn => {
      pot.push(...buyInPlayers[someBuyIn])
    })
    potPlayers[buyIn] = pot
  })

  console.log({ potPlayers })

  let pots: { [k: number]: Pot } = mapValues(potPlayers, (value, key) => {
    const buyIn = Number(key)
    const players = value
    const buyInIndex = buyIns.indexOf(buyIn)
    if (buyInIndex < 0) {
      console.log({ buyIn, buyIns, buyInIndex })
      throw new Error("invalid buyIn index")
    }
    const lowerBuyInIndex = buyInIndex + 1
    const prizePerPlayer =
      lowerBuyInIndex <= buyIns.length - 1
        ? buyIn - buyIns[lowerBuyInIndex]
        : buyIn
    console.log({ lowerBuyInIndex, prizePerPlayer, buyIn, buyIns })
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
    console.log({ PRIZE_DISTRIBUTIONS, distributionIndex })
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

  console.log({ prizes })

  return { potPlayers, totalPrize, buyIns, pots, prizes }
}

const Poker: React.FC<{}> = props => {
  const prizeInfo = React.useMemo(() => {
    return calculatePrizes(players)
  }, [players])

  const { buyIns, pots, totalPrize, prizes } = prizeInfo

  return (
    <Container>
      <h2>Poker</h2>
      <ul>
        {players.map(player => {
          const { name, fplId, buyIn, points } = player
          return (
            <ListItem key={fplId}>
              {name}, £{buyIn}, {points}pts
            </ListItem>
          )
        })}
      </ul>
      <Spacer height={40} />
      <div>
        {buyIns.map(buyIn => {
          const { totalPrize, players, prizes } = pots[buyIn]
          return (
            <div>
              <div>Buy-in: £{buyIn}</div>
              <div>Total prize: £{totalPrize}</div>
              <div>
                Players ({players.length}):{" "}
                {players.map(player => player.name).join(", ")}
              </div>
              <div>
                Winners:
                {prizes?.map((prize, index) => {
                  return (
                    <div>
                      #{index + 1}: {prize.player.name}, £{prize.value}
                    </div>
                  )
                })}
              </div>
              <Spacer height={20} />
            </div>
          )
        })}
        <hr />
        <Spacer height={20} />
        <div>
          <div>Total prize: £{totalPrize}</div>
          <div>
            Winners:
            {prizes?.map((prize, index) => {
              return (
                <div>
                  {prize.player.name}, £{prize.value}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Poker
