import { DividerHeading } from '@components/shared/DividerHeading'
import { Race } from '@models/Race.model'
import { FC } from 'react'
import 'twin.macro'
import { ActiveRaceCard } from './ActiveRaceCard'

export interface ActiveRacesProps {
  races: Race[]
}
export const ActiveRaces: FC<ActiveRacesProps> = ({ races }) => {
  return (
    <div tw="flex flex-col items-center">
      <DividerHeading title="All active races" />
      <div tw="flex w-full flex-col space-y-6">
        {races.map((race) => (
          <ActiveRaceCard key={race?.id} race={race} />
        ))}
      </div>
    </div>
  )
}
