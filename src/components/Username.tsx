'use client'

import { cn } from '@/lib/utils'
import { User } from '@prisma/client'
import { CalendarDays } from 'lucide-react'
import { FC, HTMLProps } from 'react'
import UserAvatar from './UserAvatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/HoverCard'

interface UsernameProps {
  user: Pick<User, 'username' | 'name' | 'role' | 'image'>
  className?: HTMLProps<HTMLDivElement>['className']
}

const Username: FC<UsernameProps> = ({ user, className }) => {
  const usernameOrFullname = user.username ? '@' + user.username : user.name
  let userDescription: string

  switch (user.role) {
    case 'BANNED':
      userDescription =
        'Цей користувач був заблокований за порушення правил. Він має можливість тільки переглядати теми'
      break
    case 'USER':
      userDescription = 'Цей користувач є зареєстрованим користувачем форуму'
      break
    case 'MODERATOR':
      userDescription = 'Цей користувач є модератором одного або більше форумів'
      break
    case 'ADMIN':
      userDescription = 'Цей користувач є адміністратором форуму'
      break
  }

  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          'cursor-pointer hover:text-text-900 hover:underline',
          user.role === 'BANNED' && 'line-through',
          user.role === 'MODERATOR' && 'text-green-500',
          user.role === 'ADMIN' && 'text-red-500',
          className,
        )}
      >
        {usernameOrFullname}
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <UserAvatar user={user} />
          <div className="space-y-1 text-text">
            <h4 className="text-sm font-semibold text-text-900">{user.name}</h4>
            <p className="text-wrap text-sm">{userDescription}</p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs">Приєднався(-лась) в березні 2024</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default Username
