import { z } from 'zod'

export const UserSettingsValidator = z.object({
  username: z
    .string()
    .min(3, 'Ім\'я повинно містити принаймні 3 символи')
    .max(20, 'Ім\'я повинно містити не більше 20 символів')
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      'Ім\'я може містити лише літери, цифри, точки та підкреслення',
    ),
})

export type UserSettingsRequest = z.infer<typeof UserSettingsValidator>
