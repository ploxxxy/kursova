import SubforumEditForm from '@/components/forms/SubforumEditForm'
import { authOptions, getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { FC } from 'react'

export const metadata: Metadata = {
  title: 'Редагування форуму',
}

interface PageProps {
  params: {
    slug: string
  }
}

const page: FC<PageProps> = async ({ params }) => {
  const session = await getSession()
  if (!session?.user) {
    redirect(authOptions.pages?.signIn || '/login')
  }

  const subforum = await db.subforum.findFirst({
    where: {
      name: params.slug,
    },
  })

  const accessGranted =
    subforum?.creatorId === session.user.id ||
    session.user.role === 'ADMIN' ||
    subforum?.moderatorIds.includes(session.user.id)

  if (!subforum || !accessGranted) return notFound()

  return (
    <div>
      <SubforumEditForm subforumName={params.slug} />
    </div>
  )
}

export default page
