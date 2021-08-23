import React from "react"
import LiveTable from "src/views/LiveTable"
import Calculation from "./Calculation"
import Skeleton from "./Skeleton"

const LeagueTable: React.FC<{}> = (props) => {
  return (
    <Skeleton>
      <LiveTable />
      <Calculation />
    </Skeleton>
  )
}

export default LeagueTable
