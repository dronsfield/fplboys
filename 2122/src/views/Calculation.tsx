import React from "react"
import Section from "src/components/Section"
import Spacer from "src/components/Spacer"
import { useLeagueContext } from "src/LeagueContext"

const lilSpacer = <Spacer height={5} />

const Calculation: React.FC<{}> = (props) => {
  const { ...foo } = props

  const {
    prizeCalculation: { buyIns, totalPrize, prizes, pots }
  } = useLeagueContext()

  return (
    <Section>
      <div>
        {buyIns.map((buyIn) => {
          const { totalPrize, players, prizes } = pots[buyIn]
          return (
            <div>
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
                    <div>
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
          <div>Total prize: £{totalPrize}</div>
          {lilSpacer}
          <div>
            Winners:
            {prizes?.map((prize, index) => {
              return (
                <div>
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
