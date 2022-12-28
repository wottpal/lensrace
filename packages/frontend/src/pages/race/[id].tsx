import { CenterBody } from '@components/layout/CenterBody'
import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { Hero } from '@components/shared/Hero'
import { TrophyIcon } from '@heroicons/react/20/solid'
import { ShareIcon } from '@heroicons/react/24/solid'
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import 'twin.macro'

const HomePage: NextPage = () => {
  return (
    <>
      <CenterBody>
        <Hero />
        {/* Button actions */}
        <BaseButtonGroup tw="mt-4">
          <BaseButton disabled={false} type="submit">
            <div tw="flex items-center space-x-4">
              <span>Share on Lens</span>
              <ShareIcon tw="h-5 w-5" />
            </div>
          </BaseButton>
          {/* TODO: Refactor tw into variant */}
          <BaseButton tw="bg-secondary text-secondary-content" disabled={false} type="submit">
            <div tw="flex items-center space-x-4">
              <span>Settle</span>
              <TrophyIcon tw="h-5 w-5" />
            </div>
          </BaseButton>
        </BaseButtonGroup>
        {/* Race details */}
        {/* Leaderboard */}
      </CenterBody>
    </>
  )
}

export default HomePage

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  return {
    props: {},
  }
}
