import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental"
import { persistQueryClient } from "react-query/persistQueryClient-experimental"
import { LeagueContextProvider } from "./LeagueContext"
import GlobalStyle from "./style/global"
import FixturePicks from "./views/FixturePicks"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24 // 24 hours
    }
  }
})

const localStoragePersistor = createWebStoragePersistor({
  storage: window.localStorage
})

persistQueryClient({
  queryClient,
  persistor: localStoragePersistor
})

const App: React.FC<{}> = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LeagueContextProvider>
        <GlobalStyle />
        {/* <Intro />
        <LiveTable />
        <Calculation /> */}
        <FixturePicks />
      </LeagueContextProvider>
    </QueryClientProvider>
  )
}

export default App
