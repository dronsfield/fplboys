import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { createWebStoragePersistor } from "react-query/createWebStoragePersistor-experimental"
import { persistQueryClient } from "react-query/persistQueryClient-experimental"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import appConfig from "./appConfig"
import { LeagueContextProvider } from "./LeagueContext"
import GlobalStyle from "./style/global"
import Captains from "./views/Captains"
import FixturePicks from "./views/FixturePicks"
import Intro from "./views/Intro"
import Layout from "./views/Layout"
import Table from "./views/LeagueTable"
import Played from "./views/Played"
import TemplateTeam from "./views/TemplateTeam"
import Transfers from "./views/Transfers"

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
  persistor: localStoragePersistor,
  buster: appConfig.BUILD_ID
})

console.log(`BUILD ID: ${appConfig.BUILD_ID}`)

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
              <Route path="/transfers" component={Transfers} />
              <Route path="/template" component={TemplateTeam} />
              <Route path="/played" component={Played} />
              <Route path="/" component={Intro} />
            </Switch>
          </Layout>
        </Router>
      </LeagueContextProvider>
    </QueryClientProvider>
  )
}

export default App
