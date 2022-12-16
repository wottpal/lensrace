import { CenterBody } from '@components/layout/CenterBody'
import { DividerHeading } from '@components/shared/DividerHeading'
import { Hero } from '@components/shared/Hero'
import { Input } from '@components/shared/Input'
import { InputComboBox } from '@components/shared/InputCombobox'
import { InputSelect } from '@components/shared/InputSelect'
import { yupResolver } from '@hookform/resolvers/yup'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import { SubmitHandler, useForm } from 'react-hook-form'
import 'twin.macro'
import tw from 'twin.macro'
import { useAccount, useNetwork } from 'wagmi'
import * as yup from 'yup'

const schema = yup
  .object({
    lensHandle: yup.object().required(),
    raceParticipants: yup.array().of(yup.object()).min(1).required(),
    raceName: yup.string().required(),
    followerGoal: yup.number().positive().integer().required(),
  })
  .required()

export type FormInputs = {
  lensHandle: any
  raceName: string
  followerGoal: number
  profileIds: number[]
}

export type Profile = {
  profileId: string
  handle: string
  picture: {
    original: {
      url: string
    }
  }
}

const HomePage: NextPage = () => {
  const { isConnected, isDisconnected } = useAccount()
  const { chain } = useNetwork()
  const disabled = false // isDisconnected || !!chain?.unsupported

  // console.log({ disabled })
  // console.log({ isDisconnected })
  // console.log('Test', chain?.id === env.defaultChain)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: yupResolver(schema),
  })
  const onSubmit: SubmitHandler<FormInputs> = (data) => console.log({ data })

  console.log({ errors })
  console.log('watch', watch())
  console.log({ disabled })

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
          <InputSelect
            name="lensHandle"
            errors={errors}
            control={control}
            rules={{ required: true }}
          />
          {/* Select Lens Participants */}
          <DividerHeading title="Choose Race Participants" />
          <InputComboBox
            name="raceParticipants"
            errors={errors}
            clearErrors={clearErrors}
            control={control}
            setValue={setValue}
            rules={{ required: true, min: 1 }}
            disabled={disabled}
          />
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
