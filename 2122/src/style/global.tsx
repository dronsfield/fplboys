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
    font-family: sans-serif;
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
`

export default GlobalStyle
