import { Avatar } from '@components/shared/Avatar'
import { DividerHeading } from '@components/shared/DividerHeading'
import { RaceCard } from '@components/shared/RaceCard'
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline'
import { Race } from '@models/Race.model'
import { FC } from 'react'
import 'twin.macro'

export interface ActiveRacesProps {
  races: Race[]
}
export const ActiveRaces: FC<ActiveRacesProps> = ({ races }) => {
  return (
    <div tw="flex flex-col items-center">
      <DividerHeading title="All active races" />
      <div tw="flex w-full flex-col space-y-6">
        {races.map((race) => (
          <RaceCard
            key={race?.id}
            name={race?.name}
            link={`/race/${race.id}`}
            label="Details"
            icon={<ArrowRightCircleIcon tw="ml-2 h-5 w-5" />}
          >
            {/* Race Details */}
            <p tw="font-mono text-sm">
              First to reach{' '}
              <span tw="font-bold">{race.followerGoal.toLocaleString()} followers</span>.
            </p>

            {/* Avatar Group */}
            <div tw="mt-6 flex flex-col items-center">
              <div tw="avatar avatar-group -space-x-3 p-2">
                {race.participants.map((participant) => (
                  <Avatar key={participant.name} participant={participant} />
                ))}
              </div>
            </div>
          </RaceCard>
        ))}
      </div>
    </div>
  )
}
