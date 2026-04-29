import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'
type Tab = 'kanban' | 'community' | 'chat' | 'blog' | 'video'

interface AppState {
  // 主题
  theme: Theme
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: Theme) => void

  // 当前Tab
  activeTab: Tab
  setActiveTab: (tab: Tab) => void

  // 侧边栏
  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(resolved: 'light' | 'dark') {
  document.documentElement.setAttribute('data-theme', resolved)
}

const savedTheme = (localStorage.getItem('claw-theme') as Theme) || 'system'
const initialResolved = savedTheme === 'system' ? getSystemTheme() : savedTheme
applyTheme(initialResolved)

export const useAppStore = create<AppState>((set, get) => ({
  theme: savedTheme,
  resolvedTheme: initialResolved,
  setTheme: (theme: Theme) => {
    const resolved = theme === 'system' ? getSystemTheme() : theme
    applyTheme(resolved)
    localStorage.setItem('claw-theme', theme)
    set({ theme, resolvedTheme: resolved })
  },

  activeTab: 'kanban',
  setActiveTab: (tab: Tab) => set({ activeTab: tab }),

  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))

// 监听系统主题变化
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const { theme } = useAppStore.getState()
    if (theme === 'system') {
      const resolved = getSystemTheme()
      applyTheme(resolved)
      useAppStore.setState({ resolvedTheme: resolved })
    }
  })
}
