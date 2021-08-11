import React from "react"
import { LeagueContextProvider } from "./LeagueContext"
import GlobalStyle from "./style/global"
import Calculation from "./views/Calculation"
import Intro from "./views/Intro"
import Table from "./views/Table"

const App: React.FC<{}> = () => {
  return (
    <LeagueContextProvider>
      <GlobalStyle />
      <Intro />
      <Table />
      <Calculation />
    </LeagueContextProvider>
  )
}

export default App
