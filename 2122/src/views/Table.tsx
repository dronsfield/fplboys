import React from "react"
import LiveTable from "src/views/LiveTable"
import Calculation from "./Calculation"

const Table: React.FC<{}> = (props) => {
  const { ...foo } = props

  return (
    <>
      <LiveTable />
      <Calculation />
    </>
  )
}

export default Table
