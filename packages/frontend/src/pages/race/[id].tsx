import { HomeLayout } from '@components/home/HomeLayout'
import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { RaceCard } from '@components/shared/RaceCard'
import { TrophyIcon } from '@heroicons/react/20/solid'
import { ArrowTopRightOnSquareIcon, ShareIcon } from '@heroicons/react/24/solid'
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import 'twin.macro'

const HomePage: NextPage = () => {
  return (
    <>
      <HomeLayout>
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
        <div tw="py-12">
          <RaceCard
            name="Race #42"
            link="/race/123"
            label="Explorer"
            icon={<ArrowTopRightOnSquareIcon tw="ml-2 h-5 w-5" />}
          >
            {/* TODO: Add more Details */}

            <div tw="flex flex-row justify-between font-mono text-lg">
              <span>Follower Goal:</span>
              <p tw="font-semibold">15.0000</p>
            </div>
            <div tw="flex flex-row justify-between font-mono text-lg">
              <span>Follower Goal:</span>
              <p tw="font-semibold">15.0000</p>
            </div>
          </RaceCard>
        </div>
      </HomeLayout>
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
