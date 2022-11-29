import { ActiveRaces } from '@components/home/ActiveRaces'
import { CenterBody } from '@components/layout/CenterBody'
import { Hero } from '@components/shared/Hero'
import { raceData } from '@models/Race.model'
import type { NextPage } from 'next'
import Link from 'next/link'
import 'twin.macro'

const HomePage: NextPage = () => {
  return (
    <>
      <CenterBody>
        <Hero />
        {/* TODO: Refactor to @apply custom style btn css class or component */}
        <Link
          tw="btn btn-primary btn-wide rounded-full border-primary bg-primary font-mono text-white normal-case hover:(border-primary-focus bg-primary-focus)"
          href="/setup"
        >
          Start a new race
        </Link>
        <ActiveRaces races={raceData} />
      </CenterBody>
    </>
  )
}

export default HomePage
