import React from "react"
import Section from "src/components/Section"
import Spacer from "src/components/Spacer"
import { useLeagueContext } from "src/LeagueContext"
import { Fixture, FixtureTeam, Player } from "src/services/api"
import { BuyInManager } from "src/util/calculatePrizes"
import { sortBy } from "src/util/sortBy"
import styled from "styled-components"

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
  font-size: 16px;
`

const Score = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-family: monospace;
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

const renderTeam: React.FC<{ team: FixtureTeamWithPicks; home?: boolean }> = (
  props
) => {
  const { team, home = false } = props
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
            return <div key={player.id} children={text} />
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
      {renderTeam({ team: fixture.home, home: true })}
      {renderTeam({ team: fixture.away })}
    </Row>
  )
}

const FixturePicks: React.FC<{}> = (props) => {
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
      console.log(pickedPlayers)
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
  console.log(fixturesWithPicks)
  return (
    <Section>
      {fixturesWithPicks.map((fixture) => {
        return renderFixture({ fixture })
      })}
    </Section>
  )
}

export default FixturePicks
