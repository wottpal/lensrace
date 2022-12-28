import { HomeLayout } from '@components/home/HomeLayout'
import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { Indicator } from '@components/shared/Indicator'
import { ArrowTopRightOnSquareIcon, TrophyIcon } from '@heroicons/react/20/solid'
import { ShareIcon } from '@heroicons/react/24/solid'
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import Link from 'next/link'
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
        <div tw="py-6">
          {/* Gray container */}
          <div tw="mx-auto max-w-sm rounded-xl border p-4">
            <div tw="flex flex-col space-y-4">
              {/* Race and Explorer Row */}
              <div tw="flex flex-row justify-between">
                <div tw="flex items-center">
                  <p tw="font-bold text-xl text-base-content">Race #42</p>
                  <Indicator />
                </div>
                {/* TODO: Add variable for link explorer */}
                <Link href={'/race/123'}>
                  <span tw="flex flex-row text-primary hover:text-primary-focus">
                    Explorer <ArrowTopRightOnSquareIcon tw="ml-2 h-5 w-5" />
                  </span>
                </Link>
              </div>
              {/* Follower Goal Row */}
              <div tw="flex flex-row justify-between font-mono text-lg">
                <span>Follower Goal:</span>
                <p tw="font-semibold">15.0000</p>
              </div>
            </div>
          </div>
        </div>
        {/* Leaderboard */}
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
