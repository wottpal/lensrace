import { ActiveRaces } from '@components/home/ActiveRaces'
import { CenterBody } from '@components/layout/CenterBody'
import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { Hero } from '@components/shared/Hero'
import { raceData } from '@models/Race.model'
import type { NextPage } from 'next'
import 'twin.macro'

const HomePage: NextPage = () => {
  return (
    <>
      <CenterBody>
        <Hero />

        <BaseButtonGroup>
          <BaseButton href="/setup">Start new Race</BaseButton>
        </BaseButtonGroup>

        <ActiveRaces races={raceData} />
      </CenterBody>
    </>
  )
}

export default HomePage
