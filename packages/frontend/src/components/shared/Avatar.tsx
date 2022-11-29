import Image from 'next/image'
import { FC } from 'react'
import 'twin.macro'

// TODO: Dennis to explain how to add size props and ring color props in best way
export interface AvatarProps {
  participant: {
    name: string
    avatar: string
  }
}
export const Avatar: FC<AvatarProps> = ({ participant }) => {
  return (
    <div
      data-tip="hello"
      key={participant.avatar}
      tw="tooltip w-16 rounded-full ring ring-offset-base-100 ring-offset-2 ring-[#4BC951]"
    >
      <Image src={participant.avatar} width={50} height={50} alt={participant.name} />
    </div>
  )
}
