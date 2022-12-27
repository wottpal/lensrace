import { useLazyQuery } from '@apollo/client'
import { Combobox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { SEARCH_PROFILES_BY_HANDLE } from '@shared/lensApiQueries'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { LensProfile } from '@models/LensProfile'
import Image from 'next/image'
import { FC } from 'react'
import { useController } from 'react-hook-form'
import 'twin.macro'
import tw from 'twin.macro'

export interface InputComboBoxProps {
  disabled: boolean
  clearErrors: any
  error: any
  setValue: any
  controllerProps: any
}

export const InputComboBox: FC<InputComboBoxProps> = ({
  disabled,
  clearErrors,
  error: error,
  setValue,
  controllerProps,
}) => {
  const {
    field: { value, onChange },
  } = useController(controllerProps)

  const [query, setQuery] = useState('')

  const [search, { data, loading, error: loadingError }] = useLazyQuery(SEARCH_PROFILES_BY_HANDLE)
  const debouncedSearch = useCallback(
    debounce(() => {
      if (!query) return
      // console.log(`Searching ${query}…`)
      search({
        variables: {
          request: {
            query,
            limit: 10,
            type: 'PROFILE',
          },
        },
      })
    }, 1000),
    [query],
  )
  useEffect(() => {
    debouncedSearch()
  }, [query])

  // A function that sets profiles based on onchange event
  const handleSelectedProfiles = (profiles: LensProfile[]) => {
    const newProfiles = [...(value || []), ...profiles]
    setValue('raceParticipants', newProfiles)
    // console.log('Clearing errors...')
    clearErrors('raceParticipants')
    setQuery('')
  }

  return (
    <>
      <Combobox
        as="div"
        value={value as LensProfile[]}
        onChange={handleSelectedProfiles}
        disabled={disabled}
      >
        <div tw="relative mt-1">
          <Combobox.Input
            css={[
              tw`w-full rounded-lg border-primary border ring-primary/70 focus:(border-primary ring-primary) sm:text-sm`,
              disabled &&
                tw`cursor-not-allowed border-base-content/20 bg-base-100 text-base-content/20 shadow-sm placeholder:text-base-content/20`,
              error &&
                tw`border-error pr-10 placeholder:text-error focus:(border-error ring-error)`,
            ]}
            // tw="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:(border-primary outline-none ring-1 ring-primary) sm:text-sm"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search race participants"
            displayValue={(profile: LensProfile) => profile?.handle}
          />
          <Combobox.Button tw="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon tw="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {!loading && !!data?.['search']?.['items']?.length && (
            <Combobox.Options tw="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {data?.['search']?.['items'].map((profile: LensProfile) => (
                <Combobox.Option
                  key={profile?.handle}
                  value={[profile]}
                  css={[
                    tw`relative cursor-default select-none py-2 pl-3 pr-9`,
                    (value || []).includes(profile) ? tw`bg-primary text-white` : tw`text-gray-900`,
                  ]}
                >
                  {({ active, selected }) => (
                    <>
                      <div tw="flex items-center">
                        {/* TODO: In lens test env there are many different urls so not sure if we can grap profile pic */}
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
                            tw="h-6 w-6 shrink-0 rounded-full"
                          />
                        )}
                        <span css={[tw`ml-3 truncate`, selected && tw`font-semibold`]}>
                          {profile?.handle}
                        </span>
                      </div>

                      {selected && (
                        <span
                          css={[
                            tw`absolute inset-y-0 right-0 flex items-center pr-4`,
                            active ? tw`text-white` : tw`text-primary`,
                          ]}
                        >
                          <CheckIcon tw="h-5 w-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>

      {/* List of selected profiles if multi is true */}
      {!!value?.length && (
        <div tw="mt-4">
          {value.map((profile: LensProfile) => (
            <div key={profile?.handle} tw="py-2">
              <div tw="flex items-center">
                {!!profile?.picture?.original?.url && (
                  <Image
                    src={
                      profile.picture.original.url.startsWith('ipfs://')
                        ? profile.picture.original.url.replace('ipfs://', 'https://ipfs.io/ipfs/')
                        : profile.picture.original.url
                    }
                    width={50}
                    height={50}
                    alt={`Profile picture of @${profile.handle}`}
                    tw="h-10 w-10 shrink-0 rounded-full object-contain"
                  />
                )}
                <span tw="ml-4 truncate font-semibold">@{profile?.handle}</span>
                {/* Button to remove the profile from selectedProfile */}
                <button
                  tw="ml-4 text-primary hover:text-primary/80"
                  onClick={() => {
                    if (!value?.length) return

                    const newProfiles = value.filter(
                      (p: LensProfile) => p?.handle !== profile?.handle,
                    )
                    setValue('raceParticipants', newProfiles)
                  }}
                >
                  <XMarkIcon tw="h-5 w-5 rounded-full" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {error && <p tw="mt-2 text-xs text-error">{error.message}</p>}
    </>
  )
}
