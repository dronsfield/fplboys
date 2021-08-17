import React, { Dispatch, SetStateAction } from "react"
import managersData from "src/data/managers.json"
import { useGetLeagueQuery } from "./services/api"
import {
  BuyInManager,
  calculatePrizes,
  PrizeCalculation
} from "./util/calculatePrizes"

interface LeagueContextType {
  setManagers: Dispatch<SetStateAction<BuyInManager[]>>
  prizeCalculation: PrizeCalculation
}

const defaultValue: LeagueContextType = {
  setManagers: () => {},
  prizeCalculation: {
    buyIns: [],
    pots: {},
    potManagers: {},
    totalPrize: 0,
    prizes: [],
    managers: []
  }
}

export const LeagueContext =
  React.createContext<LeagueContextType>(defaultValue)

const buyInsById: { [id: string]: number } = {}
managersData.forEach((manager) => {
  buyInsById[manager.id] = manager.datePaid ? manager.buyIn : 0
})

export const LeagueContextProvider: React.FC<{}> = (props) => {
  const { children } = props
  const [managers, setManagers] = React.useState<BuyInManager[]>([])

  const prizeCalculation = React.useMemo(() => {
    return calculatePrizes(managers)
  }, [managers])

  const { data } = useGetLeagueQuery()
  React.useEffect(() => {
    if (data) {
      const managers = data.managers.map((manager) => {
        const buyInLookupValue = buyInsById[String(manager.id)]
        const buyIn = buyInLookupValue || 0
        if (!buyInLookupValue) {
          if (buyInLookupValue === 0) {
            console.log(`${manager.name} still hasn't paid`)
          } else {
            console.log(`whomst is ${manager.name} ??`)
          }
        }
        return { ...manager, buyIn }
      })
      setManagers(managers)
    }
  }, [data])

  const contextValue = { setManagers, prizeCalculation }

  return <LeagueContext.Provider value={contextValue} children={children} />
}

export function useLeagueContext() {
  return React.useContext(LeagueContext)
}
