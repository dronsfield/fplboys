import { Field, Form, Formik } from "formik"
import React from "react"
import Section from "src/components/Section"
import Spacer from "src/components/Spacer"
import { useLeagueContext } from "src/LeagueContext"
import colors from "src/style/colors"
import { normalizeButton } from "src/style/mixins"
import { BuyInManager } from "src/util/calculatePrizes"
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
  padding: 8px 8px;
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
  padding: 8px 8px;
`

const RankSpan = styled.span`
  display: inline-block;
  width: 30px;
  opacity: 0.5;
  font-weight: bold;
  font-style: italic;
`

const ManagerSpan = styled.span`
  flex: 1;
`

const MoneySpan = styled.span<{ color?: string }>`
  width: 55px;
  @media (min-width: 500px) {
    width: 65px;
  }
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

const RankModifiersContainer = styled.div`
  width: 32px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`
const RankModifierButton = styled.button`
  ${normalizeButton};
  font-size: 11px;
  margin-right: 2px;
  height: 16px;
`

const RankModifiers = (props: {
  modifierHandlers?: { up: () => void; down: () => void }
}) => {
  const { modifierHandlers } = props
  if (!modifierHandlers) return <RankModifiersContainer />
  return (
    <RankModifiersContainer>
      <RankModifierButton children="▲" onClick={modifierHandlers.up} />
      <RankModifierButton children="▼" onClick={modifierHandlers.down} />
    </RankModifiersContainer>
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
    prizeCalculation: { managers },
    setManagers
  } = useLeagueContext()

  const getModifierHandlers = (id: number) => {
    const getModifierHandler = (up?: boolean) => {
      return () => {
        setManagers((originalManagers) => {
          let managers = [...originalManagers]
          const matchingIndex = managers.findIndex(
            (manager) => manager.id === id
          )
          if (
            matchingIndex < 0 ||
            (up && matchingIndex === 0) ||
            (!up && matchingIndex >= managers.length - 1)
          ) {
            return originalManagers
          } else {
            const [matchingmanager] = managers.splice(matchingIndex, 1) // remove match from array
            const newIndex = matchingIndex + (up ? -1 : 1)
            managers.splice(newIndex, 0, matchingmanager) // add match in new position
            return managers.map((manager, index) => {
              return { ...manager, rank: index }
            })
          }
        })
      }
    }
    return { up: getModifierHandler(true), down: getModifierHandler(false) }
  }

  const addmanager = (manager: { name: string; buyIn: number }) => {
    let { name, buyIn } = manager
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
    const formattedmanager: BuyInManager = {
      name: name,
      buyIn: buyIn,
      id: Math.floor(Math.random() * 100000),
      rank: 0,
      teamName: name,
      totalPoints: 0,
      eventPoints: 0,
      picks: [],
      transfers: { in: [], out: [] }
    }
    setManagers((originalManagers) => {
      const managers = [...originalManagers]
      managers.splice(0, 0, formattedmanager)
      return managers.map((manager, index) => {
        return { ...manager, rank: index }
      })
    })
  }

  return (
    <Section>
      <div>
        You can change rank order and/or add people in to see what you could win
        with different buy-ins.
      </div>
      <div>
        This form isn't an actual submission to the league! It's just to play
        around and see how the prize system works.
      </div>
      <Spacer height={16} />
      <Formik
        initialValues={{ name: "", buyIn: undefined } as any}
        onSubmit={addmanager}
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
          <RankModifiers />
          <RankSpan children="" />
          <ManagerSpan children="Name" />
          <MoneySpan children="Buy-in" />
          <DesktopOnlyMoneySpan children="Prize" />
          <MoneySpan children="Profit" />
        </Header>
        {managers.map((manager) => {
          return (
            <Item key={manager.id}>
              <RankModifiers
                modifierHandlers={getModifierHandlers(manager.id)}
              />
              <RankSpan children={`#${manager.rank + 1}`} />
              <ManagerSpan children={manager.name} />
              <MoneySpan {...formatMoney(manager.buyIn)} />
              <DesktopOnlyMoneySpan {...formatMoney(manager.prizeValue)} />
              <MoneySpan {...formatMoney(manager.profit, true)} />
            </Item>
          )
        })}
      </List>
    </Section>
  )
}

export default Table
