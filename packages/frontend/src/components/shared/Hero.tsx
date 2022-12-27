import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'
import raceFlag from '../../../public/images/raceFlag.svg'

export const Hero: FC = () => {
  return (
    <div tw="flex flex-col items-center py-12">
      <Link href="/" tw="mb-2 flex flex-col items-center space-y-4" className="group">
        <Image src={raceFlag} alt="lensrace.xyz" />
        <h1 tw="font-extrabold text-4xl text-base-content transition-all -skew-x-[12deg] group-hover:-skew-x-[24deg]">
          lensrace.xyz
        </h1>
      </Link>
      <h2 tw="text-base-content/60">on-chain follower competitions on lens protocol</h2>
    </div>
  )
}
