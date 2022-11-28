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
      {/* Heading and cards */}
      <h2 tw="pb-6 font-semibold text-xl italic">Active races</h2>
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
