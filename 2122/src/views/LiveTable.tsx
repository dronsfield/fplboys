import React from "react"
import Section from "src/components/Section"
import { useLeagueContext } from "src/LeagueContext"
import colors from "src/style/colors"
import { normalizeButton } from "src/style/mixins"
import { formatName } from "src/util/formatName"
import styled from "styled-components"

const List = styled.ol`
  margin: 0 -0px;
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

const PointsSpan = styled.span`
  width: 50px;
  @media (min-width: 600px) {
    width: 60px;
  }
`

const RankSpan = styled.span`
  display: inline-block;
  width: 36px;
  opacity: 0.5;
  font-weight: bold;
  font-style: italic;
`

const ManagerSpan = styled.a`
  flex: 1;
  text-decoration: none;
`

const MoneySpan = styled(PointsSpan)<{ color?: string }>`
  ${(p) => (p.color ? `color: ${p.color};` : ``)}
`

const ProfitSpan = styled(MoneySpan)`
  width: 60px;
  @media (min-width: 600px) {
    width: 75px;
  }
`

const DesktopOnlyMoneySpan = styled(MoneySpan)`
  @media (max-width: 599px) {
    display: none;
  }
  @media (min-width: 600px) {
    width: 75px;
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
  width: 30px;
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

const Table: React.FC<{}> = (props) => {
  const {
    prizeCalculation: { managers },
    setManagers,
    currentEventId
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
              return { ...manager, rank: index + 1 }
            })
          }
        })
      }
    }
    return { up: getModifierHandler(true), down: getModifierHandler(false) }
  }

  if (managers && managers.length) {
    return (
      <Section>
        <List>
          <Header>
            <RankModifiers />
            <RankSpan children="" />
            <ManagerSpan children="Name" />
            <PointsSpan children="Points" />
            <MoneySpan children="Buy-in" />
            <DesktopOnlyMoneySpan children="Prize" />
            <ProfitSpan children="Profit" />
          </Header>
          {managers.map((manager) => {
            return (
              <Item key={manager.id}>
                <RankModifiers
                  modifierHandlers={getModifierHandlers(manager.id)}
                />
                <RankSpan children={`#${manager.rank}`} />
                <ManagerSpan
                  children={formatName(manager.name)}
                  href={`https://fantasy.premierleague.com/entry/${manager.id}/event/${currentEventId}`}
                />
                <PointsSpan children={manager.totalPoints} />
                <MoneySpan {...formatMoney(manager.buyIn)} />
                <DesktopOnlyMoneySpan {...formatMoney(manager.prizeValue)} />
                <ProfitSpan {...formatMoney(manager.profit, true)} />
              </Item>
            )
          })}
        </List>
      </Section>
    )
    // } else if (isLoading) {
    //   return <Section children="Loading" />
    // } else if (error) {
    //   return <Section children="Error" />
  } else {
    return null
  }
}

export default Table
