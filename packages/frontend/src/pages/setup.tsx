import { HomeLayout } from '@components/home/HomeLayout'
import { BaseButton, BaseButtonGroup } from '@components/shared/BaseButton'
import { ConnectWalletButton } from '@components/shared/ConnectWalletButton'
import { DividerHeading } from '@components/shared/DividerHeading'
import { Input } from '@components/shared/Input'
import { InputComboBox } from '@components/shared/InputCombobox'
import { InputSelect } from '@components/shared/InputSelect'
import { yupResolver } from '@hookform/resolvers/yup'
import { LensProfile } from '@models/LensProfile'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
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
  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  // Disabled state for form
  const [isDisabled, setIsDisabled] = useState(true)
  useEffect(() => {
    setIsDisabled(!isConnected || !!chain?.unsupported)
  }, [isConnected, chain])

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

  return (
    <>
      <HomeLayout>
        <ConnectWalletButton />

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} css={[isDisabled && tw`opacity-30`]}>
          {/* Select Lens Handle */}
          <DividerHeading title="Select Lens Handle" />
          <InputSelect
            disabled={isDisabled}
            error={errors.lensHandle as FieldError}
            controllerProps={{ name: 'lensHandle', control: control }}
          />
          {/* Select Lens Participants */}
          <DividerHeading title="Choose Race Participants" />
          <InputComboBox
            disabled={isDisabled}
            error={errors.raceParticipants as FieldError}
            clearErrors={clearErrors}
            controllerProps={{ name: 'raceParticipants', control: control }}
            setValue={setValue}
          />
          {/* Set Name */}
          <DividerHeading title="Set Custom Race Name" />
          <Input
            disabled={isDisabled}
            placeholder="Awesome race"
            input="text"
            registerId="raceName"
            register={register}
            errors={errors}
          />

          {/* Set Follower Goal */}
          <DividerHeading title="Set Absolute Follower Goal" />
          <Input
            disabled={isDisabled}
            placeholder="100"
            input="number"
            registerId="followerGoal"
            register={register}
            errors={errors}
          />

          {/* Setup Button */}
          <BaseButtonGroup tw="mt-12">
            <BaseButton disabled={isDisabled} type="submit">
              Start Race
            </BaseButton>
          </BaseButtonGroup>
        </form>
      </HomeLayout>
    </>
  )
}

export default HomePage
