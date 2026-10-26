
import { useTheme } from '../lib/theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={
        isDark
          ? 'Ativar tema claro'
          : 'Ativar tema escuro'
      }
      aria-pressed={isDark}
      title={isDark ? 'Ativar tema claro' : 'Ativar tema escuro'}
    >
      <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
      <span>{isDark ? 'Modo claro' : 'Modo escuro'}</span>
    </button>
  )
}
