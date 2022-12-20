import { z } from 'zod'

export const LensProfile = z.object({
  handle: z.string(),
  id: z.string(),
  name: z.string(),
  picture: z.object({
    original: z.object({
      url: z.string(),
    }),
  }),
  stats: z.object({
    totalFollowers: z.number(),
  }),
})

export const LensProileData = z.object({
  profiles: z.object({
    items: z.array(LensProfile),
  }),
})

export type LensProfile = z.infer<typeof LensProfile>
export type LensProfileData = z.infer<typeof LensProileData>
