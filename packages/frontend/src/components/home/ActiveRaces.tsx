import { Race } from '@models/Race.model'
import { FC } from 'react'
import 'twin.macro'
import { ActiveRaceCard } from './ActiveRaceCard'

export interface ActiveRacesProps {
  races: Race[]
}
export const ActiveRaces: FC<ActiveRacesProps> = ({ races }) => {
  return (
    <div tw="flex flex-col items-center pb-12">
      <div tw="divider pb-6 pt-12 font-mono font-semibold">All active Races</div>
      <div>
        <li tw="list-none space-y-4">
          {races.map((race) => (
            <ActiveRaceCard key={race?.id} race={race} />
          ))}
        </li>
      </div>
    </div>
  )
}
