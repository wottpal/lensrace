import { FC } from 'react'
import 'twin.macro'

export const Indicator: FC = () => {
  return (
    <>
      {/* TODO: This is quick and dirty not sure how to make it "more elegant" */}
      <div tw="relative -mb-3 h-full">
        <div tw="absolute ml-2 h-3 w-3 animate-ping rounded-full bg-green-300"></div>
        <div tw="absolute ml-2 h-3 w-3 rounded-full bg-green-300"></div>
      </div>
    </>
  )
}
