import { CenterBody } from '@components/layout/CenterBody'
import { Hero } from '@components/shared/Hero'
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next'
import 'twin.macro'

const HomePage: NextPage = () => {
  return (
    <>
      <CenterBody>
        <Hero />
        {/* Button actions */}
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
