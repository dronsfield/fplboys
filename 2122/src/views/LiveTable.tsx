import React from "react"
import { ManagerCell, MoneyCell } from "src/components/CommonCells"
import Section from "src/components/Section"
import Table from "src/components/Table"
import { useLeagueContext } from "src/LeagueContext"
import { normalizeButton } from "src/style/mixins"
import styled from "styled-components"
import Skeleton from "./Skeleton"

const RankSpan = styled.span`
  opacity: 0.5;
  font-weight: bold;
  font-style: italic;
`

const ManagerLink = styled.a`
  text-decoration: none;
`

const MoneySpan = styled.span<{ color?: string }>`
  ${(p) => (p.color ? `color: ${p.color};` : ``)}
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

const headers = [
  "modifiers",
  "rank",
  "name",
  "points",
  "buyIn",
  "prizeValue",
  "profit"
] as const

const LiveTable: React.FC<{}> = (props) => {
  const { managers, currentEventId, setManagers } = useLeagueContext()

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

  return (
    <Skeleton>
      <Section>
        <Table
          data={managers}
          headers={headers}
          renderHeader={(header) => {
            switch (header) {
              case "modifiers":
                return null
              case "rank":
                return null
              case "name":
                return "Name"
              case "points":
                return "Points"
              case "buyIn":
                return "Buy-in"
              case "prizeValue":
                return "Prize"
              case "profit":
                return "Profit"
            }
          }}
          renderCell={(header, manager) => {
            switch (header) {
              case "modifiers":
                return (
                  <RankModifiers
                    modifierHandlers={getModifierHandlers(manager.id)}
                  />
                )
              case "rank":
                return <RankSpan children={`#${manager.rank}`} />
              case "name":
                return (
                  <ManagerCell
                    manager={manager}
                    currentEventId={currentEventId}
                  />
                )
              case "points":
                return manager.totalPoints
              case "buyIn":
                return <MoneyCell value={manager.buyIn} />
              case "prizeValue":
                return <MoneyCell value={manager.prizeValue} />
              case "profit":
                return <MoneyCell value={manager.prizeValue} showProfit />
            }
          }}
          cellWidths={{
            modifiers: [22],
            rank: [28],
            name: ["auto"],
            points: [40, 50],
            buyIn: [40, 50],
            prizeValue: ["hide", 70],
            profit: [55, 70]
          }}
        />
      </Section>
    </Skeleton>
  )
}

export default LiveTable
