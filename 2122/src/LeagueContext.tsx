import React from "react"
import managersData from "src/data/managers.json"
import {
  Fixture,
  Players,
  Teams,
  useGetLeagueQuery,
  useInitQuery
} from "./services/api"
import { StateSetter } from "./types"
import {
  BuyInManager,
  calculatePrizes,
  ManagerWithPrize,
  PrizeCalculation
} from "./util/calculatePrizes"

interface LeagueContextType {
  setManagers: StateSetter<BuyInManager[]>
  prizeCalculation: PrizeCalculation
  managers: ManagerWithPrize[]
  players: Players
  teams: Teams
  fixtures: Fixture[]
  currentEventId: number
  isSuccess: boolean
  isError: boolean
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
  },
  managers: [],
  players: {},
  teams: {},
  fixtures: [],
  currentEventId: 1,
  isSuccess: false,
  isError: false
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

  const { data: initData } = useInitQuery()

  const { data: leagueData, isSuccess, isError } = useGetLeagueQuery()
  React.useEffect(() => {
    if (leagueData) {
      const managers = leagueData.managers.map((manager) => {
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
  }, [leagueData])

  const contextValue = {
    ...defaultValue,
    ...initData,
    managers: prizeCalculation.managers,
    setManagers,
    prizeCalculation,
    isSuccess,
    isError
  }

  return <LeagueContext.Provider value={contextValue} children={children} />
}

export function useLeagueContext() {
  return React.useContext(LeagueContext)
}
