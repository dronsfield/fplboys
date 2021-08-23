import React from "react"
import styled from "styled-components"

interface SizeProps {
  height: string
}

const SizedDiv = styled.div<SizeProps>`
  width: 100%;
  height: ${(p) => p.height};
  flex-shrink: 0;
`

const FixedDiv = styled(SizedDiv)`
  position: fixed;
`

const StaticDiv = styled(SizedDiv)`
  position: static;
  opacity: 0;
`

const Fixed: React.FC<SizeProps & { className?: string }> = (props) => {
  const { className, ...sizeProps } = props
  return (
    <>
      <StaticDiv {...sizeProps} />
      <FixedDiv {...sizeProps} className={className} />
    </>
  )
}

export default Fixed
