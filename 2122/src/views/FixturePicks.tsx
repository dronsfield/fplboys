import React from "react"
import Section from "src/components/Section"
import Spacer from "src/components/Spacer"
import { useLeagueContext } from "src/LeagueContext"
import { Fixture, FixtureTeam, PickType, Player } from "src/services/api"
import colors from "src/style/colors"
import { StateSetter } from "src/types"
import { BuyInManager } from "src/util/calculatePrizes"
import { formatName } from "src/util/formatName"
import { sortBy } from "src/util/sortBy"
import styled from "styled-components"
import Skeleton from "./Skeleton"

interface StateContextValue {
  playerId?: number
  setPlayerId: StateSetter<number | undefined>
}
const defaultStateContextValue: StateContextValue = {
  playerId: undefined,
  setPlayerId: () => {}
}
const StateContext = React.createContext<StateContextValue>(
  defaultStateContextValue
)

const Row = styled.div<{ flexEnd?: boolean }>`
  display: flex;
  flex-direction: ${(p) => (p.flexEnd ? "row-reverse" : "row")};
  text-align: ${(p) => (p.flexEnd ? "right" : "left")};
  // justify-content: ${(p) => (p.flexEnd ? "flex-end" : "flex-start")};
`

const TeamContainer = styled.div`
  flex: 1;
  padding: 10px 5px;
`

const TeamFirstRow = styled(Row)`
  align-items: center;
`

const TeamName = styled.div`
  font-size: 18px;
`

const Score = styled.div`
  font-size: 24px;
  font-weight: bold;
  font-family: monospace;
`

const PlayerContainer = styled.div`
  position: relative;
`

const PlayerName = styled.div`
  font-size: 13px;
  padding: 2px 0;
  cursor: pointer;
`

const ManagersContainer = styled.div<{ home?: boolean }>`
  position: absolute;
  top: 100%;
  margin-top: -3px;
  ${(p) => (p.home ? "right: 0;" : "left: 0;")}
  padding: 10px;
  border: 1px solid ${colors.purple};
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: white;
  z-index: 1;
`

const ManagerName = styled.div<{ pickType: PickType }>`
  font-size: 12px;
  white-space: nowrap;
  padding: 1px 0;
  ${(p) => (p.pickType === "BENCHED" ? "opacity: 0.5;" : "")}
  ${(p) => (p.pickType === "CAPTAIN" ? "font-weight: bold;" : "")}
`

interface TeamPick {
  player: Player
  picks: Array<{
    manager: BuyInManager
    pickType: PickType
  }>
}
interface FixtureTeamWithPicks extends FixtureTeam {
  picks: TeamPick[]
}
interface FixtureWithPicks extends Fixture {
  home: FixtureTeamWithPicks
  away: FixtureTeamWithPicks
}

const TeamPicks: React.FC<{ team: FixtureTeamWithPicks; home?: boolean }> = (
  props
) => {
  const { team, home = false } = props
  const { playerId, setPlayerId } = React.useContext(StateContext)
  return (
    <TeamContainer>
      <TeamFirstRow flexEnd={home}>
        <Score children={team.score} />
        <Spacer width={8} />
        <TeamName children={team.team.name} />
      </TeamFirstRow>
      <Spacer height={5} />
      <Row flexEnd={home}>
        <div>
          {team.picks.map((pick) => {
            const { player, picks } = pick
            const text = `${player.webName} x${picks.length}`
            return (
              <PlayerContainer>
                <PlayerName
                  key={player.id}
                  children={text}
                  onClick={() =>
                    setPlayerId((id) =>
                      id === player.id ? undefined : player.id
                    )
                  }
                />
                {playerId === player.id ? (
                  <ManagersContainer home={home}>
                    {picks.map((pick) => {
                      const { manager, pickType } = pick
                      const { id, rank, name } = manager
                      const suffix =
                        pickType === "CAPTAIN"
                          ? " [C]"
                          : pickType === "VICE"
                          ? " [V]"
                          : ""
                      return (
                        <ManagerName
                          children={formatName(name) + suffix}
                          key={id}
                          pickType={pickType}
                          // benched={pickType === "BENCHED"}
                          // captain={pickType === "CAPTAIN"}
                        />
                      )
                    })}
                  </ManagersContainer>
                ) : null}
              </PlayerContainer>
            )
          })}
        </div>
      </Row>
    </TeamContainer>
  )
}

const renderFixture: React.FC<{ fixture: FixtureWithPicks }> = (props) => {
  const { fixture } = props
  return (
    <Row>
      <TeamPicks {...{ team: fixture.home, home: true }} />
      <TeamPicks {...{ team: fixture.away }} />
    </Row>
  )
}

function useFixturesWithPicks() {
  const { fixtures, managers, teams, players } = useLeagueContext()
  const fixturesWithPicks: FixtureWithPicks[] = React.useMemo(() => {
    const picksByTeam: { [teamId: number]: { [playerId: number]: TeamPick } } =
      {}
    managers.forEach((manager) => {
      const { picks } = manager
      const pickedPlayerIds: number[] = Object.keys(picks).map(Number)
      pickedPlayerIds.forEach((playerId) => {
        const player = players[playerId]
        const pickType = picks[playerId]
        const teamId = player.teamId
        if (picksByTeam[teamId]) {
          if (picksByTeam[teamId][playerId]) {
            picksByTeam[teamId][playerId].picks = [
              ...picksByTeam[teamId][playerId].picks,
              { manager, pickType }
            ]
          } else {
            picksByTeam[teamId][playerId] = {
              player,
              picks: [{ manager, pickType }]
            }
          }
        } else {
          picksByTeam[teamId] = {
            [playerId]: {
              player,
              picks: [{ manager, pickType }]
            }
          }
        }
      })
    })
    function addPicksToFixtureTeam(
      fixtureTeam: FixtureTeam
    ): FixtureTeamWithPicks {
      const teamId = fixtureTeam.teamId
      const teamPicks = Object.values(picksByTeam[teamId] || {}).map((pick) => {
        const { player, picks } = pick
        const picksWithManagerRank = picks.map((pick) => ({
          ...pick,
          managerRank: pick.manager.rank
        }))
        const sortedPicks = sortBy(picksWithManagerRank, "managerRank")
        const managerQuantity = picks.length
        return {
          player,
          picks: sortedPicks,
          managerQuantity
        }
      })
      const sortedPicks = sortBy(teamPicks, "managerQuantity", true)
      return { ...fixtureTeam, picks: sortedPicks }
    }

    return fixtures.map((fixture) => {
      return {
        ...fixture,
        home: addPicksToFixtureTeam(fixture.home),
        away: addPicksToFixtureTeam(fixture.away)
      }
    })
  }, [fixtures, managers, players])
  return fixturesWithPicks
}

const FixturePicks: React.FC<{}> = (props) => {
  const [playerId, setPlayerId] = React.useState<number>()
  const fixturesWithPicks = useFixturesWithPicks()

  return (
    <Skeleton>
      <StateContext.Provider value={{ playerId, setPlayerId }}>
        <Section>
          {fixturesWithPicks.map((fixture) => {
            return renderFixture({ fixture })
          })}
        </Section>
      </StateContext.Provider>
    </Skeleton>
  )
}

export default FixturePicks
