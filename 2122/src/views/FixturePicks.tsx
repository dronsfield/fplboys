import React from "react"
import Section from "src/components/Section"
import Spacer from "src/components/Spacer"
import { useLeagueContext } from "src/LeagueContext"
import { Fixture, FixtureTeam } from "src/services/api"
import styled from "styled-components"

const Row = styled.div<{ flexEnd?: boolean }>`
  display: flex;
  flex-direction: ${(p) => (p.flexEnd ? "row-reverse" : "row")};
  // justify-content: ${(p) => (p.flexEnd ? "flex-end" : "flex-start")};
`

const TeamContainer = styled.div`
  flex: 1;
  padding: 5px;
`

const TeamFirstRow = styled(Row)`
  align-items: center;
`

const TeamName = styled.div``

const Score = styled.div`
  font-size: 20px;
  font-weight: bold;
  font-family: monospace;
`

const renderTeam: React.FC<{ team: FixtureTeam; home?: boolean }> = (props) => {
  const { team, home = false } = props
  return (
    <TeamContainer>
      <TeamFirstRow flexEnd={home}>
        <Score children={team.score} />
        <Spacer width={10} />
        <TeamName children={team.team.name} />
      </TeamFirstRow>
    </TeamContainer>
  )
}

const renderFixture: React.FC<{ fixture: Fixture }> = (props) => {
  const { fixture } = props
  return (
    <Row>
      {renderTeam({ team: fixture.home, home: true })}
      {renderTeam({ team: fixture.away })}
    </Row>
  )
}

const FixturePicks: React.FC<{}> = (props) => {
  const { fixtures } = useLeagueContext()
  return (
    <Section>
      {fixtures.map((fixture) => {
        return renderFixture({ fixture })
      })}
    </Section>
  )
}

export default FixturePicks
