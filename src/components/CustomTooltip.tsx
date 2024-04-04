'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@radix-ui/react-tooltip'
import React, { FC } from 'react'

interface CustomTooltipProps {
  children: React.ReactNode
  text: string
}

const CustomTooltip: FC<CustomTooltipProps> = ({ children, text }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="rounded border bg-card p-2 text-sm text-text shadow">
        {text}
      </TooltipContent>
    </Tooltip>
  )
}

export default CustomTooltip
