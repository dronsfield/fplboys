import React from "react"
import { Link } from "react-router-dom"
import appConfig from "src/appConfig"
import Section from "src/components/Section"
import colors from "src/style/colors"
import {
  blendColors,
  formatColor,
  parseColor,
  usefulColors
} from "src/util/blendColors"
import styled from "styled-components"

const AUTO_JOIN_LINK =
  "https://fantasy.premierleague.com/leagues/auto-join/yhdg2q"
const MONZO_LINK = "https://monzo.me/joshuadronsfield"
const VIEW_LEAGUE_LINK = `https://fantasy.premierleague.com/leagues/${appConfig.LEAGUE_ID}/standings/c`

const ExternalLinkButton = styled.a`
  font-weight: bold;
  padding: 5px 7px;
  margin: 2px 0;
  border-radius: 8px;
  color: white;
  text-decoration: none;
  background-color: ${colors.darkPurple};
  transition: 0.1s linear all;
  -webkit-tap-highlight-color: transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  display: inline-block;
  &:focus,
  &:hover {
    background-color: ${formatColor(
      blendColors(parseColor(colors.darkPurple), usefulColors.white, 0.2)
    )};
  }
`

const ExternalLink: React.FC<{ href: string; text: string }> = (props) => {
  const { href, text } = props
  const formattedText = `${text.toUpperCase()}: ${href.replace("https://", "")}`
  return (
    <ExternalLinkButton href={href} children={formattedText} target="_blank" />
  )
}

const Intro: React.FC<{}> = (props) => {
  return (
    <Section>
      <p>
        Your favourite FPL mini-league is back! This season we have a new tiered
        buy-in system, allowing you to choose how much cash you want to put on
        the line.
      </p>
      <p>Buy-in options are: £5, £10, £20, or £40.</p>
      <p>The prize distribution is: 50% for 1st, 30% for 2nd, 20% for 3rd.</p>
      <p>
        The prizes are calculated similarly to what happens when multiple people
        go all-in in poker. Buying in for less limits the amount you can win.
      </p>
      <p>
        To see the prize calculation breakdown in action visit the{" "}
        <Link to="/table">Table</Link> page.
      </p>
      <ExternalLink href={VIEW_LEAGUE_LINK} text="View league" />
      <ExternalLink href={AUTO_JOIN_LINK} text="Auto join" />
      <ExternalLink href={MONZO_LINK} text="Payment" />
    </Section>
  )
}

export default Intro
