import Image from 'next/image'
import { FC } from 'react'
import 'twin.macro'
import raceFlag from '../../../public/images/raceFlag.svg'

export const Hero: FC = () => {
  return (
    <div tw="flex flex-col items-center space-y-4 py-12">
      <Image src={raceFlag} alt="lensrace.xyz" />
      <h1 tw="font-bold font-mono text-4xl text-base-content">lensrace.xyz</h1>
      <h2 tw="text-base-content/70">on-chain follower competitions on lens protocol</h2>
    </div>
  )
}