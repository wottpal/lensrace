import { Avatar } from '@components/shared/Avatar'
import { Indicator } from '@components/shared/Indicator'
import { ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import { Race } from '@models/Race.model'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'

export interface ActiveRaceCardProps {
  race: Race
}
export const ActiveRaceCard: FC<ActiveRaceCardProps> = ({ race }) => {
  return (
    <div tw="rounded-lg border-2 border-base-content/10 px-6 py-4">
      {/* Header */}
      <div tw="flex justify-between">
        <div tw="flex items-center justify-between space-x-1">
          <h3 tw="font-bold text-xl">{race.name}</h3>
          <Indicator />
        </div>

        <Link
          tw="flex items-center font-semibold text-primary hover:text-primary-focus"
          href={`/race/${race.id}`}
        >
          Details <ArrowRightCircleIcon tw="ml-2 h-6 w-6" />
        </Link>
      </div>

      {/* Race Details */}
      <p tw="pt-2 font-mono text-sm">
        First to reach <span tw="font-bold">{race.followerGoal.toLocaleString()} followers</span>.
      </p>

      {/* Avatar Group */}
      <div tw="mt-6 flex flex-col items-center">
        <div tw="avatar avatar-group -space-x-3 p-2">
          {race.participants.map((participant) => (
            <Avatar key={participant.name} participant={participant} />
          ))}
        </div>
      </div>
    </div>
  )
}
