'use client'

import { cn } from '@/lib/utils'
import { User } from '@prisma/client'
import { CalendarDays } from 'lucide-react'
import { FC, HTMLProps } from 'react'
import UserAvatar from './UserAvatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/HoverCard'

interface UsernameProps {
  user: User
  className?: HTMLProps<HTMLDivElement>['className']
}

const Username: FC<UsernameProps> = ({ user, className }) => {
  const usernameOrFullname = user.username ? '@' + user.username : user.name

  return (
    <HoverCard>
      <HoverCardTrigger
        className={cn(
          'cursor-pointer hover:text-text-900 hover:underline',
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
            <p className="text-sm">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Saepe
              nulla quasi itaque nesciunt magni sapiente.
            </p>
            <div className="flex items-center pt-2">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="text-xs">Приєднався (-лась) 393 дні тому</span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default Username
