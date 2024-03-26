import { clsx, type ClassValue } from 'clsx'
import { formatDistanceToNowStrict } from 'date-fns'
import { uk } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatTime = (
  date: Date,
  options?: Intl.DateTimeFormatOptions,
) => {
  return date.toLocaleDateString(
    'uk-UA',
    options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  )
}


export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: uk,
  })
}
