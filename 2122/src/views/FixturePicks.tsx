import React from "react"
import Section from "src/components/Section"
import Spacer from "src/components/Spacer"
import { useLeagueContext } from "src/LeagueContext"
import { Fixture, FixtureTeam, Player } from "src/services/api"
import { StateSetter } from "src/types"
import { BuyInManager } from "src/util/calculatePrizes"
import { formatName } from "src/util/formatName"
import { sortBy } from "src/util/sortBy"
import styled from "styled-components"

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
`

const ManagersContainer = styled.div<{ home?: boolean }>`
  position: absolute;
  top: 100%;
  ${(p) => (p.home ? "right: 0;" : "left: 0;")}
  padding: 10px;
  outline: 1px solid black;
  background-color: white;
  z-index: 1;
`

const ManagerName = styled.div`
  font-size: 11px;
  white-space: nowrap;
`

interface TeamPick {
  player: Player
  managers: BuyInManager[]
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
  console.log({ playerId, setPlayerId })
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
            const { player, managers } = pick
            const text = `${player.webName} (${managers.length})`
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
                    {managers.map((manager) => {
                      const { id, rank, name } = manager
                      return (
                        <ManagerName children={formatName(name)} key={id} />
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
      const pickedPlayers = pickedPlayerIds.map((playerId) => players[playerId])
      pickedPlayers.forEach((player) => {
        const teamId = player.teamId
        const playerId = player.id
        if (picksByTeam[teamId]) {
          if (picksByTeam[teamId][playerId]) {
            picksByTeam[teamId][playerId].managers = [
              ...picksByTeam[teamId][playerId].managers,
              manager
            ]
          } else {
            picksByTeam[teamId][playerId] = {
              player,
              managers: [manager]
            }
          }
        } else {
          picksByTeam[teamId] = {
            [playerId]: {
              player,
              managers: [manager]
            }
          }
        }
      })
    })
    function addPicksToFixtureTeam(
      fixtureTeam: FixtureTeam
    ): FixtureTeamWithPicks {
      const teamId = fixtureTeam.teamId
      const picks = Object.values(picksByTeam[teamId] || {}).map((pick) => {
        const { player, managers } = pick
        const managerQuantity = managers.length
        const sortedManagers = sortBy(managers, "rank")
        return {
          player,
          managers: sortedManagers,
          managerQuantity
        }
      })
      const sortedPicks = sortBy(picks, "managerQuantity", true)
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
    <StateContext.Provider value={{ playerId, setPlayerId }}>
      <Section>
        {fixturesWithPicks.map((fixture) => {
          return renderFixture({ fixture })
        })}
      </Section>
    </StateContext.Provider>
  )
}

export default FixturePicks
