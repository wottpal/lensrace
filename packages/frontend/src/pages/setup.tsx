import { CenterBody } from '@components/layout/CenterBody'
import { DividerHeading } from '@components/shared/DividerHeading'
import { Hero } from '@components/shared/Hero'
import { Input } from '@components/shared/Input'
import { InputComboBox } from '@components/shared/InputCombobox'
import { InputSelect } from '@components/shared/InputSelect'
import { yupResolver } from '@hookform/resolvers/yup'
import { LensProfile } from '@models/LensProfile'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import type { NextPage } from 'next'
import { FieldError, SubmitHandler, useForm } from 'react-hook-form'
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
  lensHandle: LensProfile
  raceName: string
  followerGoal: number
  raceParticipants: LensProfile[]
}

const HomePage: NextPage = () => {
  // Disabled state for forms
  const { isDisconnected } = useAccount()
  const { chain } = useNetwork()

  const disabled = isDisconnected || !!chain?.unsupported

  // React Form state Management
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

  // console.log({ errors })
  // console.log('watch', watch())
  // console.log({ disabled })
  // console.log('chainUnsupported: ', !!chain?.unsupported)

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
            disabled={disabled}
            error={errors.lensHandle as FieldError}
            controllerProps={{ name: 'lensHandle', control: control }}
          />
          {/* Select Lens Participants */}
          <DividerHeading title="Choose Race Participants" />
          <InputComboBox
            disabled={disabled}
            error={errors.raceParticipants as FieldError}
            clearErrors={clearErrors}
            controllerProps={{ name: 'raceParticipants', control: control }}
            setValue={setValue}
          />
          {/* Set Name */}
          <DividerHeading title="Set Custom Race Name" />
          <Input
            disabled={disabled}
            placeholder="Awesome race"
            input="text"
            registerId="raceName"
            register={register}
            errors={errors}
          />

          {/* Set Follower Goal */}
          <DividerHeading title="Set Absolute Follower Goal" />
          <Input
            disabled={disabled}
            placeholder="100"
            input="number"
            registerId="followerGoal"
            register={register}
            errors={errors}
          />
          {/* Setup Button */}

          {/* TODO: Refactor button */}
          <div tw="flex flex-col items-center">
            <button
              disabled={disabled}
              type="submit"
              css={[
                tw`btn btn-primary btn-wide my-6 rounded-full border-primary bg-primary font-bold font-mono text-lg text-white normal-case hover:(border-primary-focus bg-primary-focus)`,
                disabled && tw`border-primary/20 bg-primary/20`,
              ]}
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
