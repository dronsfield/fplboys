import React from "react"
import Section from "src/components/Section"
import Spacer from "src/components/Spacer"
import { useLeagueContext } from "src/LeagueContext"
import { formatName } from "src/util/formatName"

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
          const { totalPrize, managers, prizes } = pots[buyIn]
          return (
            <div key={buyIn}>
              <strong>£{buyIn} buy-in pot</strong>
              {lilSpacer}
              <div>Total prize: £{totalPrize}</div>
              {lilSpacer}
              <div>Managers ({managers.length}): </div>
              <div>
                {managers.map((manager) => formatName(manager.name)).join(", ")}
              </div>
              {lilSpacer}
              <div>
                Winners:
                {prizes?.map((prize, index) => {
                  return (
                    <div key={index}>
                      #{index + 1}: {formatName(prize.manager.name)}, £
                      {prize.value}
                    </div>
                  )
                })}
              </div>
              <Spacer height={20} />
            </div>
          )
        })}
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
                  {formatName(prize.manager.name)}, £{prize.value}
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
