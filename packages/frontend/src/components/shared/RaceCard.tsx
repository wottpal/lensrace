import { FC, PropsWithChildren } from 'react'
import 'twin.macro'
import { RaceContainer } from './RaceContainer'
import { RaceCTA } from './RaceCTA'
import { RaceName } from './RaceName'

export interface RaceCardProps extends PropsWithChildren {
  name: string
  link: string
  label: string
  icon: JSX.Element
}
export const RaceCard: FC<RaceCardProps> = ({ children, name, label, link, icon }) => {
  return (
    <RaceContainer>
      {/* Header */}
      <div tw="flex justify-between">
        <RaceName name={name} />
        <RaceCTA link={link} label="Details" icon={icon} />
      </div>
      <div tw="py-4">{children}</div>
    </RaceContainer>
  )
}
