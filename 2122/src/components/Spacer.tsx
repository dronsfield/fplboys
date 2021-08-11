import styled from "styled-components"

interface SpacerProps {
  height?: number
  width?: number
  shrink?: boolean
  inline?: boolean
}

const Spacer = styled.div<SpacerProps>`
  flex-shrink: ${(props) => Number(Boolean(props.shrink))};
  ${(props) =>
    props.shrink
      ? `
  min-height: 0;
  min-width: 0;`
      : ``}
  ${(props) => (props.inline ? `display: inline-block;` : ``)}
  ${(props) => (props.width ? `width: ${props.width}px` : ``)}
  ${(props) => (props.height ? `height: ${props.height}px` : ``)}
`

export default Spacer
