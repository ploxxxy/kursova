import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserSettingsValidator } from '@/lib/validators/userSettings'
import { z } from 'zod'

export async function PATCH(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { username } = UserSettingsValidator.parse(body)

    const usernameExists = await db.user.findFirst({
      where: { username },
    })

    if (usernameExists) {
      return new Response('Username taken', { status: 409 })
    }

    await db.user.update({
      where: { id: session.user.id },
      data: { username },
    })

    return new Response('OK', { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid Request', { status: 400 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
