import dayjs from "dayjs"
import React from "react"
import Fixed from "src/components/Fixed"
import { Loader } from "src/components/Loader"
import Spacer from "src/components/Spacer"
import { useLeagueContext } from "src/LeagueContext"
import colors from "src/style/colors"
import styled from "styled-components"

const BasicContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 15px;
`

const BackgroundUpdateContainer = styled(Fixed).attrs({ height: "40px" })`
  background-color: white;
  bottom: 0;
  box-shadow: 0px -1px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: row;
  justify-conent: flex-start;
  align-items: center;
  font-size: 12px;
`

const Skeleton: React.FC<{}> = (props) => {
  const { children } = props
  let { isSuccess, isError, isFetching, dataUpdatedAt } = useLeagueContext()
  if (isSuccess) {
    if (isFetching) {
      let updatingText = "Updating..."
      if (dataUpdatedAt) {
        updatingText += ` Current data is from ${dayjs(
          new Date(dataUpdatedAt)
        ).fromNow()}`
      }
      return (
        <>
          {children}
          <BackgroundUpdateContainer>
            <Spacer width={8} />
            <div>
              <Loader size={12} />
            </div>
            <Spacer width={6} />
            <div children={updatingText} />
          </BackgroundUpdateContainer>
        </>
      )
    } else {
      return <>{children}</>
    }
  } else if (isError) {
    return (
      <BasicContainer>Something went wrong. Try refreshing.</BasicContainer>
    )
  } else {
    return (
      <BasicContainer>
        <Loader size={32} color={colors.darkPurple} />
      </BasicContainer>
    )
  }
}

export default Skeleton
