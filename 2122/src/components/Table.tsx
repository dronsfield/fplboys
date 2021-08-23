import { capitalCase } from "change-case"
import React from "react"
import colors from "src/style/colors"
import { ItemsOf } from "src/util/utilityTypes"
import styled, { css } from "styled-components"

const _Table = styled.table.attrs({ cellSpacing: 0 })`
  width: 100%;

  border: 1px solid ${colors.border};
  background-color: white;
  border-radius: 5px;
`

const Row = styled.tr`
  th,
  td {
    border-bottom: 1px solid ${colors.border};
  }
  &:last-child {
    th,
    td {
      border-bottom: none;
    }
  }
`

const HeaderRow = styled(Row)``

type CellWidth = number | "hide" | "auto"
type CellWidths = [CellWidth] | [CellWidth, CellWidth]

interface CellProps {
  widths: CellWidths
}

function makeCellWidthStyle(cellWidth: CellWidth) {
  const widthValue =
    cellWidth === "hide" ? 0 : cellWidth === "auto" ? "auto" : cellWidth + "px"
  const style = `
    display: ${cellWidth === "hide" ? "none" : "table-cell"};
    width: ${widthValue};
    min-width: ${widthValue};
  `
  return style
}

const cellStyle = css<CellProps>`
  ${(p) => `
  ${makeCellWidthStyle(p.widths[0])}
  ${
    p.widths[1]
      ? `
  @media (min-width: 600px) {
    ${makeCellWidthStyle(p.widths[1])}
  }`
      : ""
  }
  `}
  box-sizing: content-box;
  padding: 8px 0;
  &:first-child {
    padding-left: 8px;
  }
  &:last-child {
    padding-right: 8px;
  }
`

const Cell = styled.td<CellProps>`
  ${cellStyle};
`

const HeaderCell = styled.th<CellProps & { onClick?: any }>`
  font-weight: bold;
  font-size: 10px;
  text-transform: uppercase;
  text-align: left;
  ${cellStyle};
`

interface TableProps<
  RowData extends object,
  Headers extends readonly string[]
> {
  data: RowData[]
  headers: Headers
  renderCell: (header: ItemsOf<Headers>, rowData: RowData) => React.ReactNode
  renderHeader?: (header: ItemsOf<Headers>) => React.ReactNode
  cellWidths: Record<ItemsOf<Headers>, CellWidths>
}

function Table<RowData extends object, Headers extends readonly string[]>(
  props: TableProps<RowData, Headers>
): React.ReactElement {
  const {
    data,
    headers,
    renderCell,
    renderHeader = capitalCase,
    cellWidths
  } = props
  return (
    <_Table>
      <HeaderRow>
        {headers.map((header: ItemsOf<Headers>) => {
          return (
            <HeaderCell
              children={renderHeader(header)}
              widths={cellWidths[header]}
            />
          )
        })}
      </HeaderRow>
      {data.map((rowData) => {
        return (
          <Row>
            {headers.map((header: ItemsOf<Headers>) => {
              return (
                <Cell
                  children={renderCell(header, rowData)}
                  widths={cellWidths[header]}
                />
              )
            })}
          </Row>
        )
      })}
    </_Table>
  )
}

Object.assign(Table, {
  Table: _Table,
  Row,
  HeaderRow,
  Cell,
  HeaderCell
})

export default Table
