import { CSSInterpolation } from '@emotion/css'
import Link, { LinkProps } from 'next/link'
import {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  FC,
  PropsWithChildren,
  RefAttributes,
} from 'react'
import { SpinnerDotted } from 'spinners-react'
import 'twin.macro'
import tw, { styled, theme } from 'twin.macro'

const BaseButtonWrapper = styled.button(({ variant, disabled }: Partial<BaseButtonProps>) => [
  tw`btn btn-primary btn-wide relative flex items-center justify-center whitespace-nowrap rounded-full border-2 font-bold font-mono text-lg normal-case leading-none hover:(border-primary-focus bg-primary-focus text-white)`,
  variant === 'outline'
    ? tw`border-primary bg-transparent text-primary`
    : tw`border-transparent bg-primary text-white`,
  disabled && tw`cursor-not-allowed opacity-60`,
])
const BaseButtonLinkWrapper = BaseButtonWrapper.withComponent(Link)

type ButtonAndAnchorProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps &
  RefAttributes<HTMLAnchorElement>
export interface BaseButtonProps extends Partial<ButtonAndAnchorProps> {
  variant?: 'solid' | 'outline'
  isLoading?: boolean
  css?: CSSInterpolation
  color?: string
  contentColor?: string
  primary?: boolean
}
export const BaseButton: FC<PropsWithChildren<BaseButtonProps>> = ({
  children,
  variant,
  isLoading,
  color = theme('colors.gray.800'),
  contentColor,
  primary,
  ...props
}) => {
  const { href } = props
  const wrapperProps = { variant, isLoading }
  return href ? (
    <BaseButtonLinkWrapper {...(props as any)}>{children}</BaseButtonLinkWrapper>
  ) : (
    <BaseButtonWrapper {...wrapperProps} {...(props as any)}>
      <div css={[isLoading && tw`opacity-0`]}>{children}</div>

      {/* Loading Animation Overlay */}
      {isLoading && (
        <div tw="absolute inset-0 flex items-center justify-center">
          <SpinnerDotted
            size={24}
            thickness={150}
            color={variant === 'outline' ? theme('colors.primary') : theme('colors.white')}
          />
        </div>
      )}
    </BaseButtonWrapper>
  )
}

export const BaseButtonGroup = styled.div`
  ${tw`-mx-1 -my-1 flex flex-wrap justify-center`}
  button, a, input {
    ${tw`mx-1 my-1`}
  }
`
