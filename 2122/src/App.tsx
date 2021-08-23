import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental"
import { persistQueryClient } from "react-query/persistQueryClient-experimental"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import { LeagueContextProvider } from "./LeagueContext"
import GlobalStyle from "./style/global"
import Captains from "./views/Captains"
import FixturePicks from "./views/FixturePicks"
import Intro from "./views/Intro"
import Layout from "./views/Layout"
import Table from "./views/LeagueTable"

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
        <Router>
          <Layout>
            <Switch>
              <Route path="/table" component={Table} />
              <Route path="/fixtures" component={FixturePicks} />
              <Route path="/captains" component={Captains} />
              <Route path="/" component={Intro} />
            </Switch>
          </Layout>
        </Router>
      </LeagueContextProvider>
    </QueryClientProvider>
  )
}

export default App
