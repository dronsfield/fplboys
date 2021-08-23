import React from "react"
import { Manager } from "src/services/api"
import { formatName } from "src/util/formatName"
import styled from "styled-components"

// MONEY

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

export const MoneyCell: React.FC<{ showProfit?: boolean; value: number }> = (
  props
) => {
  const { showProfit, value } = props
  return <MoneySpan {...formatMoney(value, showProfit)} />
}

// MANAGER

const ManagerLink = styled.a`
  text-decoration: none;
`

export const ManagerCell: React.FC<{
  manager: Manager
  currentEventId: number
}> = (props) => {
  const { manager, currentEventId } = props
  return (
    <ManagerLink
      children={formatName(manager.name)}
      href={`https://fantasy.premierleague.com/entry/${manager.id}/event/${currentEventId}`}
    />
  )
}
