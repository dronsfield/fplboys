import { createGlobalStyle } from "styled-components"
import { fonts, rem } from "."

export const GlobalStyle = createGlobalStyle`
  *,
  :after,
  :before {
    box-sizing: border-box;
  }

  html {
    font-size: ${rem(1)};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${fonts.sans};
    color: #2e353f;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    line-height: 1.1;
  }


  p {
    line-height: 1.65;
    --baseline-multiplier: 0.179;
    --x-height-multiplier: 0.35;
    font-family: ${fonts.serif};
    margin-top: 0;
    margin-bottom: ${rem(1.3)};
  }

  a {
    color: var(--color-primary);
  }

  a,
  a:hover,
  a:focus {
    text-decoration: none;
  }

  ol, ul {
      margin: 0;
      padding: 0;
  }
`
