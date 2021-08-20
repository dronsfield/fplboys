import { createGlobalStyle } from "styled-components"
import colors from "./colors"

export const GlobalStyle = createGlobalStyle`
  *, *:before, *:after {
    box-sizing: border-box;
  }

  html {
    height: 100%;
  }

  body {
    overflow-y: scroll;
    height: 100%;
    color: ${colors.text};
    font-family: IBM Plex Sans, sans-serif;
    font-size: 13px;
    @media (min-width: 500px) {
      font-size: 15px;
    }
  }

  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  a {
    color: currentColor;
  }

  img, svg {
    vertical-align: bottom;
  }

  p, h1, h2, h3, h4, h5 {
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
`

export default GlobalStyle
