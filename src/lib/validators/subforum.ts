import { z } from 'zod'

export const SubforumValidator = z.object({
  name: z.string().min(3).max(10),
  title: z
    .string()
    .min(3)
    .max(50)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? null : v)),
  description: z
    .string()
    .min(3)
    .max(255)
    .optional()
    .or(z.literal(''))
    .transform((v) => (v === '' ? null : v)),
})

export const SubforumSubscriptionValidator = z.object({
  subforumId: z.string(),
})

export type CreateSubforumPayload = z.infer<typeof SubforumValidator>
export type SubscribeToSubforumPayload = z.infer<
  typeof SubforumSubscriptionValidator
>
