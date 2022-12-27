import { CenterBody } from '@components/layout/CenterBody'
import { Wrapper } from '@components/layout/Wrapper'
import { Hero } from '@components/shared/Hero'
import { FC, PropsWithChildren } from 'react'
import 'twin.macro'

export const HomeLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <CenterBody>
        <Wrapper tw="pb-16!">
          <Hero />

          {children}
        </Wrapper>
      </CenterBody>
    </>
  )
}
