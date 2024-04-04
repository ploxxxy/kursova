'use client'

import { ChevronLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'

const ToFeedButton = () => {
  const pathname = usePathname()
  const subforumPath = getSubforumPath(pathname)

  return (
    <a
      href={subforumPath}
      className="flex items-center text-text transition-colors hover:text-text-800 hover:underline"
    >
      <ChevronLeft className="mr-1 h-4 w-4" />
      {subforumPath === '/' ? 'До стрічки' : 'До форуму'}
    </a>
  )
}

const getSubforumPath = (pathname: string) => {
  const splitPath = pathname.split('/')

  if (splitPath.length === 3) return '/'
  else if (splitPath.length > 3) return `/${splitPath[1]}/${splitPath[2]}`
  else return '/'
}

export default ToFeedButton
