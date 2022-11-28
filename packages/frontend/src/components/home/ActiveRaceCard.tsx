import { ArrowRightCircleIcon } from '@heroicons/react/24/solid'
import { Race } from '@models/Race.model'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'

export interface ActiveRaceCardProps {
  race: Race
}
export const ActiveRaceCard: FC<ActiveRaceCardProps> = ({ race }) => {
  return (
    <div tw="rounded-lg border-2 border-base-content/20 p-6 w-[430px]">
      <div tw="flex justify-between">
        <h3 tw="font-bold text-xl">{race.name}</h3>
        <Link
          tw="flex items-center font-semibold text-primary hover:text-primary-focus"
          href={`/race/${race.id}`}
        >
          Details <ArrowRightCircleIcon tw="ml-2 h-6 w-6" />
        </Link>
      </div>
      <p tw="pt-2 font-mono text-sm">
        First to reach <span tw="font-bold">{race.followerGoal.toLocaleString()} followers</span>.
      </p>
      {/* Avatar Group */}
      <div tw="flex flex-col items-center pt-4">
        <div tw="avatar avatar-group -space-x-3 p-2">
          {race.participants.map((participant) => (
            <div
              key={participant.avatar}
              tw="w-16 rounded-full ring ring-offset-base-100 ring-offset-2 ring-[#4BC951]"
            >
              <Image src={participant.avatar} width={50} height={50} alt={participant.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
