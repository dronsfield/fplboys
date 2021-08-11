import React from "react"
import Section from "src/components/Section"
import { useLeagueContext } from "src/LeagueContext"
import colors from "src/style/colors"
import styled from "styled-components"

const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const Item = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border: 1px solid ${colors.border};
  padding: 9px 10px;
  border-top-width: 0;

  &:first-child {
    border-radius: 5px 5px 0 0;
    border-top-width: 1px;
  }
  &:last-child {
    border-radius: 0 0 5px 5px;
  }
`

const Header = styled(Item)`
  font-size: 10px;
  text-transform: uppercase;
`

const PlacementSpan = styled.span`
  display: inline-block;
  width: 30px;
  opacity: 0.5;
  font-weight: bold;
  font-style: italic;
`

const PlayerSpan = styled.span`
  flex: 1;
`

const MoneySpan = styled.span<{ color?: string }>`
  width: 60px;
  ${(p) =>
    p.color ? `color: ${p.color};` : ``}// border-left: 1px solid black;
`

function formatProfit(profit: number): { children: string; color?: string } {
  const absValue = Math.abs(profit)
  if (profit > 0) {
    return { children: `+£${absValue}`, color: "green" }
  } else if (profit === 0) {
    return { children: `±£0` }
  } else {
    return { children: `-£${absValue}`, color: "red" }
  }
}

const Table: React.FC<{}> = (props) => {
  const { ...foo } = props

  const {
    prizeCalculation: { players }
  } = useLeagueContext()
  // const prizesByPlayerId = React.useMemo(() => {
  //   const prizesByPlayerId: any = {}
  //   prizeCalculation.prizes.forEach((prize) => {
  //     prizesByPlayerId[prize.player.fplId] = prize.value
  //   })
  //   return prizesByPlayerId
  // }, [prizeCalculation])

  return (
    <Section>
      <List>
        <Header>
          <PlacementSpan children="#" />
          <PlayerSpan children="Name" />
          <MoneySpan children="Buy-in" />
          <MoneySpan children="Prize" />
          <MoneySpan children="Profit" />
        </Header>
        {players.map((player) => {
          return (
            <Item>
              <PlacementSpan children={`#${player.placement + 1}`} />
              <PlayerSpan children={player.name} />
              <MoneySpan children={`£${player.buyIn}`} />
              <MoneySpan
                children={`£${player.prizeValue}`}
                color={player.prizeValue ? undefined : "#bbb"}
              />
              <MoneySpan {...formatProfit(player.profit)} />
            </Item>
          )
        })}
      </List>
    </Section>
  )
}

export default Table
