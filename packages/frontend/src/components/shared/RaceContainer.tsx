import { FC, PropsWithChildren } from 'react'
import 'twin.macro'

export interface RaceContainerProps extends PropsWithChildren {}
export const RaceContainer: FC<RaceContainerProps> = ({ children }) => {
  return <div tw="rounded-lg border-2 border-base-content/10 px-6 py-4">{children}</div>
}
