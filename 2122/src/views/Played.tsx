import React from "react"
import { ManagerCell } from "src/components/CommonCells"
import Section from "src/components/Section"
import Table from "src/components/Table"
import { useLeagueContext } from "src/LeagueContext"
import { FixtureTeam, PickType, Player } from "src/services/api"
import colors from "src/style/colors"
import { sortBy } from "src/util/sortBy"
import { ItemsOf } from "src/util/utilityTypes"
import styled from "styled-components"
import Skeleton from "./Skeleton"

const headers = [
  "manager",
  "points",
  "finishedCount",
  "inPlayCount",
  "notStartedCount",
  "notFinished"
] as const

const TEAM_FIXTURE_STATUS = [
  "NOT_STARTED",
  "IN_PLAY",
  "FINISHED",
  "NONE"
] as const
type TeamFixtureStatus = ItemsOf<typeof TEAM_FIXTURE_STATUS>

const PlayerName = styled.span<{
  pickType: PickType
  teamFixtureStatus: TeamFixtureStatus
}>`
  ${(p) => (p.pickType === "BENCHED" ? "opacity: 0.5;" : "")}
  ${(p) => (p.pickType === "CAPTAIN" ? "font-weight: bold;" : "")}
  ${(p) =>
    p.teamFixtureStatus === "IN_PLAY" ? `color: ${colors.purple};` : ""}
`

const Played: React.FC<{}> = (props) => {
  const { managers, currentEventId, players, fixtures } = useLeagueContext()

  const data = React.useMemo(() => {
    const teamFixtureStatuses: { [teamId: number]: TeamFixtureStatus } = {}

    fixtures.forEach((fixture) => {
      const addTeamFixtureStatus = (team: FixtureTeam) => {
        const teamId = team.teamId
        let status: TeamFixtureStatus = fixture.finished
          ? "FINISHED"
          : fixture.started
          ? "IN_PLAY"
          : "NOT_STARTED"
        teamFixtureStatuses[teamId] = status
      }
      addTeamFixtureStatus(fixture.home)
      addTeamFixtureStatus(fixture.away)
    })

    return managers.map((manager) => {
      const { picks } = manager
      let finishedCount: number = 0
      let inPlayCount: number = 0
      let notStartedCount: number = 0
      let notFinished: Array<{
        player: Player
        pickType: PickType
        teamFixtureStatus: TeamFixtureStatus
      }> = []
      Object.keys(picks).forEach((playerIdStr) => {
        const playerId = Number(playerIdStr)
        const pickType = picks[playerId]
        const player = players[playerId]
        if (!player) return
        const teamId = player.teamId
        const teamFixtureStatus = teamFixtureStatuses[teamId] || "NONE"
        if (teamFixtureStatus === "FINISHED") {
          finishedCount++
        }
        if (teamFixtureStatus === "IN_PLAY") {
          inPlayCount++
        }
        if (teamFixtureStatus === "NOT_STARTED") {
          notStartedCount++
        }
        if (
          teamFixtureStatus === "IN_PLAY" ||
          teamFixtureStatus === "NOT_STARTED"
        ) {
          notFinished.push({
            player,
            pickType,
            teamFixtureStatus
          })
        }
      })

      notFinished = sortBy(notFinished, "player", false, {
        valueTransform: (player: Player) => player.webName
      })

      return {
        manager,
        finishedCount,
        inPlayCount,
        notStartedCount,
        notFinished
      }
    })
  }, [managers, players, fixtures])

  return (
    <Skeleton>
      <Section>
        <Table
          data={data}
          headers={headers}
          renderCell={(header, rowData) => {
            if (header === "manager") {
              return (
                <ManagerCell
                  manager={rowData.manager}
                  currentEventId={currentEventId}
                />
              )
            } else if (header === "points") {
              return rowData.manager.eventPoints
            } else if (header === "notFinished") {
              return rowData.notFinished.map(
                ({ player, pickType, teamFixtureStatus }) => {
                  return (
                    <PlayerName
                      pickType={pickType}
                      teamFixtureStatus={teamFixtureStatus}
                      key={player.id}
                      children={player.webName + ", "}
                    />
                  )
                }
              )
            } else {
              return rowData[header]
            }
          }}
          renderHeader={(header) => {
            switch (header) {
              case "manager":
                return "Manager"
              case "points":
                return "Pts"
              case "finishedCount":
                return "P"
              case "inPlayCount":
                return "I-P"
              case "notStartedCount":
                return "LTP"
              case "notFinished":
                return ""
            }
          }}
          cellWidths={{
            manager: ["nowrap"],
            points: ["nowrap"],
            finishedCount: ["nowrap"],
            inPlayCount: ["nowrap"],
            notStartedCount: ["nowrap"],
            notFinished: ["auto"]
          }}
        />
      </Section>
    </Skeleton>
  )
}

export default Played
