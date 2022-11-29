import { CenterBody } from '@components/layout/CenterBody'
import { DividerHeading } from '@components/shared/DividerHeading'
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
        {/* Form */}
        <div tw="mx-auto w-full max-w-sm">
          {/* Select Lens Handle */}
          <DividerHeading title="Select Lens Handle" />
          {/* Select Lens Participants */}
          <DividerHeading title="Choose Race Participants" />
          {/* Set Name */}
          <DividerHeading title="Set Custom Race Name" />
          {/* Set Follower Goal */}
          <DividerHeading title="Set Absolute Follower Goal" />
          {/* Setup Button */}
        </div>
        {/* TODO: Refactor button */}
        <button tw="btn btn-primary btn-wide my-6 rounded-full border-primary bg-primary font-mono text-white normal-case hover:(border-primary-focus bg-primary-focus)">
          Start Race
        </button>
      </CenterBody>
    </>
  )
}

export default HomePage
