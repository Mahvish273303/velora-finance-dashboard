import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import ToastContainer from '../ui/ToastContainer'
import { useStore } from '../../store/useStore'

function AppLayout() {
  const theme = useStore((state) => state.theme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white text-slate-700 dark:bg-slate-950 dark:text-slate-200">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-3 md:px-6">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  )
}

export default AppLayout
