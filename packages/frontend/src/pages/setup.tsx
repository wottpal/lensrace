import { CenterBody } from '@components/layout/CenterBody'
import { Hero } from '@components/shared/Hero'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import 'twin.macro'

const HomePage: NextPage = () => {
  return (
    <>
      <CenterBody>
        <Hero />
        {/* Connect Wallet */}
        <ConnectButton accountStatus="address" />
        {/* Select Lens Handle */}

        {/* Select Lens Participants */}
        {/* Set Name */}
        {/* Set Follower Goal */}
        {/* Setup Button */}
      </CenterBody>
    </>
  )
}

export default HomePage
