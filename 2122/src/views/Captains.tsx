import React from "react"
import { ManagerCell } from "src/components/CommonCells"
import Section from "src/components/Section"
import Table from "src/components/Table"
import { useLeagueContext } from "src/LeagueContext"
import Skeleton from "./Skeleton"

const headers = ["name", "captain", "vice"] as const

const Captains: React.FC<{}> = (props) => {
  const { managers, currentEventId, setManagers, players } = useLeagueContext()

  const data = React.useMemo(() => {
    return managers.map((manager) => {
      const { picks } = manager
      let captainId: number = 0
      let viceId: number = 0
      Object.keys(picks).forEach((playerIdStr) => {
        const playerId = Number(playerIdStr)
        const pickType = picks[playerId]
        if (pickType === "CAPTAIN") captainId = playerId
        if (pickType === "VICE") viceId = playerId
      })
      return {
        // name: formatName(manager.name),
        manager,
        captain: players[captainId]?.webName,
        vice: players[viceId]?.webName
      }
    })
  }, [managers])

  return (
    <Skeleton>
      <Section>
        <Table
          data={data}
          headers={headers}
          renderCell={(header, rowData) => {
            if (header === "name") {
              return (
                <ManagerCell
                  manager={rowData.manager}
                  currentEventId={currentEventId}
                />
              )
            } else {
              return rowData[header]
            }
          }}
          cellWidths={{
            name: ["auto"],
            captain: ["auto"],
            vice: ["auto"]
          }}
        />
      </Section>
    </Skeleton>
  )
}

export default Captains
