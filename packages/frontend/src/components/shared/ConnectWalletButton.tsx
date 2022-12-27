import { ConnectButton, useConnectModal } from '@rainbow-me/rainbowkit'
import { FC } from 'react'
import 'twin.macro'
import { useAccount } from 'wagmi'
import { BaseButton, BaseButtonGroup } from './BaseButton'

export const ConnectWalletButton: FC = () => {
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()

  return (
    <>
      <BaseButtonGroup>
        {isConnected ? (
          <ConnectButton accountStatus="address" showBalance={false} />
        ) : (
          <BaseButton onClick={openConnectModal}>Connect Wallet</BaseButton>
        )}
      </BaseButtonGroup>
    </>
  )
}
