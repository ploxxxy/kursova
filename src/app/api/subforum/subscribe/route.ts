import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubforumSubscriptionValidator } from '@/lib/validators/subforum'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { subforumId } = SubforumSubscriptionValidator.parse(body)
    const subscription = await db.subscription.findFirst({
      where: {
        subforumId,
        userId: session.user.id,
      },
    })

    if (subscription) {
      return new Response('Already subscribed', { status: 400 })
    }

    await db.subscription.create({
      data: {
        subforumId,
        userId: session.user.id,
      },
    })

    return new Response(subforumId, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response('Invalid Request', { status: 400 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
