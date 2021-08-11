import { Field, Form, Formik } from "formik"
import React from "react"
import Section from "src/components/Section"
import Spacer from "src/components/Spacer"
import { useLeagueContext } from "src/LeagueContext"
import colors from "src/style/colors"
import { normalizeButton } from "src/style/mixins"
import { Player } from "src/util/calculatePrizes"
import { randomKey } from "src/util/randomKey"
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

function formatMoney(
  value: number,
  showsProfit?: boolean
): { children: string; color?: string } {
  const absValue = Math.abs(value)
  const absText = Number.isInteger(absValue)
    ? absValue.toFixed(0)
    : absValue.toFixed(2)
  if (value > 0) {
    const prefix = showsProfit ? "+" : ""
    return {
      children: `${prefix}£${absText}`,
      color: showsProfit ? "green" : undefined
    }
  } else if (value === 0) {
    const prefix = showsProfit ? "±" : ""
    return { children: `${prefix}£${absText}`, color: "#bbb" }
  } else {
    return { children: `-£${absText}`, color: "#bbb" }
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

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: row;

  & input {
    min-width: 0;
  }
`

const Table: React.FC<{}> = (props) => {
  const {
    prizeCalculation: { players, buyIns },
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

  const addPlayer = (player: { name: string; buyIn: number }) => {
    let { name, buyIn } = player
    buyIn = Number(buyIn)
    if (typeof name !== "string" || name.length < 1) {
      window.alert("Invalid name")
      return
    }
    if (
      !buyIn ||
      typeof buyIn !== "number" ||
      ![5, 10, 20, 40].includes(buyIn)
    ) {
      window.alert("Invalid buy-in")
      return
    }
    const formattedPlayer: Player = {
      name: name,
      buyIn: buyIn,
      fplId: randomKey() + name,
      placement: 0
    }
    setPlayers((originalPlayers) => {
      const players = [...originalPlayers]
      players.splice(0, 0, formattedPlayer)
      return players.map((player, index) => {
        return { ...player, placement: index }
      })
    })
  }

  return (
    <Section>
      <div>
        Add yourself in and/or change placement order to see what you could win
        with different buy-ins.
      </div>
      <div>
        NB: The league is likely to expand to be a lot bigger than this before
        the season starts.
      </div>
      <Spacer height={16} />
      <Formik
        initialValues={{ name: "", buyIn: undefined } as any}
        onSubmit={addPlayer}
      >
        <StyledForm>
          <Field type="text" placeholder="Name" name="name" />
          <Field type="number" placeholder="£ Buy-in" name="buyIn" />
          <button type="submit" children="Add" />
        </StyledForm>
      </Formik>
      <Spacer height={16} />
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
            <Item key={player.fplId}>
              <PlacementModifiers
                modifierHandlers={getModifierHandlers(player.fplId)}
              />
              <PlacementSpan children={`#${player.placement + 1}`} />
              <PlayerSpan children={player.name} />
              <MoneySpan {...formatMoney(player.buyIn)} />
              <DesktopOnlyMoneySpan {...formatMoney(player.prizeValue)} />
              <MoneySpan {...formatMoney(player.profit, true)} />
            </Item>
          )
        })}
      </List>
    </Section>
  )
}

export default Table
