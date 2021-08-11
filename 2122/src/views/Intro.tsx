import React from "react"
import Section from "src/components/Section"

const AUTO_JOIN_LINK =
  "https://fantasy.premierleague.com/leagues/auto-join/yhdg2q"
const MONZO_LINK = "https://monzo.me/joshuadronsfield"

const Intro: React.FC<{}> = (props) => {
  return (
    <Section>
      <h1>F P L B O Y S</h1>
      <p>
        Your favourite FPL mini-league is back! With a fancy new tiered buy-in
        system, allowing you to choose how much cash you want to put on the
        line.
      </p>
      <p>Buy-in options are: £5, £10, £20, or £40.</p>
      <p>
        It's semi-complicated so I've created this page to help demonstrate how
        the prize calculations work. The maths is similar to what happens when
        multiple people go all-in in poker with different amounts of money.
        Although it's slightly more complex because instead of winner-takes-all
        there's a prize distribution of 50%/30%/20% for 1st/2nd/3rd.
      </p>
      <p>
        Auto join link: <a href={AUTO_JOIN_LINK} children={AUTO_JOIN_LINK} />
      </p>
      <p>
        Payment link: <a href={MONZO_LINK} children={MONZO_LINK} />
      </p>
    </Section>
  )
}

export default Intro
