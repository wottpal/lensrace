import { ActiveRaces } from '@components/home/ActiveRaces'
import { HomeLayout } from '@components/home/HomeLayout'
import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { raceData } from '@models/Race.model'
import type { NextPage } from 'next'
import 'twin.macro'

const HomePage: NextPage = () => {
  return (
    <>
      <HomeLayout>
        <BaseButtonGroup>
          <BaseButton href="/setup">Start new Race</BaseButton>
        </BaseButtonGroup>
        <ActiveRaces races={raceData} />
      </HomeLayout>
    </>
  )
}

export default HomePage
