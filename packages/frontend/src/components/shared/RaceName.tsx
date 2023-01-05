import { FC } from 'react'
import 'twin.macro'
import { Indicator } from './Indicator'

export interface RaceNameProps {
  name: string
}
export const RaceName: FC<RaceNameProps> = ({ name }) => {
  return (
    <div tw="flex items-center justify-between space-x-1">
      <h3 tw="font-bold text-xl">{name}</h3>
      <Indicator />
    </div>
  )
}
