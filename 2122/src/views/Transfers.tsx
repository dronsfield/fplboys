import React from "react"
import Section from "src/components/Section"
import Table from "src/components/Table"
import { useLeagueContext } from "src/LeagueContext"
import { formatName } from "src/util/formatName"
import Skeleton from "./Skeleton"

const headers = ["name", "in", "out"] as const

const Transfers: React.FC<{}> = (props) => {
  const { managers, currentEventId, setManagers, players } = useLeagueContext()

  return (
    <Skeleton>
      <Section>
        <Table
          data={managers}
          headers={headers}
          renderCell={(header, manager) => {
            if (header === "name") {
              return formatName(manager.name)
            } else {
              const playerIds = manager.transfers[header]
              return (
                playerIds.map((id) => players[id]?.webName).join(", ") || "-"
              )
            }
          }}
          cellWidths={{
            name: ["nowrap"],
            in: ["auto"],
            out: ["auto"]
          }}
        />
      </Section>
    </Skeleton>
  )
}

export default Transfers
