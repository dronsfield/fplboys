import React from "react"
import { ManagerCell } from "src/components/CommonCells"
import Section from "src/components/Section"
import Table from "src/components/Table"
import { useLeagueContext } from "src/LeagueContext"
import Skeleton from "./Skeleton"

const headers = ["manager", "in", "out"] as const

const Transfers: React.FC<{}> = (props) => {
  const { managers, currentEventId, setManagers, players } = useLeagueContext()

  return (
    <Skeleton>
      <Section>
        <Table
          data={managers}
          headers={headers}
          renderCell={(header, manager) => {
            if (header === "manager") {
              return (
                <ManagerCell
                  manager={manager}
                  currentEventId={currentEventId}
                />
              )
            } else {
              const playerIds = manager.transfers[header]
              return (
                playerIds.map((id) => players[id]?.webName).join(", ") || "-"
              )
            }
          }}
          cellWidths={{
            manager: ["nowrap"],
            in: ["auto"],
            out: ["auto"]
          }}
        />
      </Section>
    </Skeleton>
  )
}

export default Transfers
