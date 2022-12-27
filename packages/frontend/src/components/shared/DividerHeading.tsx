import { FC } from 'react'
import 'twin.macro'

export interface DividerHeadingProps {
  title: string
}
export const DividerHeading: FC<DividerHeadingProps> = ({ title }) => {
  return <div tw="divider pb-6 pt-14 font-mono font-semibold text-lg">{title}</div>
}
