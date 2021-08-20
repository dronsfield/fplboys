import React from "react"
import { Loader } from "src/components/Loader"
import { useLeagueContext } from "src/LeagueContext"
import styled from "styled-components"

const Container = styled.div`
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translate(-50%, 0);
`

const Skeleton: React.FC<{}> = (props) => {
  const { children } = props
  const { isSuccess, isError } = useLeagueContext()
  if (isSuccess) {
    return <>{children}</>
  } else if (isError) {
    return <Container>Something went wrong</Container>
  } else {
    return (
      <Container>
        <Loader />
      </Container>
    )
  }
}

export default Skeleton
