import { FC } from 'react'
import { Label } from './ui/Label'
import { Switch } from './ui/Switch'
import { useTheme } from 'next-themes'

const ThemeSwitch: FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center justify-between gap-x-2 p-2">
      <Label htmlFor="theme-switch">Світла тема</Label>
      <Switch
        checked={theme === 'light'}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        id="theme-switch"
      />
    </div>
  )
}

export default ThemeSwitch
