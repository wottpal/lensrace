import { CenterBody } from '@components/layout/CenterBody'
import { DividerHeading } from '@components/shared/DividerHeading'
import { Hero } from '@components/shared/Hero'
import { Input } from '@components/shared/Input'
import { InputComboBox } from '@components/shared/InputCombobox'
import { yupResolver } from '@hookform/resolvers/yup'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import { SubmitHandler, useForm } from 'react-hook-form'
import 'twin.macro'
import tw from 'twin.macro'
import { useAccount, useNetwork } from 'wagmi'
import * as yup from 'yup'
import { env } from '../shared/environment'

const schema = yup
  .object({
    raceName: yup.string().required(),
    followerGoal: yup.number().positive().integer().required(),
  })
  .required()

export type FormInputs = {
  raceName: string
  followerGoal: number
  profileIds: number[]
}

const HomePage: NextPage = () => {
  const { isConnected, isDisconnected } = useAccount()
  const { chain } = useNetwork()
  const disabled = isDisconnected || chain?.id !== env.defaultChain

  // console.log({ disabled })
  // console.log({ isDisconnected })
  // console.log('Test', chain?.id === env.defaultChain)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  })
  const onSubmit: SubmitHandler<FormInputs> = (data) => console.log({ data })

  return (
    <>
      <CenterBody>
        <Hero />
        {/* Connect Wallet */}
        <ConnectButton accountStatus="address" />
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          css={[tw`mx-auto w-full max-w-sm`, disabled && tw`text-base-content/20`]}
        >
          {/* Select Lens Handle */}
          <DividerHeading title="Select Lens Handle" />
          <InputComboBox disabled={disabled} />
          {/* Select Lens Participants */}
          <DividerHeading title="Choose Race Participants" />
          {/* Set Name */}
          <DividerHeading title="Set Custom Race Name" />
          <Input
            placeholder="Awesome race"
            input="text"
            registerId="raceName"
            disabled={disabled}
            register={register}
            errors={errors}
          />

          {/* Set Follower Goal */}
          <DividerHeading title="Set Absolute Follower Goal" />
          <Input
            placeholder="100"
            input="number"
            registerId="followerGoal"
            disabled={disabled}
            register={register}
            errors={errors}
          />
          {/* Setup Button */}

          {/* TODO: Refactor button */}
          <div tw="flex flex-col items-center">
            <button
              type="submit"
              disabled={disabled}
              tw="btn btn-primary btn-wide my-6 rounded-full border-primary bg-primary font-bold font-mono text-lg text-white normal-case hover:(border-primary-focus bg-primary-focus)"
            >
              Start Race
            </button>
          </div>
        </form>
      </CenterBody>
    </>
  )
}

export default HomePage
