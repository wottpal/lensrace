import { useLazyQuery } from '@apollo/client'
import { Combobox } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { SEARCH_PROFILES_BY_HANDLE } from '@shared/lensApiQueries'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState } from 'react'

import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

const profiles = [
  {
    id: 1,
    lensHandle: 'Lens Handle 1',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 2,
    lensHandle: 'Lens Handle 2',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  // More users...
]

// export interface InputComboBoxProps {
//   id: string
//   lensHandle: string
//   imageUrl: string
// }

export interface InputComboBoxProps {
  disabled: boolean
}

type Profile = {
  profileId: string
  handle: string
}

export const InputComboBox: FC<InputComboBoxProps> = ({ disabled }) => {
  const [query, setQuery] = useState('')
  const [selectedProfile, setSelectedProfile] = useState(null)

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

  // console.log({ query })
  console.log(data?.search?.items)
  // console.log({ debouncedSearch })

  return (
    <Combobox as="div" value={selectedProfile} onChange={setSelectedProfile} disabled={disabled}>
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
  )
}
