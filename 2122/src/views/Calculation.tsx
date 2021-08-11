import React from "react"
import Section from "src/components/Section"
import Spacer from "src/components/Spacer"
import { useLeagueContext } from "src/LeagueContext"

const lilSpacer = <Spacer height={5} />

const Calculation: React.FC<{}> = (props) => {
  const {
    prizeCalculation: { buyIns, totalPrize, prizes, pots }
  } = useLeagueContext()

  return (
    <Section>
      <h3>Prize calculation breakdown:</h3>
      {lilSpacer}
      <div>
        {buyIns.map((buyIn) => {
          const { totalPrize, players, prizes } = pots[buyIn]
          return (
            <div key={buyIn}>
              <strong>£{buyIn} buy-in pot</strong>
              {lilSpacer}
              <div>Total prize: £{totalPrize}</div>
              {lilSpacer}
              <div>
                Players ({players.length}):{" "}
                {players.map((player) => player.name).join(", ")}
              </div>
              {lilSpacer}
              <div>
                Winners:
                {prizes?.map((prize, index) => {
                  return (
                    <div key={index}>
                      #{index + 1}: {prize.player.name}, £{prize.value}
                    </div>
                  )
                })}
              </div>
              <Spacer height={20} />
            </div>
          )
        })}
        <hr />
        <Spacer height={20} />
        <div>
          <strong>Overall</strong>
          {lilSpacer}
          <div>Total prize: £{totalPrize}</div>
          {lilSpacer}
          <div>
            Winners:
            {prizes?.map((prize, index) => {
              return (
                <div key={index}>
                  {prize.player.name}, £{prize.value}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Section>
  )
}

export default Calculation
