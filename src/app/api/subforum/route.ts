import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { SubforumValidator } from '@/lib/validators/subforum'
import { z } from 'zod'

export async function POST(req: Request) {
  try {
    const session = await getSession()

    if (!session?.user) {
      return new Response('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { name } = SubforumValidator.parse(body)

    const subforumExists = await db.subforum.findFirst({
      where: {
        name: name,
      },
    })

    if (subforumExists) {
      return new Response('Subforum already exists', { status: 409 })
    }

    const subforum = await db.subforum.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    })

    await db.subscrtiption.create({
      data: {
        userId: session.user.id,
        subforumId: subforum.id,
      },
    })

    return new Response(subforum.name, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response('Internal Server Error', { status: 500 })
  }
}
