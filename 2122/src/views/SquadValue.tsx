import React from "react"
import { ManagerCell } from "src/components/CommonCells"
import Section from "src/components/Section"
import Table from "src/components/Table"
import { useLeagueContext } from "src/LeagueContext"
import Skeleton from "./Skeleton"

const headers = [
  "Manager",
  "Squad Value",
  "In The Bank",
  "Total",
  "Profit"
] as const

function moneyColumn(value: number) {
  return `${value.toFixed(1)}`
}

const TemplateTeam: React.FC<{}> = (props) => {
  const { managers, currentEventId } = useLeagueContext()

  return (
    <Skeleton>
      <Section>
        <Table
          data={managers}
          headers={headers}
          renderCell={(header, manager) => {
            switch (header) {
              case "Manager":
                return (
                  <ManagerCell
                    manager={manager}
                    currentEventId={currentEventId}
                  />
                )
              case "Squad Value":
                return moneyColumn(manager.totalMoney - manager.bankMoney)
              case "In The Bank":
                return moneyColumn(manager.bankMoney)
              case "Total":
                return moneyColumn(manager.totalMoney)
              case "Profit":
                return moneyColumn(manager.totalMoney - 100)
            }
          }}
          cellWidths={{
            Manager: ["auto"],
            "Squad Value": ["auto"],
            "In The Bank": ["auto"],
            Total: ["auto"],
            Profit: ["auto"]
          }}
        />
      </Section>
    </Skeleton>
  )
}

export default TemplateTeam
