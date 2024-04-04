'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const ToFeedButton = () => {
  const pathname = usePathname()
  const subforumPath = getSubforumPath(pathname)

  return (
    <Link href={subforumPath} className="flex items-center text-text hover:underline hover:text-text-800 transition-colors">
      <ChevronLeft className="mr-1 h-4 w-4" />
      {subforumPath === '/' ? 'Back home' : 'Back to community'}
    </Link>
  )
}

const getSubforumPath = (pathname: string) => {
  const splitPath = pathname.split('/')

  if (splitPath.length === 3) return '/'
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`
  else return '/'
}

export default ToFeedButton
