import { useQuery } from '@apollo/client'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { GET_PROFILE_BY_WALLET_QUERY } from '@shared/lensApiQueries'
import Image from 'next/image'
import { FC, Fragment } from 'react'
import 'twin.macro'
import tw from 'twin.macro'
import { useAccount } from 'wagmi'

import { LensProfile, LensProfileData } from '@models/LensProfile'
import { FieldError, useController } from 'react-hook-form'
import 'twin.macro'

export interface InputSelectProps {
  disabled: boolean
  error: FieldError
  controllerProps: {
    control: any
    name: any
  }
}

export const InputSelect: FC<InputSelectProps> = ({ controllerProps, error, disabled }) => {
  const {
    field: { value, onChange },
  } = useController(controllerProps)

  const { address } = useAccount()
  const {
    loading: profilesLoading,
    error: profilesError,
    data: profilesData,
  } = useQuery<LensProfileData>(GET_PROFILE_BY_WALLET_QUERY, {
    variables: {
      request: {
        ownedBy: [
          // Test address with data
          '0x52EAF3F04cbac0a4B9878A75AB2523722325D4D4',
          // address,
        ],
        limit: 10,
      },
    },
  })

  // console.log({ profilesLoading, profilesError, profilesData })

  return (
    <>
      <Listbox
        disabled={disabled || profilesData?.profiles?.items.length === 0}
        value={value as LensProfile}
        as="div"
        onChange={onChange}
      >
        {({ open }) => (
          <>
            <div tw="relative mt-1">
              <Listbox.Button
                css={[
                  tw`relative w-full cursor-default rounded-lg border border-primary bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:(border-primary outline-none ring-1 ring-primary) sm:text-sm`,
                  disabled &&
                    tw`cursor-not-allowed border-base-content/20 bg-base-100 text-base-content/20 shadow-sm`,
                  error &&
                    tw`border-error pr-10 text-error placeholder-error focus:(border-error ring-error)`,
                ]}
              >
                <span tw="flex items-center">
                  {!!value?.picture?.original?.url && (
                    <Image
                      src={
                        value.picture.original.url.startsWith('ipfs://')
                          ? value.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')
                          : value.picture.original.url
                      }
                      width={50}
                      height={50}
                      alt={`Profile picture of @${value.handle}`}
                      tw="h-6 w-6 flex-shrink-0 rounded-full"
                    />
                  )}
                  <span tw="ml-3 block truncate">
                    {value ? value?.handle : 'Select a Lens Handle'}
                  </span>
                </span>
                <span tw="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                  <ChevronUpDownIcon tw="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options tw="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {profilesData?.profiles?.items.map((profile) => (
                    <Listbox.Option
                      key={profile?.id}
                      css={[
                        value?.id === profile?.id
                          ? tw`bg-primary text-primary-content`
                          : tw`text-primary`,
                        tw`relative cursor-default select-none py-2 pl-3 pr-9`,
                      ]}
                      value={profile}
                    >
                      {({ value, active }: any) => (
                        <>
                          <div tw="flex items-center">
                            {!!profile?.picture?.original?.url && (
                              <Image
                                src={
                                  profile.picture.original.url.startsWith('ipfs://')
                                    ? profile.picture.original.url.replace(
                                        'ipfs://',
                                        'https://ipfs.io/ipfs/',
                                      )
                                    : profile.picture.original.url
                                }
                                width={50}
                                height={50}
                                alt={`Profile picture of @${profile.handle}`}
                                tw="h-6 w-6 flex-shrink-0 rounded-full"
                              />
                            )}
                            <span
                              css={[
                                tw`ml-3 block truncate`,
                                value ? tw`font-semibold` : tw`font-normal`,
                              ]}
                            >
                              {profile?.handle}
                            </span>
                          </div>
                          {value ? (
                            <span
                              css={[
                                tw`absolute inset-y-0 right-0 flex items-center pr-4`,
                                active ? tw`text-primary-content` : tw`text-primary`,
                              ]}
                            >
                              <CheckIcon tw="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
      {error?.message && <p tw="mt-2 text-xs text-error">{error.message}</p>}
      {profilesData?.profiles?.items.length === 0 && (
        <p tw="mt-2 text-xs text-error">
          You do not have any Lens Handles. Please claim one{' '}
          <a href="https://claim.lens.xyz/" target={'_blank'} tw="text-primary underline">
            here
          </a>{' '}
          or connect a wallet with a handle.
        </p>
      )}
    </>
  )
}
