import React, { Dispatch, SetStateAction } from "react"
import playersData from "src/data/players.json"
import {
  calculatePrizes,
  Player,
  PrizeCalculation
} from "./util/calculatePrizes"
import { randomKey } from "./util/randomKey"
import { sortBy } from "./util/sortBy"

interface LeagueContextType {
  setPlayers: Dispatch<SetStateAction<Player[]>>
  prizeCalculation: PrizeCalculation
}

const defaultValue: LeagueContextType = {
  setPlayers: () => {},
  prizeCalculation: {
    buyIns: [],
    pots: {},
    potPlayers: {},
    totalPrize: 0,
    prizes: [],
    players: []
  }
}

export const LeagueContext =
  React.createContext<LeagueContextType>(defaultValue)

const defaultPlayers: Player[] = sortBy(playersData, "name").map(
  (player, index) => {
    return {
      name: player.name || "",
      fplId: randomKey() + (player.name || ""),
      buyIn: player.buyIn,
      placement: index
    }
  }
)

export const LeagueContextProvider: React.FC<{}> = (props) => {
  const { children } = props
  const [players, setPlayers] = React.useState<Player[]>(defaultPlayers)
  const prizeCalculation = React.useMemo(() => {
    return calculatePrizes(players)
  }, [players])

  const contextValue = { setPlayers, prizeCalculation }

  return <LeagueContext.Provider value={contextValue} children={children} />
}

export function useLeagueContext() {
  return React.useContext(LeagueContext)
}
