import { Link } from "gatsby"
import React from "react"
import styled from "styled-components"
import { fonts, mobileMq, rem } from "../misc"
import { GlobalStyle } from "../misc/globalStyle"

const Header = styled.header`
  margin-bottom: ${rem(2.5)};
`

const Heading = styled.h1<{ isRoot: boolean }>`
  font-family: ${fonts.sans};
  font-size: ${props => rem(props.isRoot ? 2.2 : 1.5)};
  ${mobileMq} {
    font-size: ${rem(1.5)};
  }

  & > div:last-child {
    font-size: 1.6em;
    @media (max-width: 390px) {
      font-size: ${rem(2)};
    }
  }
`

const GlobalWrapper = styled.div`
  margin: 0 auto;
  max-width: 660px;
  padding: ${rem(6)} ${rem(3)};
  ${mobileMq} {
    padding: ${rem(2.5)} ${rem(1.4)};
  }
`

const TheHeading: React.FC<{ isRoot: boolean }> = props => {
  const { isRoot } = props
  return (
    <Header>
      <Link to="/blog">
        <Heading isRoot={isRoot}>
          <div>F P L B O Y S</div>
          <div>Gameweek Reports</div>
        </Heading>
      </Link>
    </Header>
  )
}

const Layout = ({ location, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`

  const heading = <TheHeading isRoot={location.pathname === rootPath} />

  return (
    <GlobalWrapper>
      <GlobalStyle />
      {heading}
      <main>{children}</main>
      {/* <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer> */}
    </GlobalWrapper>
  )
}

export default Layout
