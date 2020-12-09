import { Link } from "gatsby"
import React from "react"
import styled from "styled-components"
import fonts from "../misc/fonts"

const Header = styled.header`
  margin-bottom: 50px;
`

const Heading = styled.h1<{ baseSize: number }>`
  font-family: ${fonts.sans};
  font-size: ${props => props.baseSize}px;

  & > div:first-child {
    font-size: 1em;
  }

  & > div:last-child {
    font-size: 1.6em;
  }
`

const TheHeading: React.FC<{ isRoot: boolean }> = props => {
  return (
    <Header>
      <Link to="/">
        <Heading baseSize={props.isRoot ? 40 : 24}>
          <div>F P L B O Y S</div>
          <div>Gameweek Reports</div>
        </Heading>
      </Link>
    </Header>
  )
}

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <Link to="/">
        <Heading baseSize={40}>
          <div>F P L B O Y S</div>
          <div>Gameweek Reports</div>
        </Heading>
      </Link>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        {title}
      </Link>
    )
  }

  const heading = <TheHeading isRoot={location.pathname === rootPath} />

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      {heading}
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
