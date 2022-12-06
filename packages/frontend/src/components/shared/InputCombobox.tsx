import { useLazyQuery } from '@apollo/client'
import { Combobox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { SEARCH_PROFILES_BY_HANDLE } from '@shared/lensApiQueries'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import { Profile } from '@pages/setup'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface InputComboBoxProps {
  disabled: boolean
  multi: boolean
  selectedProfile: Profile | Profile[] | null
  setSelectedProfile: (profile: Profile) => void
}

export const InputComboBox: FC<InputComboBoxProps> = ({
  disabled,
  multi,
  selectedProfile,
  setSelectedProfile,
}) => {
  const [query, setQuery] = useState('')

  const [search, { data, loading, error }] = useLazyQuery(SEARCH_PROFILES_BY_HANDLE)
  const debouncedSearch = useCallback(
    debounce(() => {
      if (!query) return
      console.log(`Searching ${query}…`)
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
  const handleSelectedProfile = (profile: Profile) => {
    console.log({ profile })
    if (multi) {
      const profiles = selectedProfile !== null ? selectedProfile : ([] as Profile[])
      const newProfiles = [...profiles, profile]
      setSelectedProfile(newProfiles)
      setQuery('')
    } else {
      setSelectedProfile(profile)
    }
  }

  return (
    <>
      <Combobox
        as="div"
        value={selectedProfile}
        onChange={handleSelectedProfile}
        disabled={disabled}
      >
        <div tw="relative mt-1">
          <Combobox.Input
            css={[
              tw`w-full rounded-lg border-primary border ring-primary/70 focus:(border-primary ring-primary) sm:text-sm`,
              disabled &&
                tw`cursor-not-allowed border-base-content/20 bg-base-100 text-base-content/20 shadow-sm placeholder:text-base-content/20`,
            ]}
            // tw="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:(border-primary outline-none ring-1 ring-primary) sm:text-sm"
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(profile: Profile) => profile?.handle}
          />
          <Combobox.Button tw="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
            <ChevronUpDownIcon tw="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          {!loading && !!data?.['search']?.['items']?.length && (
            <Combobox.Options tw="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {data?.['search']?.['items'].map((profile: Profile) => (
                <Combobox.Option
                  key={profile?.profileId}
                  value={profile}
                  css={[
                    tw`relative cursor-default select-none py-2 pl-3 pr-9`,
                    profile === selectedProfile ? tw`bg-primary text-white` : tw`text-gray-900`,
                  ]}
                  // tw="relative cursor-default select-none bg-primary py-2 pl-3 pr-9 text-white"
                  // className={({ active }) =>
                  //   classNames(
                  //     'relative cursor-default select-none py-2 pl-3 pr-9',
                  //     active ? 'bg-primary text-white' : 'text-gray-900',
                  //   )
                  // }
                >
                  {({ active, selected }) => (
                    <>
                      <div tw="flex items-center">
                        {/* TODO: In lens test env there are many different urls so not sure if we can grap profile pic */}
                        <img
                          src={profile?.picture?.original?.url}
                          width={50}
                          height={50}
                          alt=""
                          tw="h-6 w-6 shrink-0 rounded-full"
                        />
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
      {multi && selectedProfile && (
        <div tw="mt-4">
          {selectedProfile.map((profile: Profile) => (
            <div key={profile?.profileId} tw="py-2">
              <div tw="flex items-center">
                <img
                  src={profile?.picture?.original?.url}
                  width={50}
                  height={50}
                  alt=""
                  tw="h-10 w-10 shrink-0 rounded-full object-contain"
                />
                <span tw="ml-8 truncate font-semibold">@{profile?.handle}</span>
                {/* Button to remove the pfoile from selectedProfile */}
                <button
                  tw="ml-4 text-primary hover:text-primary/80"
                  onClick={() => {
                    const profiles = selectedProfile !== null ? selectedProfile : ([] as Profile[])
                    const newProfiles = profiles.filter((p) => p?.profileId !== profile?.profileId)
                    setSelectedProfile(newProfiles)
                  }}
                >
                  <XMarkIcon tw="h-5 w-5 rounded-full" aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
