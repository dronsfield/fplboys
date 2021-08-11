import React from "react"
import Section from "src/components/Section"
import { useLeagueContext } from "src/LeagueContext"
import colors from "src/style/colors"
import { normalizeButton } from "src/style/mixins"
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
  padding: 2px 5px;
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
  padding: 9px 5px;
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

const DesktopOnlyMoneySpan = styled(MoneySpan)`
  @media (max-width: 400px) {
    display: none;
  }
`

function formatProfit(profit: number): { children: string; color?: string } {
  const absValue = Math.abs(profit)
  if (profit > 0) {
    return { children: `+£${absValue}`, color: "green" }
  } else if (profit === 0) {
    return { children: `±£0` }
  } else {
    return { children: `-£${absValue}`, color: "#bbb" }
  }
}

const PlacementModifiersContainer = styled.div`
  width: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`
const PlacementModifierButton = styled.button`
  ${normalizeButton};
  width: 100%;
  font-size: 8px;
  height: 16px;
`

const PlacementModifiers = (props: {
  modifierHandlers?: { up: () => void; down: () => void }
}) => {
  const { modifierHandlers } = props
  if (!modifierHandlers) return <PlacementModifiersContainer />
  return (
    <PlacementModifiersContainer>
      <PlacementModifierButton children="▲" onClick={modifierHandlers.up} />
      <PlacementModifierButton children="▼" onClick={modifierHandlers.down} />
    </PlacementModifiersContainer>
  )
}

const Table: React.FC<{}> = (props) => {
  const { ...foo } = props

  const {
    prizeCalculation: { players },
    setPlayers
  } = useLeagueContext()

  const getModifierHandlers = (fplId: string) => {
    const getModifierHandler = (up?: boolean) => {
      return () => {
        setPlayers((originalPlayers) => {
          let players = [...originalPlayers]
          const matchingIndex = players.findIndex(
            (player) => player.fplId === fplId
          )
          if (
            matchingIndex < 0 ||
            (up && matchingIndex === 0) ||
            (!up && matchingIndex >= players.length - 1)
          ) {
            return originalPlayers
          } else {
            const [matchingPlayer] = players.splice(matchingIndex, 1) // remove match from array
            const newIndex = matchingIndex + (up ? -1 : 1)
            players.splice(newIndex, 0, matchingPlayer) // add match in new position
            return players.map((player, index) => {
              return { ...player, placement: index }
            })
          }
        })
      }
    }
    return { up: getModifierHandler(true), down: getModifierHandler(false) }
  }

  return (
    <Section>
      <List>
        <Header>
          <PlacementModifiers />
          <PlacementSpan children="" />
          <PlayerSpan children="Name" />
          <MoneySpan children="Buy-in" />
          <DesktopOnlyMoneySpan children="Prize" />
          <MoneySpan children="Profit" />
        </Header>
        {players.map((player) => {
          return (
            <Item>
              <PlacementModifiers
                modifierHandlers={getModifierHandlers(player.fplId)}
              />
              <PlacementSpan children={`#${player.placement + 1}`} />
              <PlayerSpan children={player.name} />
              <MoneySpan children={`£${player.buyIn}`} />
              <DesktopOnlyMoneySpan
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
