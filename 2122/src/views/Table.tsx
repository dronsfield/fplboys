import React from "react"
import LiveTable from "src/views/LiveTable"
import Calculation from "./Calculation"
import Skeleton from "./Skeleton"

const Table: React.FC<{}> = (props) => {
  const { ...foo } = props

  return (
    <Skeleton>
      <LiveTable />
      <Calculation />
    </Skeleton>
  )
}

export default Table
