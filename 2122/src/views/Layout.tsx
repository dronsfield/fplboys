import React from "react"
import { NavLink } from "react-router-dom"
import Spacer from "src/components/Spacer"
import colors from "src/style/colors"
import styled from "styled-components"

const Header = styled.nav`
  width: 100%;
  background-color: ${colors.purple};
  padding: 10px 0 6px;
`

const Banner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  line-height: 1;
  color: white;
  margin: 0;
`

const NavButtons = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
`

const CustomLink = (props: any) => (
  <NavLink {...props} activeClassName="active" exact />
)

const NavButton = styled(CustomLink)`
  font-weight: bold;
  text-transform: uppercase;
  padding: 4px 6px;
  border-radius: 4px;
  margin: 3px 3px;
  color: white;
  text-decoration: none;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.1s linear all;
  -webkit-tap-highlight-color: transparent;

  &.active {
    background-color: white;
    color: ${colors.purple};
  }

  &:focus {
    background-color: rgba(255, 255, 255, 0.4);
  }
  &.active:focus {
    background-color: white;
  }
`

const Layout: React.FC<{}> = (props) => {
  const { children } = props

  return (
    <>
      <Header>
        <Banner>
          <Title children="F P L B O Y S" />
        </Banner>
        <Spacer height={5} />
        <NavButtons>
          <NavButton children="Info" to="/" />
          <NavButton children="Prizes" to="/table" />
          <NavButton children="Fixtures" to="/fixtures" />
          <NavButton children="Captains" to="/captains" />
          <NavButton children="Chips" to="/chips" />
        </NavButtons>
        <NavButtons>
          <NavButton children="Transfers" to="/transfers" />
          <NavButton children="Played" to="/played" />
          <NavButton children="Template" to="/template" />
          <NavButton children="Value" to="/value" />
        </NavButtons>
      </Header>
      {children}
    </>
  )
}

export default Layout
