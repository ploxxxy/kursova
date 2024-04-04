import { z } from 'zod'

export const ThreadValidator = z.object({
  title: z
    .string()
    .min(4, { message: 'Заголовок має бути більшим за 4 символів' })
    .max(128, { message: 'Заголовок має бути меншим за 128 символів' }),
  subforumId: z.string(),
  content: z.any(),
})

export type ThreadCreationRequest = z.infer<typeof ThreadValidator>

export const ThreadDeleteValidator = z.object({
  threadId: z.string(),
})

export type ThreadDeleteRequest = z.infer<typeof ThreadDeleteValidator>
