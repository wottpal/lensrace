import { ExclamationCircleIcon } from '@heroicons/react/24/solid'
import { FC } from 'react'
import 'twin.macro'
import tw from 'twin.macro'

export interface InputProps {
  placeholder: string
  input: string
  registerId: string
  disabled: boolean
  register: any
  errors: any
}

export const Input: FC<InputProps> = ({
  placeholder,
  input,
  registerId,
  disabled,
  register,
  errors,
}) => {
  console.log('Error', errors[registerId])

  return (
    <div>
      <div tw="relative mt-1 rounded-md shadow-sm">
        <input
          disabled={disabled}
          {...register(registerId, {
            required: {
              value: true,
              message: 'Race names is required',
            },
          })}
          type={input}
          name={registerId}
          id={registerId}
          css={[
            tw`block w-full rounded-lg border-primary border pr-10 ring-primary/70 focus:(border-primary ring-primary) sm:text-sm`,
            disabled &&
              tw`text-base-content/20 shadow-sm placeholder:text-base-content/20 disabled:(cursor-not-allowed border-base-content/20 bg-base-100 text-base-content/5)`,
            errors[registerId] &&
              tw`border-error text-error placeholder-error focus:(border-error ring-error)`,
          ]}
          // placeholder={placeholder}
          aria-invalid={errors[registerId] ? 'true' : 'false'}
          aria-describedby={`${registerId}-error`}
        />
        {errors[registerId] && (
          <div tw="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon tw="h-5 w-5 text-error" aria-hidden="true" />
          </div>
        )}
      </div>
      {errors[registerId] && <p tw="mt-2 text-xs text-error">{errors[registerId].message}</p>}
    </div>
  )
}
