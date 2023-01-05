import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'

export interface RaceCTAProps {
  label: string
  link: string
  icon: JSX.Element
}
export const RaceCTA: FC<RaceCTAProps> = ({ label, link, icon }) => {
  return (
    <Link href={link}>
      <span tw="flex items-center font-semibold text-primary hover:text-primary-focus">
        {label} {icon}
      </span>
    </Link>
  )
}
