import MiniCreateThread from '@/components/MiniCreateThread'
import { INFINE_SCROLLING_PAGE_SIZE } from '@/config'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface PageProps {
  params: {
    slug: string
  }
}

const page: FC<PageProps> = async ({ params }) => {
  const { slug } = params

  const session = await getSession()

  const subforum = await db.subforum.findFirst({
    where: {
      name: slug,
    },
    include: {
      threads: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subforum: true,
        },
        take: INFINE_SCROLLING_PAGE_SIZE,
      },
    },
  })

  if (!subforum) {
    return notFound()
  }

  return (
    <>
      <h1 className="h-14 text-3xl font-bold md:text-4xl">c/{subforum.name}</h1>
      <MiniCreateThread session={session} />
    </>
  )
}

export default page
