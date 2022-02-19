import React from "react"
import { Manager } from "src/services/api"
import colors from "src/style/colors"
import { formatName } from "src/util/formatName"
import styled from "styled-components"

// MONEY

const MoneySpan = styled.span<{ color?: string }>`
  ${(p) => (p.color ? `color: ${p.color};` : ``)}
`

function formatMoney(
  value: number,
  opts?: { showSign?: boolean; showColor?: boolean }
): { children: string; color?: string } {
  const { showSign, showColor } = opts || {}
  const absValue = Math.abs(value)
  const absText = Number.isInteger(absValue)
    ? absValue.toFixed(0)
    : absValue.toFixed(2)
  if (value > 0) {
    const prefix = showSign ? "+" : ""
    return {
      children: `${prefix}£${absText}`,
      color: showColor ? colors.green : undefined
    }
  } else if (value === 0) {
    const prefix = showSign ? "±" : ""
    return { children: `${prefix}£${absText}`, color: colors.grey }
  } else {
    return { children: `-£${absText}`, color: colors.grey }
  }
}

export const MoneyCell: React.FC<{
  showSign?: boolean
  showColor?: boolean
  value: number
}> = (props) => {
  const { showSign, showColor, value } = props
  return <MoneySpan {...formatMoney(value, { showSign, showColor })} />
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
