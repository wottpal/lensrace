import { FC } from 'react'
import 'twin.macro'

export interface DividerHeadingProps {
  title: string
}
export const DividerHeading: FC<DividerHeadingProps> = ({ title }) => {
  return <div tw="divider py-6 font-mono font-semibold">{title}</div>
}
